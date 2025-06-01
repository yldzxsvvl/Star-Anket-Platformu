document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  // Formlar arası geçiş
  if (showRegister && showLogin && loginForm && registerForm) {
    showRegister.addEventListener('click', () => {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', () => {
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  }

  // Kayıt işlemi
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('registerConfirmPassword').value;

      if (!name || !email || !password || !confirmPassword) {
        alert('Lütfen tüm alanları doldurun.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor.');
        return;
      }

      if (localStorage.getItem(email)) {
        alert('Bu e-posta zaten kayıtlı.');
        return;
      }

      const user = { name, email, password };
      localStorage.setItem(email, JSON.stringify(user));

      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      registerForm.reset();
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  }

  // Giriş işlemi
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        alert('Lütfen e-posta ve şifreyi girin.');
        return;
      }

      const userData = localStorage.getItem(email);

      if (!userData) {
        alert('Bu e-posta ile kayıt bulunamadı.');
        return;
      }

      const user = JSON.parse(userData);

      if (user.password !== password) {
        alert('Şifre yanlış.');
        return;
      }

      alert(`Hoşgeldiniz, ${user.name}!`);
      loginForm.reset();

      // Giriş başarılıysa başka sayfaya yönlendirme
      window.location.href = 'index.html';
    });
  }
});
