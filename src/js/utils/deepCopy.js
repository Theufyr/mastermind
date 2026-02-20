// JS fait des copies en Shallow Copy par défaut avec la plupart de ses méthodes
// cela peut altérer la source quand on modifie la copie par la suite
// une Deep Copy permet de rendre la copie totalement indépendante
export default function deepCopy(toCopy) {
    return JSON.parse(JSON.stringify(toCopy));
}