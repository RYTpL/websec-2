// Основной модуль парсинга HTML с сайта СГАУ
const cheerio = require('cheerio');

const processSchedule = ($, week) => {
    try {
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const schedule = {};
        const dates = [];

        // Получаем даты для каждого дня
        $('.schedule__item.schedule__head').each((index, elem) => {
            const date = $(elem).find('.caption-text.schedule__head-date').text().trim();
            if (date) dates.push(date);
        });

        const timeBlocks = $('.schedule__time-item');
        const times = [];
        timeBlocks.each((index, timeElem) => {
            const timeStr = $(timeElem).text().trim();
            if (index % 2 === 0) {
                times.push(`${timeStr} - `);
            } else {
                times[times.length - 1] += timeStr;
            }
        });

        // Создаем структуру расписания с временными блоками и днями недели
        times.forEach((time) => {
            schedule[time] = {};
            days.forEach((day) => {
                schedule[time][day] = '-';
            });
        });

        // Заполняем расписание занятиями
        $('.schedule__item:not(.schedule__head)').each((index, elem) => {
            const cell = $(elem);
            const dayIndex = index % days.length;
            const timeIndex = Math.floor(index / days.length);
            const timeStr = times[timeIndex];

            cell.find('.schedule__lesson').each((_, lessonElem) => {
                const lesson = $(lessonElem);
                const lessonInfo = extractLessonInfo($, lesson, week);
                if (schedule[timeStr][days[dayIndex]] === '-') {
                    schedule[timeStr][days[dayIndex]] = lessonInfo;
                } else if (schedule[timeStr][days[dayIndex]] !== '-') {
                    schedule[timeStr][days[dayIndex]] += `<hr>${lessonInfo}</div>`;
                }
            });
        });

        return { days, times, schedule, dates };
    } catch (error) {
        console.error('Error in processSchedule:', error.message);
        throw error;
    }
};

// Функция извлечения информации о занятии
const extractLessonInfo = ($, lesson, week) => {
    try {
        const typeClass = lesson.find('.schedule__lesson-type-chip').attr('class') || '';
        const info = lesson.find('.schedule__lesson-info');
        const subject = info.find('.body-text.schedule__discipline').text().trim();
        const location = info.find('.caption-text.schedule__place').text().trim();

        let teacher = "Преподаватель неизвестен";
        let teacherId = null;
        const teacherLinkElem = info.find('.schedule__teacher a');
        try {
            teacher = teacherLinkElem.text().trim();
            teacherId = teacherLinkElem.attr('href').split('=')[1];
        } catch (e) {
            console.warn("Teacher link not found for this lesson.");
        }

        let groupsHtml = '';
        info.find('a.caption-text.schedule__group').each((_, groupElem) => {
            const groupName = $(groupElem).text().trim();
            const groupIdLink = $(groupElem).attr('href').split('=')[1];
            groupsHtml += `<a href="index.html?groupId=${groupIdLink}&week=${week}" target="_blank">${groupName}</a>, `;
        });

        const groupList = groupsHtml.length > 0 ? groupsHtml.slice(0, -2) : 'Нет групп';

        let lessonInfo = `<b>${subject}</b><br>${location}`;
        if (teacherId) {
            lessonInfo += `<br><a href="teachers.html?staffId=${teacherId}&week=${week}" target="_blank">${teacher}</a>`;
        } else {
            lessonInfo += `<br>${teacher}`;
        }
        lessonInfo += `<br>Группы: ${groupList}`;

        let colorClass = '';
        if (typeClass?.includes('lesson-type-1__bg')) {
            colorClass = 'green';
        } else if (typeClass?.includes('lesson-type-2__bg')) {
            colorClass = 'pink';
        } else if (typeClass?.includes('lesson-type-3__bg')) {
            colorClass = 'blue';
        } else if (typeClass?.includes('lesson-type-4__bg')) {
            colorClass = 'orange';
        } else if (typeClass?.includes('lesson-type-5__bg')) {
            colorClass = 'dark-blue';
        } else if (typeClass?.includes('lesson-type-6__bg')) {
            colorClass = 'turquoise';
        }

        return `<div class="${colorClass}">${lessonInfo}</div>`;
    } catch (error) {
        console.error('Error in extractLessonInfo:', error.message);
        return '<div>Ошибка при обработке занятия</div>';
    }
};

module.exports = { processSchedule };
