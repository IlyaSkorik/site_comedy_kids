/**
 * ourTeams.js — Слайдер команд COMEDY KIDS
 * Полностью динамический, с поддержкой свайпа и адаптивности
 */

document.addEventListener('DOMContentLoaded', function() {
    // Данные команд и индекс текущего слайда
    let teamData = [];
    let teamCurrentIndex = 0;

    // Элементы DOM
    const teamSlidesContainer = document.getElementById('teamSlidesContainer');
    const teamDotsContainer = document.getElementById('teamDotsContainer');
    const teamNavPrev = document.getElementById('teamNavPrev');
    const teamNavNext = document.getElementById('teamNavNext');
    const sliderArea = document.getElementById('team-slides-wrapper');

    // Проверка существования контейнера
    if (!teamSlidesContainer) {
        console.warn('Контейнер слайдера команд не найден');
        return;
    }

    /**
     * Загрузка данных команд с сервера
     */
    async function loadTeams() {
        try {
            // 🔁 ВАЖНО: добавляем ?t=timestamp, чтобы избежать кэширования
            const response = await fetch('/data/teams.json?t=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();

            // Проверка формата
            if (!Array.isArray(data)) {
                throw new Error('Неверный формат данных: ожидается массив');
            }

            // Обновляем данные
            teamData = data.map(team => ({
                id: team.id || Date.now(),
                description: team.age || 'Описание не указанно',
                image: team.image || 'img/team/default.jpg',
                alt: team.name || 'Команда',
                achievements: Array.isArray(team.achievements) ? team.achievements : []
            }));

            // Пересоздаём слайды
            createTeamSlides();
            createTeamDots();
            teamUpdateSlider();

        } catch (error) {
            console.error('❌ Ошибка при загрузке команд:', error);
            
            // Резервные данные на случай сбоя
            teamData = [
                {
                    id: 1,
                    description: 'Чемпионы 2023',
                    image: 'img/team/draniki.jpg',
                    alt: 'Минские дранники',
                    achievements: ['Лучшие шутки', 'Топ-3 по музыке']
                },
                {
                    id: 2,
                    description: 'Финалисты 2024',
                    image: 'img/team/kirpichi.jpg',
                    alt: 'Горячие кирпичи',
                    achievements: ['Лучшая игра', 'Приз зрительских симпатий']
                }
            ];

            createTeamSlides();
            createTeamDots();
            teamUpdateSlider();
        }
    }

    /**
     * Создаёт три слайда: предыдущий, активный, следующий
     */
    function createTeamSlides() {
        teamSlidesContainer.innerHTML = '';

        const prevSlide = document.createElement('div');
        prevSlide.className = 'absolute w-[350px] 2xl:w-[400px] h-[500px] 2xl:h-[550px] right-0 lg:right-[100%] scale-80 rounded-2xl overflow-hidden grayscale-60 brightness-90 opacity-70 shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-500 ease cursor-pointer z-[3] bottom-12';
        prevSlide.id = 'teamSlidePrev';

        const activeSlide = document.createElement('div');
        activeSlide.className = 'team-slide-active absolute w-[350px] 2xl:w-[400px] h-[500px] 2xl:h-[550px] left-[50%] translate-x-[-50%] rounded-2xl overflow-hidden transition-all duration-500 ease cursor-pointer z-[4] bottom-12';
        activeSlide.id = 'teamSlideActive';

        const nextSlide = document.createElement('div');
        nextSlide.className = "absolute w-[350px] 2xl:w-[400px] h-[500px] 2xl:h-[550px] left-0 lg:left-[100%] scale-80 rounded-2xl overflow-hidden grayscale-60 opacity-70 brightness-90 shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-500 ease cursor-pointer z-[3] bottom-12";
        nextSlide.id = 'teamSlideNext';

        teamSlidesContainer.appendChild(prevSlide);
        teamSlidesContainer.appendChild(activeSlide);
        teamSlidesContainer.appendChild(nextSlide);
    }

    /**
     * Создаёт индикаторы (точки) под слайдером
     */
    function createTeamDots() {
        teamDotsContainer.innerHTML = '';
        teamData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'team-dot-item w-2 h-2 rounded-[50%] cursor-pointer transition-all duration-300';
            if (index === teamCurrentIndex) dot.classList.add('bg-(--accent)'); else dot.classList.add('bg-(--secondary70)');
            dot.dataset.index = index;
            dot.title = `Команда ${index + 1}`;
            teamDotsContainer.appendChild(dot);
        });
    }

    /**
     * Генерирует HTML карточки команды
     */
    function createTeamCard(data, isActive = false) {
    if (!data) return `
        <div class="relative w-full h-full bg-[var(--bg)] rounded-[var(--border-radius-md)] overflow-hidden shadow-[0_10px_25px_var(--color-shadow)] transition-all duration-300 ease-in flex flex-col">
            Нет данных
        </div>
    `;

    const achievementsHtml = isActive && Array.isArray(data.achievements) 
        ? `<div class="absolute p-4 w-full flex gap-2 justify-center flex-wrap">
            ${data.achievements.map(ach => 
                `<span class="bg-[var(--accent)] px-4 py-1.5 rounded-2xl text-xs 2xl:text-sm flex items-center gap-1 transition-all duration-300 ease">
                    <i class="fas fa-star"></i> ${ach}
                </span>`
            ).join('')}
          </div>`
        : '';

    return `
        <div class="team-card relative w-full h-full bg-[var(--bg)] rounded-[var(--border-radius-md)] overflow-hidden shadow-[0_10px_25px_var(--color-shadow)] transition-all duration-300 ease flex flex-col">
            <div class="relative flex-1 overflow-hidden rounded-[var(--border-radius-md)]">
                <img class="w-full h-full object-cover transition-all duration-300 ease" src="${data.image}?t=${Date.now()}" alt="${data.alt}" loading="lazy">
            </div>
            ${achievementsHtml}
            <div class="team-info absolute bottom-0 left-0 right-0 p-6 bg-[linear-gradient(transparent,#270e3490,#270e34bd,#270e34bd,#270e34bd,#270e34c8,#270e34cc,#270e34df,#270e34)] rounded-b-[var(--border-radius-md)] transition-transform duration-300 ease ${isActive ? 'opacity-100' : 'opacity-0'} ">
                <p class="text-sm 2xl:text-base leading-[1.6] mb-3.5">${data.description}</p>
            </div>
        </div>
    `;
}

    /**
     * Обновляет отображение слайдера
     */
    function teamUpdateSlider() {
        if (teamData.length === 0) return;

        const activeSlide = document.getElementById('teamSlideActive');
        const prevSlide = document.getElementById('teamSlidePrev');
        const nextSlide = document.getElementById('teamSlideNext');

        // Плавное исчезновение
        [activeSlide, prevSlide, nextSlide].forEach(slide => {
            if (slide) slide.style.opacity = '0';
        });

        setTimeout(() => {
            // Активный слайд — с достижениями
            if (activeSlide && teamData[teamCurrentIndex]) {
                activeSlide.innerHTML = createTeamCard(teamData[teamCurrentIndex], true);
                activeSlide.style.opacity = '1';
            }

            // Предыдущий слайд
            const prevIndex = (teamCurrentIndex - 1 + teamData.length) % teamData.length;
            if (prevSlide && teamData[prevIndex]) {
                prevSlide.innerHTML = createTeamCard(teamData[prevIndex], false);
                prevSlide.style.opacity = '1';
            }

            // Следующий слайд
            const nextIndex = (teamCurrentIndex + 1) % teamData.length;
            if (nextSlide && teamData[nextIndex]) {
                nextSlide.innerHTML = createTeamCard(teamData[nextIndex], false);
                nextSlide.style.opacity = '1';
            }

            // Обновляем точки
            document.querySelectorAll('.team-dot-item').forEach((dot, index) => {
                if (index === teamCurrentIndex) {
                    dot.className = 'team-dot-item w-2 h-2 rounded-[50%] cursor-pointer transition-all duration-300 bg-[var(--accent)] scale-140';
                } else {
                    dot.className = 'team-dot-item w-2 h-2 rounded-[50%] cursor-pointer transition-all duration-300 bg-[var(--secondary70)]';
                }
});
}, 150);
}

    // Навигация
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

    // Обработчики кнопок
    if (teamNavPrev) teamNavPrev.addEventListener('click', teamPrevSlide);
    if (teamNavNext) teamNavNext.addEventListener('click', teamNextSlide);

    // Обработчики кликов по слайдам
    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.closest('#teamSlidePrev')) teamPrevSlide();
        if (target.closest('#teamSlideNext')) teamNextSlide();

        const dot = target.closest('.team-dot-item');
        if (dot) {
            const index = parseInt(dot.dataset.index);
            if (!isNaN(index)) teamGoToSlide(index);
        }
    });

    // Поддержка свайпа
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderArea) {
        sliderArea.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        sliderArea.addEventListener('touchend', () => {
            if (Math.abs(touchStartX - touchEndX) > 50) {
                if (touchStartX < touchEndX) {
                    teamPrevSlide(); // свайп вправо
                } else {
                    teamNextSlide(); // свайп влево
                }
            }
        }, { passive: true });

        sliderArea.addEventListener('touchmove', e => {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });
    }

   

    // Запуск
    loadTeams();

    // Адаптивность
    window.addEventListener('resize', teamUpdateSlider);
});