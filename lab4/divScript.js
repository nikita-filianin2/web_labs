let canvWidthReduction
let canvHeightReduction
let rectSideLen
let stepIncrease
let bgPath
let closeButtonText
let startButtonText
let stopButtonText
let reloadButtonText
let msgInit
let msgCanvasClosed
let msgAniStart
let msgBorder
let msgAniStop
let msgReload

async function readJSON() {
	const response = await fetch("config.json")
	const json = await response.json()

	canvWidthReduction = json['canvWidthReduction']
	canvHeightReduction = json['canvHeightReduction']
	rectSideLen = json['rectSideLen']
	stepIncrease = json['stepIncrease']
	
	bgPath = json['bgPath']
	
	closeButtonText = json['closeButtonText']
	startButtonText = json['startButtonText']
	stopButtonText = json['stopButtonText']
	reloadButtonText = json['reloadButtonText']
	
	msgInit = json['msgInit']
	msgCanvasClosed = json['msgCanvasClosed']
	msgAniStart = json['msgAniStart']
	msgBorder = json['msgBorder']
	msgAniStop = json['msgAniStop']
	msgReload = json['msgReload']
}

readJSON()
const storage = window.localStorage
storage.clear()

// saving old div elements for future
const divOne = document.getElementById("one")
let oldDivOneChilds = []
for (let i = 0; i < divOne.children.length; i++) {
	oldDivOneChilds.push(divOne.children[i])
}

function playButtonFunc () {
	// removing elements from first div
	while (divOne.lastChild) {
		divOne.removeChild(divOne.lastChild)
	}

	// creating shit
	let work = document.createElement("div")
	work.id = "work"
	work.style.display = "grid"
	work.style.gridTemplateRows = `${canvHeightReduction}px 1fr`
	divOne.append(work)

	let controls = document.createElement("div")
	controls.id = "controls"
	controls.width = work.offsetWidth
	controls.style.height = `${canvHeightReduction}px`
	work.append(controls)

	let textBox = document.createElement("a")
	textBox.id = "textBox"
	textBox.innerHTML = msgInit
	controls.append(textBox)

	let current = new Date()
	storage.setItem(`${storage.length}`, `${msgInit} at ${current.toLocaleString()}`)

	let buttonList = document.createElement("ul")
	buttonList.id = "buttonList"
	controls.append(buttonList)

	let liOne = document.createElement("li")
	buttonList.appendChild(liOne)
	let closeButton = document.createElement("button")
	closeButton.id = "closeButton"
	closeButton.classList.add("controlButton")
	closeButton.onclick = closeButtonFunc
	closeButton.innerHTML = closeButtonText
	liOne.appendChild(closeButton)

	let liTwo = document.createElement("li")
	liTwo.id = "liTwo"
	buttonList.appendChild(liTwo)
	let startButton = document.createElement("button")
	startButton.id = "startButton"
	startButton.classList.add("controlButton")
	startButton.onclick = startButtonFunc
	startButton.innerHTML = startButtonText
	liTwo.appendChild(startButton)

	let anim = document.createElement("div")
	anim.id = "anim"
	anim.style.minWidth = anim.style.maxWidth = `${work.offsetWidth - canvWidthReduction}px`
	anim.style.minHeight = anim.style.maxHeight = `${work.offsetHeight - canvHeightReduction}px`
	anim.style.margin = "auto"
	anim.style.border = "5px solid green"
	anim.style.backgroundImage = `url(${bgPath})`
	anim.style.backgroundPosition = "center center"
	work.append(anim)

	rectX = anim.offsetWidth/2-rectSideLen/2
	rectY = anim.offsetHeight/2-rectSideLen/2

	let rect = document.createElement("div")
	rect.id = "rect"
	rect.style.minWidth = rect.style.maxWidth = rect.style.minHeight = rect.style.maxHeight = `${rectSideLen}px`
	rect.style.position = "fixed"
	rect.style.marginTop = `${canvHeightReduction}px`
	rect.style.left = `${rectX}px`
	rect.style.top = `${rectY}px`
	rect.style.backgroundColor = "blue"
	anim.append(rect)
}

function closeButtonFunc() {
	while (divOne.lastChild) {
		divOne.removeChild(divOne.lastChild)
	}
	for (let i = 0; i < oldDivOneChilds.length; i++) {
		divOne.append(oldDivOneChilds[i])
	}
	let current = new Date()
	storage.setItem(`${storage.length}`, `${msgCanvasClosed} at ${current.toLocaleString()}`)
	let tmpLog = ""
	for (let i = 0; i < storage.length; i++) {
		tmpLog += `${storage.getItem(i)}<br>`
	}
	document.getElementById("log").innerHTML = tmpLog
}

let maxDistance = 1
let distanceMoved = 0
let rectX = 0
let rectY = 0
let rectDir = "r"
let stopPressed = false
let reloadPressed = false
function startButtonFunc() {
	document.getElementById("liTwo").remove()

	let liTwo = document.createElement("li")
	liTwo.id = "liTwo"
	document.getElementById("buttonList").appendChild(liTwo)

	let stopButton = document.createElement("button")
	stopButton.id = "stopButton"
	stopButton.classList.add("controlButton")
	stopButton.onclick = stopButtonFunc
	stopButton.innerHTML = stopButtonText
	document.getElementById("liTwo").appendChild(stopButton)
	
	document.getElementById("textBox").innerHTML = msgAniStart
	let current = new Date()
	storage.setItem(`${storage.length}`, `${msgAniStart} at ${current.toLocaleString()}`)

	let rect = document.getElementById("rect")
	if (reloadPressed) {
		rectX = anim.offsetWidth/2-rectSideLen/2
		rectY = anim.offsetHeight/2-rectSideLen/2
		maxDistance = 1
		distanceMoved = 0
		rectDir = "r"
	}
	stopPressed = false
	reloadPressed = false
	function move() {
		setTimeout(() => {
			switch (rectDir) {
				case "r":
					rectX += 1
					rect.style.left = `${rectX}px`
					break
				case "d":
					rectY -= 1
					rect.style.top = `${rectY}px`
					break
				case "l":
					rectX -= 1
					rect.style.left = `${rectX}px`
					break
				case "u":
					rectY += 1
					rect.style.top = `${rectY}px`
					break
				}
			distanceMoved += 1
			if (distanceMoved >= maxDistance) {
				if (rectDir == "r") {rectDir = "d"}
				else if (rectDir == "d") {rectDir = "l"}
				else if (rectDir == "l") {rectDir = "u"}
				else if (rectDir == "u") {rectDir = "r"}
				maxDistance += stepIncrease
				distanceMoved = 0
			}
			if (rectY < anim.offsetHeight && rectY > -rectSideLen && !stopPressed && !reloadPressed) {move()}
			if (!(document.getElementById("reloadButton")) && 
				!(rectY+rectSideLen < anim.offsetHeight && rectY > 0)) {
					document.getElementById("textBox").innerHTML = msgBorder
					let current = new Date()
					storage.setItem(`${storage.length}`, `${msgBorder} at ${current.toLocaleString()}`)
					document.getElementById("liTwo").remove()

					let liTwo = document.createElement("li")
					liTwo.id = "liTwo"
					document.getElementById("buttonList").appendChild(liTwo)

					let reloadButton = document.createElement("button")
					reloadButton.id = "reloadButton"
					reloadButton.classList.add("controlButton")
					reloadButton.onclick = reloadButtonFunc
					reloadButton.innerHTML = reloadButtonText
					liTwo.appendChild(reloadButton)
				}
		}, 0)
	}
	move()
}

function stopButtonFunc() {
	stopPressed = true
	document.getElementById("textBox").innerHTML = msgAniStop
	let current = new Date()
	storage.setItem(`${storage.length}`, `${msgAniStop} at ${current.toLocaleString()}`)
	document.getElementById("liTwo").remove()

	let liTwo = document.createElement("li")
	liTwo.id = "liTwo"
	document.getElementById("buttonList").appendChild(liTwo)

	let startButton = document.createElement("button")
	startButton.id = "startButton"
	startButton.classList.add("controlButton")
	startButton.onclick = startButtonFunc
	startButton.innerHTML = startButtonText
	liTwo.appendChild(startButton)
}

function reloadButtonFunc() {
	reloadPressed = true
	setTimeout(() => {
		document.getElementById("liTwo").remove()

		let liTwo = document.createElement("li")
		liTwo.id = "liTwo"
		document.getElementById("buttonList").appendChild(liTwo)

		let startButton = document.createElement("button")
		startButton.id = "startButton"
		startButton.classList.add("controlButton")
		startButton.onclick = startButtonFunc
		startButton.innerHTML = startButtonText
		liTwo.appendChild(startButton)
		
		let rect = document.getElementById("rect")
		rect.style.left = `${anim.offsetWidth/2-rectSideLen/2}px`
		rect.style.top = `${anim.offsetHeight/2-rectSideLen/2}px`
		document.getElementById("textBox").innerHTML = msgReload
		let current = new Date()
		storage.setItem(`${storage.length}`, `${msgReload} at ${current.toLocaleString()}`)
	}, 100)
}