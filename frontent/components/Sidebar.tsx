"use client";

import Link from 'next/link';
import { Home, Search, PlusSquare, User, Heart, Shield } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const { openCreateModal } = useGlobalContext();

    return (
        <div className={styles.sidebar}>
            <Link href="/" className={styles.logo}>
                ReaidyVerse
            </Link>

            <nav className={styles.navItems}>
                <Link href="/" className={styles.navItem}>
                    <Home className={styles.navIcon} />
                    <span className={styles.navLabel}>Home</span>
                </Link>

                <div className={styles.navItem}>
                    <Search className={styles.navIcon} />
                    <span className={styles.navLabel}>Search</span>
                </div>

                <div className={styles.navItem}>
                    <Heart className={styles.navIcon} />
                    <span className={styles.navLabel}>Notifications</span>
                </div>

                <div className={styles.navItem} onClick={openCreateModal}>
                    <PlusSquare className={styles.navIcon} />
                    <span className={styles.navLabel}>Create</span>
                </div>

                <Link href="/profile" className={styles.navItem}>
                    <User className={styles.navIcon} />
                    <span className={styles.navLabel}>Profile</span>
                </Link>

                <Link href="/admin" className={styles.navItem} style={{ marginTop: 'auto' }}>
                    <Shield className={styles.navIcon} />
                    <span className={styles.navLabel}>Admin</span>
                </Link>
            </nav>
        </div>
    );
}
