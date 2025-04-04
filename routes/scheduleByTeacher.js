//API для расписания по преподавателю
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const SSAU_BASE_URL = 'https://ssau.ru/rasp';
const fetchScheduleHTML = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Не удалось загрузить расписание с ${url}`);
    }
};

const processSchedule = ($, week) => {
    // Здесь будет логика парсинга расписания (см. код из вашего вопроса)
    // Это будет функция, возвращающая данные расписания
    return {
        days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        times: ["9:00 - 10:30", "10:45 - 12:15", "12:30 - 14:00"],
        schedule: {},
        dates: ['01.01.2025', '02.01.2025']
    };
};

// API для получения расписания по преподавателю
router.get('/', async (req, res) => {
    try {
        const staffId = req.query.staffId;
        const week = req.query.week;

        if (!staffId || !week) {
            return res.status(400).json({ success: false, error: 'Missing staffId or week' });
        }

        const url = `${SSAU_BASE_URL}?staffId=${staffId}&selectedWeek=${week}`;
        const html = await fetchScheduleHTML(url);
        const $ = cheerio.load(html);
        
        const teacherName = $('.page-header h1.h1-text').text().trim();
        const scheduleData = processSchedule($, week);

        res.json({
            success: true,
            staffId,
            week,
            teacherName,
            schedule: scheduleData.schedule,
            dates: scheduleData.dates
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch teacher schedule', details: error.message });
    }
});

module.exports = router;
