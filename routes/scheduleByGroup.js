const express = require('express');
const puppeteer = require('puppeteer'); // Подключаем Puppeteer
const cheerio = require('cheerio');
const router = express.Router();

const SSAU_BASE_URL = 'https://ssau.ru/rasp';

const fetchScheduleHTML = async (url) => {
    try {
        // Запускаем Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Переходим на страницу
        await page.goto(url, { waitUntil: 'networkidle2' }); // Ждем, пока страница полностью загрузится

        // Получаем HTML страницы
        const html = await page.content();

        await browser.close();
        return html;
    } catch (error) {
        throw new Error(`Не удалось загрузить расписание с ${url}`);
    }
};

const processSchedule = ($, week) => {
    // Логика парсинга расписания
    return {
        days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        times: ["9:00 - 10:30", "10:45 - 12:15", "12:30 - 14:00"],
        schedule: {},
        dates: ['01.01.2025', '02.01.2025']
    };
};

// API для получения расписания по группе
router.get('/', async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const week = req.query.week;

        if (!groupId || !week) {
            return res.status(400).json({ success: false, error: 'Missing groupId or week' });
        }

        const url = `${SSAU_BASE_URL}?groupId=${groupId}&selectedWeek=${week}`;
        
        // Используем Puppeteer для получения HTML
        const html = await fetchScheduleHTML(url);
        console.log(html.substring(0, 500)); // Выведем первые 500 символов страницы для отладки
        const $ = cheerio.load(html);

        const groupName = $('.page-header h1.h1-text').text().trim();
        const scheduleData = processSchedule($, week);

        res.json({
            success: true,
            groupId,
            week,
            groupName,
            schedule: scheduleData.schedule,
            dates: scheduleData.dates
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch schedule', details: error.message });
    }
});

module.exports = router;
