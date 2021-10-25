'use strict';

// import Billing from '../models/recordModel';
// import moment from 'moment';
// import chalk from 'chalk';

const Billing = require('../models/recordModel');
const moment = require('moment')
const chalk = require('chalk')

const
    errBillingCycle = 'Billing Cycle not on range at row ',
    errStartDate = 'Invalid Start Date format at row ',
    errEndDate = 'Invalid End Date format at row ',
    errNoRecord = 'No Record Found!',
    errArrow = chalk.bold.magenta('\n=====> ');

const readCsv = async (filename, req, res) => {
    try {
        const request = [];

        const
            buff = req.file.buffer,
            strBuff = buff.toString(),
            arrLine = strBuff.split('\r\n');

        let objLine = {};
        const objArr = [];

        let isValidFile = true;

        const objReq = {
            billingCycle: '',
            startDate: '',
            endDate: '',
        };

        for (let i = 0; i < arrLine.length; i++) {
            objLine = Object.assign({}, arrLine[i].split(','));
            objArr[i] = objLine;

            objReq.billingCycle = parseInt(objLine[0]);
            objReq.startDate = new Date(objLine[1]);
            objReq.endDate = new Date(objLine[2]);

            if (objReq.billingCycle <= 0 || objReq.billingCycle > 12) {
                isValidFile = false;
                res.status(400).send({ error: errBillingCycle + (i + 1) });
                console.log(errArrow + chalk.bold.red(errBillingCycle + (i + 1)));
            }
            if (!(objReq.endDate instanceof Date && !isNaN(objReq.endDate.valueOf()))) {
                isValidFile = false;
                res.status(400).send({ error: errEndDate + (i + 1) });
                console.log(errArrow + chalk.bold.red(errEndDate + (i + 1)))
            }
            if (!(objReq.startDate instanceof Date && !isNaN(objReq.startDate.valueOf()))) {
                isValidFile = false;
                res.status(400).send({ error: errStartDate + (i + 1) });
                console.log(errArrow + chalk.bold.red(errStartDate + (i + 1)))
            }
        }

        if (isValidFile === true) {
            for (let j = 0; j < arrLine.length; j++) {
                objLine = Object.assign({}, arrLine[j].split(','));
                objArr[j] = objLine;

                objReq.billingCycle = parseInt(objLine[0]);
                objReq.startDate = new Date(objLine[1]);
                objReq.endDate = new Date(objLine[2]);

                console.log(
                    chalk.bold.magenta('\n=====>') +
                    ' Processing request with 3 parameters ' +
                    chalk.bold.magenta('<=====\n')
                )

                // FILTER PROCESS
                try {
                    console.log('\tBilling Cycle : ' + objReq.billingCycle)
                    console.log('\tStart Date    : ' + moment(objReq.startDate).format('MM/DD/YYYY'));
                    console.log('\tEnd Date      : ' + moment(objReq.endDate).format('MM/DD/YYYY'));

                    console.log(
                        chalk.bold.yellow('\n   =====>') +
                        ' [ Generating file document ] ' +
                        chalk.bold.yellow('<=====\n')
                    )

                    const
                        startDate = moment(new Date(objReq.startDate)).format('YYYY-MM-DD[T00:00:00.000Z]'),
                        endDate = moment(new Date(objReq.endDate)).format('YYYY-MM-DD[T00:00:00.000Z]');

                    const count = await Billing.count({
                        $and: [
                            { 'billingCycle': objReq.billingCycle },
                            { 'startDate': new Date(startDate) },
                            { 'endDate': new Date(endDate) }
                        ]
                    });

                    const record = await Billing.find({
                        $and: [
                            { 'billingCycle': objReq.billingCycle },
                            { 'startDate': new Date(startDate) },
                            { 'endDate': new Date(endDate) }
                        ]
                    }, {
                        '_id': false
                    }).select(
                        'billingCycle startDate endDate amount account.customer.firstName account.customer.lastName'
                    );

                    if (count === 0) {
                        res.status(400).send({ error: errNoRecord })
                        console.log(errArrow + chalk.bold.red(errNoRecord))
                    } else {

                        const JSONresponse = {
                            billingCycle: record[0].billingCycle,
                            startDate: moment(record[0].startDate).format('MM/DD/YYYY'),
                            endDate: moment(record[0].endDate).format('MM/DD/YYYY'),
                            amount: record[0].amount,
                            firstName: record[0].account.customer.firstName,
                            lastName: record[0].account.customer.lastName
                        };

                        console.log(JSONresponse);
                        request[j] = JSONresponse;
                    }
                    // FILTER PROCESS END
                } catch (e) {
                    res.status(500).send()
                }
            } // END OF 2ND FOR LOOP

        } else {
            // DO NOT SEARCH
        }
        res.send(request)
        return request
    } catch (e) {
        //res.status(400).send()
    }
}

module.exports = readCsv
