// ============================================================
// 1. CANVAS ANIMATION
// ============================================================
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let width, height;
let circles = [];
let animationFrame;

const colors = [
  "rgba(224, 170, 160, 0.12)",
  "rgba(224, 170, 160, 0.08)",
  "rgba(224, 170, 160, 0.04)",
  "rgba(248, 235, 230, 0.2)",
  "rgba(245, 225, 220, 0.15)"
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function initCircles() {
  circles = [];
  let circleCount = Math.floor(Math.min(width, height) / 18);

  for (let i = 0; i < circleCount; i++) {
    let radius = randomBetween(40, 140);
    let x = randomBetween(radius, width - radius);
    let y = randomBetween(radius, height - radius);
    let dx = randomBetween(-0.1, 0.1);
    let dy = randomBetween(-0.1, 0.1);
    let color = colors[Math.floor(Math.random() * colors.length)];
    circles.push({ x, y, dx, dy, radius, color });
  }
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fillStyle = circle.color;
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];

    if (circle.x + circle.radius > width) {
      circle.x = width - circle.radius;
      circle.dx = -circle.dx;
    } else if (circle.x - circle.radius < 0) {
      circle.x = circle.radius;
      circle.dx = -circle.dx;
    }

    if (circle.y + circle.radius > height) {
      circle.y = height - circle.radius;
      circle.dy = -circle.dy;
    } else if (circle.y - circle.radius < 0) {
      circle.y = circle.radius;
      circle.dy = -circle.dy;
    }

    circle.x += circle.dx;
    circle.y += circle.dy;

    drawCircle(circle);
  }

  animationFrame = requestAnimationFrame(animate);
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  initCircles();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
animate();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    animate();
  }
});

// ============================================================
// 2. SPA NAVIGATION
// ============================================================
function showView(viewName) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(viewName + '-view');
  if (targetView) {
    targetView.classList.add('active');
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    const link = item.querySelector('a');
    if (link && link.dataset.view === viewName) {
      item.classList.add('active');
    }
  });

  window.location.hash = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.innerWidth <= 992) {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('mobileMenuToggle').innerHTML = '<i class="fas fa-bars"></i>';
  }
}

function handleHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'course') {
    showView('course');
  } else {
    showView('dashboard');
  }
}

document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const view = this.dataset.view;
    if (view) {
      showView(view);
    }
  });
});

document.querySelectorAll('.nav-item a[data-view]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const view = this.dataset.view;
    if (view) {
      showView(view);
    }
  });
});

window.addEventListener('hashchange', handleHash);
handleHash();

// ============================================================
// 3. ACCESSIBILITY CONTROLS
// ============================================================
const state = {
  fontSize: 'medium',
  contrast: 'normal',
  theme: 'light',
  spacing: 'normal'
};

function applyAccessibility() {
  const body = document.body;
  const contentBody = document.getElementById('contentBody');

  // Font size
  body.classList.remove('large-text', 'small-text');
  if (state.fontSize === 'large') {
    body.classList.add('large-text');
  } else if (state.fontSize === 'small') {
    body.classList.add('small-text');
  }

  // Contrast
  body.classList.remove('high-contrast');
  if (state.contrast === 'high') {
    body.classList.add('high-contrast');
    state.theme = 'light';
  }

  // Theme
  body.classList.remove('dark-theme');
  if (state.theme === 'dark') {
    body.classList.add('dark-theme');
  }

  // Spacing for course content
  if (contentBody) {
    if (state.spacing === 'wide') {
      contentBody.style.lineHeight = '2.2';
      const paragraphs = contentBody.querySelectorAll('p, li, h1, h2, h3, h4');
      paragraphs.forEach(p => {
        p.style.marginBottom = '1.2rem';
      });
    } else {
      contentBody.style.lineHeight = '';
      const paragraphs = contentBody.querySelectorAll('p, li, h1, h2, h3, h4');
      paragraphs.forEach(p => {
        p.style.marginBottom = '';
      });
    }
  }

  updateAccessibilityButtons();
}

function updateAccessibilityButtons() {
  document.querySelectorAll('[data-action="font-size"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.fontSize);
  });

  document.querySelectorAll('[data-action="contrast"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.contrast);
  });

  document.querySelectorAll('[data-action="theme"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.theme);
  });

  document.querySelectorAll('[data-action="spacing"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.spacing);
  });
}

document.querySelectorAll('[data-action="font-size"]').forEach(btn => {
  btn.addEventListener('click', function() {
    state.fontSize = this.dataset.value;
    applyAccessibility();
  });
});

document.querySelectorAll('[data-action="contrast"]').forEach(btn => {
  btn.addEventListener('click', function() {
    state.contrast = this.dataset.value;
    if (state.contrast === 'high') {
      state.theme = 'light';
    }
    applyAccessibility();
  });
});

document.querySelectorAll('[data-action="theme"]').forEach(btn => {
  btn.addEventListener('click', function() {
    state.theme = this.dataset.value;
    if (state.theme === 'dark') {
      state.contrast = 'normal';
    }
    applyAccessibility();
  });
});

document.querySelectorAll('[data-action="spacing"]').forEach(btn => {
  btn.addEventListener('click', function() {
    state.spacing = (state.spacing === 'normal') ? 'wide' : 'normal';
    this.dataset.value = state.spacing;
    applyAccessibility();
  });
});

document.querySelectorAll('[data-action="reset"]').forEach(btn => {
  btn.addEventListener('click', function() {
    state.fontSize = 'medium';
    state.contrast = 'normal';
    state.theme = 'light';
    state.spacing = 'normal';
    applyAccessibility();
  });
});

// ============================================================
// 4. TASK TOGGLES
// ============================================================
document.querySelectorAll('.btn-show-answer').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.dataset.target;
    const answer = document.getElementById(targetId);
    if (answer) {
      answer.classList.toggle('show');
      this.textContent = answer.classList.contains('show') ? 'Скрыть ответ' : 'Показать ответ';
    }
  });
});

// ============================================================
// 5. PROGRESS STATE
// ============================================================
const progress = {
  featured: 68,
  keyboard: 80,
  color: 45,
  subtitles: 20,
  course: 75
};

function updateProgress() {
  const featuredFill = document.getElementById('featuredProgress');
  const featuredPercent = document.getElementById('featuredPercent');
  if (featuredFill && featuredPercent) {
    featuredFill.style.width = progress.featured + '%';
    featuredPercent.textContent = progress.featured + '%';
  }

  const courseFill = document.getElementById('courseProgressFill');
  const courseText = document.getElementById('courseProgressText');
  if (courseFill && courseText) {
    const width = (progress.course / 100) * 94;
    courseFill.style.width = width + 'px';
    courseText.textContent = progress.course + '%';
  }

  const ring = document.getElementById('ringProgress');
  if (ring) {
    const avg = Math.round((progress.featured + progress.keyboard + progress.color + progress.subtitles) / 4);
    ring.textContent = avg + '%';
    const ringParent = ring.closest('.ring-progress');
    if (ringParent) {
      const deg = (avg / 100) * 360;
      ringParent.style.background = `conic-gradient(#e0aaa0 0deg ${deg}deg, rgba(224, 170, 160, 0.15) ${deg}deg 360deg)`;
    }
  }

  document.querySelectorAll('.course-card').forEach(card => {
    const fill = card.querySelector('.progress-fill');
    const percentSpan = card.querySelector('.progress-percent');
    if (fill && percentSpan) {
      const label = card.querySelector('h3')?.textContent || '';
      let pct = 0;
      if (label.includes('Клавиатурная')) pct = progress.keyboard;
      else if (label.includes('Цвет')) pct = progress.color;
      else if (label.includes('Субтитры')) pct = progress.subtitles;
      fill.style.width = pct + '%';
      percentSpan.textContent = pct + '%';
    }
  });
}

document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('click', function() {
    const fill = this.querySelector('.progress-fill');
    const percentSpan = this.querySelector('.progress-percent');
    if (fill && percentSpan) {
      let current = parseInt(percentSpan.textContent) || 0;
      if (current < 100) {
        let newWidth = Math.min(current + 15, 100);
        fill.style.width = newWidth + '%';
        percentSpan.textContent = newWidth + '%';

        const label = this.querySelector('h3')?.textContent || '';
        if (label.includes('Клавиатурная')) progress.keyboard = newWidth;
        else if (label.includes('Цвет')) progress.color = newWidth;
        else if (label.includes('Субтитры')) progress.subtitles = newWidth;
        updateProgress();
      }
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

document.querySelector('.progress-wrap')?.addEventListener('click', function() {
  let next = progress.course + 5;
  if (next > 100) next = 0;
  progress.course = next;
  updateProgress();
});

document.querySelectorAll('.course-sidebar-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.course-sidebar-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});

// ============================================================
// 6. MOBILE MENU
// ============================================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

// ============================================================
// 7. DEMO MOCKS
// ============================================================
const navDemos = {
  'Стандарты WCAG': '📄 Раздел «Стандарты WCAG»: каталог из 87 критериев успеха 2.2 с фильтрами по уровням A / AA / AAA и принципам POUR.',
  'Прогресс': '📈 Раздел «Прогресс»: графики прохождения курсов, серии активности и полученные сертификаты.',
  'Сообщество': '👥 Раздел «Сообщество»: обсуждения, вопросы и ответы, обмен полезными ресурсами.',
  'Ресурсы': '🔖 Раздел «Ресурсы»: чек-листы, шаблоны и ссылки на инструменты доступности.'
};

document.querySelectorAll('.nav-item a').forEach(a => {
  const label = a.querySelector('span')?.textContent.trim();
  if (navDemos[label]) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      alert(navDemos[label]);
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
      }
    }, true);
  }
});

document.querySelectorAll('.view-all').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const section = this.closest('.section-header')?.querySelector('h2')?.textContent.trim() || 'Раздел';
    alert('🗂 «' + section + '» — полный список откроется в финальной версии.');
  });
});

document.querySelector('.user-chip')?.addEventListener('click', () => {
  alert('👤 Профиль: Александра — UX/UI дизайнер. Здесь появятся настройки аккаунта.');
});

document.querySelector('.tip-card')?.addEventListener('click', () => {
  alert('💡 Совет дня (WCAG 4.1.2). В демо-версии советы будут обновляться ежедневно.');
});

// ============================================================
// 8. MOBILE MENU TOGGLE EVENTS (после объявления переменных)
// ============================================================
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    sidebar.classList.toggle('active');
    const isActive = sidebar.classList.contains('active');
    this.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    this.setAttribute('aria-label', isActive ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 &&
      sidebar.classList.contains('active') &&
      !sidebar.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
      document.body.style.overflow = '';
    }
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    sidebar.classList.remove('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
    }
    document.body.style.overflow = '';
  }
});

// ============================================================
// 9. INIT
// ============================================================
applyAccessibility();
updateProgress();
