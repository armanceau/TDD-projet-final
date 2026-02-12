import {Carte} from "./Carte.js";
import {ResultatMain} from "../domain/EvaluerMain.js";

export interface Joueur {
    id: string;
    cartes: Carte[];
}

export interface ResultatJoueur {
    joueur: Joueur;
    resultat: ResultatMain;
}

export interface ResultatComparaison {
    gagnants: ResultatJoueur[];
    resultats: ResultatJoueur[];
}