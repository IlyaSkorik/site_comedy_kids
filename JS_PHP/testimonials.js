// Обрезка текста
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openModal(fullText) {
    const modal = document.getElementById('review-modal');
    const modalContent = modal.querySelector('div'); // внутренний блок
    const modalText = document.getElementById('modal-review-text');

    // Устанавливаем текст
    modalText.textContent = fullText;

    // Показываем модалку плавно
    modal.classList.remove('pointer-events-none');
    modal.classList.remove('opacity-0');
    
    // Через небольшую задержку анимируем контент
    setTimeout(() => {
        if (modalContent) {
            modalContent.classList.remove('opacity-0', 'scale-95');
            modalContent.classList.add('opacity-100', 'scale-100');
        }
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('review-modal');
    const modalContent = modal.querySelector('div');

    if (modalContent) {
        // Сначала анимируем уход контента
        modalContent.classList.remove('opacity-100', 'scale-100');
        modalContent.classList.add('opacity-0', 'scale-95');
    }

    // Через время скрываем весь оверлей
    setTimeout(() => {
        modal.classList.add('opacity-0', 'pointer-events-none');
    }, 300); // должно совпадать с duration-300
}

// Инициализация модальных окон (вызывать ПОСЛЕ генерации отзывов)
function initTestimonialModals() {
    let modal = document.querySelector('#review-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'review-modal';   
        modal.className = 'fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[9999] opacity-0 pointer-events-none transition-opacity duration-300';
        modal.innerHTML = `
            <div class="bg-[var(--bg)] overflow-y-auto p-7 rounded-2xl w-4/5 max-w-3/4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] opacity-0 scale-95 transition-all duration-300 ease-out transform relative">
                <span class="absolute top-3.5 right-5 text-2xl font-medium cursor-pointer transition-colors duration-200 hover:text-[var(--primary)]" id="modal-close">&times;</span>
                <p class="m-0 whitespace-pre-wrap" id="modal-review-text"></p>
            </div>
        `;
        document.body.appendChild(modal);

        // Закрытие
        modal.querySelector('#modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.removeEventListener('click', handleReadMoreClick);
    document.addEventListener('click', handleReadMoreClick);

    // Закрытие по Esc
    const handleEsc = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
}


// Делегирование кликов (работает даже с динамически созданными кнопками)
function handleReadMoreClick(e) {
    const button = e.target.closest('.btn-read-more');
    if (!button) return;

    e.preventDefault();

    const fullText = button.getAttribute('data-full');
    if (fullText) {
        openModal(fullText);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // 4. Загрузка отзывов
fetch('/data/testimonials.json?t=' + Date.now())
    .then(r => r.ok ? r.json() : [])
    .then(testimonials => {
        const container = document.getElementById('testimonials-container');
        if (!container) return;
        container.innerHTML = '';

        // --- Десктоп версия ---
for (let i = 0; i < testimonials.length; i += 4) {
    const chunk = testimonials.slice(i, i + 4);
    const desktopSlide = document.createElement('div');
    desktopSlide.className = i === 0 
        ? 'testimonial-slide active desktop-version block relative w-full h-auto' 
        : 'testimonial-slide desktop-version none relative w-full h-auto';
    
    desktopSlide.innerHTML = `
        <div class="grid grid-cols-2 gap-6 mb-8 w-full">
            ${chunk.map(t => `
                <div class="min-h-52 bg-[var(--secondary50)] rounded-[var(--border-radius-md)] shadow-[0_10px_30px_var(--color-shadow)] relative overflow-hidden flex flex-row">
                    <div class="relative flex-1 aspect-square max-w-52">
                        <img class="w-full h-full object-cover transition-transform duration-300 ease" src="${t.image}?t=${Date.now()}" alt="${t.name}" loading="lazy">
                    </div>
                    <div class="flex flex-2 flex-col justify-center p-6">
                        <div class="mb-2.5 text-[var(--text)] text-sm z-[1]">
                            <h4 class="font-[Dela_Gothic_One] tracking-[1px] m-0 text-2xl text-[var(--primary)]">${t.name}</h4>
                            <span class="m-0 text-sm opacity-90">${t.role}</span>
                        </div>
                        <div class="testimonial-item">
                            <p class="text-base leading-[1.6] opacity-90 m-0">
                                ${truncateText(t.text, 255)}
                            </p>
                            <div class="testimonial-item w-full flex justify-end mt-4">
                                <button type="button" class="btn-read-more bg-[var(--primary)] text-[var(--bg)] p-1.5 px-3 rounded-3xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-[0_4px_10px_rgba(255,100,0,0.3)] transition-all duration-300 ease-linear hover:-translate-y-0.5" data-full="${escapeHtml(t.text)}">
                                    Читать больше
                                    <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    container.appendChild(desktopSlide);
}

        // --- Мобильная версия ---
        testimonials.forEach(t => {
            const mobileSlide = document.createElement('div');
            mobileSlide.className = 'testimonial-slide mobile-version';
            mobileSlide.innerHTML = `
                <div class="testimonials-container testimonials-container-mobile">
                    <div class="testimonial-card active">
                        <div class="testimonial-author">
                            <img src="${t.image}?t=${Date.now()}" alt="${t.name}" loading="lazy">
                        </div>
                        <div class="testimonial-content">
                            <div class="author-overlay">
                                <h4>${t.name}</h4>
                                <span>${t.role}</span>
                            </div>
                            <p class="testimonial-text" >
                                ${truncateText(t.text, 200)}
                                <button type="button" class="btn-read-more" data-full='${escapeHtml(t.text)}'>
                                    Читать больше
                                    <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(mobileSlide);
        });

        // ✅ Запускаем слайдер
        if (typeof initTestimonialsSlider === 'function') {
            initTestimonialsSlider();
        } else {
            console.error('Функция initTestimonialsSlider не найдена');
        }

        // ✅ Инициализируем модалку ПОСЛЕ генерации кнопок
        initTestimonialModals();
    })
    .catch(e => console.error('Ошибка загрузки testimonials.json:', e));
});

function initTestimonialsSlider() {
    const isMobile = window.innerWidth <= 1024;

    const slides = isMobile ?
        document.querySelectorAll('.testimonial-slide.mobile-version') :
        document.querySelectorAll('.testimonial-slide.desktop-version');

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const svgprevBtn = document.getElementById('svg-prev-btn');
    const svgnextBtn = document.getElementById('svg-next-btn');
    const indicatorsContainer = document.getElementById('slider-indicators');

    if (!slides || slides.length === 0) {
        console.log('Слайды не найдены');
        return;
    }

    let currentIndex = 0;
    let isAnimating = false;

    // Очищаем индикаторы
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
    }

    // Создаем индикаторы
    for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add(
            'w-2',
            'h-2',
            'rounded-[50%]',
            'bg-(--secondary70)',
            'cursor-pointer',
            'transition-(--transition)',
            'transition-all',
            'duration-150',
            'ease-linear'
        );
        indicator.id = 'indicator-dot'
        if (i === 0) indicator.classList.add('bg-(--accent)', 'scale-140');
        indicator.addEventListener('click', () => goToSlide(i));
        if (indicatorsContainer) {
            indicatorsContainer.appendChild(indicator);
        }
    }

    const indicators = document.getElementById('indicator');

    // Сначала скрываем все слайды
    document.querySelectorAll('.testimonial-slide').forEach(slide => {
        slide.style.display = 'none';
        slide.classList.remove('active');
    });

    // Показываем только нужные слайды для текущего устройства
    if (isMobile) {
        document.querySelectorAll('.desktop-version').forEach(el => el.style.display = 'none');
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.style.display = 'block';
                slide.classList.add('active');
            } else {
                slide.style.display = 'none';
            }
        });
    } else {
        document.querySelectorAll('.mobile-version').forEach(el => el.style.display = 'none');
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.style.display = 'block';
                slide.classList.add('active');
            } else {
                slide.style.display = 'none';
            }
        });
    }

    // Функция для прокрутки слайдов
    function goToSlide(index) {
        if (isAnimating || index === currentIndex) return;

        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const targetSlide = slides[index];

        // Определяем направление
        const direction = index > currentIndex ? 1 : -1;

        // Подготавливаем следующий слайд
        targetSlide.style.display = 'block';
        targetSlide.style.position = 'absolute';
        targetSlide.style.top = '0';
        targetSlide.style.width = '100%';
        targetSlide.style.transform = `translateX(${direction > 0 ? '100%' : '-100%'})`;

        // Анимация прокрутки
        setTimeout(() => {
            currentSlide.style.transition = 'transform 0.5s ease';
            targetSlide.style.transition = 'transform 0.5s ease';

            currentSlide.style.transform = `translateX(${direction > 0 ? '-100%' : '100%'})`;
            targetSlide.style.transform = 'translateX(0)';
        }, 10);

        // Завершение анимации
        setTimeout(() => {
            currentSlide.style.display = 'none';
            currentSlide.style.transition = '';
            currentSlide.style.transform = '';
            currentSlide.style.position = '';
            currentSlide.style.top = '';
            currentSlide.style.width = '';
            currentSlide.classList.remove('active');

            targetSlide.style.position = '';
            targetSlide.style.top = '';
            targetSlide.style.width = '';
            targetSlide.style.transition = '';
            targetSlide.style.transform = '';
            targetSlide.classList.add('active');

            currentIndex = index;
            updateIndicators();
            isAnimating = false;
        }, 510);
    }

    function nextSlide() {
        if (isAnimating) return;
        if (currentIndex >= slides.length - 1) return;
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (isAnimating) return;
        if (currentIndex <= 0) return;
        goToSlide(currentIndex - 1);
    }

    function updateIndicators() {
    // Обновляем кнопки
    if (prevBtn) {
        if (currentIndex === 0) {
            prevBtn.classList.remove('bg-(--primary)', 'cursor-pointer', 'hover:scale-110');
            svgprevBtn.classList.remove('fill-(--bg)')
            prevBtn.classList.add('bg-(--secondary50)', 'cursor-not-allowed', 'transform-none');
            svgprevBtn.classList.add('fill-(--text)', 'opacity-80')
        } else {
            prevBtn.classList.remove('bg-(--secondary50)', 'cursor-not-allowed', 'transform-none');
            svgprevBtn.classList.remove('fill-(--text)', 'opacity-80')
            prevBtn.classList.add('bg-(--primary)', 'cursor-pointer', 'hover:scale-110');
            svgprevBtn.classList.add('fill-(--bg)')
        }
    }   

    if (nextBtn) {
        if (currentIndex === slides.length - 1) {
            nextBtn.classList.remove('bg-(--primary)', 'cursor-pointer', 'hover:scale-110');
            svgnextBtn.classList.remove('fill-(--bg)')
            nextBtn.classList.add('bg-(--secondary50)', 'cursor-not-allowed', 'transform-none');
            svgnextBtn.classList.add('fill-(--text)', 'opacity-80')
        } else {
            nextBtn.classList.remove('bg-(--secondary50)', 'cursor-not-allowed', 'transform-none');
            svgnextBtn.classList.remove('fill-(--text)', 'opacity-80')
            nextBtn.classList.add('bg-(--primary)', 'cursor-pointer', 'hover:scale-110');
            svgnextBtn.classList.add('fill-(--bg)')
        }
    }

    // Обновляем индикаторы
    const indicatorDots = document.querySelectorAll('#slider-indicators #indicator-dot');
    indicatorDots.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('bg-(--accent)', 'scale-140');
            indicator.classList.remove('bg-(--secondary70)');
        } else {
            indicator.classList.remove('bg-(--accent)', 'scale-140');
            indicator.classList.add('bg-(--secondary70)');
        }
    });
}

    // События
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Инициализация
    updateIndicators();

    // Перезапуск при ресайзе
    window.addEventListener('resize', function() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            initTestimonialsSlider();
        }, 200);
    });
}