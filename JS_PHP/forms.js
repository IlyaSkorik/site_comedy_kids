// === DOM Elements ===
const signupModal = document.getElementById('signup-modal');
const successModal = document.getElementById('success-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const signupForm = document.querySelector('.signup-form');

let birthPicker = null;
let contactPicker = null;

// === Открытие модалки + инициализация календарей ===
function openFormModal() {
    signupModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(initPickers, 100);
}

// === Закрытие модалки ===
function closeModal() {
    signupModal?.classList.remove('active');
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
    signupForm?.reset();
    clearErrors();

    if (birthPicker) { birthPicker.destroy(); birthPicker = null; }
    if (contactPicker) { contactPicker.destroy(); contactPicker = null; }
}

// === Закрытие по крестику и Escape ===
modalCloseButtons.forEach(btn => btn.addEventListener('click', closeModal));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && (signupModal?.classList.contains('active') || successModal?.classList.contains('active'))) {
        closeModal();
    }
});

// === Делегирование: открываем форму по data-action, даже для динамических кнопок ===
document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-action="open-modal"]');
    if (!target) return;

    e.preventDefault();

    // Берём текст кнопки
    const buttonText = target.textContent.trim();

    // Сохраняем в скрытое поле формы
    const sourceInput = document.getElementById('form-source');
    if (sourceInput) {
        sourceInput.value = buttonText;
    }

    // Открываем модалку
    openFormModal();
});

// === Инициализация flatpickr ===
function initPickers() {
    if (birthPicker || contactPicker) return;

    // Максимум — 3 года назад (ребёнку не больше 3 лет)
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 3);
maxDate.setHours(0, 0, 0, 0);

birthPicker = flatpickr("#child-birth-date", {
    minDate: "1970-01-01", // или не ставить
    maxDate: maxDate,      // не старше 3 лет
    dateFormat: "d.m.Y",
    locale: "ru"
});

    // --- Когда лучше связаться ---
    const contactInput = document.getElementById('preferred-contact');
    if (contactInput) {
        contactPicker = flatpickr(contactInput, {
            dateFormat: "d.m.Y H:i",
            time_24hr: true,
            enableTime: true,
            minDate: "today",
            locale: "ru",
            allowInput: true,
            clickOpens: true
        });
    }
}

// === Маска телефона ===
function setupPhoneMask(input) {
    let timeout;
    input.addEventListener('input', function () {
        const value = this.value;
        if (/^[\d+]*$/.test(value) || value === '' || value === '+') {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                let v = this.value.replace(/\D/g, '');
                if (v.startsWith('80')) v = '375' + v.slice(2);
                if (!v.startsWith('375')) v = '375' + v;
                v = v.slice(0, 12);
                const code = v.slice(3, 5);
                const sub = v.slice(5);
                let f = '+375';
                if (code) f += ` (${code})`;
                if (sub) f += ' ' + (sub.length <= 3 ? sub : sub.length <= 5 ? sub.slice(0,3)+'-'+sub.slice(3) : sub.slice(0,3)+'-'+sub.slice(3,5)+'-'+sub.slice(5));
                this.value = f;
            }, 300);
        }
    });
    input.addEventListener('blur', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.startsWith('80')) v = '375' + v.slice(2);
        if (!v.startsWith('375')) v = '375' + v;
        v = v.slice(0, 12);
        const code = v.slice(3, 5);
        const sub = v.slice(5);
        let f = '+375';
        if (code) f += ` (${code})`;
        if (sub) f += ' ' + (sub.length <= 3 ? sub : sub.length <= 5 ? sub.slice(0,3)+'-'+sub.slice(3) : sub.slice(0,3)+'-'+sub.slice(3,5)+'-'+sub.slice(5));
        this.value = f;
    });
}
document.querySelectorAll('input[type="tel"]').forEach(setupPhoneMask);

// === Валидация ===
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}
function showError(id, msg) {
    const el = document.getElementById(id + '-error');
    if (el) el.textContent = msg;
}
function validateBirthDate() {
    return birthPicker?.selectedDates[0] ? true : (showError('child-birth-date', 'Укажите дату рождения (от 3 лет)'), false);
}

const phoneRegex = /^\+375\s?\(?(17|25|29|33|44)\)?\s?\d{3}-?\d{2}-?\d{2}$/;

signupForm?.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    const data = Object.fromEntries(new FormData(signupForm).entries());
    let valid = true;

    if (!data.parentName) { showError('parent-name', 'Укажите имя'); valid = false; }
    if (!data.childName) { showError('child-name', 'Укажите имя ребёнка'); valid = false; }
    if (!validateBirthDate()) valid = false;
    if (!data.phone) { showError('phone', 'Укажите телефон'); valid = false; }
    else if (!phoneRegex.test(data.phone)) { showError('phone', 'Формат: +375 (XX) XXX-XX-XX'); valid = false; }
    if (!data.consent) { showError('consent', 'Требуется согласие'); valid = false; }

    if (!valid) return;

    const btn = signupForm.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправка...';

    try {
        const resp = await fetch('JS_PHP/PHP/send_telegram.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await resp.json();
        if (!json.ok) throw new Error();

        closeModal();
        successModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        alert('Ошибка отправки. Попробуйте позже.');
    } finally {
        btn.disabled = false;
        btn.textContent = txt;
    }
});

function closeSuccessModal() {
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
}