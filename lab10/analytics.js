/* Complete the function `biggestGrowth` such that it returns the name of
   the school that has had the largest growth (increase) of students between 2004 and
   2018 (i.e. find the school where difference between the 2018 HC and 2004
   HC is the largest, ignoring anything that happened in years 2005-2017). */
const biggestGrowth = () => {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('./HC.json', 'utf8'));
    let largest_diff = 0;
    let largest_school = "";
    for (school of obj) {
        const diff = parseInt(school['HC_2018']) - parseInt(school['HC_2004']);
        if (diff > largest_diff) {
            largest_diff = diff;
            largest_school = school['School Name'];
        }
    }
    return largest_school;
};

/* Complete the function `overallHeadCount` such that it returns the name of
   the school that has the largest sum of all of the head counts across all
   of the years that the school lists for. This function returns a string. */
const overallHeadCount = () => {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('./HC.json', 'utf8'));
    let largest_sum = 0;
    let largest_school = "";
    for (school of obj) {
        let head_sum = 0;
        for (var listing in school) {
            if (listing !== "School Code" && listing !== "School Name") {
                if (school[listing] != null) {
                    head_sum += parseInt(school[listing]);
                }
            }
        }

        if (head_sum > largest_sum){
            largest_sum = head_sum;
            largest_school = school["School Name"];
        }
    }
    return largest_school;
};

/* Complete the function `largestVariation` such that it returns the name of
   the school that has the largest variation in head count between adjacent
   years. E.G. If a school has a HC in 2005 of 78, and then a HC in 2006 of
   88, then that is a variation of 10. It does not matter if the variation
   goes up or down. This function returns a string. */
const largestVariation = () => {
    return ''; // TODO
};

module.exports = {
    biggestGrowth,
    overallHeadCount,
    largestVariation,
}