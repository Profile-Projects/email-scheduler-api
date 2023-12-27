const express = require("express");
const { DEFAULT_SIGNATURE, DEFAULT_SALUTATION } = require("../utils/emailTemplateUtils");
const EmailTemplateService = require("../service/EmailTemplateService");
const { copyOnlyNonEmptyObj } = require("../utils/jsonUtils");
const CustomerService = require("../service/CustomerService");
const BaseController = require("./BaseController");

const router = express.Router();

const emailTemplateService = new EmailTemplateService();
const customerService = new CustomerService();

class EmailTemplateController extends BaseController {

    constructor(app) {
        super(app);
        this.router = router;
        this.initRouters();
    }

    initRouters() {

        router.post(`/`, async (req, res, next) => {
            try {
                const {
                    content,
                    user_placeholder_props = [],
                    customer_placeholder_props = [],
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

        router.get(`/:email_template_sid`, async (req, res, next) => {
            try {
                const {
                    email_template_sid
                } = req.params;

                const email_template = await emailTemplateService.findById({
                    value: email_template_sid 
                });
                
                return res.status(200).json({ email_template });
            } catch (err) {
                next(err);
            }
        });

        router.put(`/:email_template_sid`, async (req, res, next) => {
            try {
                const {
                    email_template_sid
                } = req.params;

                // customer_sid mapping cannot be updated
                const {
                    props
                } = req.body;

                await emailTemplateService.update({
                    sidValue: email_template_sid,
                    obj: copyOnlyNonEmptyObj({
                        props
                    })
                })
                const email_template = await emailTemplateService.findById({ value: email_template_sid });
                return res.status(200).json({ email_template });
            } catch(err) {
                next(err);
            }
        });
    }
}

const initController = (app) => {
    const emailTemplateController = new EmailTemplateController(app);
    return emailTemplateController.router;
}

module.exports = initController;