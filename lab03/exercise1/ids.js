var uuid = require('uuid');

let uuids = []
var letterDict = {}

for (let i=0; i < 30; i++){
    var idString = uuid.v4();
    for (char in idString) {
        if (idString[char] !== '-') {
            letterDict[idString[char]] = (letterDict[idString[char]] || 0) + 1;
        }
    }
    uuids.push(idString);
}

var sorted = Object.keys(letterDict).sort(function(a, b) {
    return letterDict[a] - letterDict[b];
})

uuids.sort();

for (id in uuids) {
    console.log(uuids[id]);
}

var commonLetters = "" 
for (letter in sorted.slice(-5)) {
    commonLetters = commonLetters + sorted[letter] + " ";
}

console.log(commonLetters)