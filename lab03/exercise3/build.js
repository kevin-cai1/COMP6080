const body = document.getElementById('body');

const createTableData = (value) => {
    var td = document.createElement('td');
    var text = document.createTextNode(value);
    td.appendChild(text);
    return td;
}

const createTableHeading = (value) => {
    var th = document.createElement('th');
    var text = document.createTextNode(value);
    th.appendChild(text);
    return th;
};

const createDataRow = (values) => {
    var tr = document.createElement('tr');
    for (val in values) {
        tr.appendChild(createTableData(values[val]));
    }
    return tr;
};

const createHeadingRow = (values) => {
    var tr = document.createElement('tr');
    for (val in values) {
        tr.appendChild(createTableHeading(values[val]));
    }
    return tr;
};

const container = document.createElement('div');
container.style.background = "#000000";

const anchor = document.createElement('a');
anchor.href = "https://google.com";
anchor.target = "_blank";

const image = document.createElement('img');
image.src = "https://i.ytimg.com/vi/yJiVZUKAS84/maxresdefault.jpg";
image.alt = "Me and my sibling";

anchor.appendChild(image);

const rule = document.createElement('hr');

const table = document.createElement('table');
table.appendChild(createHeadingRow(['Name', 'Age', 'Height']));
table.appendChild(createDataRow(['Sarah', '22', '188']));
table.appendChild(createDataRow(['Lin', '42', '134']));
table.appendChild(createDataRow(['Samir', '21', '155']));
table.appendChild(createDataRow(['Wayne', '29', '162']));
table.appendChild(createDataRow(['Eckhart', '112', '144']));


container.appendChild(anchor);
container.appendChild(rule);
container.append(table);
body.appendChild(container);