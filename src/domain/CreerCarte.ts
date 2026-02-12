import {Carte, Couleur, Rang} from "../entities/Carte.js";


export function creerCarte(rang: Rang, couleur: Couleur): Carte {
    return { rang, couleur };
}
