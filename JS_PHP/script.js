// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const ctaButtons = document.querySelectorAll('.cta-btn, .btn-primary');
const floatingBtn = document.getElementById('floatingBookBtn');
const navOverlay = document.getElementById('navOverlay'); // Оверлей для меню


// === Мобильное меню: открывается по клику, без задержек ===
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');

    // Блокируем прокрутку при открытом меню
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Убираем touchstart — оставляем только click (быстро и стабильно!)
hamburger.addEventListener('click', toggleMobileMenu);

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// === Плавный скролл ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('#header') ?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// === Анимация хедера при скролле ===
window.addEventListener('scroll', () => {
    const header = document.getElementById('header'); // ← без #
    if (!header) return;

    if (window.scrollY > 100) {
        header.classList.remove('bg-transparent');
        header.classList.add('bg-[var(--bg)]'); // ← правильный синтаксис
    } else {
        header.classList.remove('bg-[var(--bg)]');
        header.classList.add('bg-transparent');
    }
});

// === Анимация при прокрутке (Intersection Observer) ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.section-title, .section-subtitle, .program-card, .benefit-item, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// === Счётчики в hero ===
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }, 20);
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.textContent.replace(/\D/g, ''));
                animateCounter(stat, target);
            });
            heroObserver.unobserve(entry.target);
        }
    });
});

if (document.querySelector('.hero')) {
    heroObserver.observe(document.querySelector('.hero'));
}



// === Lazy loading ===
document.querySelectorAll('img[data-src]').forEach(img => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.src) {
                entry.target.src = entry.target.dataset.src;
                entry.target.classList.remove('lazy');
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(img);
});

// === Кнопка "Наверх" ===
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopBtn.className = 'fixed bottom-5 right-5 w-12 h-12 bg-(--secondary) text-(--text) border-none rounded-[50%] cursor-pointer flex items-center justify-center shadow=[0_5px_15px_rgba(0,0,0,0.3)] z-[999] transition-all duration-300 ease-linear opacity-0 pointer-events-none hover:bg-(--primary) hover:text-(--bg) hover:translate-y-[-3px] hover:shadow-[0_8px_25px_rgba(139,0,139,0.4);]';
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.remove('pointer-events-none'); 
        scrollToTopBtn.classList.remove("opacity-0");
        scrollToTopBtn.classList.add('opacity-100');
        scrollToTopBtn.classList.add('pointer-events-auto');        
    } else {
        scrollToTopBtn.classList.remove('pointer-events-auto'); 
        scrollToTopBtn.classList.remove("opacity-100");
        scrollToTopBtn.classList.add('opacity-0');
        scrollToTopBtn.classList.add('pointer-events-none'); 
    }
});

// === Анимация карточек программ ===
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// === Задержка анимации benefit-item ===
document.querySelectorAll('.benefit-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// === Floating button ===
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        floatingBtn ?.classList.add('show');
    } else {
        floatingBtn ?.classList.remove('show');
    }
});

floatingBtn ?.addEventListener('click', (e) => {
    e.preventDefault();
    openFormModal();
});