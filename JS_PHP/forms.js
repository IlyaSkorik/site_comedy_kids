document.addEventListener('DOMContentLoaded', function () {
    // === DOM Elements ===
    const signupModal = document.getElementById('signup-modal');
    const successModal = document.getElementById('success-modal');
    const signupForm = document.querySelector('.signup-form');

    let birthPicker = null;
    let contactPicker = null;

    // === Открытие модалки + инициализация календарей ===
    function openFormModal() {
        if (signupModal) {
            signupModal.classList.remove('hidden');
            signupModal.classList.add('flex');
            requestAnimationFrame(() => {
                signupModal.classList.remove('opacity-0');
                signupModal.classList.add('opacity-100');
            });
        }
        document.body.style.overflow = 'hidden';
        setTimeout(initPickers, 100);
    }

    // === Закрытие модалки ===
    function closeFormModal() {
        if (signupModal) {
            signupModal.classList.remove('opacity-100');
            signupModal.classList.add('opacity-0');
            setTimeout(() => {
                signupModal.classList.add('hidden');
                signupModal.classList.remove('flex');
            }, 300);
        }
        document.body.style.overflow = '';
        signupForm?.reset();
        clearErrors();

        if (birthPicker) { birthPicker.destroy(); birthPicker = null; }
        if (contactPicker) { contactPicker.destroy(); contactPicker = null; }
    }

    // === Закрытие модалки успеха ===
    function closeSuccessModal() {
        if (successModal) {
            successModal.classList.remove('opacity-100');
            successModal.classList.add('opacity-0');
            setTimeout(() => {
                successModal.classList.add('hidden');
                successModal.classList.remove('flex');
            }, 300);
        }
    }

    // === Инициализация flatpickr ===
    function initPickers() {
        if (birthPicker || contactPicker) return;

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 3);
        maxDate.setHours(0, 0, 0, 0);

        const birthInput = document.getElementById('child-birth-date');
        if (birthInput && !birthPicker) {
            birthPicker = flatpickr(birthInput, {
                minDate: "1970-01-01",
                maxDate: maxDate,
                dateFormat: "d.m.Y",
                locale: "ru"
            });
        }

        const contactInput = document.getElementById('preferred-contact');
        if (contactInput && !contactPicker) {
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
                    if (sub) {
                        if (sub.length <= 3) {
                            f += ' ' + sub;
                        } else if (sub.length <= 5) {
                            f += ' ' + sub.slice(0, 3) + '-' + sub.slice(3);
                        } else {
                            f += ' ' + sub.slice(0, 3) + '-' + sub.slice(3, 5) + '-' + sub.slice(5);
                        }
                    }
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
            if (sub) {
                if (sub.length <= 3) {
                    f += ' ' + sub;
                } else if (sub.length <= 5) {
                    f += ' ' + sub.slice(0, 3) + '-' + sub.slice(3);
                } else {
                    f += ' ' + sub.slice(0, 3) + '-' + sub.slice(3, 5) + '-' + sub.slice(5);
                }
            }
            this.value = f;
        });
    }

    // === Валидация ===
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    function showError(id, msg) {
        const el = document.getElementById(id + '-error');
        if (el) el.textContent = msg;
    }

    function validateBirthDate() {
        const birthDate = birthPicker?.selectedDates[0];
        if (birthDate) return true;
        showError('child-birth-date', 'Укажите дату рождения (от 3 лет)');
        return false;
    }

    const phoneRegex = /^\+375\s?\(?(17|25|29|33|44)\)?\s?\d{3}-?\d{2}-?\d{2}$/;

    // === Обработчик отправки формы ===
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData.entries());

            let valid = true;

            if (!data.parentName?.trim()) {
                showError('parent-name', 'Укажите имя');
                valid = false;
            }
            if (!data.childName?.trim()) {
                showError('child-name', 'Укажите имя ребёнка');
                valid = false;
            }
            if (!validateBirthDate()) {
                valid = false;
            }
            if (!data.phone?.trim()) {
                showError('phone', 'Укажите телефон');
                valid = false;
            } else if (!phoneRegex.test(data.phone)) {
                showError('phone', 'Формат: +375 (XX) XXX-XX-XX');
                valid = false;
            }

            // Проверка согласия: чекбокс должен быть отмечен
            const consentChecked = signupForm.querySelector('input[name="consent"]')?.checked;
            if (!consentChecked) {
                showError('consent', 'Требуется согласие на обработку данных');
                valid = false;
            }

            if (!valid) return;

            const btn = signupForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Отправка...';

            try {
                const response = await fetch('JS_PHP/PHP/send_telegram.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.ok) {
                    closeFormModal();
                    if (successModal) {
                        successModal.classList.remove('hidden');
                        successModal.classList.add('flex');
                        requestAnimationFrame(() => {
                            successModal.classList.remove('opacity-0');
                            successModal.classList.add('opacity-100');
                        });
                    }
                } else {
                    alert('Ошибка: ' + (result.message || 'Не удалось отправить заявку'));
                }
            } catch (err) {
                console.error('Ошибка отправки:', err);
                alert('Ошибка отправки. Попробуйте позже.');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

    // === Маска телефона для всех input[type="tel"] ===
    document.querySelectorAll('input[type="tel"]').forEach(setupPhoneMask);

    // === Обработчики закрытия модалки ===
    const modalCloseButtons = Array.from(document.querySelectorAll('.modal-close'));
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.closest('#signup-modal')) {
                closeFormModal();
            } else if (this.closest('#success-modal')) {
                closeSuccessModal();
            }
        });
    });

    if (signupModal) {
        signupModal.addEventListener('click', function (e) {
            if (e.target.classList.contains('backdrop') || !e.target.closest('.modal-content')) {
                closeFormModal();
            }
        });
    }

    if (successModal) {
        successModal.addEventListener('click', function (e) {
            if (e.target.classList.contains('backdrop') || !e.target.closest('.success-content')) {
                closeSuccessModal();
            }
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (signupModal && !signupModal.classList.contains('hidden')) {
                closeFormModal();
            }
            if (successModal && !successModal.classList.contains('hidden')) {
                closeSuccessModal();
            }
        }
    });

    // Открытие формы по data-action
    document.addEventListener('click', function (e) {
        const target = e.target.closest('[data-action="open-modal"]');
        if (!target) return;

        e.preventDefault();
        const buttonText = target.textContent.trim();
        const sourceInput = document.getElementById('form-source');
        if (sourceInput) {
            sourceInput.value = buttonText;
        }
        openFormModal();
    });

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

    // Экспорт функций в глобальную область (для onclick в HTML)
    window.closeSuccessModal = closeSuccessModal;
});