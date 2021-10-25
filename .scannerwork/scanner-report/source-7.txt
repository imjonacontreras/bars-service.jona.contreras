'use strict';

// import chalk from 'chalk';

// import readTxt from './readTxt';
// import readCsv from './readCsv';

const chalk = require('chalk')

const
    readTxt = require('./readTxt'),
    readCsv = require('./readCsv');

const fileReader = async (req, res) => {
    const filename = await req.file.originalname;
    let request = [];

    console.log(
        chalk.bold.magenta('\n=====>') +
        ' Inside Text Processing ' +
        chalk.bold.magenta('<=====')
    )

    //Both methods must return the requests as list of objects.
    if (filename.endsWith('.txt')) {
        request = await readTxt(filename, req, res);

        if (request === undefined) {
            console.log()
        } else {
            console.log(
                chalk.bold.magenta('\n==========>') +
                ' F I N A L   O U T P U T ' +
                chalk.bold.magenta('<==========')
            )
            console.log(request)
        }
    } else {
        request = await readCsv(filename, req, res);


        if (request === undefined) {
            console.log()
        } else {
            console.log(
                chalk.bold.magenta('\n==========>') +
                ' F I N A L   O U T P U T ' +
                chalk.bold.magenta('<==========')
            )
            console.log(request)
        }
    }
    res.send()
}
module.exports = fileReader;
