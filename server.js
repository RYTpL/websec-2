const express = require('express');
const cors = require('cors');
const path = require('path');

// Подключение маршрутов
const groupsRoute = require('./routes/groups');
const scheduleByGroupRoute = require('./routes/scheduleByGroup');
const scheduleByTeacherRoute = require('./routes/scheduleByTeacher');
const currentWeekRoute = require('./routes/currentWeek');

// Подключение парсера
const { processSchedule } = require('./utils/parseSchedule');

// Инициализация сервера
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

// Подключение маршрутов
app.use('/groups', groupsRoute);
app.use('/schedule', scheduleByGroupRoute);
app.use('/teacherSchedule', scheduleByTeacherRoute);
app.use('/currentWeek', currentWeekRoute);

// Маршрут по умолчанию для расписания определенной группы
app.get('/', async (req, res) => {
    try {
        
        const groupId = '1282690301'; 
        const schedule = await getScheduleForGroup(groupId); // Функция для получения расписания по группе
        res.json({ success: true, data: schedule });
    } catch (error) {
        console.error("Error fetching default schedule:", error);
        res.status(500).json({ success: false, error: "Failed to fetch schedule" });
    }
});

// Функция для получения расписания по группе (например, через парсер)
async function getScheduleForGroup(groupId) {
    // В вашем случае эта функция должна использовать API или парсер
    // для получения расписания по группе
    const schedule = await processSchedule(groupId); // Пример использования парсера
    return schedule;
}

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
