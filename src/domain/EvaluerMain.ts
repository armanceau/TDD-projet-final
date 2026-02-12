import { Carte, Rang } from '../entities/Carte.js';

export enum CategorieMain {
    CarteHaute,
    Paire,
    DeuxPaires,
    Brelan,
    Suite,
    Couleur,
    Full,
    Carre,
    QuinteFlush
}

export interface ResultatMain {
    categorie: CategorieMain;
    cartes: Carte[];
}

export function valeurRang(rang: Rang): number {
    if (typeof rang === 'number') return rang;
    switch (rang) {
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        case 'A': return 14;
        default: return 0;
    }
}

export function detecterMain(cartes: Carte[]): ResultatMain {
    if (cartes.length === 0) throw new Error("Aucune carte fournie");

    const compte: Record<string, Carte[]> = {};
    for (const carte of cartes) {
        const cle = carte.rang.toString();
        if (!compte[cle]) compte[cle] = [];
        compte[cle].push(carte);
    }

    const groupes = Object.values(compte);

    const paires = groupes.filter(g => g.length === 2);
    if (paires.length >= 2 && paires[0] && paires[1]) {
        const toutesPaires = [...paires[0], ...paires[1]];
        const kickers = cartes
            .filter(c => !toutesPaires.includes(c))
            .sort((a,b)=>valeurRang(b.rang)-valeurRang(a.rang))
            .slice(0,1);
        return { categorie: CategorieMain.DeuxPaires, cartes: [...toutesPaires, ...kickers] };
    }

    if (paires.length === 1 && paires[0]) {
        const paire = paires[0];
        const kickers = cartes
            .filter(c => !paire.includes(c))
            .sort((a,b)=>valeurRang(b.rang)-valeurRang(a.rang))
            .slice(0,3);
        return { categorie: CategorieMain.Paire, cartes: [...paire, ...kickers] };
    }

    const brelans = groupes.filter(g => g.length === 3 && g[0]);
    if (brelans.length >= 1 && brelans[0]) {
        const triplet = brelans[0];
        const kickers = cartes
            .filter(c => !triplet.includes(c))
            .sort((a,b)=>valeurRang(b.rang)-valeurRang(a.rang))
            .slice(0,2);
        return { categorie: CategorieMain.Brelan, cartes: [...triplet, ...kickers] };
    }

    const valeursSansAs = Array.from(new Set(cartes.map(c => valeurRang(c.rang)))).sort((a,b) => b - a);
    if (!(valeursSansAs.includes(10) && valeursSansAs.includes(11) && valeursSansAs.includes(12) && valeursSansAs.includes(13) && valeursSansAs.includes(14))) {
        const valeurs = [...valeursSansAs];
        if (valeurs.includes(14)) valeurs.push(1);
        for (let i = 0; i <= valeurs.length - 5; i++) {
            const window = valeurs.slice(i, i + 5);
            if (window[0] - window[4] === 4) {
                const straightCartes: Carte[] = [];
                for (let v of window) {
                    const c = cartes.find(c => valeurRang(c.rang) === (v === 1 ? 14 : v));
                    if (c) straightCartes.push(c);
                }
                return { categorie: CategorieMain.Suite, cartes: straightCartes };
            }
        }
    }

    const carteMax = cartes.reduce((max, c) => (valeurRang(c.rang) > valeurRang(max.rang) ? c : max), cartes[0]!);
    return { categorie: CategorieMain.CarteHaute, cartes: [carteMax] };
}
