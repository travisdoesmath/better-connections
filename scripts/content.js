let COOLDOWN = 100 // in milliseconds. Used to rate-limit attempts to inject code

console.log('Running Better Connections Extensions')

let injectionSuccess = false;
let currentColor = null;

let myDiv = document.createElement('div');

function injectDiv() {
    let h2Elements = document.querySelectorAll("h2");
    let h2;

    h2Elements.forEach(elem => {
        if (elem.innerText == "Create four groups of four!") {
            h2 = elem;
            injectionSuccess = true;

            
            // myDiv.innerHTML = "this is a test";

            h2.insertAdjacentElement("afterend", myDiv)
        }
    })

    if (!injectionSuccess) {
        // console.log('attempting again...')
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

for (let i = 0; i < 5; i++) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle.setAttribute('cx', 12 + i * 36)
    circle.setAttribute('cy', 12)
    circle.setAttribute('r', 12)
    circle.setAttribute('fill', colors[i])
    if (colors[i] == "rgba(0,0,0,0)") {
        circle.setAttribute('stroke', "#888")
    } 
    
    circle.addEventListener('mousedown', () => {
        currentColor = colors[i]
        console.log(currentColor)
    }) 

    svg.appendChild(circle)
}


myDiv.appendChild(svg)

document.addEventListener('mouseup', e => {
    // console.log(e.target)
    if (e.target.tagName == 'LABEL' || (e.target.tagName == 'INPUT' && e.target.parent.tagName == 'LABEL')) {
        let elem = e.target.tagName == 'LABEL' ? e.target : e.target.parent;
        if (currentColor !== null) {
            elem.style.border = `solid 4px ${currentColor}`;
        } 
    }
    currentColor = null;
})
