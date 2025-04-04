//API для получения списка групп
const express = require('express');
const router = express.Router();

const GROUP_NUMBER_IDS = {
    "1282690301": "6411-100503D",
    "1282690279": "6412-100503D",
    "1213641978": "6413-100503D"
};

// API для получения списка групп
router.get('/', (req, res) => {
    try {
        const groups = Object.entries(GROUP_NUMBER_IDS).map(([id, name]) => ({
            id,
            name: name.split('-')[0],
        }));
        res.json({ success: true, data: groups });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ success: false, error: "Failed to fetch groups" });
    }
});

module.exports = router;
