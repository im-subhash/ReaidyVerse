"use client";

import styles from './Suggestions.module.css';

export default function Suggestions() {
    const suggestions = [
        { id: 1, username: 'besttfrndss', subtitle: 'Followed by glenn_1203 + 2 more' },
        { id: 2, username: 'Sadie Sink', subtitle: 'Followed by akarshika_sha + 1 more', isVerified: true },
        { id: 3, username: 'Anubhav Dubey', subtitle: 'Followed by amit.mishra_3 + 5 more', isVerified: true },
        { id: 4, username: 'Google Students', subtitle: 'Followed by moupali_mukh', isVerified: true },
        { id: 5, username: 'Rishav Yadav', subtitle: 'Followed by aloneboy_10__1' },
    ];

    return (
        <div className={styles.container}>
            {/* Current User */}
            <div className={styles.userProfile}>
                <div className={styles.userInfo}>
                    <img
                        src="https://ui-avatars.com/api/?name=User+Profile&background=random"
                        alt="Profile"
                        className={styles.avatar}
                    />
                    <div>
                        <div className={styles.username}>testuser</div>
                        <div className={styles.fullName}>Test User</div>
                    </div>
                </div>
                <div className={styles.switchAction}>Switch</div>
            </div>

            {/* Header */}
            <div className={styles.suggestionsHeader}>
                <div className={styles.headerTitle}>Suggested for you</div>
                <div className={styles.seeAll}>See All</div>
            </div>

            {/* List */}
            {suggestions.map(s => (
                <div key={s.id} className={styles.suggestionItem}>
                    <div className={styles.suggestionInfo}>
                        <div className={styles.suggestionAvatar} />
                        <div>
                            <div className={styles.suggestionUsername}>
                                {s.username}
                                {s.isVerified && (
                                    <span style={{ color: '#0095f6', marginLeft: '4px' }}>✓</span>
                                )}
                            </div>
                            <div className={styles.suggestionMeta}>{s.subtitle}</div>
                        </div>
                    </div>
                    <div className={styles.followAction}>Follow</div>
                </div>
            ))}

            {/* Footer */}
            <div className={styles.footer}>
                <div>
                    {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language', 'Meta Verified'].map(link => (
                        <span key={link} className={styles.footerLink}>{link} · </span>
                    ))}
                </div>
                <div className={styles.copyright}>
                    © 2026 REAIDYVERSE FROM META
                </div>
            </div>
        </div>
    );
}
