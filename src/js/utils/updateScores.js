export default function updateScores(type, scores) {
    // parties jouées
    let plural = (scores.done > 1) ? "s" : "";
    let message = `${scores.done} Partie${plural} effectuée${plural}`;
    // parties gagnées
    if (type === "won") {
        plural = (scores.won > 1) ? "s" : "";
        message = "\n" + `${scores.won} Partie${plural} gagnée${plural}`;
    }
    if (type === "points") {
        plural = (scores.points > 1) ? "s" : "";
        message = "\n" + `${scores.points} Point${plural}`;
    }
    return message;
}