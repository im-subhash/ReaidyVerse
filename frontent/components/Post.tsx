"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { PostData, useGlobalContext, Comment } from '@/context/GlobalContext';
import styles from './Post.module.css';

export default function Post({
    id,
    username,
    userAvatar,
    imageUrl,
    caption,
    initialLikes,
    timestamp,
    comments,
    isLiked
}: PostData) {
    const { toggleLike, addComment, openPostDetail } = useGlobalContext();
    const [commentText, setCommentText] = useState('');

    const handleLike = () => {
        toggleLike(id);
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            await addComment(id, commentText);
            setCommentText('');
        }
    };

    return (
        <article className={styles.post}>
            <div className={styles.header}>
                {userAvatar ? (
                    <img src={userAvatar} alt={username} className={styles.avatar} />
                ) : (
                    <div className={styles.avatar} />
                )}
                <span className={styles.username}>{username}</span>
            </div>

            <div className={styles.imageContainer}>
                <img src={imageUrl} alt="Post content" className={styles.postImage} />
            </div>

            <div className={styles.footer}>
                <div className={styles.actions}>
                    <div onClick={handleLike} className={styles.actionIcon}>
                        <Heart
                            size={24}
                            fill={isLiked ? "#ed4956" : "none"}
                            color={isLiked ? "#ed4956" : "currentColor"}
                        />
                    </div>
                    <div className={styles.actionIcon} onClick={() => openPostDetail({
                        id, username, userAvatar, imageUrl, caption,
                        initialLikes, timestamp, comments, isLiked
                    } as PostData)}>
                        <MessageCircle size={24} />
                    </div>
                    <div className={styles.actionIcon}>
                        <Send size={24} />
                    </div>
                    <div style={{ marginLeft: 'auto' }} className={styles.actionIcon}>
                        <Bookmark size={24} />
                    </div>
                </div>

                <div className={styles.likes}>
                    {initialLikes.toLocaleString()} likes
                </div>

                <div className={styles.caption}>
                    <span className={styles.captionUsername}>{username}</span>
                    {caption}
                </div>

                {comments && comments.length > 0 && (
                    <div
                        className={styles.viewComments}
                        onClick={() => openPostDetail({
                            id, username, userAvatar, imageUrl, caption,
                            initialLikes, timestamp, comments, isLiked
                        } as PostData)}
                    >
                        View all {comments.length} comments
                    </div>
                )}

                <div className={styles.timestamp}>
                    {timestamp}
                </div>

                <form className={styles.commentForm} onSubmit={handlePostComment}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className={styles.commentInput}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={styles.postButton}
                        disabled={!commentText.trim()}
                    >
                        Post
                    </button>
                </form>
            </div>
        </article>
    );
}
