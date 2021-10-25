'use strict';

const Billing = require('../models/recordModel');
const moment = require('moment')
const chalk = require('chalk')

const
    errBillingCycle = 'Billing Cycle not on range at row ',
    errStartDate = 'Invalid Start Date format at row ',
    errEndDate = 'Invalid End Date format at row ',
    errNoRecord = 'No Record Found!',
    errArrow = chalk.bold.magenta('\n=====> ');

const readTxt = async (filename, req, res) => {
    try {
        const request = [];

        const
            buff = req.file.buffer,
            strBuff = buff.toString(),
            arrLine = strBuff.split('\r\n');

        let isValidFile = true;

        for (let i = 0; i < arrLine.length; i++) {

            const strLine = arrLine[i].toString(),
                bc = strLine.substring(0, 2),
                sd = strLine.substring(2, 10),
                ed = strLine.substring(10);

            const billingCycle = parseInt(bc);

            const sdMM = sd.substring(0, 2),
                sdDD = sd.substring(2, 4),
                sdYYYY = sd.substring(4),
                strSD = sdMM + '/' + sdDD + '/' + sdYYYY,
                startDate = new Date(strSD);

            const edMM = ed.substring(0, 2),
                edDD = ed.substring(2, 4),
                edYYYY = ed.substring(4),
                etrSD = edMM + '/' + edDD + '/' + edYYYY,
                endDate = new Date(etrSD);

            if (billingCycle <= 0 || billingCycle > 12) {
                isValidFile = false;
                res.status(400).send({ error: errBillingCycle + (i + 1) });
                console.log(errArrow + chalk.bold.red(errBillingCycle + (i + 1)));
            }
            if (!(endDate instanceof Date && !isNaN(endDate.valueOf()))) {
                isValidFile = false;
                res.status(400).send({ error: errEndDate + (i + 1) });
                console.log(errArrow + chalk.bold.red(errEndDate + (i + 1)))
            }
            if (!(startDate instanceof Date && !isNaN(startDate.valueOf()))) {
                isValidFile = false;
                res.status(400).send({ error: errStartDate + (i + 1) });
                console.log(errArrow + chalk.bold.red(errStartDate + (i + 1)))
            }
        }

        if (isValidFile === true) {

            for (let j = 0; j < arrLine.length; j++) {
                const strLine2 = arrLine[j].toString(),
                    bc2 = strLine2.substring(0, 2),
                    sd2 = strLine2.substring(2, 10),
                    ed2 = strLine2.substring(10);

                const billingCycle2 = parseInt(bc2);

                const sdMM2 = sd2.substring(0, 2),
                    sdDD2 = sd2.substring(2, 4),
                    sdYYYY2 = sd2.substring(4),
                    strSD2 = sdMM2 + '/' + sdDD2 + '/' + sdYYYY2,
                    startDate2 = new Date(strSD2);

                const edMM2 = ed2.substring(0, 2),
                    edDD2 = ed2.substring(2, 4),
                    edYYYY2 = ed2.substring(4),
                    etrSD2 = edMM2 + '/' + edDD2 + '/' + edYYYY2,
                    endDate2 = new Date(etrSD2);

                console.log(
                    chalk.bold.magenta('\n=====>') +
                    ' Processing request with 3 parameters ' +
                    chalk.bold.magenta('<=====\n')
                )

                try {
                    console.log('\tBilling Cycle : ' + billingCycle2)
                    console.log('\tStart Date    : ' + moment(startDate2).format('MM/DD/YYYY'));
                    console.log('\tEnd Date      : ' + moment(endDate2).format('MM/DD/YYYY'));

                    console.log(
                        chalk.bold.yellow('\n\   =====>') +
                        ' [ Generating file document ] ' +
                        chalk.bold.yellow('<=====\n')
                    )

                    // FILTER PROCESS HERE 
                    const
                        startDateFIN = moment(new Date(startDate2)).format('YYYY-MM-DD[T00:00:00.000Z]'),
                        endDateFIN = moment(new Date(endDate2)).format('YYYY-MM-DD[T00:00:00.000Z]');

                    const count = await Billing.count({
                        $and: [
                            { 'billingCycle': billingCycle2 },
                            { 'startDate': new Date(startDateFIN) },
                            { 'endDate': new Date(endDateFIN) }
                        ]
                    });
                    const record = await Billing.find({
                        $and: [
                            { 'billingCycle': billingCycle2 },
                            { 'startDate': new Date(startDateFIN) },
                            { 'endDate': new Date(endDateFIN) }
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
            }
        } else {
            // DO NOT SEARCH
        }
        res.send(request)
        return request
    } catch (e) {
        //res.status(400).send()
    }
}

module.exports = readTxt
