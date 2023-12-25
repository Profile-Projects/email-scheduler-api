const express = require("express");
const CustomerService = require("../service/CustomerService");
const EmailTemplateService = require("../service/EmailTemplateService");
const { copyOnlyNonEmptyObj } = require("../utils/jsonUtils");


const router = express.Router();
const customerService = new CustomerService();
const emailTemplateService = new EmailTemplateService();

router.post(`/`, async (req, res, next) => {
    try{

        const {
            organization_name,
            phone_number="",
            email, 
            address = {},
            props = {}
        } = req.body;

        const customer_sid = await customerService.insert({
            values: [
                organization_name,
                phone_number,
                email,
                address,
                props
            ]
        })

        return res.status(201).json({ message: "Customer created", customer_sid });
    } catch(err) {
        next(err);
    }
});

router.get(`/:customer_sid`, async (req, res, next) => {
    try {
        const {
            customer_sid
        } = req.params;

        const customer = await customerService.findById({
            value: customer_sid 
        });
        
        return res.status(200).json({ customer });
    } catch (err) {
        next(err);
    }
});

router.put(`/:customer_sid`, async (req, res, next) => {
    try {
        const {
            customer_sid
        } = req.params;

        const {
            organization_name,
            email,
            props
        } = req.body;

        await customerService.update({
            sidValue: customer_sid,
            obj: copyOnlyNonEmptyObj({
                organization_name,
                email,
                props
            })
        })
        const customer = await customerService.findById({ value: customer_sid });
        return res.status(200).json({ customer });
    } catch(err) {
        next(err);
    }
});

module.exports = router;