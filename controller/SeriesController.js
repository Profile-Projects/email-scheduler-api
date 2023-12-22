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

module.exports = router;