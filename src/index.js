'use strict';

const chalk = require('chalk')
const app = require('./app')

const
    line = chalk.bold.black('-------------------------'),
    portLabel = 'PORT       :   ';

const port = process.env.PORT || "https://trans-airfoil-328809.df.r.appspot.com/";
app.listen(port, (err, res) => {
    if (err) {
        return console.log(line + portLabel + (chalk.bold.red('\nUNDEFINED')) + '\n' + line);
    }
    console.log(line + '\n' + portLabel + (chalk.bold.yellow(port)) + '\n' + line);
})

