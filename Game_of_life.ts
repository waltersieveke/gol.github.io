let canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");

let loopx, loopy;
let zellBreite = 20;
let zellLaenge = zellBreite;
let anzahlFelderLaenge = 0;
let anzahlFelderBreite = 0;
let feldbreite = 0;
let feldlänge = 0;

let draw = 0;

document.addEventListener("DOMContentLoaded", function (event) {
	rangeSlider(null);
	//alles in beiden Feldern wird false
	initFieldasFalse(feld);
	initFieldasFalse(nextGenFeld);

	feld[16][9] = lebendig;
	feld[16][10] = lebendig;
	feld[15][10] = lebendig;
	feld[17][10] = lebendig; //stelt den anfangskörper dar
	feld[17][11] = lebendig;
	feld[17][12] = lebendig;
	feld[16][12] = lebendig;
	feld[15][12] = lebendig;
	drawBoard(feld);
	createCanvas();
});

//Schieberegler
let range = document.getElementById("myRange");
if (range) {
	range.addEventListener("input", (RANGE: Event) => rangeSlider(RANGE));
}

//die Zellbreite wird mit dem regler geändert
function rangeSlider(inputellll: any) {
	//console.log("rangeSlider");
	if (inputellll) {
		zellBreite = Number(inputellll.explicitOriginalTarget.value) + 10;
	} else {
		zellBreite = 20;
	}
	zellLaenge = zellBreite; //zum quadrat
	//modulo(%), nennt nur nachkommastellen
	feldlänge = window.innerWidth;
	feldbreite = window.innerHeight * 0.8;
	anzahlFelderLaenge = Math.floor(feldlänge / zellLaenge);
	anzahlFelderBreite = Math.floor(feldbreite / zellBreite);
	canvas.height = feldbreite - (feldbreite % zellBreite);
	canvas.width = feldlänge - (feldlänge % zellLaenge);
	u = false;
	generationen = 0;
	displayGenerationenScore();
	feld = [];
	nextGenFeld = [];
	initFieldasFalse(nextGenFeld);
	initFieldasFalse(feld);
	if (ctx && inputellll) {
		ctx.clearRect(0, 0, feldlänge, feldbreite);
		drawBoard(feld);
		createCanvas();
	}
}

//erstellen des Spielfeldes
function createCanvas() {
	//console.log("createCanvas");
	if (ctx) {
		for (loopx = 0; loopx < anzahlFelderLaenge; loopx++) {
			for (loopy = 0; loopy < anzahlFelderBreite; loopy++) {
				ctx.strokeRect(
					0 + loopx * zellBreite,
					0 + loopy * zellLaenge,
					zellBreite,
					zellLaenge
				);
			}
		}
	}
}

let tot = false;
let lebendig = true;

let feld: Boolean[][] = [];
let nextGenFeld: Boolean[][] = [];
let copyfeld = feld;
//baut das Array auf

//funktion um alles im array auf false zu setzten
function initFieldasFalse(field: Boolean[][]) {
	//console.log("initFieldasFalse");
	for (let x2 = 0; x2 < anzahlFelderLaenge; x2++) {
		field.push([]);
	}
	for (let i = 0; i < anzahlFelderLaenge; i++) {
		for (let j = field[i].length; j < anzahlFelderBreite; j++) {
			field[i].push(tot);
		}
	}
}

let color = "blue";
//füllt die lebendigen zellen aus
function drawBoard(fieldvar: any) {
	draw = 0;
	//console.log("drawBoard");
	let x = 0;
	if (ctx) {
		for (let y = 0; y < anzahlFelderBreite; y++) {
			for (x = 0; x < anzahlFelderLaenge; x++) {
				if (fieldvar[x][y] == lebendig) {
					ctx.fillStyle = color;
					ctx.fillRect(x * zellBreite, y * zellLaenge, zellBreite, zellLaenge);
				} else {
				}
			}
		}
	}
}

//zählen der nachbarn an einer bestimmten position(xpos,ypos)
function checkneighbours(xpos: any, ypos: any) {
	//console.log("checkneighbours");
	let countNeighbours = 0;

	for (let x = -1; x < 2; x++) {
		for (let y = -1; y < 2; y++) {
			if (
				xpos + x < 0 ||
				ypos + y < 0 ||
				xpos + x > anzahlFelderLaenge - 1 ||
				ypos + y > anzahlFelderBreite - 1
			) {
			} else {
				if (feld[xpos + x][ypos + y]) {
					if (x == 0 && y == 0) {
					} else {
						countNeighbours = countNeighbours + 1;
					}
				}
			}
		}
	}

	return countNeighbours;
}
let score = 0;
//die Zellen werden über die nachbarn an den Spielregeln geprüft
function rules() {
	//console.log("rules");
	let x = 0;
	for (let y = 0; y < anzahlFelderBreite; y++) {
		x = 0;
		for (let x = 0; x < anzahlFelderLaenge; x++) {
			let countNbrs = checkneighbours(x, y);
			if (ctx) {
				if (feld[x][y] == lebendig) {
					//feld wird getestet auf nextGenFeld die zellen in dem status geändert
					if (countNbrs < 2 || countNbrs > 3) {
						nextGenFeld[x][y] = tot;
						score = score + 1;
					}
					if (countNbrs == 2 || countNbrs == 3) {
						nextGenFeld[x][y] = lebendig;
						score = score + 1;
					}
				}
				if (feld[x][y] == tot) {
					if (countNbrs == 3) {
						nextGenFeld[x][y] = lebendig;
						score = score + 1;
					}
				}
			}
		}
	}
}

//button für einmaligen Generationswechsel pro click
let btn = document.getElementById("Genw");
if (btn) {
	btn.addEventListener("click", (nextGen: Event) => Generationswechsel());
}

let count = 1;
let ende = false;
let generationen = 0;

//abfolge der funktionen für einmaligen Generationwechsel in eine funktion
function Generationswechsel() {
	//console.log("Generationswechsel");
	if (ende == true) {
		//nur noch wiederholende Vorgänge => wird gestoppt
	} else {
		ctx?.clearRect(0, 0, feldlänge, feldbreite); //die voherige Generation wird gelöscht damit die nächtse angezeigt werden kann
		rules();
		if (draw == 0) {
			drawBoard(nextGenFeld);
		} else {
			drawRandomColor(feld);
		}
		//drawBoard(nextGenFeld);
		createCanvas();
		//console.log(count);
		if (count == 1) {
			copyfeld = feld;
		}
		if (count == 3) {
			compare2feld(copyfeld, feld);
			count = 0;
		}
		count = count + 1;
		feld = nextGenFeld; //feld wird von nextGenFeld übernommen
		nextGenFeld = []; //nextGenFeld wird wieder leer - damit die regeln bei dem nächsten Generationwechsel angewendet werden können
		initFieldasFalse(nextGenFeld); //nextGenFeld wird wieder alles false
		generationen = generationen + 1;
		console.log("generation: " + generationen);
		displayGenerationenScore();
	}
}

//button für den start stopp knopf
let btn1 = document.getElementById("st");
if (btn1) {
	btn1.addEventListener("click", (startStopp: Event) => buttonTrueFalse());
}

//funktion für den wechsel von true false also start stopp
function buttonTrueFalse() {
	console.log(u);
	//console.log("buttonTrueFalse");
	u = !u;
	//setzt u = true und false pro click
	return u;
}

//Schieberegeler für den delay zwischen der Endlosschleife
let speed = document.getElementById("mySpeed");
if (speed) {
	speed.addEventListener("input", (RANGEspeed: Event) =>
		changespeed(RANGEspeed)
	);
}

//altes interval wird gecleart und neues durch das value des reglers angepasst
let intervalId2 = 0;
let timeInterval;
function changespeed(inputellllll: any) {
	//console.log("changespeed");
	if (speed) {
		clearInterval(intervalId);
		timeInterval = inputellllll.explicitOriginalTarget.value;
		clearInterval(intervalId2);
		intervalId2 = setInterval(myCallback, timeInterval);
	}
}

let u = false;
let counter = 0;
let intervalId = setInterval(myCallback, timeInterval);
//Schleife für den unendlichen Generationwechsel mit delay
function myCallback() {
	//console.log("myCallback");
	if (u) {
		setTimeout(() => {
			//console.log("Counter ist: " + counter);
			//counter = counter + 1;
			Generationswechsel();
		}, 100);
	}
}

//auswahlmenü für die farben
let colorpicker = document.getElementById("colorpicker");
if (colorpicker) {
	colorpicker.addEventListener("input", (COLORlist: Event) =>
		changecolor(COLORlist)
	);
}

//farben auf die Zellen anwenden, auf direkte änderung der Farbe auch direkte änderung der Zelle
function changecolor(clickell: any) {
	//console.log("changeColor");
	if (ctx) {
		color = clickell.explicitOriginalTarget.value;
		ctx?.clearRect(0, 0, feldlänge, feldbreite);
		drawBoard(feld);
		createCanvas();
	}
}

//button für Random
let random = document.getElementById("random");
if (random) {
	random.addEventListener("click", (Random: Event) => randomLife());
}

//ca. 30% werden lebendig
function randomLife() {
	//console.log("randmLife");
	feld = []; //feld wird geleert
	for (let x2 = 0; x2 < anzahlFelderLaenge; x2++) {
		feld.push([]);
	}
	for (let i = 0; i < anzahlFelderLaenge; i++) {
		for (let j = feld[i].length; j < anzahlFelderBreite; j++) {
			if (Math.random() > 0.3) {
				feld[i].push(tot); //alles über 0,3 wird false
			} else {
				feld[i].push(lebendig); // alles über 0,3 wird true
			}
		}
	}
	ctx?.clearRect(0, 0, feldlänge, feldbreite);
	drawBoard(feld); //anzeigen auf dem Spielfeld
	createCanvas();
}

//button für clear
let restbutton = document.getElementById("clear");
if (restbutton) {
	restbutton.addEventListener("click", (RESET: Event) => clear());
}

//funktion um das feld zu leeren
function clear() {
	//console.log("clear");
	if (ctx) {
		ctx.clearRect(0, 0, feldlänge, feldbreite);
		createCanvas();
		feld = [];
		initFieldasFalse(nextGenFeld);
		initFieldasFalse(feld);
		ende = false;
		generationen = 0;
	}
}

document.addEventListener("click", (MOUSEclick: Event) =>
	showCoords(MOUSEclick)
);
//beim clicken werden die koordinaten angezeigt
function showCoords(event: any) {
	//console.log("showCoords");
	let x = event.clientX;
	let y = event.clientY + scrollY;

	let Yfeld = (
		(y - event.explicitOriginalTarget.offsetTop) /
		zellBreite
	).toString();
	let Xfeld = //Koordinaten werden durch die Versetzung zum rand berechnet
		(
			(x - event.explicitOriginalTarget.offsetLeft) / //und dem array zugewisen
			zellBreite
		).toString();
	let Yfeldparsed = parseInt(Yfeld);
	let Xfeldparsed = parseInt(Xfeld);

	if (event.target.id == "mycanvas") {
		//solange der click im canvas ist wird er "benutzt"
		if (feld[Xfeldparsed][Yfeldparsed] == tot) {
			feld[Xfeldparsed][Yfeldparsed] = lebendig;
		} else {
			feld[Xfeldparsed][Yfeldparsed] = tot;
		}
		if (ctx) {
			ctx.clearRect(0, 0, feldlänge, feldbreite);
			if (draw == 0) {
				drawBoard(feld);
			} else {
				drawRandomColor(feld);
			}
			createCanvas();
		}
	}
}

//spielstände speichern
let saveButton = document.getElementById("Save");
if (saveButton) {
	saveButton.addEventListener("click", (SAVE: Event) => saveGame());
}
function saveGame() {
	//console.log("saveGame");
	localStorage.setItem("feld", JSON.stringify(feld));
}

//spielstände laden
let loadButton = document.getElementById("Load");
if (loadButton) {
	loadButton.addEventListener("click", (load: Event) => loadGame());
}
function loadGame() {
	//console.log("loadGame");
	if (localStorage.getItem("feld") != null) {
		feld = JSON.parse(localStorage.getItem("feld") || "{}");
	}
}

//prüfen ob beide arrays identisch sind
function compare2feld(a: any, b: any) {
	//console.log("compare2feld");
	if (JSON.stringify(a) === JSON.stringify(b)) {
		//console.log("Arrays sind identisch");
		ende = true;
		u = false;
		console.log(score);
		console.log("ende erreicht");
	} else {
		//console.log("Arrays sind ungleich");
	}
}

let generation = document.getElementById("container");
//die Generationen werden angezeigt
function displayGenerationenScore() {
	//console.log("displayGenerationScore");
	if (generation) {
		let temp = generation.innerHTML;
		generation.innerHTML = generation.innerHTML.replace(
			temp,
			"Generation: " + generationen
		);
	}
}

//button für die randomRainbow felder
let rainbowBTN = document.getElementById("Rainbow");
if (rainbowBTN) {
	rainbowBTN.addEventListener("click", (RAINBOW: Event) =>
		drawRandomColor(feld)
	);
}

function randomColor() {
	draw = 1;
	//console.log("randomColor");

	let randomNumber = Math.random();

	if (ctx) {
		if (randomNumber < 0.33) {
			ctx.fillStyle = "#fc4f4f"; //rot
			color = "#fc4f4f";
		}
		if (randomNumber > 0.33 && randomNumber < 0.66) {
			ctx.fillStyle = "#00c0ff"; //blau
			color = "#00c0ff";
		}
		if (randomNumber > 0.66 && randomNumber < 0.99) {
			ctx.fillStyle = "#ffcf00"; //gelb
			color = "#ffcf00";
		}
	}
	return color;
}

function drawRandomColor(fieldvar: any) {
	//console.log("drawRandomColor");
	let x = 0;
	if (ctx) {
		for (let y = 0; y < anzahlFelderBreite; y++) {
			for (x = 0; x < anzahlFelderLaenge; x++) {
				if (fieldvar[x][y] == lebendig) {
					ctx.fillStyle = randomColor();
					ctx.fillRect(x * zellBreite, y * zellLaenge, zellBreite, zellLaenge);
				} else {
				}
			}
		}
		createCanvas();
	}
}

let darkBtn = document.getElementById("Darkmode");
if (darkBtn) {
	darkBtn.addEventListener("click", (DARK: Event) => darkmode());
}

function darkmode2() {
	if (p) {
		document.body.bgColor = "black";
		if (ctx) {
			ctx.strokeStyle = "white";
			createCanvas();
		}
	} else {
		document.body.bgColor = "white";
		if (ctx) {
			ctx.strokeStyle = "black";
			createCanvas();
		}
	}
}

let p = false;
function darkmode() {
	console.log(p);
	//console.log("buttonTrueFalse");
	p = !p;
	darkmode2();
	//setzt u = true und false pro click
	return p;
}
