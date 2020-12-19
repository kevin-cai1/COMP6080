const body = document.getElementById('body');

const div = document.createElement('div');
div.style.background = '#000000';

const a = document.createElement('a');
a.setAttribute('target', '_blank');
a.setAttribute('href', 'https://google.com');
const img = document.createElement('img');
img.setAttribute('src', 'https://i.ytimg.com/vi/yJiVZUKAS84/maxresdefault.jpg');
img.setAttribute('alt', 'Me and my sibling');
a.appendChild(img);

const hr = document.createElement('hr');

const table = document.createElement('table');

// First row
const firstRow = document.createElement('tr');
const name = document.createElement('th');
const nameText = document.createTextNode('Name');
name.appendChild(nameText);
const age = document.createElement('th');
const ageText = document.createTextNode('Age');
age.appendChild(ageText);
const height = document.createElement('th');
const heightText = document.createTextNode('Height');
height.appendChild(heightText);
firstRow.appendChild(name);
firstRow.appendChild(age);
firstRow.appendChild(height);
table.appendChild(firstRow);

// Second row
const secondRow = document.createElement('tr');
const sarah = document.createElement('th');
const sarahText = document.createTextNode('Sarah');
sarah.appendChild(sarahText);
const twentyTwo = document.createElement('th');
const twentyTwoText = document.createTextNode('22');
twentyTwo.appendChild(twentyTwoText);
const hundred = document.createElement('th');
const hundredText = document.createTextNode('188');
hundred.appendChild(hundredText);
secondRow.appendChild(sarah);
secondRow.appendChild(twentyTwo);
secondRow.appendChild(hundred);
table.appendChild(secondRow);
// Third row
const thirdRow = document.createElement('tr');
const lin = document.createElement('th');
const linText = document.createTextNode('Lin');
lin.appendChild(linText);
const fourtyTow = document.createElement('th');
const fourtyTowText = document.createTextNode('42');
fourtyTow.appendChild(fourtyTowText);
const thirtyFour = document.createElement('th');
const thirtyFourText = document.createTextNode('134');
thirtyFour.appendChild(thirtyFourText);
thirdRow.appendChild(lin);
thirdRow.appendChild(fourtyTow);
thirdRow.appendChild(thirtyFour);
table.appendChild(thirdRow);

// Fourth row
const fourthRow = document.createElement('tr');
const samir = document.createElement('th');
const samirText = document.createTextNode('Samir');
samir.appendChild(samirText);
const twentyOne = document.createElement('th');
const twentyOneText = document.createTextNode('21');
twentyOne.appendChild(twentyOneText);
const fiftyFive = document.createElement('th');
const fiftyFiveText = document.createTextNode('155');
fiftyFive.appendChild(fiftyFiveText);
fourthRow.appendChild(samir);
fourthRow.appendChild(twentyOne);
fourthRow.appendChild(fiftyFive);
table.appendChild(fourthRow);

// Fifth row
const fifthRow = document.createElement('tr');
const wayne = document.createElement('th');
const wayneText = document.createTextNode('Wayne');
wayne.appendChild(wayneText);
const twentyNine = document.createElement('th');
const twentyNineText = document.createTextNode('29');
twentyNine.appendChild(twentyNineText);
const sixtyTwo = document.createElement('th');
const sixtyTwoText = document.createTextNode('162');
sixtyTwo.appendChild(sixtyTwoText);
fifthRow.appendChild(wayne);
fifthRow.appendChild(twentyNine);
fifthRow.appendChild(sixtyTwo);
table.appendChild(fifthRow);

// Sixth row
const sixthRow = document.createElement('tr');
const eckhart = document.createElement('th');
const eckhartText = document.createTextNode('Eckhart');
eckhart.appendChild(eckhartText);
const twelve = document.createElement('th');
const twelveText = document.createTextNode('112');
twelve.appendChild(twelveText);
const fourtyFour = document.createElement('th');
const fourtyFourText = document.createTextNode('144');
fourtyFour.appendChild(fourtyFourText);
sixthRow.appendChild(eckhart);
sixthRow.appendChild(twelve);
sixthRow.appendChild(fourtyFour);
table.appendChild(sixthRow);

div.appendChild(a);
div.appendChild(hr);
div.appendChild(table)
body.appendChild(div);
