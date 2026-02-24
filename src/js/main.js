import deepCopy from './utils/deepCopy.js';
import shuffleArray from './utils/shuffleArray.js';
import updateScores from './utils/updateScores.js';
import useLocalStorage from './utils/useLocalStorage.js';

// SCORES
// on garde en mémoire :
// done: le nombre de parties effectuées et celles gagnées
// won: le nombre de parties gagnées
// points: le nombre total de pions devinés (+1 si les couleurs pouvaient être répétées)
const scoresSave = {
	done: 0,
	won: 0,
	points: 0
}


// VALEURS PAR DEFAUT DU JEU
// couleurs utilisables dans le jeu
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
// pions devinés
const gameType = {
	pawnTotal: 2,
	multiColor: false,
	winPawns: 0,
	active: false
}
const gameStatusDisplay = {
	pawnTotal: "",
	multiColor: ""
};


// on met en mémoire les couleurs choisies à chaque ligne
// 12 lignes en clés qui correspondent au nombre de coups autorisés dans une partie
// chaque clé aura comme valeur un tableau contenant :
// - la validation de la ligne (faite : Y, ou pas : N)
// - la couleur des 5 pions possibles dans cette ligne
// [N/Y, couleur du pion 1, couleur du pion 2... ]
// par défaut seulement ["N"] car les couleurs n'ont pas encore été choisies
const boardMemory = [];
for (let i = 0; i < 12; i++) {
	boardMemory[i] = ["N"];
}


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

// affichage du calcul des scores
const scoreExplanations = document.getElementById("score_explanations");
scoreExplanations.style.display = "none";
const scoreExplanationsT = document.getElementById("s_triangle");
scoreExplanationsT.textContent = "▸";
document.getElementById("score_points").addEventListener('click', () => {
	scoreExplanations.style.display = (scoreExplanations.style.display == "block") ? "none" : "block";
	scoreExplanationsT.textContent = (scoreExplanations.style.display == "block") ? "▾" : "▸";
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
const checkedColorsNb = document.getElementById("checked_colors_nb");
checkedColorsNb.textContent = inputNumber.value;
inputNumber.addEventListener("change", () => {
    checkedColorsNb.textContent = inputNumber.value;
});

// affichage des scores
const gameScoresDone = document.getElementById("game_scores_done");
const gameScoresWon = document.getElementById("game_scores_won");
const gameScoresPoints = document.getElementById("game_scores_points");

// affichage du type de partie
const gameStatusPawns = document.getElementById("game_status_pawns");
const gameStatusMulti = document.getElementById("game_status_multi");

// plateau de jeu
const gameDisplay = document.getElementById("game");
gameDisplay.style.display = "none";
const boardGame = document.getElementById("game_board");
boardGame.style.display = "none";
const boardGameT = document.getElementById("gt_triangle");
boardGameT.textContent = "▸";
document.getElementById("game_title").addEventListener('click', () => {
	boardGame.style.display = (boardGame.style.display == "block") ? "none" : "block";
	gameStatusPawns.style.display = boardGame.style.display;
	gameStatusMulti.style.display = boardGame.style.display;
	boardGameT.textContent = (boardGame.style.display == "block") ? "▾" : "▸";
});

// affichage de la fin de la partie
const gameEnd = document.getElementById("game_end");
gameEnd.style.display = "none";
const endMessage = document.getElementById("end_message");
endMessage.addEventListener('click', () => {
	// on raffiche le formulaire de choix de partie
	chooseGame.style.display = "block";
	chooseGameT.textContent = "▾";
});


// SAUVEGARDE EN LocalStorage
// clés à vérifier ou créer
const gameSave = {
	scoresSave: scoresSave,
	secretCode: secretCode,
	gameType: gameType,
	boardMemory: boardMemory,
	gameStatusDisplay: gameStatusDisplay
};

// automatisation de la mise à jour de sauvegarde
function saveUpdate(saving = false) {
	const localSave = useLocalStorage(gameSave, saving);
	for (const saveVerif in localSave) {
		gameSave[saveVerif] = localSave[saveVerif];
	}
	// affichage des scores
	gameScoresDone.textContent = updateScores("done", gameSave.scoresSave);
	gameScoresWon.textContent = updateScores("won", gameSave.scoresSave);
	gameScoresPoints.textContent = updateScores("points", gameSave.scoresSave);
	// affichage du type de partie
	gameStatusPawns.textContent = gameSave.gameStatusDisplay.pawnTotal;
	gameStatusMulti.textContent = gameSave.gameStatusDisplay.multiColor;
}

// récupération de la sauvegarde si elle est présente
// ou création avec valeurs par défaut
saveUpdate();

// réinitialisation de la sauvegarde des scores
const reinit = document.getElementById("reinit");
reinit.addEventListener('click', (target) => {
	target.preventDefault();
	// on remet les scores à 0
	gameSave.scoresSave.done = 0;
	gameSave.scoresSave.won = 0;
	gameSave.scoresSave.points = 0;
	gameScoresDone.textContent = updateScores("done", gameSave.scoresSave);
	gameScoresWon.textContent = updateScores("won", gameSave.scoresSave);
	gameScoresPoints.textContent = updateScores("points", gameSave.scoresSave);
	// on met à jour la sauvegarde
	saveUpdate(true);
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
		// on n'affiche que les lignes passées et celle en cours
		if (activeLine !== "done") {
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
			const valid = gameSave.boardMemory[i][0];
			// si la ligne est en cours, le bouton pour valider est actif
			if ((activeLine === "no") && (valid === "N")) {
				activeLine = "current";
				sendColors.className = "on";
				sendColors.title = "Valider les choix de couleurs";
				sendColors.addEventListener('click', () => {
					// on garde en mémoire la validation
					gameSave.boardMemory[i][0] = "Y";
					// on met à jour la sauvegarde
					saveUpdate(true);
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
				const currentColor = (gameSave.boardMemory[i][j] !== undefined) ? gameSave.boardMemory[i][j] : pawnColor;
				// on ne colore le pion que s'il est dans la partie
				if (j <= gameSave.gameType.pawnTotal) {
					pawn.classList.add(colorsList[currentColor]);
					pawn.title = colorsFr[colorsList[currentColor]];
				}
				// si ce pion est dans la partie et
				// si ce pion est dans la ligne active et qu'elle n'a pas été validée
				if ((j <= gameSave.gameType.pawnTotal) && (activeLine === "current")) {
					pawnColor = (gameSave.boardMemory[i][j] !== undefined) ? gameSave.boardMemory[i][j] : pawnColor;
					// on garde en mémoire la nouvelle couleur
					if (gameSave.boardMemory[i][j] === undefined) {
						gameSave.boardMemory[i].push(pawnColor);
					} else {
						gameSave.boardMemory[i][j] = pawnColor;
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
						gameSave.boardMemory[i][j] = nextColor;
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
				if ((j <= gameSave.gameType.pawnTotal) && (valid === "Y")) {
					if (gameSave.secretCode.includes(colorsList[currentColor])) {
						// couleur présente dans la combinaison secrète
						let dotColor = "dotwhite";
						result.title = "Pion de la bonne couleur à la mauvaise place";
						// couleur à la bonne place
						if (gameSave.secretCode[j - 1] === colorsList[currentColor]) {
							result.textContent = "◉";
							dotColor = "dotblack";
							result.title = "Pion de la bonne couleur à la bonne place";
							// on comptabilise le pion gagnant
							++gameSave.gameType.winPawns;
						}
						result.classList.add(dotColor);
					}
				}
				lineResults.appendChild(result);
			}
			//
			activeLine = (activeLine === "current") ? "done" : activeLine;
			const lineAll = document.createElement("div");
			lineAll.appendChild(lineResults);
			lineAll.appendChild(linePawns);
			lineAll.appendChild(sendColors);
			boardGame.appendChild(lineAll);
			// partie gagnée
			if (gameSave.gameType.winPawns === gameSave.gameType.pawnTotal) {
				endMessage.textContent = `Bravo ! Partie gagnée !`;
				gameEnd.style.display = "block";
				gameSave.gameType.active = false;
				// on met à jour les scores
				++gameSave.scoresSave.done;
				++gameSave.scoresSave.won;
				// points gagnés : nombre de pions devinés (+1 si les couleurs pouvaient être répétées)
				gameSave.scoresSave.points += (gameSave.gameType.multiColor) ? (gameSave.gameType.pawnTotal + 1) : gameSave.gameType.pawnTotal;
				// +1 point pour avoir gagné la partie
				++gameSave.scoresSave.points
				// +1 par coups non utilisés (en nombre de pions)
				gameSave.scoresSave.points += ((11 - i) * gameSave.gameType.pawnTotal);
				//on sauvegarde
				saveUpdate(true);
				gameScoresDone.textContent = updateScores("done", gameSave.scoresSave);
				gameScoresWon.textContent = updateScores("won", gameSave.scoresSave);
				gameScoresPoints.textContent = updateScores("points", gameSave.scoresSave);
				// partie finie, on empêche d'activer une autre ligne
				activeLine = "done";
			// partie perdue
			} else {
				// si on arrive à la dernière ligne et seulement après la 12ème proposition
				if ((i === 11) && (activeLine !== "done")) {
					endMessage.textContent = `Partie perdue, retente ta chance !`;
					gameEnd.style.display = "block";
					gameSave.gameType.active = false;
					// on met à jour les scores
					++gameSave.scoresSave.done;
					// points gagnés : nombre de pions devinés (+1 si les couleurs pouvaient être répétées)
					gameSave.scoresSave.points += (gameSave.gameType.multiColor) ? (gameSave.gameType.pawnTotal + 1) : gameSave.gameType.pawnTotal;
					//on sauvegarde
					saveUpdate(true);
					gameScoresDone.textContent = updateScores("done", gameSave.scoresSave);
					gameScoresWon.textContent = updateScores("won", gameSave.scoresSave);
					gameScoresPoints.textContent = updateScores("points", gameSave.scoresSave);
				}
			}
			// on réinitialise le nombre de pions gagnés pour le traitement de la prochaine ligne
			gameSave.gameType.winPawns = 0;
		}
	}
	boardGameT.textContent = "▾";
	gameStatusPawns.style.display = "block";
	gameStatusMulti.style.display = "block";
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
		const colorsType = (!multiColors) ? "ne peut pas" : "peut";

		// sauvegarde des paramètres de la partie
		gameSave.gameType.pawnTotal = colorChoice;
		gameSave.gameType.multiColor = multiColors;
		gameSave.gameType.winPawns = 0;
		gameSave.gameType.active = true;

		// on réinitialise le formulaire
		inputNumber.value = 2;
		inputMultiColors.checked = false;
		// et on le masque
		chooseGame.style.display = "none";
		chooseGameT.textContent = "▸";
		// on masque aussi les règles du jeu
		rules.style.display = "none";
		rulesT.textContent = "▸";
		// et l'éventuel message de fin de partie
		gameEnd.style.display = "none";

		// création de la combinaison de couleurs
		// on réinitialise le code secret avant d'en créer un nouveau
		gameSave.secretCode.length = 0;
		
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
				gameSave.secretCode.push(singleColor[0]);
			// couleurs multiples
			} else {
				// on mélange le tableau des couleurs et on choisi la première
				gameSave.secretCode.push(colorsShuffled[0]);
			}
		}
		
		// affichage du type de partie générée
		gameSave.gameStatusDisplay.pawnTotal = `Combinaison de ${colorChoice} pions à deviner.`;
		gameSave.gameStatusDisplay.multiColor = `Une même couleur ${colorsType} être présente plusieurs fois dans la combinaison.`;
		// réinitialisation de la mémoire
		for (let i = 0; i < 12; i++) {
			gameSave.boardMemory[i] = ["N"];
		}
		//on sauvegarde
		saveUpdate(true);
		// création du plateau de jeu
		boardDisplay();
	}
});

// PARTIE EN PAUSE
// au chargement de la page, on vérifie si une partie était en cours
if (gameSave.gameType.active) {
	// on affiche le plateau de jeu directement
	boardDisplay();
	
	// et on masque le formulaire
	chooseGame.style.display = "none";
	chooseGameT.textContent = "▸";
	// on masque aussi les règles du jeu
	rules.style.display = "none";
	rulesT.textContent = "▸";
	// et l'éventuel message de fin de partie
	gameEnd.style.display = "none";
}
