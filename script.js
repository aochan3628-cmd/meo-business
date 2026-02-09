// ============================================
// Blue Life LP - Script
// ============================================

// ハンバーガーメニュー
function toggleMenu() {
    document.getElementById('navList').classList.toggle('active');
}

// FAQアコーディオン
function toggleFaq(el) {
    const item = el.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    // 全部閉じる
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.maxHeight = null;
    });

    // クリックしたやつだけ開閉
    if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// スクロールアニメーション（Intersection Observer）
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 遅延をつけてカード類が順番に出る
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // fade-in要素を監視（遅延付き）
    document.querySelectorAll('.fade-in').forEach((el, i) => {
        // 同じ親内での順番で遅延をつける
        const siblings = el.parentElement.querySelectorAll('.fade-in');
        const index = Array.from(siblings).indexOf(el);
        el.dataset.delay = index * 120;
        observer.observe(el);
    });
});
