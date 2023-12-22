const express = require("express");
const CustomerService = require("../service/CustomerService");
const EmailTemplateService = require("../service/EmailTemplateService");


const router = express.Router();
const customerService = new CustomerService();
const emailTemplateService = new EmailTemplateService();

router.post(`/`, async (req, res, next) => {
    try{

        const {
            organization_name,
            phone_number="",
            email, 
            address = {}
        } = req.body;

        const customer_sid = await customerService.insert({
            values: [
                organization_name,
                phone_number,
                email,
                address
            ]
        })

        return res.status(201).json({ message: "Customer created", customer_sid });
    } catch(err) {
        next(err);
    }
});

module.exports = router;