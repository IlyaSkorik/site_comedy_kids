// === Загрузка данных на главную страницу ===
document.addEventListener('DOMContentLoaded', function () {
    let contentDataLoaded = false;
    let animationStarted = false;

    // 1. Загрузка статистики и контактов
    fetch('/data/content.json?t=' + Date.now())
        .then(r => r.ok ? r.json() : {})
        .then(content => {
            const exp = document.querySelector('#stat-experience');
            const stud = document.querySelector('#stat-students');
            const events = document.querySelector('#stat-events');
            
            // Обновляем текст и устанавливаем data-target атрибуты
            if (exp && content.stat_experience) {
                exp.textContent = content.stat_experience;
                exp.setAttribute('data-target', content.stat_experience.replace(/\D/g, ''));
            }
            if (stud && content.stat_students) {
                stud.textContent = content.stat_students;
                stud.setAttribute('data-target', content.stat_students.replace(/\D/g, ''));
            }
            if (events && content.stat_events) {
                events.textContent = content.stat_events;
                events.setAttribute('data-target', content.stat_events.replace(/\D/g, ''));
            }

            const phone = document.querySelector('#contact-phone');
            const phoneLink = document.querySelector('#contact-phone-link');
            const address = document.querySelector('#contact-address');
            const email = document.querySelector('#contact-email');
            const emailLink = document.querySelector('#contact-email-link');

            if (phone && content.contact_phone) phone.textContent = content.contact_phone;
            if (phoneLink && content.contact_phone) phoneLink.setAttribute('href', 'tel:' + content.contact_phone.replace(/\D/g, ''));
            if (address && content.contact_address) address.textContent = content.contact_address;
            if (email && content.contact_email) email.textContent = content.contact_email;
            if (emailLink && content.contact_email) emailLink.setAttribute('href', 'mailto:' + content.contact_email);
            
            contentDataLoaded = true;
        })
        .catch(e => console.error('Ошибка загрузки content.json:', e));

    // 2. Загрузка программ
    fetch('/data/programs.json?t=' + Date.now())
        .then(r => r.ok ? r.json() : [])
        .then(programs => {
            const container = document.getElementById('programs-grid');
            if (!container) return;
            container.innerHTML = '';
            programs.forEach(program => {
                const card = document.createElement('div');
                card.className = 'program-card xl:w-1/3 animate bg-(--secondary50) py-5 px-7 rounded-(--border-radius-md) shadow-[0_10px_30px_var(--color-shadow)] relative transition-transform duration-300 ease-linear flex justify-between flex-col';
                if (program.id === 2) card.classList.add('featured');
                card.innerHTML = `
                    <div class="h-16 fullHD:h-20 w-full flex justify-center">
                        <img class="h-full mb-5" src="${program.image}?t=${Date.now()}" alt="${program.title}" >
                    </div> 
                    <h3 class="font-[Dela_Gothic_One] text-xl xl:text-2xl fullHD:text-3xl tracking-[1px] mb-2.5 text-(--primary) text-center">${program.title}</h3>
                    <p class="text-base xl:text-lg fullHD:text-xl font-semibold mb-5 text-center">${program.subtitle}</p>
                    <p class="mb-6 text-sm xl:text-base fullHD:text-lg leading-[1.6] indent-7">${program.description}</p>
                    <ul class="program-features">
                        ${program.features.map(feat => `<li>${feat}</li>`).join('')}
                    </ul>
                    <div class="w-full flex justify-center ">
                    <button class="btn bg-(--primary) text-(--bg) text-center hover:translate-y-[-3px] hover:shadow-[0_20px_80px_-10px_var(--primary)] hover:animate-fade-in-up-delayed" data-action="open-modal">${program.btnText}</button>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(e => console.error('Ошибка загрузки programs.json:', e));

    // 3. Преподаватели
    fetch('/data/teachers.json?t=' + Date.now())
        .then(r => r.ok ? r.json() : [])
        .then(teachers => {
            const container = document.getElementById('teachers-preview-grid');
            if (!container) return;
            container.innerHTML = '';
            teachers.forEach(teacher => {
                const card = document.createElement('div');
                card.className = "relative w-[350px] fullHD:w-[450px] h-[450px] fullHD:h-[600px] rounded-(--border-radius-md) overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.4)]";
                card.innerHTML = `
                    <div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                        <img class="w-full h-full object-cover transition-all duration-300 ease-in" src="${teacher.image}?t=${Date.now()}" alt="${teacher.alt}" class="teacher-main-img" loading="lazy">
                    </div>
                    <div class="flex content-start fullHD:h-[165px] flex-col flex-wrap absolute left-0 right-0 bottom-0 p-6 bg-[linear-gradient(transparent,#270e3490,#270e34bd,#270e34bd,#270e34bd,#270e34c8,#270e34cc,#270e34df,#270e34)] text-center rounded-b-(--border-radius-md)">
                        <h3 class="w-full font-[Dela_Gothic_One] text-xl xl:text-2xl fullHD:text-3xl tracking-[1px] mb-2.5 text-(--primary)">${teacher.name}</h3>
                        <p class="text-sm xl:text-base fullHD:text-lg mb-3.5 font-medium">${teacher.role}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(e => console.error('Ошибка загрузки teachers.json:', e));

    // === Счётчики в hero ===
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const hasPlus = element.textContent.includes('+');
        
        // Сбрасываем значение перед анимацией
        element.textContent = '0' + (hasPlus ? '+' : '');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }, 20);
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationStarted) {
                setTimeout(() => {
                    document.querySelectorAll('.stat-number').forEach(stat => {
                        let target;
                        if (stat.hasAttribute('data-target')) {
                            target = parseInt(stat.getAttribute('data-target'));
                        } else {
                            target = parseInt(stat.textContent.replace(/\D/g, ''));
                        }
                        
                        if (target > 0) {
                            animateCounter(stat, target);
                        }
                    });
                    animationStarted = true;
                    heroObserver.unobserve(entry.target);
                }, 500);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    if (document.querySelector('.hero')) {
        heroObserver.observe(document.querySelector('.hero'));
    }
});