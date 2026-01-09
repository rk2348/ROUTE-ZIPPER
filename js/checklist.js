// --- 持ち物リスト ---
const defaultItems = [
    { text: "チケット", checked: false },
    { text: "ペンライト", checked: false },
    { text: "モバイルバッテリー", checked: false },
    { text: "身分証", checked: false },
    { text: "うちわ/アクスタ", checked: false },
    { text: "飲み物", checked: false },
    { text: "ゴミ袋/荷物保護袋", checked: false }
];

let checklistItems = JSON.parse(localStorage.getItem('fz-checklist')) || defaultItems;

function renderChecklist() {
    const area = document.getElementById('checklistArea');
    if(!area) return;
    area.innerHTML = '';
    
    checklistItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-3 bg-gray-50 rounded-xl";
        div.innerHTML = `
            <div class="flex items-center cursor-pointer flex-1" onclick="toggleCheck(${index})">
                <div class="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${item.checked ? 'fz-bg border-transparent' : 'bg-white fz-border'}">
                    ${item.checked ? '<span class="text-white text-[10px]">✓</span>' : ''}
                </div>
                <span class="text-sm font-medium ${item.checked ? 'check-item done' : ''}">${item.text}</span>
            </div>
            <button onclick="removeItem(${index})" class="text-gray-300 hover:text-red-400 px-2 text-xl">&times;</button>
        `;
        area.appendChild(div);
    });
    localStorage.setItem('fz-checklist', JSON.stringify(checklistItems));
}

function addItem() {
    const input = document.getElementById('newItemInput');
    if (!input.value.trim()) return;
    checklistItems.push({ text: input.value, checked: false });
    input.value = '';
    renderChecklist();
}

function toggleCheck(index) {
    checklistItems[index].checked = !checklistItems[index].checked;
    renderChecklist();
}

function removeItem(index) {
    checklistItems.splice(index, 1);
    renderChecklist();
}

function clearChecklist() {
    if(confirm("持ち物リストをリセットしますか？")) {
        checklistItems = [...defaultItems];
        renderChecklist();
    }
}

// --- 物販計算機 ---
let merchItems = JSON.parse(localStorage.getItem('fz-merch-list')) || [];

function addMerch() {
    const nameInput = document.getElementById('merchName');
    const priceInput = document.getElementById('merchPrice');
    const qtyInput = document.getElementById('merchQty');
    
    if (!nameInput.value || !priceInput.value) return;
    
    const qty = parseInt(qtyInput.value) || 1;
    merchItems.push({ 
        name: nameInput.value, 
        price: parseInt(priceInput.value),
        qty: qty 
    });
    
    nameInput.value = '';
    priceInput.value = '';
    qtyInput.value = '1';
    renderMerch();
}

function renderMerch() {
    const list = document.getElementById('merchList');
    const totalDisp = document.getElementById('merchTotal');
    if(!list) return;
    
    list.innerHTML = '';
    let total = 0;
    merchItems.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        const div = document.createElement('div');
        div.className = "merch-item text-sm";
        div.innerHTML = `
            <div class="flex flex-col">
                <span class="font-bold">${item.name}</span>
                <span class="text-[10px] text-gray-400">¥${item.price.toLocaleString()} × ${item.qty}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-bold">¥${subtotal.toLocaleString()}</span>
                <button onclick="removeMerch(${index})" class="text-red-400 font-bold text-lg">&times;</button>
            </div>
        `;
        list.appendChild(div);
    });
    totalDisp.innerText = `¥${total.toLocaleString()}`;
    localStorage.setItem('fz-merch-list', JSON.stringify(merchItems));
}

function removeMerch(index) {
    merchItems.splice(index, 1);
    renderMerch();
}

function clearMerch() {
    if(confirm("計算機をリセットしますか？")) {
        merchItems = [];
        renderMerch();
    }
}