document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderChecklist();
    renderMerch();
    initMemos();

    // 初期表示のタブにアニメーション適用
    document.getElementById('tab-search').classList.add('animate-fade');

    document.getElementById('routeSearchBtn')?.addEventListener('click', handleRouteSearch);
    document.getElementById('travelSearchBtn')?.addEventListener('click', handleTravelSearch);
});

function switchTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('animate-fade');
    });

    const target = document.getElementById(`tab-${tabName}`);
    target.classList.remove('hidden');
    
    // 強制的に再フローを発生させてアニメーションをリセット
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