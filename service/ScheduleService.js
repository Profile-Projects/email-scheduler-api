const cron = require("node-cron");

const ScheduleRepository = require("../repository/ScheduleRepository");
const UserRepository = require("../repository/UserRepository");
const { postGresTimestamp, getImmediateDate, getScheduledAt } = require("../utils/dateUtils");
const { EMAIL_TRIGGER_TYPE, getSeriesStep } = require("../utils/seriesConfigUtil");
const CrudService = require("./CrudService");
const UserSeriesService = require("./UserSeriesService");
const UserService = require("./UserService");
const SeriesService = require("./SeriesService");
const UserSeriesRepository = require("../repository/UserSeriesRepository");
const EmailTemplateService = require("./EmailTemplateService");
const EmailService = require("./EmailService");

const scheduleRepository = new ScheduleRepository();

const userService = new UserService();
const userSeriesRepository = new UserSeriesRepository();
const seriesService = new SeriesService();
const emailTemplateService = new EmailTemplateService();

const emailService = new EmailService();

class ScheduleService extends CrudService {
    
    constructor() {
        super(scheduleRepository, "SC");
        this.initSchedule();
    }

    async checkStepForTrigger({ step, user_series_sid }) {
        const { trigger, schedule = {} } = step;
        return trigger == EMAIL_TRIGGER_TYPE.IMMEDIATE;
    }

    async executeStep({ step, series, user, email_template, user_series_sid, step_index, trigger_next = true }) {
        // if (!this.checkStepForTrigger({ step})) return;
        const { user_props, customer_props } = series;

        const { trigger } = step;
        if (trigger == EMAIL_TRIGGER_TYPE.IMMEDIATE) {
            await this.scheduleImmediately({
                user_series_sid
            });
        } else {
            await this.scheduleAt({
                schedule,
                user_series_sid
            });
        }
        if (trigger_next) {
            this.scheduleNextStep({ 
                step_index: step_index + 1,
                user_series_sid,
                series
            });
        }
    }

    async scheduleNextStep({step_index, series, user_series_sid}) {
        if (series.length <= step_index) return;
        const {steps} = series?.config;
        const step = steps[step_index];
        const { trigger, schedule } = step;
        if (trigger == EMAIL_TRIGGER_TYPE.IMMEDIATE) {
            await this.scheduleImmediately({
                user_series_sid
            });
        } else {
            await this.scheduleAt({
                schedule,
                user_series_sid
            });
        }
    }

    async triggerEmail({ content, user_props, customer_props, email_template, cc, bcc, user, to }) {
        console.log(`Sending email : ${content}`);
        
        const html_body = `<html><body>${content}</body></html>`
        await emailService.send({ to, html_body, subject_text: "Text Email" })
    }

    async scheduleImmediately({
        user_series_sid
    }) {
        const scheduled_at = getImmediateDate();
        return await super.insert({
            values: [user_series_sid, scheduled_at]
        });
    }

    async scheduleAt({
        user_series_sid,
        schedule: {
            days = 0,
            hours = 0,
            minutes = 0
        }
    }) {
        const scheduled_at = getScheduledAt({
            days, hours, minutes
        });
        return await super.insert({
            values: [user_series_sid, scheduled_at]
        });
    }

    async pickSchedules() {
        const schedules = await scheduleRepository.fetchLast10MinutesSchedules();
        for(const schedule of schedules) {
            const { sid, user_series_sid } = schedule;
            const user_series = await this.fetchUserSeries({ user_series_sid });
            const { user_sid, series_sid, state, props } = user_series;
            const { step_index } = state;
            const { user_props, customer_props } = props;
            const user = await this.fetchUser({ user_sid });
            const { email } = user;
            const series = await this.fetchSeries({ series_sid });
            const { config: { steps } = []} = series;
            const step = getSeriesStep({ steps, step_index });
            const { email_template_sid } = step;
            const email_template = await this.fetchEmailTemplate({ email_template_sid });
            const { content, cc, bcc } = email_template?.props;
            await this.triggerEmail({
                content,
                cc,
                bcc,
                user,
                user_props,
                customer_props,
                email_template,
                to: email
            });

            await super.update({
                sidValue: sid,
                obj: {
                    mark_complete: true
                }
            })
        }
    }

    async initSchedule() {
        console.log("initializing schedule runs");
        cron.schedule('* * * * *', () => {
            console.log("Running every minute");
            this.pickSchedules();
        });

    }



    async fetchUserSeries({ user_series_sid}) {return await userSeriesRepository.findById({ value: user_series_sid })};

    async fetchUser({ user_sid }) { return await userService.findById({ value: user_sid })};

    async fetchSeries({ series_sid }) { return await seriesService.findById({ value: series_sid })};

    async fetchEmailTemplate({ email_template_sid}) { return await emailTemplateService.findById( {value: email_template_sid} )};
};

module.exports = ScheduleService;