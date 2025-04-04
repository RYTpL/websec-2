// server.js
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
app.use('/api/groups', groupsRoute);
app.use('/api/schedule', scheduleByGroupRoute);
app.use('/api/teacherSchedule', scheduleByTeacherRoute);
app.use('/api/currentWeek', currentWeekRoute);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
