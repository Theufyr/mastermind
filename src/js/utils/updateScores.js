export default function updateScores(type, scores) {
    // parties jouées
    let pluriel = (scores.done > 1) ? "s" : "";
    let message = `${scores.done} Partie${pluriel} effectuée${pluriel}`;
    // parties gagnées
    if (type === "won") {
        pluriel = (scores.won > 1) ? "s" : "";
        message = "\n" + `${scores.won} Partie${pluriel} gagnée${pluriel}`;
    }
    if (type === "points") {
        pluriel = (scores.points > 1) ? "s" : "";
        message = "\n" + `${scores.points} Point${pluriel}`;
    }
    return message;
}