const express = require("express");
const { DEFAULT_SIGNATURE, DEFAULT_SALUTATION } = require("../utils/emailTemplateUtils");
const EmailTemplateService = require("../service/EmailTemplateService");

const router = express.Router();

const emailTemplateService = new EmailTemplateService();


router.post(`/`, async (req, res, next) => {
    try {
        const {
            content,
            user_placeholder_props,
            customer_placeholder_props,
            signature = DEFAULT_SIGNATURE,
            salutation = DEFAULT_SALUTATION,
            cc = [],
            bcc = [], 
            customer_sid,
            name
        } = req.body;

        const email_template_sid = await emailTemplateService.insert({
            content,
            user_placeholder_props,
            customer_placeholder_props,
            signature,
            salutation,
            cc,
            bcc, 
            customer_sid,
            name
        });

        return res.status(201).json({ message : "Email Template created", email_template_sid });

    } catch(err) {
        next(err);
    }
});

module.exports = router;