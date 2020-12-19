var moment = require('moment');

var now = moment();

const dayStart = (now) => {
    var start = moment(now);
    start.hour(0);
    start.minute(0);
    return now.diff(start, 'hours');
};
var prevWeekday = now.format('dddd');
var prevWeekTime = now.format("hh:mm A");
var currDate = now.format("DD/MM/YY");
const nextFridaySeconds = (now) => {
    // set moment for friday of current week at 9am
    const nextFriday = moment(now).endOf('isoWeek').subtract(2, 'days');
    nextFriday.hour(9);
    nextFriday.minute(0);
    nextFriday.second(0);

    // find time from now to nextFriday
    var timeDiff = nextFriday.diff(now, 'seconds');

    // check for if past friday of current week
    if (timeDiff < 0) {
        nextFriday.add(1, 'week')   // skip to next week friday
        return nextFriday.diff(now, 'seconds');
    } else {
        return timeDiff;
    }
};

var string = `The day started [${dayStart(now)}] hours ago. One week ago it was [${prevWeekday}] at [${prevWeekTime}]. Today's date is [${currDate}]. There are exactly [${nextFridaySeconds(now)}] seconds until 9am on Friday.`
console.log(string);