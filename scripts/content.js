let COOLDOWN = 100 // in milliseconds. Used to rate-limit attempts to inject code
let MODE = 0; // 0 = drag color onto label, 1 = apply color to selected

console.log('Running Better Connections Extensions')

let injectionSuccess = false;
let currentColor = null;

let myDiv = document.createElement('div');
myDiv.style.margin = '12px'

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
    }
}

injectDiv()

let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
svg.setAttribute('width', '172px')
svg.setAttribute('height', '26px')

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

const hoverSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
hoverSVG.setAttribute('height', '24px');
hoverSVG.setAttribute('width', '24px');
hoverSVG.style.position = "absolute";
hoverSVG.style.pointerEvents = "none";
hoverSVG.style.display = "none";

const hoverCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
hoverCircle.setAttribute('cx', 12)
hoverCircle.setAttribute('cy', 12)
hoverCircle.setAttribute('r', 8)
hoverSVG.appendChild(hoverCircle)
document.body.appendChild(hoverSVG)
document.addEventListener('mousemove', e => {
    hoverSVG.style.top = `${e.pageY - 12}px`
    hoverSVG.style.left = `${e.pageX - 12}px`
})

let baseLayer = document.createElementNS("http://www.w3.org/2000/svg", "g")
let overlay = document.createElementNS("http://www.w3.org/2000/svg", "g")
overlay.style.opacity = 0;
overlay.style.pointerEvents = "none";

svg.appendChild(baseLayer)
svg.appendChild(overlay)

for (let i = 0; i < 5; i++) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle.setAttribute('cx', 12 + i * 36)
    circle.setAttribute('cy', 12)
    circle.setAttribute('r', 12)
    circle.setAttribute('fill', colors[i])
    if (colors[i] == "rgba(0,0,0,0)") {
        circle.setAttribute('stroke', "#888")
            circle.setAttribute('r', 10)
    } 
    
    circle.addEventListener('mousedown', () => {
        if (MODE == 0) {
            currentColor = colors[i]
            hoverSVG.style.display = "block";
            hoverCircle.setAttribute("fill", currentColor);
            hoverCircle.setAttribute("stroke", darkColors[i]);
            if (currentColor == 'rgba(0, 0, 0, 0)') {
                hoverCircle.style.strokeDasharray = "2 2"
            }
        }
    })
    
    circle.addEventListener('click', () => {
        if (MODE == 1) {
            currentColor = colors[i]
            let selected = Array.from(document.querySelectorAll('input:checked')).map(x => x.parentElement)
            selected.forEach(elem => {
                elem.style.border = `solid 4px ${currentColor}`;
            })

            currentColor = null;
        }
    }) 

    baseLayer.appendChild(circle)

    let plus = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let plusPadding = 6
    plus.setAttribute('d', `M${plusPadding + i * 36} 12 L${24 - plusPadding + i * 36} 12 M ${12 + i * 36} ${plusPadding} L ${12 + i * 36} ${24 - plusPadding}`)
    plus.setAttribute('stroke', darkColors[i])
    plus.setAttribute('stroke-width', '4')
    overlay.appendChild(plus)
}

myDiv.appendChild(svg)

document.addEventListener('mouseup', e => {
    // console.log(e.target)
    if (MODE == 0) {
        if (e.target.tagName == 'LABEL' || (e.target.tagName == 'INPUT' && e.target.parent.tagName == 'LABEL')) {
            let elem = e.target.tagName == 'LABEL' ? e.target : e.target.parent;
            if (currentColor !== null) {
                elem.style.border = `solid 4px ${currentColor}`;
            } 
        }
        hoverSVG.style.display = "none";
        currentColor = null;
    } 
})

document.addEventListener('keydown', e => {
    if (e.key == 'Shift') {
        overlay.style.opacity = 1;
        MODE = 1;
    }
})

document.addEventListener('keyup', e => {
    overlay.style.opacity = 0;
    MODE = 0;
})

