'use strict';

// import chalk from 'chalk;

// import express from 'express';
// import multer from 'multer';

// import fileReader from '../utils/fileReader';

// import Billing from '../models/recordModel';

const chalk = require('chalk');

const
    express = require('express'),
    multer = require('multer');

const fileReader = require('../utils/fileReader');

const Billing = require('../models/recordModel')

const router = new express.Router();

const
    processArrow = chalk.bold.magenta('\n==========> ') + 'FilePath: ',
    errArrow = chalk.bold.magenta('\n=====> '),
    errFileDoesntExist = 'Please input an existing request file path.',
    errFileIsEmpty = 'No request(s) to read from the input file.',
    errFileNotSupported = 'File is not supported for processing';

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(txt|csv)$/)) {
            cb(new Error(errFileNotSupported));
        } else {
            cb(undefined, true);
        }
    }
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filename = await req.file.originalname;
        console.log(processArrow + (chalk.bold.green(filename)));

        const buff = await req.file.buffer, strBuff = buff.toString();

        if (strBuff === '') {
            await res.status(400).send({ error: errFileIsEmpty });
            console.log(chalk.bold.red(errArrow + errFileIsEmpty));
        } else {
            fileReader(req, res)
            //await res.send()
        }
    } catch (e) {
        await res.status(400).send({ error: errFileDoesntExist });
        console.log(chalk.bold.red(errArrow + errFileDoesntExist));
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    console.log((chalk.bold.red(errArrow + errFileNotSupported)));
})

router.get('/fetchAll', async (req, res) => {
    try {
        const record = await Billing.find({})
        res.send(record)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;
