document.addEventListener('DOMContentLoaded', function () {
    let teamData = [];
    let teamCurrentIndex = 0;

    const teamSlidesContainer = document.getElementById('teamSlidesContainer');
    const teamDotsContainer = document.getElementById('teamDotsContainer');
    const teamNavPrev = document.getElementById('teamNavPrev');
    const teamNavNext = document.getElementById('teamNavNext');
    const sliderArea = document.getElementById('team-slides-wrapper');

    if (!teamSlidesContainer) {
        console.warn('Контейнер слайдера команд не найден');
        return;
    }

    /**
     * Предзагрузка изображений (чтобы избежать мигания)
     */
    function preloadImages(imageUrls) {
        const promises = imageUrls.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = img.onerror = resolve; // загрузился или ошибка — всё равно продолжаем
                img.src = url;
            });
        });
        return Promise.all(promises);
    }

    /**
     * Загрузка данных команд
     */
    async function loadTeams() {
        try {
            // Загружаем данные с timestamp, чтобы обойти кэш JSON
            const response = await fetch('/data/teams.json?t=' + Date.now());
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
            const rawData = await response.json();
            if (!Array.isArray(rawData)) throw new Error('Неверный формат данных');

            // Подготавливаем данные: добавляем timestamp к изображениям ТОЛЬКО при первой загрузке
            // Это обновит картинки, если они изменились на сервере
            teamData = rawData.map(team => ({
                id: team.id || Date.now(),
                description: team.age || 'Описание не указано',
                image: team.image ? `${team.image}?t=${Date.now()}` : 'img/team/default.jpg',
                alt: team.name || 'Команда',
                achievements: Array.isArray(team.achievements) ? team.achievements : []
            }));

            // Предзагружаем изображения
            const imageUrls = teamData.map(t => t.image);
            await preloadImages(imageUrls);

            createTeamSlides();
            createTeamDots();
            teamUpdateSlider();
        } catch (error) {
            console.error('❌ Ошибка при загрузке команд:', error);
            // Резервные данные — тоже с timestamp для актуальности
            teamData = [
                {
                    id: 1,
                    description: 'Чемпионы 2023',
                    image: 'img/team/draniki.jpg?t=' + Date.now(),
                    alt: 'Минские дранники',
                    achievements: ['Лучшие шутки', 'Топ-3 по музыке']
                },
                {
                    id: 2,
                    description: 'Финалисты 2024',
                    image: 'img/team/kirpichi.jpg?t=' + Date.now(),
                    alt: 'Горячие кирпичи',
                    achievements: ['Лучшая игра', 'Приз зрительских симпатий']
                }
            ];
            const imageUrls = teamData.map(t => t.image);
            preloadImages(imageUrls); // без await — не критично для резерва

            createTeamSlides();
            createTeamDots();
            teamUpdateSlider();
        }
    }

    /**
     * Создаём все слайды один раз
     */
    function createTeamSlides() {
        teamSlidesContainer.innerHTML = '';
        teamData.forEach((team, index) => {
            const slide = document.createElement('div');
            slide.className = 'team-slide absolute w-full xl:w-[350px] fullHD:w-[400px] 2K:w-[600px] h-[500px] fullHD:h-[550px] 2K:h-[900px] rounded-2xl overflow-hidden transition-all duration-500 ease cursor-pointer bottom-12';
            slide.dataset.index = index;
            slide.innerHTML = createTeamCard(team, false);
            teamSlidesContainer.appendChild(slide);
        });
    }

    /**
     * Создаём точки
     */
    function createTeamDots() {
        teamDotsContainer.innerHTML = '';
        teamData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'team-dot-item w-2 2K:w-[10px] h-2 2K:h-[10px] rounded-[50%] cursor-pointer transition-all duration-300 bg-secondary50';
            dot.dataset.index = index;
            dot.title = `Команда ${index + 1}`;
            teamDotsContainer.appendChild(dot);
        });
        updateDots();
    }

    /**
     * Генерация карточки БЕЗ ?t= в img — изображение уже с timestamp в данных!
     */
    function createTeamCard(data, isActive = false) {
        if (!data) return `
            <div class="relative w-full h-full bg-bg rounded-[var(--border-radius-md)] 2K:rounded-4xl overflow-hidden shadow-[0_10px_25px_var(--color-shadow)] flex flex-col">
                Нет данных
            </div>
        `;

        const achievementsHtml = isActive && Array.isArray(data.achievements)
            ? `<div class="absolute p-4 w-full flex gap-2 justify-center flex-wrap">
                ${data.achievements.map(ach =>
                    `<span class="bg-accent px-4 py-1.5 rounded-2xl 2K:rounded-4xl text-xs fullHD:text-sm 2K:text-2xl flex items-center gap-1">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg> ${ach}
                    </span>`
                ).join('')}
              </div>`
            : '';

        // ❗ ВАЖНО: data.image УЖЕ содержит ?t=... (если нужно), поэтому просто вставляем его
        return `
            <div class="team-card relative w-full h-full bg-bg rounded-[var(--border-radius-md)] overflow-hidden shadow-[0_10px_25px_var(--color-shadow)] flex flex-col">
                <div class="relative flex-1 overflow-hidden rounded-[var(--border-radius-md)]">
                    <img class="w-full h-full object-cover" src="${data.image}" alt="${data.alt}" loading="lazy">
                </div>
                ${achievementsHtml}
                <div class="team-info absolute bottom-0 left-0 right-0 p-6 bg-[linear-gradient(transparent,#270e3490,#270e34bd,#270e34bd,#270e34bd,#270e34c8,#270e34cc,#270e34df,#270e34)] rounded-b-[var(--border-radius-md)] transition-opacity duration-300 ease ${isActive ? 'opacity-100' : 'opacity-0'}">
                    <p class="text-sm fullHD:text-base 2K:text-3xl leading-[1.6] mb-3.5">${data.description}</p>
                </div>
            </div>
        `;
    }

    function updateDots() {
        document.querySelectorAll('.team-dot-item').forEach((dot, index) => {
            if (index === teamCurrentIndex) {
                dot.className = 'team-dot-item w-2 2K:w-[10px] h-2 2K:h-[10px] rounded-[50%] cursor-pointer transition-all duration-300 bg-accent scale-140';
            } else {
                dot.className = 'team-dot-item w-2 2K:w-[10px] h-2 2K:h-[10px] rounded-[50%] cursor-pointer transition-all duration-300 bg-secondary50';
            }
        });
    }

    function positionSlides() {
        const slides = document.querySelectorAll('.team-slide');
        const total = teamData.length;

        slides.forEach((slide, index) => {
            const diff = index - teamCurrentIndex;
            let normalizedDiff = ((diff % total) + total) % total;
            if (normalizedDiff > total / 2) normalizedDiff -= total;

            slide.style.zIndex = String(10 - Math.abs(normalizedDiff));

            if (index === teamCurrentIndex) {
                slide.style.left = '50%';
                slide.style.transform = 'translateX(-50%) scale(1)';
                slide.style.opacity = '1';
                slide.style.filter = 'grayscale(0%) brightness(1)';
                slide.style.pointerEvents = 'auto';
                slide.innerHTML = createTeamCard(teamData[index], true);
            } else if (normalizedDiff === -1 || (teamCurrentIndex === 0 && index === total - 1)) {
                slide.style.left = '0';
                slide.style.transform = 'translateX(-50%) scale(0.8)';
                slide.style.opacity = '0.7';
                slide.style.filter = 'grayscale(60%) brightness(0.9)';
                slide.style.pointerEvents = 'auto';
                slide.innerHTML = createTeamCard(teamData[index], false);
            } else if (normalizedDiff === 1 || (teamCurrentIndex === total - 1 && index === 0)) {
                slide.style.left = '100%';
                slide.style.transform = 'translateX(-50%) scale(0.8)';
                slide.style.opacity = '0.7';
                slide.style.filter = 'grayscale(60%) brightness(0.9)';
                slide.style.pointerEvents = 'auto';
                slide.innerHTML = createTeamCard(teamData[index], false);
            } else {
                slide.style.opacity = '0';
                slide.style.pointerEvents = 'none';
                // Даже для скрытых — обновляем, но можно оптимизировать
                slide.innerHTML = createTeamCard(teamData[index], false);
            }
        });
    }

    function teamUpdateSlider() {
        if (teamData.length === 0) return;
        positionSlides();
        updateDots();
    }

    function teamNextSlide() {
        teamCurrentIndex = (teamCurrentIndex + 1) % teamData.length;
        teamUpdateSlider();
    }

    function teamPrevSlide() {
        teamCurrentIndex = (teamCurrentIndex - 1 + teamData.length) % teamData.length;
        teamUpdateSlider();
    }

    function teamGoToSlide(index) {
        if (index >= 0 && index < teamData.length) {
            teamCurrentIndex = index;
            teamUpdateSlider();
        }
    }

    if (teamNavPrev) teamNavPrev.addEventListener('click', teamPrevSlide);
    if (teamNavNext) teamNavNext.addEventListener('click', teamNextSlide);

    document.addEventListener('click', (e) => {
        const clickedSlide = e.target.closest('.team-slide');
        if (clickedSlide && getComputedStyle(clickedSlide).opacity !== '0') {
            const index = parseInt(clickedSlide.dataset.index);
            if (!isNaN(index) && index !== teamCurrentIndex) {
                teamGoToSlide(index);
            }
        }

        const dot = e.target.closest('.team-dot-item');
        if (dot) {
            const index = parseInt(dot.dataset.index);
            if (!isNaN(index)) teamGoToSlide(index);
        }
    });

    // Свайп
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderArea) {
        sliderArea.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        sliderArea.addEventListener('touchmove', e => {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });

        sliderArea.addEventListener('touchend', () => {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) teamNextSlide();
                else teamPrevSlide();
            }
        }, { passive: true });
    }

    // Запуск
    loadTeams();

    // Адаптивность с дебаунсом
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(teamUpdateSlider, 150);
    });
});