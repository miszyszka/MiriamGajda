// ─── STICKY NAV ───
const nav = document.getElementById('main-nav');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  backTop.classList.toggle('visible', window.scrollY > 300);
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── SCROLL ANIMATIONS ───
// Observe .section-heading → animate line & title
const headingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      headingObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section-heading').forEach(el => {
  headingObserver.observe(el);
});

// Observe list items with staggered delay
const listObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('li');
      items.forEach((li, i) => {
        setTimeout(() => li.classList.add('in-view'), i * 70);
      });
      listObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.obszary-list').forEach(el => {
  listObserver.observe(el);
});

// Observe forma items with stagger
const formaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.forma-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('in-view'), i * 100);
      });
      formaObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.formy-grid').forEach(el => {
  formaObserver.observe(el);
});

// Observe zasady items with stagger
const zasadyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.zasada-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('in-view'), i * 120);
      });
      zasadyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.zasady-grid').forEach(el => {
  zasadyObserver.observe(el);
});

// ─── ACTIVE NAV HIGHLIGHT ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ─── FORMA ITEM TOGGLE ───
function toggleForma(heading) {
  heading.classList.toggle('open');
}

// ─── "WIĘCEJ / MNIEJ" TOGGLE ───
function toggleMore(btn) {
  const extra = btn.previousElementSibling;
  const isOpen = extra.classList.toggle('open');
  btn.textContent = isOpen ? '› mniej...' : '› więcej...';
}

// ─── CONTACT FORM → miriamgajda@gmail.com ───
async function sendForm() {
  const name   = document.getElementById('cf-name').value.trim();
  const email  = document.getElementById('cf-email').value.trim();
  const tel    = document.getElementById('cf-tel').value.trim();
  const msg    = document.getElementById('cf-msg').value.trim();
  const status = document.getElementById('form-status');
  const btn    = document.querySelector('#contactForm button');

  if (!name || !email || !msg) {
    status.style.display = 'block';
    status.style.color = '#c0392b';
    status.textContent = 'Proszę wypełnić wymagane pola (imię, e-mail, wiadomość).';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Wysyłanie...';
  status.style.display = 'none';

  try {
    const res = await fetch('https://formspree.io/f/miriamgajda@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, tel, message: msg })
    });

    status.style.display = 'block';

    if (res.ok) {
      status.style.color = '#27ae60';
      status.textContent = 'Dziękuję! Wiadomość została wysłana. Odezwę się wkrótce.';
      document.getElementById('cf-name').value  = '';
      document.getElementById('cf-email').value = '';
      document.getElementById('cf-tel').value   = '';
      document.getElementById('cf-msg').value   = '';
    } else {
      throw new Error();
    }
  } catch {
    const subject = encodeURIComponent('Wiadomość ze strony – ' + name);
    const body    = encodeURIComponent(
      `Imię i nazwisko: ${name}\nE-mail: ${email}\nTelefon: ${tel}\n\n${msg}`
    );
    window.location.href = `mailto:miriamgajda@gmail.com?subject=${subject}&body=${body}`;
  } finally {
    btn.textContent = 'Wyślij wiadomość';
    btn.disabled = false;
  }
}
