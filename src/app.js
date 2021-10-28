'use strict';

const express = require('express')

require('./db/dbConnect')

const billingRouter = require('./router/billingRouter');

const app = express();

app.use(express.json());
app.use(billingRouter);

module.exports = app;
