auth.onAuthStateChanged((user) => {
    if (!user) {
        // Не залогинен → на главную
        window.location.href = 'index.html';
    } else if (user.email !== ADMIN_EMAIL) {
        // Залогинен не админ → выкидываем
        auth.signOut();
        window.location.href = 'index.html';
    } else {
        // Админ → показываем email и загружаем данные
        document.getElementById('adminEmailDisplay').textContent = user.email;
        loadClients();
    }
});

// ============================================
// 2. ВЫХОД
// ============================================
function logoutAdmin() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

// ============================================
// 3. ЗАГРУЗКА СПИСКА КЛИЕНТОВ
// ============================================
function loadClients() {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Загрузка...</td></tr>';
    
    db.collection('clients')
        .orderBy('name')
        .get()
        .then((snapshot) => {
            const clients = [];
            snapshot.forEach((doc) => {
                clients.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Обновляем статистику
            document.getElementById('totalClients').textContent = clients.length;
            document.getElementById('totalTags').textContent = clients.length;
            document.getElementById('clientsCount').textContent = `(${clients.length})`;
            
            // Если клиентов нет
            if (clients.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="empty">Нет клиентов. Добавьте первого!</td></tr>';
                return;
            }
            
            // Рендерим таблицу
            let html = '';
            clients.forEach((client) => {
                html += `
                    <tr>
                        <td><span class="tag-id">${client.id}</span></td>
                        <td><strong>${client.name || '—'}</strong></td>
                        <td>${client.carModel || '—'}</td>
                        <td>${client.phone || '—'}</td>
                        <td style="text-align:center">
                            <button class="btn-delete" onclick="deleteClient('${client.id}')">Удалить</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        })
        .catch((error) => {
            tbody.innerHTML = `<tr><td colspan="5" class="empty">❌ Ошибка загрузки: ${error.message}</td></tr>`;
        });
}

// ============================================
// 4. УДАЛЕНИЕ КЛИЕНТА
// ============================================
function deleteClient(clientId) {
    if (!confirm(`Вы уверены, что хотите удалить клиента с меткой ${clientId}?`)) {
        return;
    }
    
    db.collection('clients').doc(clientId).delete()
        .then(() => {
            loadClients();
        })
        .catch((error) => {
            alert('Ошибка удаления: ' + error.message);
        });
}

// ============================================
// 5. ОТКРЫТЬ / ЗАКРЫТЬ МОДАЛКУ ДОБАВЛЕНИЯ
// ============================================
function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    document.getElementById('addError').classList.remove('show');
    document.getElementById('inputTagId').focus();
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    document.getElementById('inputTagId').value = '';
    document.getElementById('inputName').value = '';
    document.getElementById('inputCarModel').value = '';
    document.getElementById('inputPhone').value = '';
    document.getElementById('addError').classList.remove('show');
}

// Закрыть по клику на фон
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAddModal();
        });
    }
});

// ============================================
// 6. ДОБАВЛЕНИЕ КЛИЕНТА
// ============================================
function addClient() {
    const tagId = document.getElementById('inputTagId').value.trim();
    const name = document.getElementById('inputName').value.trim();
    const carModel = document.getElementById('inputCarModel').value.trim();
    const phone = document.getElementById('inputPhone').value.trim();
    const errorEl = document.getElementById('addError');
    
    // Проверка на пустые поля
    if (!tagId || !name || !carModel || !phone) {
        errorEl.textContent = '❌ Заполните все поля!';
        errorEl.classList.add('show');
        return;
    }
    
    // Проверка на пробелы в tagId
    if (tagId.includes(' ')) {
        errorEl.textContent = '❌ UID метки не должен содержать пробелов!';
        errorEl.classList.add('show');
        return;
    }
    
    // Сохраняем в Firebase
    db.collection('clients').doc(tagId).set({
        name: name,
        carModel: carModel,
        phone: phone
    })
    .then(() => {
        closeAddModal();
        loadClients();
    })
    .catch((error) => {
        errorEl.textContent = '❌ Ошибка: ' + error.message;
        errorEl.classList.add('show');
    });
}

// ============================================
// 7. ВХОД ПО КНОПКЕ ENTER В ПОЛЯХ МОДАЛКИ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['inputTagId', 'inputName', 'inputCarModel', 'inputPhone'];
    inputs.forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') addClient();
            });
        }
    });
});