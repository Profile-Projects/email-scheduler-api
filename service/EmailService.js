const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1"});

class EmailService {

    constructor() {

    }

    async send({to = null, html_body = "", subject_text}) {
        if (!to) return;
        var params = {
            Destination: { /* required */
                CcAddresses: [],
                ToAddresses: [to]
            },
            Message: { /* required */
                Body: { /* required */
                    Html: {
                    Charset: "UTF-8",
                    Data: html_body
                    },
                    Text: {
                    Charset: "UTF-8",
                    Data: "TEXT_FORMAT_BODY"
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject_text
                }
            },
            Source: 'aemailscheduler@gmail.com', /* required */
            ReplyToAddresses: ['aemailscheduler@gmail.com'],
        };
        try {
            const result = await new AWS.SES({
                apiVersion: '2010-12-01'
            }).sendEmail(params).promise();
            const { MessageId } = result;
            console.log(`Message Id : ${MessageId}`);
        } catch (err) {
            console.log(`Error while sending mail : ${JSON.stringify(err)}`)
        } finally {
            return true;
        }
    }
}

module.exports = EmailService;