'use strict';

const chalk = require('chalk')
const mongoose = require('mongoose')

const line = chalk.bold.black('-------------------------')
const dbLabel = 'Database   :   '

//const dbURL = process.env.MONGODB_URL
const dbURL = "mongodb+srv://jona:123abc@cluster0.qzc1r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(dbURL, (err, db) => {
    if (err) {
        return console.log(dbLabel + (chalk.bold.red('Not connected.\n')) + line)
    }
    console.log(dbLabel + (chalk.bold.green('CONNECTED\n')) + line)
})
