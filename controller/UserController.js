const express = require("express");
const CustomerService = require("../service/CustomerService");
const UserService = require("../service/UserService");
const UserSeriesService = require("../service/UserSeriesService");


const router = express.Router();
const userService = new UserService();
const userSeriesService = new UserSeriesService();

router.post(`/`, async (req, res, next) => {
    try{

        const {
            name,
            customer_sid,
            email,
            props = {}
        } = req.body;

        const user_sid = await userService.insert({
            values: [
                customer_sid,
                name,
                email,
                props
            ]
        })

        return res.status(201).json({ message: "user created", user_sid });
    } catch(err) {
        next(err);
    }
});

router.post(`/addtoseries`, async (req, res, next) => {
    try {
        const {
            user_sid,
            series_sid,
        } = req.body;

        const user_series_sid = await userSeriesService.insert({
            values: [user_sid, series_sid]
        });

        return res.status(201).json({ message: "User added to series", user_series_sid });
    } catch(err) {
        next(err);
    }
});

module.exports = router;