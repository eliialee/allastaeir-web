const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-links a');
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalMeta = document.getElementById('modalMeta');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalProcess = document.getElementById('modalProcess');
const modalBeforeAfter = document.getElementById('modalBeforeAfter');
const loadingScreen = document.querySelector('.loading-screen');
const cursor = document.querySelector('.cursor');

const createBubbles = () => {
  const bubbleCount = 18;
  document.querySelectorAll('.bubble').forEach((bubble) => bubble.remove());

  for (let i = 0; i < bubbleCount; i += 1) {
    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.style.setProperty('--size', `${Math.random() * 120 + 30}px`);
    bubble.style.setProperty('--duration', `${Math.random() * 14 + 10}s`);
    bubble.style.setProperty('--delay', `${Math.random() * 5}s`);
    bubble.style.setProperty('--x-shift', `${(Math.random() - 0.5) * 220}px`);
    bubble.style.left = `${Math.random() * 100}%`;
    document.body.appendChild(bubble);
  }
};


const setLoadingState = () => {
  window.setTimeout(() => {
    loadingScreen?.classList.add('hidden');
  }, 1400);
};

const initReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
};

const setActiveNav = () => {
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const activeLink = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', activeLink);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
};

const bindModal = () => {
  projectCards.forEach((card) => {
    const openModal = () => {
      const hasVideo = Boolean(card.dataset.video);
      modalImage.hidden = hasVideo;
      modalVideo.hidden = !hasVideo;
      if (hasVideo) {
        modalVideo.src = card.dataset.video;
        modalVideo.load();
        modalVideo.play().catch(() => {});
      } else {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalImage.src = card.dataset.image;
        modalImage.alt = card.dataset.title;
      }
      modalMeta.textContent = card.dataset.meta;
      modalTitle.textContent = card.dataset.title;
      modalDescription.textContent = card.dataset.description;
      modalProcess.textContent = card.dataset.process;
      modalBeforeAfter.textContent = `${card.dataset.before} • ${card.dataset.after}`;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };

    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });
  });

  modal?.querySelectorAll('[data-close]').forEach((closeTrigger) => {
    closeTrigger.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalVideo.pause();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalVideo.pause();
    }
  });
};

const initCursor = () => {
  if (window.matchMedia('(pointer: fine)').matches) {
    cursor.classList.add('active');
    window.addEventListener('pointermove', (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
  }
};

const updateBackground = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

    hero.style.setProperty('--mouse-x', x.toFixed(3));
    hero.style.setProperty('--mouse-y', y.toFixed(3));

    const orbitStyles = hero.querySelectorAll('.orb');
    orbitStyles.forEach((orb, index) => {
      const depth = (index + 1) * 12;
      orb.style.transform = `translate(${x * depth * 3}px, ${y * depth * 3}px)`;
    });

    const figure = hero.querySelector('.glass-figure');
    const badge = hero.querySelector('.crystal-badge');
    const star = hero.querySelector('.floating-star');

    if (figure) figure.style.transform = `rotate(-12deg) translate(${x * 16}px, ${y * 18}px)`;
    if (badge) badge.style.transform = `rotate(14deg) translate(${x * -14}px, ${y * 12}px)`;
    if (star) star.style.transform = `rotate(18deg) translate(${x * 18}px, ${y * -12}px)`;
  });
};

createBubbles();
setLoadingState();
initReveal();
setActiveNav();
bindModal();
initCursor();
updateBackground();
