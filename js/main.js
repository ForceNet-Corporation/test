// ============================================
// main.js — ГЛАВНАЯ СТРАНИЦА (index.html)
// ============================================

// ============================================
// 1. ОТКРЫТЬ / ЗАКРЫТЬ МОДАЛЬНОЕ ОКНО
// ============================================
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('adminEmail').focus();
    document.getElementById('loginError').classList.remove('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').classList.remove('show');
}

// Закрыть по клику на фон
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeLoginModal();
        });
    }
});

// ============================================
// 2. ВХОД В АДМИН-ПАНЕЛЬ
// ============================================
function loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');
    
    // Проверка на пустые поля
    if (!email || !password) {
        errorEl.textContent = '❌ Заполните все поля!';
        errorEl.classList.add('show');
        return;
    }
    
    // Вход через Firebase
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Проверка: является ли пользователь админом
            if (user.email === ADMIN_EMAIL) {
                // ✅ Всё ок! Переходим в админ-панель
                window.location.href = 'admin-panel.html';
            } else {
                // ❌ Залогинился, но не админ - выкидываем
                auth.signOut();
                errorEl.textContent = '❌ Доступ только для администратора!';
                errorEl.classList.add('show');
            }
        })
        .catch((error) => {
            // Ошибка входа
            let msg = error.message;
            if (msg.includes('user-not-found')) {
                msg = '❌ Пользователь не найден';
            } else if (msg.includes('wrong-password')) {
                msg = '❌ Неверный пароль';
            } else if (msg.includes('too-many-requests')) {
                msg = '❌ Слишком много попыток. Попробуйте позже.';
            }
            errorEl.textContent = msg;
            errorEl.classList.add('show');
        });
}

// ============================================
// 3. ВХОД ПО КНОПКЕ ENTER В ПОЛЕ ПАРОЛЯ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') loginAdmin();
        });
    }
});
