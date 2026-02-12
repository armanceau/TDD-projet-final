import { Carte } from '../entities/Carte.js';
import { comparerResultats, evaluerMeilleureMain } from './EvaluerMain.js';
import {Joueur, ResultatComparaison, ResultatJoueur} from "../entities/Joueur.js";

export function comparerJoueurs(board: Carte[], joueurs: Joueur[]): ResultatComparaison {
    if (board.length !== 5) throw new Error('Le board doit contenir 5 cartes');
    if (joueurs.length === 0) throw new Error('Aucun joueur fourni');

    const resultats: ResultatJoueur[] = joueurs.map(joueur => ({
        joueur,
        resultat: evaluerMeilleureMain([...board, ...joueur.cartes])
    }));

    let meilleure = resultats[0]!;
    for (let i = 1; i < resultats.length; i++) {
        if (comparerResultats(resultats[i]!.resultat, meilleure.resultat) > 0) {
            meilleure = resultats[i]!;
        }
    }

    const gagnants = resultats.filter(r => comparerResultats(r.resultat, meilleure.resultat) === 0);

    return { gagnants, resultats };
}
