import { Carte } from '../entities/Carte.js';
import { evaluerMeilleureMain } from './EvaluerMain.js';
import {Joueur, ResultatComparaison, ResultatJoueur} from "../entities/Joueur.js";

export function comparerJoueurs(board: Carte[], joueurs: Joueur[]): ResultatComparaison {
    if (board.length !== 5) throw new Error('Le board doit contenir 5 cartes');
    if (joueurs.length === 0) throw new Error('Aucun joueur fourni');

    const resultats: ResultatJoueur[] = joueurs.map(joueur => ({
        joueur,
        resultat: evaluerMeilleureMain([...board, ...joueur.cartes])
    }));

    const meilleureCategorie = Math.max(...resultats.map(r => r.resultat.categorie));
    const gagnants = resultats.filter(r => r.resultat.categorie === meilleureCategorie);

    return { gagnants, resultats };
}
