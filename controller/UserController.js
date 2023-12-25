const express = require("express");
const CustomerService = require("../service/CustomerService");
const UserService = require("../service/UserService");
const UserSeriesService = require("../service/UserSeriesService");
const ScheduleService = require("../service/ScheduleService");
const EmailTemplateService = require("../service/EmailTemplateService");
const { copyOnlyNonEmptyObj } = require("../utils/jsonUtils");


const router = express.Router();
const userService = new UserService();
const userSeriesService = new UserSeriesService();
const scheduleService = new ScheduleService();
const emailTemplateService = new EmailTemplateService();

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

        const {user_series_sid, series, user } = await userSeriesService.insert({
            values: [user_sid, series_sid]
        });

        const { steps } = series?.config;
        const [ first_step ] = steps;

        const { email_template_sid } = first_step;
        const email_template = await emailTemplateService.findById({ value: email_template_sid });
        await scheduleService.executeStep({
            step: first_step,
            step_index: 0,
            series,
            user,
            email_template,
            user_series_sid
        });

        return res.status(201).json({ message: "User added to series", user_series_sid });
    } catch(err) {
        next(err);
    }
});


router.get(`/:user_sid`, async (req, res, next) => {
    try {
        const {
            user_sid
        } = req.params;

        const user = await userService.findById({
            value: user_sid 
        });
        
        return res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
});

router.put(`/:user_sid`, async (req, res, next) => {
    try {
        const {
            user_sid
        } = req.params;

        // customer_sid mapping cannot be updated
        const {
            name,
            email,
            props
        } = req.body;

        await userService.update({
            sidValue: user_sid,
            obj: copyOnlyNonEmptyObj({
                name,
                email,
                props
            })
        })
        const user = await userService.findById({ value: user_sid });
        return res.status(200).json({ user });
    } catch(err) {
        next(err);
    }
});

module.exports = router;