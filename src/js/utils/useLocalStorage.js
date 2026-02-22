export default function useLocalStorage(gameSave, saving = false) {
    for (const saveVerif in gameSave) {
        // RECUPERATION
        if (!saving) {
            // si la sauvegarde est présente, on la récupère et on la remet au format JSON
            if (localStorage.getItem(saveVerif) !== null) {
                gameSave[saveVerif] = JSON.parse(localStorage.getItem(saveVerif));
            // sinon on la crée
            } else {
                saving = true;
            }
        }

        // SAUVEGARDE
        // on crée ou remet à jour la sauvegarde en la sérialisant
        // volontairement fait en un 2ème temps après la récupération
        // pour que le localStorage et la mémoire courrante gameSave soient synchronisés
        if (saving) {
            localStorage.setItem(saveVerif, JSON.stringify(gameSave[saveVerif]));
        }
    }
    return gameSave;
}