const signupForm2 = document.querySelector('.contact-form form'); // Уточняем селектор

signupForm2.addEventListener('submit', async (e) => {  // Было 'submit2' → исправлено на 'submit'
    e.preventDefault();

    const data = {
        Name: signupForm2.querySelector('[name="Name"]').value.trim(),
        phone: signupForm2.querySelector('[name="phone"]').value.trim(),
        Message: signupForm2.querySelector('[name="Message"]').value.trim()
    };

    // Проверка полей и номера (остаётся без изменений)
    if (Object.values(data).some(v => !v)) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (!BY_PHONE_REGEX.test(data.phone)) {
        alert('Введите корректный номер Беларуси: +375 (xx) xxx-xx-xx');
        return;
    }

    const submitBtn = signupForm2.querySelector('button[type="submit"]');
    const originalTxt = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
        const resp = await fetch('JS&PHP/PHP/send_telegram_contacts.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await resp.json();

        if (!json.ok) throw new Error(json.error || 'Server error');
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        signupForm2.reset();
    } catch (err) {
        console.error(err);
        alert('Не удалось отправить форму. Попробуйте позже.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalTxt;
    }
});