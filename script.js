/* ============================================
   OMAR AMIN — Portfolio Script
   Theme • Particles • Typing • Modals • Feedback • Terminal
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Theme Engine --- */
  function getStoredTheme() {
    return localStorage.getItem('portfolio-theme') || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
  }

  function initTheme() {
    setTheme(getStoredTheme());
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    }
  }

  /* --- Scroll progress bar --- */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* --- Navbar scroll + menu + scrollspy --- */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menu = document.getElementById('navbar-menu');
    const toggleBtn = document.getElementById('navbar-toggle');

    function onScroll() {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', function () {
        menu.classList.toggle('open');
        toggleBtn.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', menu.classList.contains('open'));
      });
    }

    function closeMobileMenu() {
      if (menu) menu.classList.remove('open');
      if (toggleBtn) toggleBtn.classList.remove('open');
    }

    document.querySelectorAll('.nav-link-mobile').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });

    /* Scrollspy */
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

    function updateActive() {
      const y = window.scrollY + 120;
      let current = '';
      sections.forEach(function (sec) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (y >= top && y < top + height) current = sec.id;
      });
      navLinks.forEach(function (link) {
        const section = link.getAttribute('data-section');
        if (section === current) link.classList.add('active');
        else link.classList.remove('active');
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* --- Particles (pure JS) --- */
  function initParticles() {
    if (prefersReducedMotion) return;
    const container = document.getElementById('particles-container');
    if (!container) return;

    const count = 40;
    const particles = [];
    const hero = document.querySelector('.hero');

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      container.appendChild(p);
      particles.push({
        el: p,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        mx: 0,
        my: 0
      });
    }

    let mouseX = 0.5, mouseY = 0.5;
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        const rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
      });
    }

    function animateParticles() {
      particles.forEach(function (p) {
        p.x += p.vx + p.mx * 0.02;
        p.y += p.vy + p.my * 0.02;
        p.mx += (mouseX * 20 - p.x - p.mx) * 0.02;
        p.my += (mouseY * 20 - p.y - p.my) * 0.02;
        if (p.x < 0 || p.x > 100) p.vx *= -1;
        if (p.y < 0 || p.y > 100) p.vy *= -1;
        p.x = Math.max(0, Math.min(100, p.x));
        p.y = Math.max(0, Math.min(100, p.y));
        p.el.style.left = p.x + '%';
        p.el.style.top = p.y + '%';
      });
      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  /* --- Hero parallax (mouse) --- */
  function initHeroParallax() {
    if (prefersReducedMotion) return;
    const hero = document.querySelector('.hero');
    const left = document.querySelector('.hero-left');
    const right = document.querySelector('.hero-profile-card');
    if (!hero || !left || !right) return;

    hero.addEventListener('mousemove', function (e) {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      left.style.transform = 'translate(' + x * 8 + 'px,' + y * 8 + 'px)';
      right.style.transform = 'translate(' + -x * 12 + 'px,' + -y * 8 + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      left.style.transform = '';
      right.style.transform = '';
    });
  }

  /* --- Typing effect --- */
  const typingPhrases = [
    'AI / ML Engineer',
    'Data Analyst',
    'Data Engineer',
    'ML Research Enthusiast'
  ];

  function initTyping() {
    const el = document.getElementById('hero-typing');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function tick() {
      const phrase = typingPhrases[phraseIndex];
      if (isDeleting) {
        charIndex--;
        el.textContent = phrase.slice(0, charIndex);
        timeout = 80;
      } else {
        charIndex++;
        el.textContent = phrase.slice(0, charIndex);
        timeout = isDeleting ? 80 : 120;
      }
      if (!isDeleting && charIndex === phrase.length) {
        timeout = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        timeout = 400;
      }
      if (!prefersReducedMotion) setTimeout(tick, timeout);
    }

    if (prefersReducedMotion) {
      el.textContent = typingPhrases[0];
    } else {
      setTimeout(tick, 500);
    }
  }

  /* --- Stat counters --- */
  function initCounters() {
    const items = document.querySelectorAll('.stat-value[data-target]');
    if (prefersReducedMotion) {
      items.forEach(function (el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500;
        const start = performance.now();
        const startVal = 0;

        function step(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(startVal + (target - startVal) * ease);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* --- Reveal (IntersectionObserver) --- */
  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* --- Skills data + filter --- */
  const skillsData = {
    da: [
      { name: 'Pandas', icon: 'assets/icons/pandas.png' },
      { name: 'NumPy', icon: 'assets/icons/numpy.png' },
      { name: 'Excel', icon: 'assets/icons/excel.png' },
      { name: 'SQL', icon: 'assets/icons/sql.png' },
      { name: 'Visualization', icon: 'assets/icons/chart.png' }
    ],
    ml: [
      { name: 'Scikit-learn', icon: 'assets/icons/sklearn.png' },
      { name: 'TensorFlow', icon: 'assets/icons/tensorflow.png' },
      { name: 'PyTorch', icon: 'assets/icons/pytorch.png' },
      { name: 'Keras', icon: 'assets/icons/keras.png' },
      { name: 'XGBoost', icon: 'assets/icons/xgboost.png' }
    ],
    de: [
      { name: 'Python', icon: 'assets/icons/python.png' },
      { name: 'SQL', icon: 'assets/icons/sql.png' },
      { name: 'ETL', icon: 'assets/icons/etl.png' },
      { name: 'Apache Spark', icon: 'assets/icons/spark.png' }
    ],
    tools: [
      { name: 'Git', icon: 'assets/icons/git.png' },
      { name: 'Jupyter', icon: 'assets/icons/jupyter.png' },
      { name: 'Docker', icon: 'assets/icons/docker.png' },
      { name: 'Linux', icon: 'assets/icons/linux.png' }
    ]
  };

  function renderSkills(filter) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    const all = [];
    Object.keys(skillsData).forEach(function (cat) {
      skillsData[cat].forEach(function (s) {
        all.push({ ...s, category: cat });
      });
    });

    grid.innerHTML = all.map(function (s) {
      const show = filter === 'all' || filter === s.category;
      return '<div class="skill-item' + (show ? '' : ' hidden') + '" data-category="' + s.category + '">' +
        '<img src="' + s.icon + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
        '<span>' + s.name + '</span></div>';
    }).join('');
  }

  function initSkills() {
    renderSkills('all');
    document.querySelectorAll('.skill-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.skill-chip').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('.skill-item');
        items.forEach(function (item) {
          const cat = item.getAttribute('data-category');
          const show = filter === 'all' || filter === cat;
          item.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* --- Projects data + grid + modal --- */
  const projectsData = [
    { id: 1, title: 'ML Classification Pipeline', category: 'ml', image: 'assets/images/projects/project-1.jpg', desc: 'End-to-end classification pipeline with feature engineering and model comparison.', tech: ['Python', 'Scikit-learn', 'Pandas'], github: '#', live: '' },
    { id: 2, title: 'NLP Sentiment Analysis', category: 'nlp', image: 'assets/images/projects/project-2.jpg', desc: 'Sentiment analysis on text data using transformers and traditional NLP.', tech: ['Python', 'TensorFlow', 'NLTK'], github: '#', live: '' },
    { id: 3, title: 'Data Dashboard', category: 'data', image: 'assets/images/projects/project-3.jpg', desc: 'Interactive analytics dashboard for business metrics.', tech: ['Python', 'SQL', 'Plotly'], github: '#', live: '#' },
    { id: 4, title: 'Time Series Forecasting', category: 'ml', image: 'assets/images/projects/project-4.jpg', desc: 'Forecasting model for time series data with ARIMA and ML.', tech: ['Python', 'Pandas', 'Statsmodels'], github: '#', live: '' },
    { id: 5, title: 'ETL Data Pipeline', category: 'data', image: 'assets/images/projects/project-5.jpg', desc: 'Extract, transform, load pipeline for large-scale data.', tech: ['Python', 'SQL', 'Apache Spark'], github: '#', live: '' },
    { id: 6, title: 'Image Classification', category: 'ml', image: 'assets/images/projects/project-6.jpg', desc: 'CNN-based image classification with transfer learning.', tech: ['Python', 'TensorFlow', 'Keras'], github: '#', live: '' }
  ];

  function renderProjects(tab) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const filtered = tab === 'all' ? projectsData : projectsData.filter(function (p) { return p.category === tab; });
    grid.innerHTML = filtered.map(function (p) {
      return '<div class="project-card" data-project-id="' + p.id + '" role="button" tabindex="0">' +
        '<div class="project-card-img-wrap"><img class="project-card-img" src="' + p.image + '" alt="" loading="lazy"></div>' +
        '<div class="project-card-body">' +
        '<h3 class="project-card-title">' + p.title + '</h3>' +
        '<p class="project-card-meta">' + p.tech.join(' · ') + '</p></div></div>';
    }).join('');

    grid.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('click', openProjectModal);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal.call(card, e);
        }
      });
      /* 3D tilt */
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', x * 8 + 'deg');
        card.style.setProperty('--rx', -y * 8 + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  function openProjectModal(e) {
    const card = e.currentTarget;
    const id = parseInt(card.getAttribute('data-project-id'), 10);
    const p = projectsData.find(function (x) { return x.id === id; });
    if (!p) return;

    const modal = document.getElementById('project-modal');
    const img = document.getElementById('modal-project-img');
    const title = document.getElementById('project-modal-title');
    const desc = document.getElementById('modal-project-desc');
    const tech = document.getElementById('modal-project-tech');
    const github = document.getElementById('modal-project-github');
    const live = document.getElementById('modal-project-live');

    img.src = p.image;
    img.alt = p.title;
    title.textContent = p.title;
    desc.textContent = p.desc;
    tech.innerHTML = p.tech.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    github.href = p.github;
    live.href = p.live || '#';
    live.style.display = p.live ? '' : 'none';

    modal.removeAttribute('hidden');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('open');
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function initProjects() {
    renderProjects('all');
    document.querySelectorAll('.project-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.project-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderProjects(btn.getAttribute('data-tab'));
      });
    });

    document.querySelectorAll('[data-close="project-modal"]').forEach(function (el) {
      el.addEventListener('click', closeProjectModal);
    });
    document.getElementById('project-modal').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeProjectModal();
    });
  }

  /* --- Certificates data + grid + lightbox --- */
  const certificatesData = [];
  for (let i = 1; i <= 10; i++) {
    certificatesData.push({
      id: i,
      image: 'assets/images/certificates/cert-' + i + '.jpg',
      category: ['ml', 'data', 'python'][(i - 1) % 3]
    });
  }

  let currentCertIndex = 0;
  let currentCertFiltered = [];

  function renderCertificates(filter) {
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;

    currentCertFiltered = filter === 'all' ? certificatesData : certificatesData.filter(function (c) { return c.category === filter; });
    grid.innerHTML = currentCertFiltered.map(function (c, i) {
      return '<div class="cert-card" data-cert-index="' + i + '" role="button" tabindex="0">' +
        '<div class="cert-img-wrap"><img src="' + c.image + '" alt="Certificate ' + (i + 1) + '" loading="lazy"></div></div>';
    }).join('');

    grid.querySelectorAll('.cert-card').forEach(function (card) {
      card.addEventListener('click', function () {
        currentCertIndex = parseInt(card.getAttribute('data-cert-index'), 10);
        openCertLightbox();
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentCertIndex = parseInt(card.getAttribute('data-cert-index'), 10);
          openCertLightbox();
        }
      });
    });
  }

  function openCertLightbox() {
    const lb = document.getElementById('cert-lightbox');
    const img = document.getElementById('lightbox-img');
    const cert = currentCertFiltered[currentCertIndex];
    if (!cert) return;
    img.src = cert.image;
    img.alt = 'Certificate';
    lb.removeAttribute('hidden');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCertLightbox() {
    const lb = document.getElementById('cert-lightbox');
    lb.classList.remove('open');
    lb.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function lightboxPrev() {
    currentCertIndex = (currentCertIndex - 1 + currentCertFiltered.length) % currentCertFiltered.length;
    document.getElementById('lightbox-img').src = currentCertFiltered[currentCertIndex].image;
  }

  function lightboxNext() {
    currentCertIndex = (currentCertIndex + 1) % currentCertFiltered.length;
    document.getElementById('lightbox-img').src = currentCertFiltered[currentCertIndex].image;
  }

  function initCertificates() {
    renderCertificates('all');
    document.querySelectorAll('.cert-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.cert-chip').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderCertificates(btn.getAttribute('data-filter'));
      });
    });

    document.getElementById('lightbox-prev').addEventListener('click', lightboxPrev);
    document.getElementById('lightbox-next').addEventListener('click', lightboxNext);
    document.querySelectorAll('[data-close="cert-lightbox"]').forEach(function (el) {
      el.addEventListener('click', closeCertLightbox);
    });
    document.getElementById('cert-lightbox').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCertLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    });

    /* Swipe (touch) */
    let touchStartX = 0;
    document.getElementById('cert-lightbox').addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.getElementById('cert-lightbox').addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) lightboxPrev();
        else lightboxNext();
      }
    }, { passive: true });
  }

  /* --- Feedback (localStorage + like + sort + toast) --- */
  const FEEDBACK_KEY = 'portfolio-feedback';
  const LIKES_KEY = 'portfolio-feedback-likes';

  function getFeedback() {
    try {
      return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
    } catch (_) {
      return [];
    }
  }

  function setFeedback(arr) {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(arr));
  }

  function getLikes() {
    try {
      return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function setLikes(obj) {
    localStorage.setItem(LIKES_KEY, JSON.stringify(obj));
  }

  const defaultFeedback = [
    { id: '1', name: 'Ahmed Hassan', role: 'Senior Data Scientist', avatar: 'assets/images/avatars/user-1.jpg', comment: 'Omar shows strong analytical skills and dedication to learning. A great collaborator on ML projects.', date: Date.now() - 86400000 * 5 },
    { id: '2', name: 'Sara Mohamed', role: 'Tech Lead', avatar: 'assets/images/avatars/user-2.jpg', comment: 'Impressive portfolio and clear communication. Recommended for any data-driven team.', date: Date.now() - 86400000 * 10 },
    { id: '3', name: 'Khaled Ali', role: 'ML Engineer', avatar: 'assets/images/avatars/user-3.jpg', comment: 'Solid foundation in Python and ML frameworks. Eager to grow and deliver.', date: Date.now() - 86400000 * 15 }
  ];

  function ensureFeedback() {
    let arr = getFeedback();
    if (arr.length === 0) {
      setFeedback(defaultFeedback);
      arr = defaultFeedback;
    }
    return arr;
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  function renderFeedback(sortBy) {
    const grid = document.getElementById('feedback-grid');
    if (!grid) return;

    let list = ensureFeedback().slice();
    const likes = getLikes();

    if (sortBy === 'newest') list.sort(function (a, b) { return b.date - a.date; });
    else if (sortBy === 'oldest') list.sort(function (a, b) { return a.date - b.date; });
    else if (sortBy === 'most-liked') list.sort(function (a, b) { return (likes[b.id] || 0) - (likes[a.id] || 0); });

    grid.innerHTML = list.map(function (f) {
      const likeCount = likes[f.id] || 0;
      const liked = localStorage.getItem('portfolio-feedback-liked-' + f.id) === '1';
      return '<div class="feedback-card" data-feedback-id="' + f.id + '">' +
        '<div class="feedback-header">' +
        '<img class="feedback-avatar" src="' + f.avatar + '" alt="" loading="lazy">' +
        '<div class="feedback-meta">' +
        '<h4>' + f.name + ' <span class="feedback-verified">✓ Verified</span></h4>' +
        '<p>' + f.role + '</p></div></div>' +
        '<p class="feedback-comment">' + f.comment + '</p>' +
        '<div class="feedback-like-wrap">' +
        '<button type="button" class="feedback-like-btn' + (liked ? ' liked' : '') + '" data-feedback-id="' + f.id + '">' +
        '<span class="heart">♥</span> <span class="like-count">' + likeCount + '</span></button></div></div>';
    }).join('');

    grid.querySelectorAll('.feedback-like-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-feedback-id');
        const likes = getLikes();
        const wasLiked = localStorage.getItem('portfolio-feedback-liked-' + id) === '1';
        if (wasLiked) {
          likes[id] = (likes[id] || 0) - 1;
          if (likes[id] <= 0) delete likes[id];
          localStorage.removeItem('portfolio-feedback-liked-' + id);
        } else {
          likes[id] = (likes[id] || 0) + 1;
          localStorage.setItem('portfolio-feedback-liked-' + id, '1');
        }
        setLikes(likes);
        btn.classList.toggle('liked', !wasLiked);
        btn.querySelector('.like-count').textContent = likes[id] || 0;
      });
    });
  }

  function initFeedback() {
    ensureFeedback();
    renderFeedback('newest');

    document.getElementById('feedback-sort').addEventListener('change', function () {
      renderFeedback(this.value);
    });

    document.getElementById('feedback-add-btn').addEventListener('click', function () {
      document.getElementById('feedback-form-wrap').hidden = false;
    });

    document.getElementById('feedback-form-cancel').addEventListener('click', function () {
      document.getElementById('feedback-form-wrap').hidden = true;
    });

    document.getElementById('feedback-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.target;
      const arr = getFeedback();
      const newId = String(Date.now());
      arr.unshift({
        id: newId,
        name: form.name.value.trim(),
        role: form.role.value.trim(),
        avatar: 'assets/images/avatars/user-' + ((arr.length % 8) + 1) + '.jpg',
        comment: form.comment.value.trim(),
        date: Date.now()
      });
      setFeedback(arr);
      form.reset();
      document.getElementById('feedback-form-wrap').hidden = true;
      renderFeedback('newest');
      showToast('Thank you! Your feedback has been added.');
    });
  }

  /* --- AI Terminal --- */
  const terminalCommands = [
    { cmd: 'load model', output: 'Model loaded: resnet50' },
    { cmd: 'training...', output: 'Epoch 1/10 — loss: 0.42' },
    { cmd: 'training...', output: 'Epoch 5/10 — loss: 0.18' },
    { cmd: 'evaluate', output: 'accuracy: 92%' },
    { cmd: 'deployment ready', output: '✓ Pipeline deployed' }
  ];

  function initTerminal() {
    if (prefersReducedMotion) return;
    const outputEl = document.getElementById('terminal-output');
    const commandEl = document.getElementById('terminal-command');
    const cursorEl = document.getElementById('terminal-cursor');
    if (!outputEl || !commandEl) return;

    let step = 0;
    let phase = 'command'; // command | output
    let charIndex = 0;
    let outputIndex = 0;

    function run() {
      const item = terminalCommands[step % terminalCommands.length];
      if (phase === 'command') {
        if (charIndex <= item.cmd.length) {
          commandEl.textContent = item.cmd.slice(0, charIndex);
          charIndex++;
          setTimeout(run, 80);
        } else {
          phase = 'output';
          charIndex = 0;
          const line = document.createElement('div');
          line.className = 'prompt-line';
          line.textContent = '> ' + item.cmd;
          outputEl.appendChild(line);
          setTimeout(run, 400);
        }
      } else {
        if (charIndex <= item.output.length) {
          const outLine = outputEl.querySelector('.output-line-last');
          const text = item.output.slice(0, charIndex);
          if (outLine) outLine.textContent = text;
          else {
            const line = document.createElement('div');
            line.className = 'output-line-last success';
            line.textContent = text;
            outputEl.appendChild(line);
          }
          charIndex++;
          setTimeout(run, 50);
        } else {
          const last = outputEl.querySelector('.output-line-last');
          if (last) last.classList.remove('output-line-last');
          phase = 'command';
          charIndex = 0;
          step++;
          if (outputEl.children.length > 12) outputEl.removeChild(outputEl.firstChild);
          setTimeout(run, 1500);
        }
      }
    }

    setTimeout(run, 1000);
  }

  /* --- Contact form mailto --- */
  function initContact() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = encodeURIComponent('Portfolio contact from ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + '\n' + email);
      window.location.href = 'mailto:omarmaghawry2018@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  /* --- Lazy load images --- */
  function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    images.forEach(function (img) {
      if (img.getAttribute('data-src')) observer.observe(img);
    });
  }

  /* --- Footer year --- */
  function initFooter() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* --- Init all --- */
  initTheme();
  initScrollProgress();
  initNavbar();
  initParticles();
  initHeroParallax();
  initTyping();
  initCounters();
  initReveal();
  initSkills();
  initProjects();
  initCertificates();
  initFeedback();
  initTerminal();
  initContact();
  initLazyImages();
  initFooter();
})();
