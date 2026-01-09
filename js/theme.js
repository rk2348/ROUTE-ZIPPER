const members = [
    { name: "月足天音", color: "#ff4d4d" },
    { name: "鎮西寿々歌", color: "#ff9f43" },
    { name: "早瀬ノエル", color: "#feca57" },
    { name: "櫻井優衣", color: "#55efc4" },
    { name: "仲川瑠夏", color: "#74b9ff" },
    { name: "松本かれん", color: "#ff9ff3" },
    { name: "真中まな", color: "#e2e2e2" }
];

function initTheme() {
    const selector = document.getElementById('theme-selector');
    if(!selector) return;
    
    members.forEach(m => {
        const btn = document.createElement('button');
        btn.className = "w-7 h-7 rounded-full border-2 border-white shadow-sm transition-transform active:scale-90";
        btn.style.backgroundColor = m.color;
        btn.title = m.name;
        btn.onclick = () => setTheme(m.color);
        selector.appendChild(btn);
    });

    const saved = localStorage.getItem('fz-theme');
    if (saved) setTheme(saved);
}

function setTheme(color) {
    document.documentElement.style.setProperty('--main-color', color);
    // 背景もテーマに合わせてわずかに色づける
    document.body.style.backgroundColor = `${color}10`; // 透明度10%
    localStorage.setItem('fz-theme', color);
}