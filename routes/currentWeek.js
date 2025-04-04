// API для текущей недели
const express = require('express');
const router = express.Router();

// API для получения текущей недели
router.get('/', (req, res) => {
    try {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // день недели (0 - воскресенье, 6 - суббота)
        const currentWeek = Math.ceil((currentDate.getDate() - currentDay + 1) / 7); // вычисляем номер недели

        res.json({
            success: true,
            currentWeek: currentWeek
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to get current week', details: error.message });
    }
});

module.exports = router;
