import shuffleArray from './utils/shuffleArray.js';
import deepCopy from './utils/deepCopy.js';

// DECLARATION DE L'ETAT DU JEU
const colorsList = ["black", "brown", "red", "orange", "yellow", "green", "blue", "white"];
const colorsFr = {
	black: "Noir",
	brown: "Brun",
	red: "Rouge",
	orange: "Orange",
	yellow: "Jaune",
	green: "Vert",
	blue: "Bleu",
	white: "Blanc",
};

// on met en mémoire la combinaison secrète
const secretCode = [];
// on met en mémoire le type de partie
// nombre de couleurs à deviner
// si les couleurs peuvent être répétées
const gameType = {
	pawnTotal: 2,
	multiColor: false
}
// on met en mémoire les couleurs choisies à chaque ligne
// 5 lignes en clés dont les valeurs sont un tableau contenant
// la validation (faite : Y, ou pas : N) et les couleurs des 5 pions possibles
// [N/Y, couleur du pion 1, couleur du pion 2... ]
let boardMemory = [
	["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"],
];


// PREPARATION DES AFFICHAGES
// affichage des règles du jeu
const rules = document.getElementById("rules");
rules.style.display = "block";
const rulesT = document.getElementById("r_triangle");
rulesT.textContent = "▾";
document.getElementById("rules_title").addEventListener('click', () => {
	rules.style.display = (rules.style.display == "block") ? "none" : "block";
	rulesT.textContent = (rules.style.display == "block") ? "▾" : "▸";
});

// affichage du formulaire
const chooseGame = document.getElementById("choose_game");
chooseGame.style.display = "block";
const chooseGameT = document.getElementById("lg_triangle");
chooseGameT.textContent = "▾";
document.getElementById("launch_game").addEventListener('click', () => {
	chooseGame.style.display = (chooseGame.style.display == "block") ? "none" : "block";
	chooseGameT.textContent = (chooseGame.style.display == "block") ? "▾" : "▸";
});

// initialisation du formulaire
const inputNumber = document.getElementById("colors_nb");
inputNumber.value = 2;
const inputMultiColors = document.getElementById("multi_colors");
inputMultiColors.checked = false;
const gameStatus = document.getElementById("game_status");
gameStatus.textContent = "";

// plateau de jeu
const gameDisplay = document.getElementById("game");
gameDisplay.style.display = "none";
const boardGame = document.getElementById("game_board");
boardGame.style.display = "none";
const boardGameT = document.getElementById("gt_triangle");
boardGameT.textContent = "▸";
document.getElementById("game_title").addEventListener('click', () => {
	boardGame.style.display = (boardGame.style.display == "block") ? "none" : "block";
	gameStatus.style.display = boardGame.style.display;
	boardGameT.textContent = (boardGame.style.display == "block") ? "▾" : "▸";
});


// CREATION DU PLATEAU DE JEU
// générer le plateau de jeu
function boardDisplay() {
	// on vide le plateau de jeu s'il existe déjà
	while (boardGame.firstChild) {
		boardGame.removeChild(boardGame.firstChild);
	}
	// ligne à valider
	let activeLine = "no";
	// on crée 12 lignes
	for (let i = 0; i < 12; i++) {
		// on crée une ligne de 5 pions, vide et inactive par défaut
		const linePawns = document.createElement("div");
		linePawns.id = "line_pawn_" + i;
		// on crée une ligne de 5 résultats
		const lineResults = document.createElement("div");
		lineResults.id = "line_result_" + i;
		lineResults.className = "result_line";
		// on crée un bouton pour valider les choix de couleurs
		const sendColors = document.createElement("button");
		sendColors.id = "send_colors_" + i;
		sendColors.type = "submit";
		sendColors.className = "off";
		sendColors.title = "";
		// ligne à valider
		const valid = boardMemory[i][0];
		if ((activeLine === "no") && (valid === "N")) {
			activeLine = "current";
			sendColors.className = "on";
			sendColors.title = "Valider les choix de couleurs";
			sendColors.addEventListener('click', () => {
				// on garde en mémoire la validation
				boardMemory[i][0] = "Y";
				// on actualise le plateau de jeu
				boardDisplay();
			});
		}
		// si la ligne est déjà validée on passe le bouton en vert
		if (valid === "Y") {
			sendColors.className = "off checked";
			sendColors.title = "Choix de couleurs déjà validés";
		}
		sendColors.textContent = "✓";
		for (let j = 1; j <= 5; j++) {
			// pions
			const pawn = document.createElement("div");
			pawn.textContent = "●";
			pawn.id = "pawn_" + j;
			pawn.className = "pawn";
			let pawnColor = 0;
			const currentColor = (boardMemory[i][j] !== undefined) ? boardMemory[i][j] : pawnColor;
			// on ne colore le pion que s'il est dans la partie
			if (j <= gameType.pawnTotal) {
				pawn.classList.add(colorsList[currentColor]);
				pawn.title = colorsFr[colorsList[currentColor]];
			}
			// si ce pion est dans la partie et
			// si ce pion est dans la ligne active et qu'elle n'a pas été validée
			if ((j <= gameType.pawnTotal) && (activeLine === "current")) {
				pawnColor = (boardMemory[i][j] !== undefined) ? boardMemory[i][j] : pawnColor;
				// on garde en mémoire la nouvelle couleur
				if (boardMemory[i][j] === undefined) {
					boardMemory[i].push(pawnColor);
				} else {
					boardMemory[i][j] = pawnColor;
				}
				pawn.classList.remove(colorsList[currentColor]);
				pawn.classList.add(colorsList[pawnColor]);
				pawn.title += ", cliquer pour changer de couleur";
				pawn.addEventListener('click', () => {
					const actualColor = colorsList.indexOf(pawn.classList[1]);
					// on retire la couleur actuelle
					pawn.classList.remove(colorsList[actualColor]);
					// on affiche la couleur suivante de la liste
					// ou on revient à la première si on est en fin de liste
					let nextColor = (actualColor + 1);
					nextColor = (actualColor >= 7) ? 0 : nextColor;
					pawn.classList.add(colorsList[nextColor]);
					// on change le nom du pion avec celui de la nouvelle couleur
					pawn.title = colorsFr[colorsList[nextColor]] + ", cliquer pour changer de couleur";
					// on garde en mémoire la nouvelle couleur
					boardMemory[i][j] = nextColor;
				});
			}
			linePawns.appendChild(pawn);
			// résultats
			const result = document.createElement("div");
			result.textContent = "◎";
			result.id = "result_" + j;
			result.className = "result";
			// si ce pion est dans la partie et
			// si la ligne est validée, on affiche les résultats
			if ((j <= gameType.pawnTotal) && (valid === "Y")) {
				if (secretCode.includes(colorsList[currentColor])) {
					// couleur présente dans la combinaison secrète
					let dotColor = "dotwhite";
					result.title = "Pion de la bonne couleur à la mauvaise place";
					// couleur à la bonne place
					if (secretCode[j - 1] === colorsList[currentColor]) {
						result.textContent = "◉";
						dotColor = "dotblack";
						result.title = "Pion de la bonne couleur à la bonne place";
					}
					result.classList.add(dotColor);
				}
			}
			lineResults.appendChild(result);
		}
		activeLine = (activeLine === "current") ? "done" : activeLine;
		const lineAll = document.createElement("div");
		lineAll.appendChild(lineResults);
		lineAll.appendChild(linePawns);
		lineAll.appendChild(sendColors);
		boardGame.appendChild(lineAll);
	}
	boardGameT.textContent = "▾";
	gameStatus.style.display = "block";
	boardGame.style.display = "block";
	gameDisplay.style.display = "block";
}

// LANCER LA PARTIE
// nombre et type de couleurs à découvrir (à choisir en lançant la partie)
chooseGame.addEventListener('submit', (target) => {
	target.preventDefault();
	const colorChoice	= parseInt(inputNumber.value);
	const numberChoices	= [2, 3, 4, 5];
	if (numberChoices.includes(colorChoice)) {
		// couleurs uniques ou multiples
		const multiColors = (inputMultiColors.checked);
		const colorsType = (!multiColors) ? "uniques" : "multiples";

		// sauvegarde des paramètres de la partie
		gameType.pawnTotal = colorChoice;
		gameType.multiColor = multiColors;

		// on réinitialise le formulaire
		inputNumber.value = 2;
		inputMultiColors.checked = false;
		// et on le masque
		chooseGame.style.display = "none";
		chooseGameT.textContent = "▸";
		// on masque aussi les règles du jeu
		rules.style.display = "none";
		rulesT.textContent = "▸";

		// création de la combinaison de couleurs
		// on réinitialise le code secret avant d'en créer un nouveau
		secretCode.length = 0;
		// on ne touche pas au tableau originel des couleurs
		// on le copie pour faire le mélange de couleurs
		// (en Deep Copy indépendante qui n'altèrera pas l'original quand il est modifié)
		const colorsShuffled = deepCopy(colorsList);
		// on sélectionne les couleurs en fonction du nb de pions demandés pour la partie
		
		for (let i = 0; i < colorChoice; i++) {
			// avant chaque choix de couleur, on mélange le tableau
			shuffleArray(colorsShuffled);
			// couleurs uniques
			if (!multiColors) {
				// si les couleurs sont uniques dans le code secret
				// on retire du tableau mélangé celle qui a été choisie
				// pour qu'elle ne ressorte pas au prochain tirage
				const singleColor = colorsShuffled.splice(0, 1);
				secretCode.push(singleColor[0]);
			// couleurs multiples
			} else {
				// on mélange le tableau des couleurs et on choisi la première
				secretCode.push(colorsShuffled[0]);
			}
		}
		console.table(secretCode);
		// affichage du type de partie générée
		gameStatus.textContent = `Combinaison de ${colorChoice} pions à deviner, de couleurs ${colorsType}.`;
		// réinitialisation de la mémoire
		boardMemory = [
			["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"], ["N"],
		];
		// création du plateau de jeu
		boardDisplay();
	}
});

