const BASE_URL = 'https://healthkeys-backend.onrender.com';

document.addEventListener("DOMContentLoaded", function () {
  // Аккордеон
  const buttons = document.querySelectorAll(".accordion_button");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const content = this.nextElementSibling;
      this.classList.toggle("active");
      content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
    });
  });

  // Главная кнопка "Читать далее"
  const toggleBtn = document.querySelector(".btn");
  const moreTextBlock = document.getElementById("moreText");
  if (toggleBtn && moreTextBlock) {
    toggleBtn.addEventListener("click", () => {
      const isVisible = moreTextBlock.style.display === "block";
      moreTextBlock.style.display = isVisible ? "none" : "block";
      toggleBtn.textContent = isVisible ? "Читать далее →" : "Скрыть ←";
    });
  }

  // Кнопки "Читать далее" в features
  const readMoreLinks = document.querySelectorAll(".read-more");
  readMoreLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const featureBlock = this.closest(".feature");
      const moreText = featureBlock.querySelector(".more-text");

      const isVisible = moreText.style.display === "block";
      moreText.style.display = isVisible ? "none" : "block";
      this.textContent = isVisible ? "Читать далее →" : "Скрыть ←";
    });
  });

  // Логика формы регистрации
  const form = document.querySelector('form');
  if (form && form.classList.contains("registration-form")) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const inputBoxes = form.querySelectorAll('.input_box input');
      const name = inputBoxes[0].value.trim();
      const username = inputBoxes[1].value.trim();
      const phone = inputBoxes[2].value.trim();
      const email = inputBoxes[3].value.trim();
      const password = inputBoxes[4].value.trim();
      const confirmPassword = inputBoxes[5].value.trim();

      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: name, username, phone, email, password })
        });

        const data = await response.json();
        if (response.ok) {
          alert('Регистрация прошла успешно!');
          localStorage.setItem("userEmail", email);
          window.location.href = 'profile.html';
        } else {
          alert(data.message || 'Ошибка при регистрации');
        }
      } catch (error) {
        console.error('Ошибка запроса:', error);
        alert('Что-то пошло не так');
      }
    });
  }

  // Логика логина
  if (form && form.classList.contains("login-form")) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailInput = form.querySelector('input[name="email"]');
      const passwordInput = form.querySelector('input[name="password"]');
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Успешный вход!");
          localStorage.setItem("userEmail", email);
          window.location.href = "profile.html";
        } else {
          alert(data.message || "Ошибка входа");
        }
      } catch (err) {
        alert("Ошибка сервера");
        console.error(err);
      }
    });
  }

  // Профиль
  const profileForm = document.getElementById("profileForm");
  const editBtn = document.getElementById("editBtn");
  const email = localStorage.getItem("userEmail");

  if (profileForm && editBtn) {
    if (!email) {
      alert("Сначала войдите или зарегистрируйтесь.");
      window.location.href = "registration.html";
      return;
    }

    const inputs = profileForm.querySelectorAll("input");
    fetch(`${BASE_URL}/api/profile/${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const user = data.user;
          inputs.forEach(input => {
            if (user[input.name]) input.value = user[input.name];
          });
          document.getElementById("profileName").textContent = user.fullName || "Имя";
          document.getElementById("profileEmail").textContent = user.email;
          document.getElementById("emailField").textContent = user.email;
        } else {
          alert("Не удалось загрузить профиль.");
        }
      });

    let editing = false;
    editBtn.addEventListener("click", async () => {
      if (!editing) {
        inputs.forEach(input => input.removeAttribute("disabled"));
        editBtn.textContent = "Сохранить изменения";
        editing = true;
      } else {
        const updated = {};
        inputs.forEach(input => updated[input.name] = input.value);

        const res = await fetch(`${BASE_URL}/api/profile/${email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        const data = await res.json();
        if (data.success) {
          alert("Профиль обновлён");
          inputs.forEach(input => input.setAttribute("disabled", true));
          editBtn.textContent = "Редактировать";
          editing = false;
        } else {
          alert("Ошибка при сохранении");
        }
      }
    });
  }

  
  const translations = {
    kz: {
      welcome: "Қош келдіңіз!",
      about: "Біз туралы",
      contact: "Байланыс",
    },
    ru: {
      welcome: "Добро пожаловать!",
      about: "О нас",
      contact: "Контакты",
    },
    en: {
      welcome: "Welcome!",
      about: "About us",
      contact: "Contact",
    },
  };

  function changeLanguage(lang) {
    localStorage.setItem("language", lang);
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = translations[lang][key] || key;
    });
  }

  const savedLang = localStorage.getItem("language") || "kz";
  changeLanguage(savedLang);

  const langSelect = document.querySelector(".change-lang");
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener("change", (e) => {
      changeLanguage(e.target.value);
    });
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userEmail");
    alert("Вы вышли из аккаунта");
    window.location.href = "index.html";
  });
}

function goToWhatsApp() {
  window.open("https://wa.me/7076849888", "_blank");
}

function goToProfile() {
  const email = localStorage.getItem("userEmail");
  if (email) {
    window.location.href = "profile.html";
  } else {
    alert("Пожалуйста, войдите или зарегистрируйтесь");
    window.location.href = "login.html";
  }
}

function toggleMenu() {
  const menu = document.getElementById("mainMenu") || document.querySelector("header menu");
  menu.classList.toggle("active");
}
