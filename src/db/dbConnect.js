'use strict';

const chalk = require('chalk')

const mongoose = require('mongoose')

// import chalk from 'chalk';
// import mongoose from 'mongoose'

const line = chalk.bold.black('-------------------------')
const dbLabel = 'Database   :   '

const dbURL = process.env.MONGODB_URL
//const dbURL = "mongodb://127.0.0.1:27017/bars_db"
mongoose.connect(dbURL, (err, db) => {
    if (err) {
        return console.log(dbLabel + (chalk.bold.red('Not connected.\n')) + line)
    }
    console.log(dbLabel + (chalk.bold.green('CONNECTED\n')) + line)
})

//require('dotenv').config({ path: 'ENV_FILENAME' });
