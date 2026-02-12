import {Carte, Couleur, Rang} from "../Entities/Carte.js";


export function creerCarte(rang: Rang, couleur: Couleur): Carte {
    return { rang, couleur };
}
