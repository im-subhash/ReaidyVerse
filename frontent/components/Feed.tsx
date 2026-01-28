"use client";

import Post from './Post';
import { useGlobalContext } from '@/context/GlobalContext';

export default function Feed() {
    const { posts } = useGlobalContext();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {posts.map(post => (
                <Post
                    key={post.id}
                    {...post}
                />
            ))}
        </div>
    );
}
