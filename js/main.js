document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderChecklist();
    renderMerch();
    initMemos();

    // オープニングアニメーション制御
    const splash = document.getElementById('splash-screen');
    const gateTop = document.getElementById('zip-gate-top');
    const gateBottom = document.getElementById('zip-gate-bottom');
    const logo = document.getElementById('splash-logo');
    const text = document.getElementById('splash-text');

    // 1. 白背景（ゲート）が開く
    setTimeout(() => {
        gateTop.classList.add('zip-open-top');
        gateBottom.classList.add('zip-open-bottom');
    }, 300);

    // 2. ロゴが登場
    setTimeout(() => {
        logo.classList.add('animate-pop');
    }, 800);

    // 3. テキストが登場
    setTimeout(() => {
        text.classList.add('animate-text-up');
    }, 1100);

    // 4. フェードアウトしてメイン画面を表示
    setTimeout(() => {
        splash.classList.add('splash-fade-out');
        document.getElementById('tab-search').classList.add('animate-fade');
    }, 2200);

    // イベントリスナーの登録
    document.getElementById('routeSearchBtn')?.addEventListener('click', handleRouteSearch);
    document.getElementById('travelSearchBtn')?.addEventListener('click', handleTravelSearch);
    document.getElementById('foodSearchBtn')?.addEventListener('click', handleFoodSearch);
});

function switchTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('animate-fade');
    });

    const target = document.getElementById(`tab-${tabName}`);
    target.classList.remove('hidden');
    
    void target.offsetWidth; 
    target.classList.add('animate-fade');

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active-nav'));
    document.getElementById(`nav-${tabName}`).classList.add('active-nav');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initMemos() {
    const seatInput = document.getElementById('seatMemo');
    const eventText = document.getElementById('eventMemo');
    if(!seatInput || !eventText) return;

    seatInput.value = localStorage.getItem('fz-memo-seat') || '';
    eventText.value = localStorage.getItem('fz-memo-event') || '';

    seatInput.addEventListener('input', () => localStorage.setItem('fz-memo-seat', seatInput.value));
    eventText.addEventListener('input', () => localStorage.setItem('fz-memo-event', eventText.value));
}