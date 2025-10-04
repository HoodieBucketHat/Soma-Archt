(function () {
  // ================= SLIDER ================= //
  const slidesEl = document.getElementById("slides");
  const slideEls = Array.from(slidesEl?.children || []);
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (slidesEl && prevBtn && nextBtn) {
    let index = 0;
    const slideCount = slideEls.length;

    function updateSlider() {
      slidesEl.style.transform = `translateX(${-index * 100}%)`;
    }

    function goTo(i) {
      index = (i + slideCount) % slideCount;
      updateSlider();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // Autoplay
    let autoplayId = null;
    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(next, 5000);
    }
    function stopAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = null;
    }

    slidesEl.addEventListener("mouseenter", stopAutoplay);
    slidesEl.addEventListener("mouseleave", startAutoplay);

    startAutoplay();
    updateSlider();
  }

  // ================= STICKY TITLE ================= //
  document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".sticky-title");
    const section2 = document.querySelector(".about-section2");
    const stopSection = document.querySelector(".center-text-section"); // ganti target berhenti
    const navHeight = 84; // tinggi navbar px

    if (!title || !section2 || !stopSection) return;

    function updateTitlePosition() {
      const scrollY = window.scrollY;
      const sectionRect = section2.getBoundingClientRect();
      const sectionTop = section2.offsetTop;
      const stopTop = stopSection.offsetTop; // batas bawah sticky

      // ambil posisi kiri section relatif ke viewport lalu ditambah scroll
      const sectionLeft = sectionRect.left + window.scrollX;

      if (
        scrollY + navHeight >= sectionTop &&
        scrollY + navHeight < stopTop - title.offsetHeight
      ) {
        // Fixed dari section2 sampai sebelum stopSection
        title.style.position = "fixed";
        title.style.top = navHeight + "px";
        title.style.left = sectionLeft + "30mm"; // sejajar kolom
        title.style.width = title.offsetWidth + "30mm";
      } else if (scrollY + navHeight >= stopTop - title.offsetHeight) {
        // Ketika menyentuh stopSection → berhenti
        title.style.position = "absolute";
        title.style.top =
          stopTop - title.offsetHeight - sectionTop + "px";
        title.style.left = "0";
        title.style.width = "fit-content";
      } else {
        // Sebelum section2 → normal
        title.style.position = "relative";
        title.style.top = "0";
        title.style.left = "0";
        title.style.width = "fit-content";
      }
    }

    window.addEventListener("scroll", updateTitlePosition);
    window.addEventListener("resize", updateTitlePosition);
    updateTitlePosition();
  });

  // ================= NEWS PAGE FILTER ================= //
  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".news-nav button");
    const cards = document.querySelectorAll(".news-card");

    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // ubah tombol aktif
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        // filter konten
        cards.forEach((card) => {
          if (filter === "all" || card.dataset.category === filter) {
            card.style.display = "flex";
            card.style.opacity = "1";
            card.style.transition = "opacity 0.4s ease";
          } else {
            card.style.opacity = "0";
            setTimeout(() => {
              card.style.display = "none";
            }, 400);
          }
        });
      });
    });
  });
// ================= CONTACT FORM (Pivot + EmailJS) ================= //
  document.addEventListener("DOMContentLoaded", () => {
    const formType = document.getElementById("formType");
    const subFormContainer = document.getElementById("subFormContainer");
    const contactForm = document.getElementById("contactForm");

    if (!formType || !subFormContainer || !contactForm) return;

    const subForms = {
      project: `
        <div class="form-group"><label>02</label><input type="text" name="name" placeholder="Name*" required></div>
        <div class="form-group"><label>03</label><input type="text" name="phone" placeholder="Phone Number*" required></div>
        <div class="form-group"><label>04</label><input type="email" name="email" placeholder="Email*" required></div>
        <div class="form-group"><label>05</label><input type="text" name="projectType" placeholder="Project Type*" required></div>
        <div class="form-group"><label>06</label><input type="text" name="location" placeholder="Project Location*" required></div>
        <div class="form-group"><label>07</label><input type="text" name="landSize" placeholder="Project Land Size (m²)*"></div>
        <div class="form-group"><label>08</label><input type="text" name="findUs" placeholder="How did you find us?"></div>
        <div class="form-group"><label>09</label><textarea name="message" placeholder="Message*" required></textarea></div>
      `,
      collaboration: `
        <div class="form-group"><label>02</label><input type="text" name="name" placeholder="Your Name*" required></div>
        <div class="form-group"><label>03</label><input type="email" name="email" placeholder="Your Email*" required></div>
        <div class="form-group"><label>04</label><input type="text" name="organization" placeholder="Organization Name"></div>
        <div class="form-group"><label>05</label><textarea name="proposal" placeholder="Tell us about your idea*" required></textarea></div>
      `,
      job: `
        <div class="form-group"><label>02</label><input type="text" name="name" placeholder="Full Name*" required></div>
        <div class="form-group"><label>03</label><input type="email" name="email" placeholder="Email*" required></div>
        <div class="form-group"><label>04</label><input type="text" name="position" placeholder="Position Applied For*" required></div>
        <div class="form-group"><label>05</label><textarea name="message" placeholder="Your Message"></textarea></div>
      `
    };

    subFormContainer.innerHTML = subForms.project;

    formType.addEventListener("change", () => {
      subFormContainer.innerHTML = subForms[formType.value];
    });

    // === EmailJS ===
    if (window.emailjs) emailjs.init("YOUR_PUBLIC_KEY"); // Ganti dengan public key EmailJS kamu

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!window.emailjs) {
        alert("EmailJS not loaded.");
        return;
      }

      emailjs
        .sendForm("service_contact", "template_contact", contactForm)
        .then(() => {
          alert("✅ Message sent successfully!");
          contactForm.reset();
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Failed to send message. Please try again.");
        });
    });
  });
})();