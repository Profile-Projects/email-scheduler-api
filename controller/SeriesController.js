const express = require("express");
const SeriesService = require("../service/SeriesService");

const router = express.Router();

const seriesService = new SeriesService();

router.post(`/`, async (req, res, next) => {
    try {
        const {
            customer_sid,
            name,
            config = {}
        } = req.body;

        const series_sid = await seriesService.insert({ values: [customer_sid, config]});

        return res.status(201).json({ message: "Series created", series_sid });
    } catch(err) {

    }
});

module.exports = router;