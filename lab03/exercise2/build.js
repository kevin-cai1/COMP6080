const body = document.getElementById('body');

const createParagraph = (sentence) => {
    var para = document.createElement('p');
    var node = document.createTextNode(sentence);
    para.appendChild(node);
    return para;
};

const createListItem = (label) => {
    var item = document.createElement('li');
    var node = document.createTextNode(label);
    item.appendChild(node);
    return item;
};

var container = document.createElement('div');

var listContainer = document.createElement('ul');
listContainer.appendChild(createListItem("The"));
listContainer.appendChild(createListItem("Duck"));
listContainer.appendChild(createListItem("Lemonade"));
listContainer.appendChild(createListItem("Stand"));

container.appendChild(createParagraph("Hello there,"));
container.appendChild(createParagraph("I am a llama, hear my sirens roar:"));
container.appendChild(listContainer);

body.appendChild(container);
