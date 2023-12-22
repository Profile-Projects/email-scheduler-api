const express = require("express");
const CustomerService = require("../service/CustomerService");
const UserService = require("../service/UserService");


const router = express.Router();
const userService = new UserService();

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

module.exports = router;