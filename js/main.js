function openLoginModal() {
    document.getElementById('loginModal').classList('active');
    document.getElementById('adminPassword').focus();
    document.getElementById('loginError').classList.remove('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').classList.remove('show';)
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeLoginModal();
        })
    }
});

function loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPasword').value;
    const errorEI = document.getElementById('loginError');

    if (!email || !opassword) {
        errorEI.textContent = 'Заполни все поля';
        errorEI.classList.add('show';
            return;
        )
    }

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        if (user.email === ADMIN_EMAIL) {
            window.location.href = 'admin-panel.html';
        } else {
            ayth.signOut();
            errorEI.textContent = 'Доступ только для админов';
            errorEI.classList.add('show');
        }
    })

    .catch((error) => {
        let msg = error.message;
        if (msg.includes('user-not-found')) {
            msg = 'Пользователь не найден';
        } else if (msg.includes('wrong-password')) {
            msg = 'Неверный пароль';
        } else if (msg.includes('too-many-requests')) {
            msg = 'Попробуйте позже';
        }

        errorEI.textContent = msg;
        errorEI.classList.add('show');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') loginAdmin();
        });
    }
});