// 🔹  ID
const YANDEX_METRICA_ID = 103887113;
const GOOGLE_ANALYTICS_ID = 'G-GL9F38RGBX';

// === Функция переключения кастомного чекбокса ===
    window.toggleCheckbox = function (checkbox) {
        const container = checkbox.nextElementSibling;
        const checkmark = container.querySelector('.checkmark');

        if (checkbox.checked) {
            container.classList.remove('bg-transparent', 'border-text');
            container.classList.add('bg-primary', 'border-primary');
            checkmark.classList.add('opacity-100');
            checkmark.classList.remove('opacity-0');
        } else {
            container.classList.add('bg-transparent', 'border-text');
            container.classList.remove('bg-primary', 'border-primary');
            checkmark.classList.add('opacity-0');
            checkmark.classList.remove('opacity-100');
        }
    };

// Обновление UI чекбоксов при загрузке
function updateCheckboxUI(checkboxId, checked) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = checked;
    toggleCheckbox(checkbox);
}

// Подключение Google Analytics (только при согласии)
function loadGoogleAnalytics() {
    if (window.gtag) return; // Уже подключена

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    script.onload = () => {
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;

        gtag('js', new Date());

        // Устанавливаем начальное состояние (запрещено)
        gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });

        // Инициализируем GA (это отправит page_view, если consent разрешён позже)
        gtag('config', GOOGLE_ANALYTICS_ID);
    };
}

// Подключение Яндекс.Метрики (только при согласии)
function loadYandexMetrika() {
    if (window.ym) return; // Уже подключена

    (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() {
            (m[i].a = m[i].a || []).push(arguments)
        };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) {
                return;
            }
        }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    // Инициализируем с параметрами (отложено)
    ym(YANDEX_METRICA_ID, "init", {
        defer: true, // Отложим до установки consent
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true
    });
}

// Инициализация аналитики (только после согласия)
function initAnalytics(consent) {
    // Подключаем аналитику, если разрешено
    if (consent.analytics) {
        loadGoogleAnalytics();
        loadYandexMetrika();

        // Обновляем consent через 200мс, чтобы gtag/ym успели подключиться
        setTimeout(() => {
            if (window.gtag) {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
                if (consent.ads) {
                    gtag('consent', 'update', {
                        'ad_storage': 'granted',
                        'ad_user_data': 'granted',
                        'ad_personalization': 'granted'
                    });
                } else {
                    gtag('consent', 'update', {
                        'ad_storage': 'denied',
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied'
                    });
                }
            }
            if (window.ym) {
                ym(YANDEX_METRICA_ID, 'consent', 'default', {
                    consent: true
                });
                ym(YANDEX_METRICA_ID, 'hit', window.location.href); // Отправляем hit вручную
            }
        }, 200);
    } else {
        // Если аналитика не разрешена, убедимся, что запрещено
        setTimeout(() => {
            if (window.gtag) {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                });
            }
            if (window.ym) {
                ym(YANDEX_METRICA_ID, 'consent', 'default', {
                    consent: false
                });
            }
        }, 200);
    }
}

// Сохранение согласия
function saveConsent(consent) {
    consent.accepted = true;
    consent.timestamp = new Date().toISOString();
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
}

// Проверяем, было ли уже принято решение
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
        const parsed = JSON.parse(consent);
        if (parsed.accepted) {
            // Обновление UI при загрузке
            if (parsed.analytics !== undefined) {
                updateCheckboxUI('analytics-consent', parsed.analytics);
            }
            if (parsed.ads !== undefined) {
                updateCheckboxUI('ads-consent', parsed.ads);
            }
            initAnalytics(parsed);
        }
        return true;
    }
    return false;
}

const cookiesBanner = document.getElementById('cookie-banner');
const cookiesSettings = document.getElementById('cokies-settings');
const cookieAcceptCustomize = document.getElementById('cookie-accept-customize');

// Показ блока настроек
function openSettingsModal() {
    cookiesSettings.classList.remove('hidden');
    cookieAcceptCustomize.classList.add('hidden');
    requestAnimationFrame(() => {
      cookiesSettings.classList.remove('opacity-0');
      cookiesSettings.classList.add('opacity-100');
  });

}

function openCookiesModal(){
  cookiesBanner.classList.remove('hidden');
  document.documentElement.classList.add('overflow-y-hidden');
  requestAnimationFrame(() => {
    cookiesBanner.classList.remove('opacity-0');
    cookiesBanner.classList.add('opacity-100');
  });
}

function closeCookiesModal(){
  cookiesBanner.classList.remove('opacity-100');
  cookiesBanner.classList.add('opacity-0');
    setTimeout(() => {
      cookiesBanner.classList.add('hidden');
    }, 300);
  document.documentElement.classList.remove('overflow-y-hidden');
}

// Основная логика
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация кастомных чекбоксов
    document.querySelectorAll('.checkbox-container').forEach(container => {
        const checkbox = container.previousElementSibling;
        if (checkbox.type === 'checkbox' && !checkbox.disabled) {
            container.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                toggleCheckbox(checkbox);
            });
        }
    });

    // Проверяем, есть ли уже согласие
    if (checkCookieConsent()) {
        closeCookiesModal();
    } else {
        openCookiesModal();
    }

    // Обработчики событий
    document.getElementById('cookie-accept-all').addEventListener('click', () => {
        saveConsent({
            analytics: true,
            ads: true
        });
        initAnalytics({
            analytics: true,
            ads: true
        });
        checkCookieConsent();
        closeCookiesModal();
    });

    document.getElementById('cookie-customize-initial').addEventListener('click', () => {
        openSettingsModal();
    });


    document.getElementById('save-cookie-settings').addEventListener('click', () => {
        const analytics = document.getElementById('analytics-consent').checked;
        const ads = document.getElementById('ads-consent').checked;
        saveConsent({
            analytics,
            ads
        });
        initAnalytics({
            analytics,
            ads
        });
        closeCookiesModal();
    });
});