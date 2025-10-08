document.addEventListener('DOMContentLoaded', function() {
    // Данные для галереи
    const galleryData = {
        draniki: [
            {
                id: 1,
                full: '/gallery/draniki/KVN1.1.jpg',
                thumb: '/gallery/draniki/KVN1.1.jpg',
                title: 'Выступление на фестивале 2023',
                desc: 'Команда "Минские дранники" на сцене международного фестиваля'
            },
            {
                id: 2,
                full: '/gallery/draniki/KVN2.jpg',
                thumb: '/gallery/draniki/KVN2.jpg',
                title: 'Финал детской лиги 2024',
                desc: 'Музыкальный номер команды "Горячие кирпичи"'
            },
            {
                id: 3,
                full: '/gallery/draniki/KVN3.jpg',
                thumb: '/gallery/draniki/KVN3.jpg',
                title: 'Дебют команды "Чипупельки"',
                desc: 'Первое выступление нашей самой младшей команды'
            },
            {
                id: 4,
                full: '/gallery/draniki/KVN4.jpg',
                thumb: '/gallery/draniki/KVN4.jpg',
                title: 'Кубок чемпионов 2023',
                desc: 'Награждение команды "Лаванда"'
            }
        ],
        kirpichi: [
            {
                id: 5,
                full: '/gallery/kirpichi/KVN3.1.jpg',
                thumb: '/gallery/kirpichi/KVN3.1.jpg',
                title: 'Работа над новым номером',
                desc: 'Ребята репетируют сценку для предстоящего фестиваля'
            },
            {
                id: 6,
                full: '/gallery/kirpichi/KVN5.jpg',
                thumb: '/gallery/kirpichi/KVN5.jpg',
                title: 'Подготовка к конкурсу',
                desc: 'Разбор шуток с преподавателем перед выступлением'
            },
            {
                id: 7,
                full: '/gallery/kirpichi/KVN6.jpg',
                thumb: '/gallery/kirpichi/KVN6.jpg',
                title: 'Работа над образами',
                desc: 'Подготовка костюмов и реквизита для выступления'
            }
        ],
        lavanda: [
            {
                id: 8,
                full: '/gallery/lavanda/KVN7.jpg',
                thumb: '/gallery/lavanda/KVN7.jpg',
                title: 'День рождения школы',
                desc: 'Празднование 5-летия Школы КВН с выпускниками'
            },
            {
                id: 9,
                full: '/gallery/lavanda/KVN8.jpg',
                thumb: '/gallery/lavanda/KVN8.jpg',
                title: 'Мастер-класс от чемпионов',
                desc: 'Встреча с участниками Высшей лиги КВН'
            },
            {
                id: 10,
                full: '/gallery/lavanda/KVN9.jpg',
                thumb: '/gallery/lavanda/KVN9.jpg',
                title: 'Летний лагерь КВН',
                desc: 'Творческие занятия и игры на свежем воздухе'
            }
        ],
        shum: [
            {
                id: 11,
                full: 'images/gallery/team1.jpg',
                thumb: 'images/gallery/team1-thumb.jpg',
                title: 'Команда "Минские дранники"',
                desc: 'Победители детской лиги КВН 2023'
            },
            {
                id: 12,
                full: 'images/gallery/team2.jpg',
                thumb: 'images/gallery/team2-thumb.jpg',
                title: 'Команда "Горячие кирпичи"',
                desc: 'Финалисты международного фестиваля 2024'
            },
            {
                id: 13,
                full: 'images/gallery/team3.jpg',
                thumb: 'images/gallery/team3-thumb.jpg',
                title: 'Команда "Лаванда"',
                desc: 'Девчачья команда с изысканным юмором'
            },
            {
                id: 14,
                full: 'images/gallery/team4.jpg',
                thumb: 'images/gallery/team4-thumb.jpg',
                title: 'Комxvx',
                desc: 'Самая энергичная команда школы'
            }
        ],

        chipupelki: [
            {
                id: 11,
                full: 'images/gallery/team1.jpg',
                thumb: 'images/gallery/team1-thumb.jpg',
                title: 'Команда "Минские дранники"',
                desc: 'Победители детской лиги КВН 2023'
            },
            {
                id: 12,
                full: 'images/gallery/team2.jpg',
                thumb: 'images/gallery/team2-thumb.jpg',
                title: 'Команда "Горячие кирпичи"',
                desc: 'Финалисты международного фестиваля 2024'
            },
            {
                id: 13,
                full: 'images/gallery/team3.jpg',
                thumb: 'images/gallery/team3-thumb.jpg',
                title: 'Команда "Лаванда"',
                desc: 'Девчачья команда с изысканным юмором'
            },
            {
                id: 14,
                full: 'images/gallery/team4.jpg',
                thumb: 'images/gallery/team4-thumb.jpg',
                title: 'Команда "Шум"',
                desc: 'Самая энергичная команда школы'
            }
        ]
    };

    // Данные для видео
    const videoData = [
        {
            id: 1,
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Финал детской лиги 2023',
            desc: 'Выступление команды "Минские дранники"'
        },
        {
            id: 2,
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Музыкальный конкурс 2024',
            desc: 'Номер команды "Горячие кирпичи"'
        },
        {
            id: 3,
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Дебют "Чипупелек"',
            desc: 'Первое выступление нашей младшей команды'
        }
    ];

    // Элементы DOM
    const galleryGrid = document.getElementById('lightgallery');
    const videoContainer = document.getElementById('video-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const filterButtons = document.querySelectorAll('.tab-btn');

    // Текущее состояние
    let currentFilter = 'all';
    let visibleItems = 8;
    const itemsPerLoad = 4;

    // Инициализация галереи
    function initGallery() {
        renderGallery();
        renderVideos();
        setupEventListeners();
    }

    // Рендер фотогалереи
    function renderGallery() {
        galleryGrid.innerHTML = '';
        
        let itemsToShow = [];
        
        if (currentFilter === 'all') {
            Object.values(galleryData).forEach(category => {
                itemsToShow = itemsToShow.concat(category);
            });
        } else {
            itemsToShow = galleryData[currentFilter] || [];
        }
        
        itemsToShow.slice(0, visibleItems).forEach(item => {
            const galleryItem = document.createElement('a');
            galleryItem.className = `gallery-item ${currentFilter === 'all' ? getCategoryForItem(item.id) : currentFilter}`;
            galleryItem.href = item.full;
            galleryItem.setAttribute('data-sub-html', `<h4>${item.title}</h4><p>${item.desc}</p>`);
            
            galleryItem.innerHTML = `
                <img src="${item.thumb}" alt="${item.title}">
                <div class="item-overlay">
                    <i class="fas fa-search-plus"></i>
                    <span>${getCategoryName(getCategoryForItem(item.id))}</span>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Скрываем кнопку, если все элементы уже показаны
        if (visibleItems >= itemsToShow.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
        
        // Инициализируем lightGallery после рендера
        if (window.lightGallery) {
            lightGallery(galleryGrid, {
                selector: '.gallery-item',
                download: false,
                counter: false,
                getCaptionFromTitleOrAlt: false
            });
        }
    }

    // Рендер видео
    function renderVideos() {
        videoContainer.innerHTML = '';
        
        videoData.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            
            videoItem.innerHTML = `
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                </div>
                <h3>${video.title}</h3>
                <p>${video.desc}</p>
            `;
            
            videoContainer.appendChild(videoItem);
        });
    }

    // Получение категории по ID элемента
    function getCategoryForItem(id) {
        for (const category in galleryData) {
            if (galleryData[category].some(item => item.id === id)) {
                return category;
            }
        }
        return '';
    }

    // Получение читаемого имени категории
    function getCategoryName(category) {
        const names = {
            performances: 'Выступление',
            rehearsals: 'Репетиция',
            events: 'Мероприятие',
            teams: 'Команда'
        };
        return names[category] || '';
    }

    // Загрузка дополнительных элементов
    function loadMoreItems() {
        loadingSpinner.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        
        // Имитация задержки загрузки
        setTimeout(() => {
            visibleItems += itemsPerLoad;
            renderGallery();
            loadingSpinner.style.display = 'none';
        }, 800);
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Фильтрация
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                currentFilter = this.getAttribute('data-filter');
                visibleItems = 8;
                renderGallery();
            });
        });
        
        // Кнопка "Показать еще"
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreItems);
        }
        
        // Мобильное меню
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    // Запуск инициализации
    initGallery();
});