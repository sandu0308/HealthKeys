document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".accordion_button");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;

            this.classList.toggle("active");

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

function goToWhatsApp() {
    window.open("https://wa.me/70", "_blank");
  }

  
  function toggleText() {
    const moreText = document.getElementById("moreText");
    const btn = document.querySelector(".btn");

    if (moreText.style.display === "none") {
      moreText.style.display = "block";
      btn.textContent = "Скрыть ←";
    } else {
      moreText.style.display = "none";
      btn.textContent = "Читать далее →";
    }
  }

