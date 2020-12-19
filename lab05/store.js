window.addEventListener('load', getData);
const body = document.getElementById('body');

const createElem = (tag, value) => {
    const elem = document.createElement(tag);
    if (value) {
        elem.appendChild(document.createTextNode(value))
    }
    return elem;
};

const headings = [ 'name', 'reindeers', 'primary' ]

const createFlexElement = (heading, value) => {
    const flex = document.createElement('div');
    flex.style.display = 'flex';
    const headingDiv = document.createElement('div');
    const headingText = document.createTextNode(heading);
    const valueDiv = document.createElement('div');
    const valueText = document.createTextNode(value);
    headingDiv.appendChild(headingText);
    valueDiv.appendChild(valueText);
    headingDiv.style.flex = "1";
    valueDiv.style.flex = "1";
    flex.appendChild(headingDiv);
    flex.appendChild(valueDiv);
    return flex;
}

const setBody = () => {
    const data = createElem('div');
    for (let i of headings) {
        let elem = createFlexElement(i, localStorage.getItem(i));
        data.appendChild(elem);
    }
    body.innerHTML = '';
    body.appendChild(data);
};

function getData() {
    const loading = createElem('p', 'Loading, please wait');
    body.appendChild(loading);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status === 200) {
                let json = JSON.parse(xhttp.responseText);
                localStorage.setItem('name', json.name);
                localStorage.setItem('reindeers', json.reindeers);
                localStorage.setItem('primary', json.primary);
                setBody();
            } else {
                setBody();
                let warning = createElem('p','This data is not live');
                body.appendChild(warning);
            }
        }
    }
    xhttp.open('GET', 'http://www.cse.unsw.edu.au/~cs6080/20T3/data/package.json');
    xhttp.send();


}

