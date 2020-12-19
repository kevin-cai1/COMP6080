const removeBtn = document.getElementById("remove");
const summary = document.getElementById("summary")
const textItems = document.getElementsByClassName("text-input");
const checkboxes = document.getElementsByClassName("checkbox");
const dropdown = document.getElementById("animal");


// checks that the given name is between 3 and 50 characters
function validName(name) {
    if (name.length > 3 && name.length < 50) {
        return true;
    } else {
        return false;
    }
}

// calculate age from birthday
function age(date) {
    if (!validDate(date)) {
        return false;
    }
    var today = new Date();
    // create a Date() type, switching values to fit "mm/dd/yy" format
    var birthday = new Date(date.replace(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/, "$2/$1/$3"));
    var diff = today - birthday;    // result of diff in milliseconds
    var age = Math.floor(diff/(1000*60*60*24*365.25));      // divide to get years from milliseconds
    return age;
}

// validate date with date regex pattern
function validDate(date) {
    var pattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    var result = pattern.exec(date);
    if (result) {
        return true;
    } else {
        return false;
    }
}

// form a string of cities based on checked boxes
function getCities() {
    var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked')    // get array of checked boxes
    if (checkedBoxes.length == 0) {
        return "no cities";
    }
    var returnString = "";
    for (let i = 0; i < checkedBoxes.length; i++) {
        returnString = returnString + checkedBoxes[i].value + ", ";
    }
    returnString = returnString.replace(/,\s*$/, "");   // remove trailing comma and whitespace
    return returnString;
}

// render textarea output according to given input values
function render() {
    const firstname = document.getElementById("f-name").value;
    const lastname = document.getElementById("l-name").value;
    const birth = document.getElementById("birth").value;
    const animal = document.getElementById("animal").value;
    if (!validName(firstname)) {
        summary.value = "Please input a valid firstname";
    } else {
        if (!validName(lastname)) {
            summary.value = "Please input a valid lastname";
        } else {
            if (!validDate(birth)) {
                summary.value = "Please enter a valid date of birth";
            } else {
                summary.value = `Hello ${firstname} ${lastname}, you are ${age(birth)} years old, your favourite animal is ${animal} and you've lived in ${getCities()}.`
            }
        }
    }
}

function reset() {
    // clear text area output
    summary.value = "";

    // clear text inputs
    for (let i = 0; i < textItems.length; i++) {
        textItems[i].value = "";
    }

    // uncheck all checkboxes
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }

    // reset dropdown value
    dropdown.selectedIndex = 0;
}

// event listeners for text input blur
for (let i = 0; i < textItems.length; i++) {
    textItems[i].addEventListener('blur', render);
}

// event listeners for checkbox changes
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', render);
}

// event listener for dropdown change
dropdown.addEventListener('change', render);

// event listener for remove button press
removeBtn.addEventListener('click', reset);


