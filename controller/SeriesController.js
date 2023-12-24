const express = require("express");
const SeriesService = require("../service/SeriesService");

const router = express.Router();

const seriesService = new SeriesService();

router.post(`/`, async (req, res, next) => {
    try {
        const {
            customer_sid,
            name,
            steps = [],
        } = req.body;

        const series_sid = await seriesService.insert({ values: [steps, customer_sid, name ]});

        return res.status(201).json({ message: "Series created", series_sid });
    } catch(err) {
        console.log()
        console.log("Error :" + err);
    }
});

router.get(`/:series_sid`, async (req, res, next) => {
    try {
        const {
            series_sid
        } = req.params;

        const series = await seriesService.findById({ value: series_sid });

        return res.status(200).json({ series });

    } catch(err) {
        next(err);
    }
});

module.exports = router;