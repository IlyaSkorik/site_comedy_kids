document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("cookie-overlay");
    const settingsBtn = document.getElementById("cookie-settings-btn");
    const configureBtn = document.getElementById("cookie-configure");
    const actionBtn = document.getElementById("cookie-action-btn");
    const advancedSection = document.getElementById("cookie-advanced");
    const analyticsConsent = document.getElementById("analytics-consent");
    const adsConsent = document.getElementById("ads-consent");

    // 🔹  ID
    const YANDEX_METRICA_ID = 103887113;         
    const GOOGLE_ANALYTICS_ID = 'G-GL9F38RGBX'; 

    // Проверяем, было ли согласие
    const savedConsent = localStorage.getItem("cookieConsent");

    if (savedConsent) {
      settingsBtn.style.display = "flex"; // Показываем иконку
      const consent = JSON.parse(savedConsent);
      if (consent.analytics) loadYandexMetrika(YANDEX_METRICA_ID);
      if (consent.ads) loadGoogleAnalytics(GOOGLE_ANALYTICS_ID);
    } else {
      showOverlay(); // Показываем баннер
    }

    function showOverlay() {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function hideOverlay() {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Переключение настроек
    configureBtn.addEventListener("click", function () {
      if (advancedSection.style.display === "block") {
        advancedSection.style.display = "none";
        configureBtn.textContent = "Настроить";
        actionBtn.textContent = "Принять все";
      } else {
        advancedSection.style.display = "block";
        configureBtn.textContent = "Скрыть настройки";
        actionBtn.textContent = "Сохранить настройки";
      }
    });

    // Основная кнопка: меняется в зависимости от режима
    actionBtn.addEventListener("click", function () {
      const consent = {
        necessary: true,
        analytics: analyticsConsent.checked,
        ads: adsConsent.checked
      };

      localStorage.setItem("cookieConsent", JSON.stringify(consent));
      hideOverlay();
      settingsBtn.style.display = "flex"; // показываем иконку

      // Загружаем метрики
      if (window.ym) ym(YANDEX_METRICA_ID, 'destroy');
      if (window.gtag) gtag('config', GOOGLE_ANALYTICS_ID, { send_page_view: false });

      if (consent.analytics) loadYandexMetrika(YANDEX_METRICA_ID);
      if (consent.ads) loadGoogleAnalytics(GOOGLE_ANALYTICS_ID);
    });

    // Кнопка шестерёнки — открывает настройки
    settingsBtn.addEventListener("click", function () {
      showOverlay();
      advancedSection.style.display = "block";
      configureBtn.textContent = "Скрыть настройки";
      actionBtn.textContent = "Сохранить настройки";
    });

    // Загрузка Яндекс.Метрики
    function loadYandexMetrika(id) {
      if (window.ym) return;
      (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(id, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
    }

    // Загрузка Google Analytics
    function loadGoogleAnalytics(measurementId) {
      if (window.gtag) return;
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', measurementId);
    }
  });

  