'use strict';

// import mongoose from 'mongoose'

const mongoose = require('mongoose')

const billingSchema = new mongoose.Schema({
    billingCycle: Number,
    billingMonth: String,
    amount: Number,
    startDate: Date,
    endDate: Date,
    lastEdited: String,
    account: {
        accountName: String,
        dateCreated: String,
        isActive: String,
        lastEdited: String,
        customer: {
            firstName: String,
            lastName: String,
            address: String,
            status: String,
            dateCreated: Date,
            lastEdited: String
        }
    }
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
