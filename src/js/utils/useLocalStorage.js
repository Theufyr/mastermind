// gestion Storage
export default function useLocalStorage(action, key, value) {
    // ajouter une entrée en Storage
    if (action == "set") {
        // on sérialise l'entrée
        localStorage.setItem(key, JSON.stringify(value));
    }
    // récupérer une entrée stockée en Storage
    if (action == "get") {
        // on vérifie qu'il y a une entrée
        if (localStorage.getItem(key) !== null) {
            // on la remet au format javascript
            return JSON.parse(localStorage.getItem(key));
        } else {
            return null;
        }
    }
    // effacement d'une entrée stockée en Storage
    if (action == "remove") {
        localStorage.removeItem(key);
    }
    // effacement de toutes les données stockées en Storage
    if (action == "clear") {
        localStorage.clear();
    }
}