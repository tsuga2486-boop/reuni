import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingPage}>
            <div className={styles.loadingContent}>
                <div className={styles.spinner}>
                    <span className={styles.paw}>🐾</span>
                </div>
                <p className={styles.loadingText}>読み込み中...</p>
            </div>
        </div>
    );
}
