const venues = {
    budokan: {
        title: "日本武道館",
        station: "九段下駅",
        lat: 35.6933,
        lng: 139.7497,
        tags: ["#伝統の聖地", "#玉ねぎ"],
        desc: "九段下駅から坂を登るので、時間に余裕を持って。帰りは規制退場で時間がかかります。",
        seatMap: "https://www.nipponbudokan.or.jp/about/seat",
        spots: { locker: "九段下駅 ロッカー", store: "神保町 100均", wifi: "九段下 カフェ" }
    },
    ariake: {
        title: "有明アリーナ",
        station: "有明テニスの森駅",
        lat: 35.6441,
        lng: 139.7941,
        tags: ["#音響最高", "#新会場"],
        desc: "最寄り駅から少し歩きます。終演後はシャトルバスや豊洲駅への徒歩も検討を。",
        seatMap: "https://ariake-arena.tokyo/seat/",
        spots: { locker: "有明アリーナ ロッカー", store: "有明ガーデン 100均", wifi: "有明 カフェ" }
    },
    pia: {
        title: "ぴあアリーナMM",
        station: "みなとみらい駅",
        lat: 35.4549,
        lng: 139.6314,
        tags: ["#縦長", "#みなとみらい"],
        desc: "2階売店のフードが充実。桜木町駅からもペデストリアンデッキで直結しています。",
        seatMap: "https://pia-arena-mm.jp/about/seat/index.html",
        spots: { locker: "桜木町駅 ロッカー", store: "マークイズ 100均", wifi: "みなとみらい カフェ" }
    }
};

async function getSelectedVenueData() {
    const select = document.getElementById('venueSelect');
    const customInput = document.getElementById('customVenueInput');
    const customName = customInput.value.trim();

    if (customName !== "") {
        const geo = await fetchCoordinates(customName);
        return {
            title: customName,
            station: customName,
            lat: geo ? geo.lat : 35.6895,
            lng: geo ? geo.lon : 139.6917,
            tags: ["#カスタム検索"],
            desc: "入力された会場周辺の情報をZIPしました！",
            seatMap: `https://www.google.com/search?q=${encodeURIComponent(customName + " 座席表 公式")}`,
            spots: { locker: customName + " ロッカー" }
        };
    } else if (select.value) {
        return venues[select.value];
    }
    return null;
}

async function handleRouteSearch() {
    const data = await getSelectedVenueData();
    if (!data) { alert("会場を選択または入力してください"); return; }

    const resultDiv = document.getElementById('routeResult');
    const detailDiv = document.getElementById('routeDetail');
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.title)}&travelmode=transit`;

    resultDiv.classList.remove('hidden');
    detailDiv.innerHTML = `
        <div class="mb-4">
            <h4 class="font-bold text-xl text-gray-800">📍 ${data.title}への動線</h4>
            <div id="weatherInfo" class="mt-2 text-sm">天気取得中...</div>
            <div class="flex flex-wrap gap-2 mt-2">
                ${data.tags.map(t => `<span class="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold">${t}</span>`).join('')}
                <a href="${data.seatMap}" target="_blank" class="text-[10px] bg-blue-500 text-white px-2 py-1 rounded font-bold no-underline">💺 座席表 ↗</a>
            </div>
        </div>
        <div class="w-full h-40 rounded-xl overflow-hidden mb-4 border border-gray-100">
            <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${data.lat},${data.lng}&hl=ja&z=15&output=embed"></iframe>
        </div>
        <div class="grid grid-cols-1 gap-2">
            <a href="${navUrl}" target="_blank" class="text-center fz-bg text-white font-bold py-4 rounded-xl shadow-md no-underline text-sm">🚆 会場へのルートをGoogleマップで開く</a>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(data.spots.locker || data.title + ' ロッカー')}" target="_blank" class="text-center text-xs bg-gray-50 text-gray-600 py-3 rounded-xl font-bold no-underline">📦 周辺のロッカーを探す</a>
        </div>
        <div class="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 fz-border">
            <p class="font-bold mb-1 fz-main">💡 アドバイス</p>
            ${data.desc}
        </div>
    `;
    updateWeather(data.lat, data.lng);
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

async function handleTravelSearch() {
    const data = await getSelectedVenueData();
    if (!data) { alert("会場を選択または入力してください"); return; }

    const price = document.getElementById('priceSelect').value;
    const departure = document.getElementById('departureInput').value.trim();
    const date = document.getElementById('dateInput').value;

    const resultDiv = document.getElementById('routeResult');
    const detailDiv = document.getElementById('routeDetail');

    const hotelUrl = `https://www.google.com/maps/search/${encodeURIComponent(data.station + ' ホテル ' + (price ? price + '円' : ''))}`;
    
    // 出発地と日付をクエリに含める
    const busQuery = `${departure} ${data.station} 夜行バス ${date} 予約`.trim();
    const busUrl = `https://www.google.com/search?q=${encodeURIComponent(busQuery)}`;

    resultDiv.classList.remove('hidden');
    detailDiv.innerHTML = `
        <div class="mb-4">
            <h4 class="font-bold text-xl text-gray-800">🏨 遠征の準備：${data.station}周辺</h4>
            <p class="text-xs text-gray-500 mt-1">${departure || '各地'}から${data.title}への遠征情報をZIPしました</p>
        </div>
        <div class="grid grid-cols-1 gap-3">
            <a href="${hotelUrl}" target="_blank" class="flex items-center justify-between bg-blue-50 text-blue-700 p-4 rounded-2xl font-bold no-underline border border-blue-100">
                <span class="flex items-center gap-2">🏨 <span>周辺のホテルを探す</span></span>
                <span class="text-xs bg-blue-100 px-2 py-1 rounded">${price ? price + '円以下' : 'すべて'} ↗</span>
            </a>
            <a href="${busUrl}" target="_blank" class="flex items-center justify-between bg-indigo-50 text-indigo-700 p-4 rounded-2xl font-bold no-underline border border-indigo-100">
                <span class="flex items-center gap-2">🚌 <span>夜行バスを比較・予約する</span></span>
                <span class="text-[10px] bg-indigo-100 px-2 py-1 rounded leading-tight text-center">
                    ${date ? date + '<br>' : ''}${departure || '出発地'}発 ↗
                </span>
            </a>
        </div>
        <div class="mt-6 p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 leading-relaxed">
            <p class="font-bold mb-1">💡 遠征のコツ</p>
            夜行バスは早めの予約がお得です。ホテルは最寄り駅だけでなく、乗り換えなしで数駅離れた場所を探すと予算に合う場所が見つかりやすくなります。
        </div>
    `;
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

async function handleFoodSearch() {
    const data = await getSelectedVenueData();
    if (!data) { alert("会場を選択または入力してください"); return; }

    const resultDiv = document.getElementById('routeResult');
    const detailDiv = document.getElementById('routeDetail');

    const foodUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.title + ' 飲食店')}`;

    resultDiv.classList.remove('hidden');
    detailDiv.innerHTML = `
        <div class="mb-4">
            <h4 class="font-bold text-xl text-gray-800">🍴 周辺の飲食店：${data.title}</h4>
            <p class="text-xs text-gray-500 mt-1">打ち上げや待ち合わせに使えるお店をZIPしました</p>
        </div>
        <div class="grid grid-cols-1 gap-3">
            <a href="${foodUrl}" target="_blank" class="flex items-center justify-between bg-orange-50 text-orange-700 p-4 rounded-2xl font-bold no-underline border border-orange-100">
                <span class="flex items-center gap-2">🍽️ <span>近くのレストラン・カフェを探す</span></span>
                <span class="text-xs bg-orange-100 px-2 py-1 rounded">検索 ↗</span>
            </a>
        </div>
        <div class="mt-6 p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 leading-relaxed">
            <p class="font-bold mb-1">💡 グルメのアドバイス</p>
            イベント前後は会場近くの店舗が非常に混雑します。予約ができるお店を探すか、隣駅まで移動して探すとスムーズに入店できることが多いです。
        </div>
    `;
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

async function fetchCoordinates(query) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
        const results = await response.json();
        if (results && results.length > 0) {
            return { lat: results[0].lat, lon: results[0].lon };
        }
    } catch (e) {
        console.error("ジオコーディング失敗", e);
    }
    return null;
}

async function updateWeather(lat, lng) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=Asia%2FTokyo`);
        const data = await response.json();
        const weather = data.current_weather;
        
        const icons = { 0: "☀️ 快晴", 1: "🌤 晴れ", 2: "⛅ 晴れ時々曇り", 3: "☁️ 曇り", 45: "🌫 霧", 51: "🌦 小雨", 61: "🌧 雨", 71: "❄️ 雪", 95: "⚡ 雷雨" };
        const iconLabel = icons[weather.weathercode] || "🌡️ 天気取得";
        
        document.getElementById('weatherInfo').innerHTML = `
            <div class="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                <span class="text-xl">${iconLabel.split(' ')[0]}</span>
                <div>
                    <div class="text-[10px] text-blue-600 font-bold uppercase">会場周辺の現在の天気</div>
                    <div class="text-sm font-bold text-gray-800">${weather.temperature}℃ / ${iconLabel.split(' ')[1]}</div>
                </div>
            </div>
        `;
    } catch (e) {
        document.getElementById('weatherInfo').innerText = "天気情報の読み込みに失敗しました。";
    }
}