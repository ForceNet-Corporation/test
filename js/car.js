function getTagIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // ?id=TAG_123456789
}

// ============================================
// 2. ЗАГРУЗКА ДАННЫХ КЛИЕНТА
// ============================================
function loadCarData() {
    const tagId = getTagIdFromURL();
    const container = document.getElementById('carInfo');
    
    if (!tagId) {
        container.innerHTML = `
            <div class="not-found">
                <div style="font-size: 48px; margin-bottom: 16px;">📱</div>
                <p>Отсканируйте NFC-метку, чтобы увидеть информацию</p>
            </div>
        `;
        return;
    }
    
    // Показываем загрузку
    container.innerHTML = `
        <div class="loading">
            <div style="font-size: 36px; margin-bottom: 12px;">⏳</div>
            <p>Загрузка данных...</p>
        </div>
    `;
    
    // Ищем клиента в Firebase
    db.collection('clients').doc(tagId).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                container.innerHTML = `
                    <div class="car-icon">🚗</div>
                    <div class="car-name">${data.name || 'Имя не указано'}</div>
                    <div class="car-model">${data.carModel || 'Модель не указана'}</div>
                    <div class="divider"></div>
                    <div class="info-row">
                        <span class="label">📱 Телефон</span>
                        <span class="value">${data.phone || '—'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">🏷️ Метка</span>
                        <span class="value" style="font-size:12px; color:rgba(255,255,255,0.3);">${tagId}</span>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="not-found">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                        <p>Клиент с меткой <strong>${tagId}</strong> не найден</p>
                        <p style="font-size:13px; color:rgba(255,255,255,0.2); margin-top:8px;">Проверьте правильность метки</p>
                    </div>
                `;
            }
        })
        .catch((error) => {
            container.innerHTML = `
                <div class="not-found">
                    <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                    <p>Ошибка загрузки данных</p>
                    <p style="font-size:13px; color:rgba(255,255,255,0.2); margin-top:8px;">${error.message}</p>
                </div>
            `;
        });
}

// ============================================
// 3. ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================
document.addEventListener('DOMContentLoaded', loadCarData);