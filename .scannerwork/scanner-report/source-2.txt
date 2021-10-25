'use strict';

const express = require('express')

require('./db/dbConnect')

const billingRouter = require('./router/billingRouter');

// import express from 'express';

// import './db/dbConnect';

// import billingRouter from  './router/billingRouter';

const app = express();

app.use(express.json());
app.use(billingRouter);

module.exports = app;
