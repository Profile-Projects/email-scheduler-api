const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const CustomerController = require("./controller/CustomerController");
const UserController = require("./controller/UserController");
const SeriesController = require("./controller/SeriesController");
const EmailTemplateController = require("./controller/EmailTemplateController");
const BaseController = require('./controller/BaseController');

const app = express();

const VERSION = 'v1';
const SERVICE_PATH = "email-scheduler/api"

const corsOptions = {
  origin: '*', // This allows requests from any origin.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // This allows the specified methods.
  headers: ['Content-Type', 'Authorization'], // This allows the specified headers.
};


const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({message: 'Internal Server Error', error: err?.message || ""});
}

const baseController = new BaseController(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use(`/${SERVICE_PATH}/${VERSION}/customer`, CustomerController(app));
app.use(`/${SERVICE_PATH}/${VERSION}/user`, UserController(app));
app.use(`/${SERVICE_PATH}/${VERSION}/series`, SeriesController(app));
app.use(`/${SERVICE_PATH}/${VERSION}/emailTemplate`, EmailTemplateController(app));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// app.use(errorHandler);
baseController.initAppHandlers();

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
