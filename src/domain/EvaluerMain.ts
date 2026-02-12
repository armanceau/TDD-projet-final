import { Carte, Rang } from '../entities/Carte.js';

export interface ResultatCarteHaute {
    carteHaute: Carte;
}

export function detecterCarteHaute(cartes: Carte[]): ResultatCarteHaute {
    if (cartes.length === 0) throw new Error("Aucune carte fournie");

    const valeurRang = (rang: Rang) => {
        if (typeof rang === 'number') return rang;
        switch (rang) {
            case 'J': return 11;
            case 'Q': return 12;
            case 'K': return 13;
            case 'A': return 14;
            default: return 0;
        }
    };

    let carteMax = cartes[0];
    if(carteMax != undefined) {
        for (const carte of cartes) {

            if (valeurRang(carte.rang) > valeurRang(carteMax.rang)) {
                carteMax = carte;
            }
        }
        return { carteHaute: carteMax }
    }
    else{
        throw ("La carte n'est pas définie")
    }
}
