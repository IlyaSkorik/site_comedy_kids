// DOM Elements
const ctaButtons = document.querySelectorAll('.cta-btn, .btn-primary');
const floatingBtn = document.getElementById('floatingBookBtn');


// === Плавный скролл ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('#header')?.offsetHeight || 0;
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
    const header = document.getElementById('header');
    if (!header) return;

    if (window.scrollY > 100) {
        header.classList.remove('bg-transparent');
        header.classList.add('bg-[var(--bg)]');
    } else {
        header.classList.remove('bg-[var(--bg)]');
        header.classList.add('bg-transparent');
    }
});

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
scrollToTopBtn.className = 'fixed bottom-5 right-5 text-xs w-12 h-12 bg-(--secondary) text-(--text) border-none rounded-[50%] cursor-pointer flex items-center justify-center shadow=[0_5px_15px_rgba(0,0,0,0.3)] z- transition-all duration-300 ease-linear opacity-0 pointer-events-none hover:bg-(--primary) hover:text-(--bg) hover:translate-y-[-3px] hover:shadow-[0_8px_25px_rgba(139,0,139,0.4);]';
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

// === Floating button ===
window.addEventListener('scroll', () => {
    if (floatingBtn) {
        const handleScroll = () => {
            if (window.innerWidth >= 1024) {
                return;
            }
            if (window.scrollY > 500) {
                floatingBtn.classList.remove('opacity-0', 'pointer-events-none');
                floatingBtn.classList.add('opacity-100');
            } else {
                floatingBtn.classList.remove('opacity-100');
                floatingBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
});

floatingBtn?.addEventListener('click', (e) => {
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');
    const lines = hamburger.querySelectorAll('.hamburger-line');
    const header = document.getElementById('header');

    function openMenu() {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0', 'pointer-events-auto');
        overlay.classList.remove('hidden', 'opacity-0');
        overlay.classList.add('opacity-100', 'pointer-events-auto');

        // Анимация → крестик (2 линии)
        lines[0].style.transform = 'rotate(45deg) translate(5px, 4px)';
        lines[1].style.transform = 'rotate(-45deg) translate(5px, -4px)';

        document.body.style.overflow = 'hidden';

        if (window.scrollY < 100) {
            header.classList.remove('bg-transparent');
            header.classList.add('bg-[var(--bg)]');
        }        
    }

    function closeMenu() {
        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0', 'pointer-events-auto');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        overlay.classList.add('hidden', 'opacity-0');
        // Анимация → гамбургер
        lines[0].style.transform = 'rotate(0) translate(0, 0)';
        lines[1].style.transform = 'rotate(0) translate(0, 0)';

        document.body.style.overflow = '';

        if (window.scrollY > 100) return;
        else {
            header.classList.remove('bg-[var(--bg)]');
            header.classList.add('bg-transparent');
        }        
    }

    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('translate-x-full')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Закрытие при клике на ссылку
    document.querySelectorAll('#mobile-menu a, #mobile-menu button').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
