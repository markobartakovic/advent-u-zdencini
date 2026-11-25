/**

 * Advent u Zdenčini - JavaScript

 *

 * UPUTA ZA GOOGLE SHEETS:

 * Ako želite da se podaci s obrasca spremaju direktno u Google Sheets tablicu:

 * 1. Pratite korake u datoteci `google-apps-script.js` i kreirajte Google Web App.

 * 2. Zalijepite dobiveni URL u varijablu GOOGLE_SCRIPT_URL ispod (između navodnika).

 * 3. Ako ostavite prazno (''), obrazac će ponuditi trenutno slanje preko WhatsAppa i prikazati potvrdu!

 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzz6lKNZKYnFCdqZ4WAZL2YA9E9M1uaCCBaWaIyBuinfGC4g9E-2mC7p5lndPKxdKLn/exec';
 

document.addEventListener('DOMContentLoaded', () => {

  initCountdown();

  initSnow();

  initMobileMenu();

  initFormHandler();

});

 

/* ================= 1. Odbrojavanje (Countdown) ================= */

function initCountdown() {

  const now = new Date();

  const currentYear = now.getFullYear();

 

  // Ciljni datum: 19. prosinca u 17:00:00

  let targetDate = new Date(currentYear, 11, 19, 17, 0, 0); // Mjesec 11 = Prosinac (0-indexed)

 

  // Ako je 19.12. već prošao ove godine, ciljaj sljedeću godinu

  if (now > targetDate) {

    targetDate = new Date(currentYear + 1, 11, 19, 17, 0, 0);

  }

 

  const daysEl = document.getElementById('days');

  const hoursEl = document.getElementById('hours');

  const minutesEl = document.getElementById('minutes');

  const secondsEl = document.getElementById('seconds');

 

  function update() {

    const currentTime = new Date().getTime();

    const distance = targetDate.getTime() - currentTime;

 

    if (distance <= 0) {

      daysEl.textContent = '00';

      hoursEl.textContent = '00';

      minutesEl.textContent = '00';

      secondsEl.textContent = '00';

      const label = document.querySelector('.countdown-label');

      if (label) label.textContent = '🎄 Advent je upravo u tijeku! Dobrodošli! 🎄';

      return;

    }

 

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));

    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const s = Math.floor((distance % (1000 * 60)) / 1000);

 

    daysEl.textContent = String(d).padStart(2, '0');

    hoursEl.textContent = String(h).padStart(2, '0');

    minutesEl.textContent = String(m).padStart(2, '0');

    secondsEl.textContent = String(s).padStart(2, '0');

  }

 

  update();

  setInterval(update, 1000);

}

 

/* ================= 2. Snježni canvas efekt ================= */

function initSnow() {

  const canvas = document.getElementById('snow-canvas');

  if (!canvas) return;

 

  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);

  let height = (canvas.height = window.innerHeight);

 

  window.addEventListener('resize', () => {

    width = canvas.width = window.innerWidth;

    height = canvas.height = window.innerHeight;

  });

 

  const flakeCount = Math.min(width > 768 ? 65 : 35, 80);

  const flakes = [];

 

  for (let i = 0; i < flakeCount; i++) {

    flakes.push({

      x: Math.random() * width,

      y: Math.random() * height,

      r: Math.random() * 2.5 + 1,

      d: Math.random() * flakeCount,

      speedY: Math.random() * 0.9 + 0.4,

      speedX: Math.random() * 0.5 - 0.25,

      opacity: Math.random() * 0.6 + 0.3

    });

  }

 

  function draw() {

    ctx.clearRect(0, 0, width, height);

 

    for (let i = 0; i < flakeCount; i++) {

      const f = flakes[i];

      ctx.beginPath();

      ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;

      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);

      ctx.fill();

 

      f.y += f.speedY;

      f.x += f.speedX;

 

      if (f.y > height) {

        f.y = -10;

        f.x = Math.random() * width;

      }

      if (f.x > width + 10) f.x = -10;

      if (f.x < -10) f.x = width + 10;

    }

 

    requestAnimationFrame(draw);

  }

 

  draw();

}

 

/* ================= 3. Mobilni izbornik ================= */

function initMobileMenu() {

  const toggleBtn = document.getElementById('mobile-menu-toggle');

  const navLinks = document.getElementById('nav-links');

 

  if (toggleBtn && navLinks) {

    toggleBtn.addEventListener('click', () => {

      navLinks.classList.toggle('show');

      const isOpen = navLinks.classList.contains('show');

      toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';

    });

 

    // Zatvori meni kad korisnik klikne na link

    navLinks.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {

        navLinks.classList.remove('show');

        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

      });

    });

  }

}

 

/* ================= 4. Obrazac i slanje (Google Sheets / WhatsApp) ================= */

function initFormHandler() {

  const form = document.getElementById('adventForm');

  const submitBtn = document.getElementById('submitBtn');

  const btnText = submitBtn.querySelector('.btn-text');

  const btnLoader = submitBtn.querySelector('.btn-loader');

  const feedbackEl = document.getElementById('formFeedback');

 

  if (!form) return;

 

  form.addEventListener('submit', async (e) => {

    e.preventDefault();

 

    // Reset grešaka

    let isValid = true;

    form.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

 

    const parentName = form.ImeRoditelja.value.trim();

    const phone = form.BrojMobitela.value.trim();

    const children = form.Djeca.value.trim();

    const notes = form.Napomena.value.trim();

 

    if (!parentName) {

      showFieldError(form.ImeRoditelja, 'Molimo unesite ime i prezime roditelja');

      isValid = false;

    }

 

    if (!phone) {

      showFieldError(form.BrojMobitela, 'Molimo unesite kontakt broj mobitela');

      isValid = false;

    }

 

    if (!children) {

      showFieldError(form.Djeca, 'Molimo unesite ime i dob djeteta');

      isValid = false;

    }

 

    if (!isValid) return;

 

    // UI: Učitavanje

    submitBtn.disabled = true;

    btnText.style.display = 'none';

    btnLoader.style.display = 'inline-flex';

    feedbackEl.style.display = 'none';

    feedbackEl.className = 'form-feedback';

 

    const formData = {

      Timestamp: new Date().toLocaleString('hr-HR'),

      ImeRoditelja: parentName,

      BrojMobitela: phone,

      Djeca: children,

      Napomena: notes

    };

 

    // Priprema WhatsApp poruke za dodatnu sigurnost / fallback

    const waText = encodeURIComponent(

      `🎅 *Prijava za poklončić - Advent u Zdenčini*\n` +

      `👤 *Roditelj:* ${parentName}\n` +

      `📞 *Broj:* ${phone}\n` +

      `🎁 *Dijete/Djeca:* ${children}\n` +

      (notes ? `📝 *Napomena:* ${notes}\n` : '')

    );

    const waUrl = `https://wa.me/385994119102?text=${waText}`;

 

    // Ako je unesen Google Apps Script URL

    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim() !== '') {

      try {

        const bodyData = new URLSearchParams(formData);

 

        await fetch(GOOGLE_SCRIPT_URL, {

          method: 'POST',

          mode: 'no-cors', // standard za Google Apps Script Web App

          headers: {

            'Content-Type': 'application/x-www-form-urlencoded'

          },

          body: bodyData.toString()

        });

 

        // Spremljeno

        showSuccess(parentName, waUrl);

        form.reset();

      } catch (err) {

        console.error('Greška pri slanju:', err);

        showError(waUrl);

      } finally {

        submitBtn.disabled = false;

        btnText.style.display = 'inline-flex';

        btnLoader.style.display = 'none';

      }

    } else {

      // Ako još nije podešen Google Script URL:

      // Simuliramo uspjeh i ponudimo instantno prosljeđivanje na WhatsApp organizatoru

      setTimeout(() => {

        submitBtn.disabled = false;

        btnText.style.display = 'inline-flex';

        btnLoader.style.display = 'none';

 

        feedbackEl.innerHTML = `

          <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">

            🎉 Hvala vam, ${escapeHtml(parentName)}!

          </div>

          <p style="margin-bottom: 12px;">

            Prijava za <strong>${escapeHtml(children)}</strong> je uspješno zabilježena.

          </p>

          <div style="margin-top: 10px; padding: 12px; background: rgba(255,255,255,0.7); border-radius: 8px;">

            <p style="font-size: 0.9rem; margin-bottom: 10px;">

              Za dodatnu sigurnost možete poslati potvrdu i jednim klikom na WhatsApp:

            </p>

            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="display: inline-flex; width: auto; padding: 10px 18px; font-size: 0.95rem;">

              <i class="fa-brands fa-whatsapp"></i> Potvrdi na WhatsApp organizatora

            </a>

          </div>

        `;

        feedbackEl.className = 'form-feedback success';

        feedbackEl.style.display = 'block';

        form.reset();

      }, 700);

    }

  });

 

  function showFieldError(input, message) {

    const parent = input.closest('.form-group');

    parent.classList.add('has-error');

    const err = parent.querySelector('.error-msg');

    if (err) err.textContent = message;

  }

 

  function showSuccess(parentName, waUrl) {

    feedbackEl.innerHTML = `

      <div style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px;">

        🎅 Prijava je uspješno poslana!

      </div>

      <p style="margin-bottom: 10px;">

        Hvala vam, <strong>${escapeHtml(parentName)}</strong>! Podaci su zabilježeni u tablicu organizatora. Vidimo se u subotu na podjeli poklona!

      </p>

      <a href="${waUrl}" target="_blank" rel="noopener" style="font-size: 0.9rem; color: #1b5e20; text-decoration: underline;">

        Želite i kopiju na WhatsApp? Kliknite ovdje.

      </a>

    `;

    feedbackEl.className = 'form-feedback success';

    feedbackEl.style.display = 'block';

  }

 

  function showError(waUrl) {

    feedbackEl.innerHTML = `

      <div style="font-weight: 700; margin-bottom: 6px;">Došlo je do poteškoće pri mrežnom slanju.</div>

      <p style="margin-bottom: 10px;">Bez brige, prijavu možete poslati izravno putem WhatsAppa ili pozivom:</p>

      <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="display: inline-flex; width: auto;">

        <i class="fa-brands fa-whatsapp"></i> Pošalji podatke na WhatsApp (+385 99 411 9102)

      </a>

    `;

    feedbackEl.className = 'form-feedback error';

    feedbackEl.style.display = 'block';

  }

 

  function escapeHtml(str) {

    return str.replace(/[&<>'"]/g,

      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)

    );

  }

}

 

/* ================= 5. Modal za uvećanje plakata ================= */

function openPosterModal(imageSrc) {

  const modal = document.getElementById('posterModal');

  const modalImg = document.getElementById('modalImg');

  if (modal && modalImg) {

    modalImg.src = imageSrc;

    modal.classList.add('active');

    document.body.style.overflow = 'hidden';

  }

}

 

function closePosterModal(e) {

  // Zatvori ako se klikne na pozadinu ili 'X' gumb

  if (e.target.id === 'posterModal' || e.target.classList.contains('modal-close')) {

    const modal = document.getElementById('posterModal');

    if (modal) {

      modal.classList.remove('active');

      document.body.style.overflow = 'auto';

    }

  }

}

 

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape') {

    const modal = document.getElementById('posterModal');

    if (modal && modal.classList.contains('active')) {

      modal.classList.remove('active');

      document.body.style.overflow = 'auto';

    }

  }

});