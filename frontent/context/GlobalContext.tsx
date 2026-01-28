"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface PostData {
    id: string;
    username: string;
    userAvatar?: string;
    imageUrl: string;
    caption: string;
    initialLikes: number;
    timestamp: string;
    comments: Comment[];
    isLiked?: boolean;
}

export interface Comment {
    id: string;
    username: string;
    text: string;
    isFlagged?: boolean; // Added for frontend awareness
}

interface GlobalContextType {
    isCreateModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    posts: PostData[];
    addPost: (post: PostData) => void;
    toggleLike: (postId: string) => void;
    addComment: (postId: string, text: string) => Promise<void>;
    refreshFeed: () => void;
    selectedPost: PostData | null;
    openPostDetail: (post: PostData) => void;
    closePostDetail: () => void;
    deletePost: (postId: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5002/api';

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [posts, setPosts] = useState<PostData[]>([]);

    const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/posts`);
            if (!res.ok) throw new Error('Failed to fetch posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const openPostDetail = (post: PostData) => setSelectedPost(post);
    const closePostDetail = () => setSelectedPost(null);

    const refreshFeed = () => fetchPosts();

    const addPost = (post: PostData) => {
        setPosts(prev => [post, ...prev]);
    };

    const toggleLike = async (postId: string) => {
        try {
            // Optimistic update
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    const newIsLiked = !post.isLiked;
                    const updatedPost = {
                        ...post,
                        isLiked: newIsLiked,
                        initialLikes: newIsLiked ? (post.initialLikes || 0) + 1 : (post.initialLikes || 1) - 1
                    };

                    // Sync selected post if open
                    if (selectedPost && selectedPost.id === postId) {
                        setSelectedPost(updatedPost);
                    }
                    return updatedPost;
                }
                return post;
            }));

            await fetch(`${API_URL}/posts/${postId}/like`, { method: 'PUT' });
        } catch (err) {
            console.error(err);
            fetchPosts();
        }
    };

    const addComment = async (postId: string, commentText: string) => {
        try {
            const res = await fetch(`${API_URL}/comments/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText })
            });

            if (!res.ok) throw new Error('Failed to comment');
            const newComment = await res.json();

            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    const updatedPost = {
                        ...post,
                        comments: [...post.comments, newComment]
                    };

                    // Sync selected post
                    if (selectedPost && selectedPost.id === postId) {
                        setSelectedPost(updatedPost);
                    }
                    return updatedPost;
                }
                return post;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const deletePost = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            // Optimistic update
            setPosts(prev => prev.filter(p => p.id !== postId));
            if (selectedPost && selectedPost.id === postId) {
                closePostDetail();
            }

            await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' });
        } catch (err) {
            console.error(err);
            fetchPosts(); // Revert
        }
    };

    return (
        <GlobalContext.Provider value={{
            isCreateModalOpen,
            openCreateModal,
            closeCreateModal,
            posts,
            addPost,
            toggleLike,
            addComment,
            refreshFeed,
            selectedPost,
            openPostDetail,
            closePostDetail,
            deletePost
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
}
