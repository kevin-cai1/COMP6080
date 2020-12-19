const building = document.getElementById('building');

const addWindow = () => {
    const elem = document.createElement('div');
    elem.style.width = '50px';
    elem.style.height = '50px';
    elem.style.margin = '25px';
    elem.className = 'window';
    elem.style.display = 'inline-block';
    building.appendChild(elem);
};
for (let i = 0; i < 9; ++i) {
   addWindow();
}

document.addEventListener('keydown', event => {
    if (event.key == 'ArrowUp') {
        addWindow();
    } else if (event.key == 'ArrowDown') {
        if (building.hasChildNodes()) {
            building.removeChild(building.lastChild);
        }
    } else if (event.key == 'ArrowLeft') {
        building.style.left = (building.offsetLeft - 50) + 'px';
    } else if (event.key == 'ArrowRight') {
        building.style.left = (building.offsetLeft + 50) + 'px';
    }
});

const windows = document.getElementsByClassName('window');

for (const w of windows) {
    w.addEventListener('click', event => {
        w.style.visibility = 'hidden';
        event.stopPropagation();
    });
}

document.addEventListener('click', event => {
    if (document.body.hasAttribute('night')) {
        document.body.removeAttribute('night');
    } else {
        document.body.setAttribute('night', '')
    }
})