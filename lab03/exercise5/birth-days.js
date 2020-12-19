var moment = require('moment');

var now = moment(); // get current date

// iterate 14 times for 14 year old
for (let i = 0; i < 14; i++) {
    console.log(now.format('dddd'));    // prints out the day of week
    now = now.subtract(1, 'years'); // subtract a year to get previous years birthday
}
