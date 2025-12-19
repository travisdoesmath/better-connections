console.log('Running Better Connections Extensions')

let COOLDOWN = 100 // in milliseconds. Used to rate-limit attempts to inject code

let colors = [
    "#ba81c5",
    "#b0c4ef",
    "#a0c35a",
    "#f9df6d",
    "rgba(0,0,0,0)"
]

let darkColors = [
    "#895e91",
    "#8c9bbd",
    "#758f42",
    "#c7b258",
    "#888"
]

let injectionSuccess = false;

let draggedElem = null;

let myDiv = document.createElement('div');
myDiv.style.margin = '12px'
const blankLabel = document.createElement('label')
let labelClassList = "";

function injectBlankLabel() {
    let label = document.querySelector('label');
    labelClassList = label.classList;
    let labelParent = label.parentElement;
    
    blankLabel.style.order = 16;
    blankLabel.classList = labelClassList;
    blankLabel.style.backgroundColor = "rgba(0,0,0,0)"
    blankLabel.style.display = "none"

    labelParent.append(blankLabel);
}

function hideShuffleButton() {
    document.querySelector('button[data-testid=shuffle-btn]').style.display = "none"
}

function injectDiv() {
    let h2Elements = document.querySelectorAll("h2");
    let h2;

    h2Elements.forEach(elem => {
        if (elem.innerText == "Create four groups of four!") {
            h2 = elem;
            injectionSuccess = true;
            h2.insertAdjacentElement("afterend", myDiv)
        }
    })

    if (!injectionSuccess) {
        setTimeout(injectDiv, COOLDOWN)
    } else {
        injectBlankLabel();
        makeLabelsDraggable();
        hideShuffleButton();
    }
}

function makeLabelsDraggable() {

    document.querySelectorAll('label').forEach((elem, i) => { 
        elem.style.order = i 
        elem.style.borderStyle = "solid";
        elem.style.borderColor = colors[Math.floor(i/4)]
        elem.style.borderWidth = "0px"
        elem.setAttribute('draggable', true)
        elem.addEventListener('drag', e => { 
            draggedElem = elem
            elem.style.display = "none";
            blankLabel.style.order = draggedElem.style.order;
            blankLabel.style.display = "block";
        })
        elem.addEventListener('dragover', e => {
            e.preventDefault()
        })
        elem.addEventListener('drop', e => {
            console.log("drop", e)
            const j = +draggedElem.style.order;
            const k = +elem.style.order;
            draggedElem.style.order = k;
            elem.style.order = j;
            draggedElem.style.display = "block";
            draggedElem.style.borderColor = colors[Math.floor(k/4)]
            elem.style.borderColor = colors[Math.floor(j/4)]
            blankLabel.style.order = 16;
            blankLabel.style.display = "none";
        })
        elem.addEventListener('mouseup', e => {
            if (e.shiftKey) {
                if (elem.style.borderWidth == "4px") {
                    elem.style.borderWidth = "0px"
                } else {
                    elem.style.borderWidth = "4px"
                }
            }
        })
    })
}

injectDiv()