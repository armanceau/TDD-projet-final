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

function valeurSuite(cartes: Carte[]): number {
    const valeurs = cartes.map(c => valeurRang(c.rang));
    const uniques = new Set(valeurs);
    if (uniques.has(14) && uniques.has(5) && uniques.has(4) && uniques.has(3) && uniques.has(2)) {
        return 5;
    }
    return Math.max(...valeurs);
}

export function comparerResultats(a: ResultatMain, b: ResultatMain): number {
    if (a.categorie !== b.categorie) return a.categorie - b.categorie;

    switch (a.categorie) {
        case CategorieMain.Suite:
        case CategorieMain.QuinteFlush:
            return valeurSuite(a.cartes) - valeurSuite(b.cartes);
        default:
            return 0;
    }
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

    const getSuiteCartes = (source: Carte[]): Carte[] | null => {
        const valeursUniq = Array.from(new Set(source.map(c => valeurRang(c.rang)))).sort((a, b) => b - a);
        const valeurs = [...valeursUniq];
        if (valeurs.includes(14)) valeurs.push(1);
        for (let i = 0; i <= valeurs.length - 5; i++) {
            const window = valeurs.slice(i, i + 5);
            if (window[0] - window[4] === 4) {
                const straightCartes: Carte[] = [];
                for (const v of window) {
                    const target = v === 1 ? 14 : v;
                    const c = source.find(card => valeurRang(card.rang) === target);
                    if (c) straightCartes.push(c);
                }
                if (straightCartes.length === 5) return straightCartes;
            }
        }
        return null;
    };

    const compte: Record<string, Carte[]> = {};
    for (const carte of cartes) {
        const cle = carte.rang.toString();
        if (!compte[cle]) compte[cle] = [];
        compte[cle].push(carte);
    }

    const groupesTries = Object.values(compte).sort((a, b) => valeurRang(b[0]!.rang) - valeurRang(a[0]!.rang));
    const carres = groupesTries.filter(g => g.length === 4);
    const brelans = groupesTries.filter(g => g.length === 3);
    const paires = groupesTries.filter(g => g.length === 2);

    const couleurs: Record<string, Carte[]> = {};
    for (const c of cartes) {
        if (!couleurs[c.couleur]) couleurs[c.couleur] = [];
        couleurs[c.couleur].push(c);
    }
    const flushs = Object.values(couleurs).filter(g => g.length >= 5);
    if (flushs.length >= 1 && flushs[0]) {
        const quinteFlush = getSuiteCartes(flushs[0]);
        if (quinteFlush) {
            return { categorie: CategorieMain.QuinteFlush, cartes: quinteFlush };
        }
    }

    if (carres.length >= 1) {
        const carre = carres[0]!;
        const kicker = cartes
            .filter(c => !carre.includes(c))
            .sort((a, b) => valeurRang(b.rang) - valeurRang(a.rang))
            .slice(0, 1);
        return { categorie: CategorieMain.Carre, cartes: [...carre, ...kicker] };
    }

    if (brelans.length >= 1) {
        const triplet = brelans[0]!;
        const autreBrelan = brelans[1];
        const paire = paires[0] ?? (autreBrelan ? autreBrelan.slice(0, 2) : undefined);
        if (paire) {
            return { categorie: CategorieMain.Full, cartes: [...triplet, ...paire] };
        }
    }

    if (flushs.length >= 1 && flushs[0]) {
        const flushCartes = flushs[0]
            .sort((a, b) => valeurRang(b.rang) - valeurRang(a.rang))
            .slice(0, 5);
        return { categorie: CategorieMain.Couleur, cartes: flushCartes };
    }

    const suite = getSuiteCartes(cartes);
    if (suite) {
        return { categorie: CategorieMain.Suite, cartes: suite };
    }

    if (brelans.length >= 1) {
        const triplet = brelans[0]!;
        const kickers = cartes
            .filter(c => !triplet.includes(c))
            .sort((a, b) => valeurRang(b.rang) - valeurRang(a.rang))
            .slice(0, 2);
        return { categorie: CategorieMain.Brelan, cartes: [...triplet, ...kickers] };
    }

    if (paires.length >= 2 && paires[0] && paires[1]) {
        const toutesPaires = [...paires[0], ...paires[1]];
        const kickers = cartes
            .filter(c => !toutesPaires.includes(c))
            .sort((a, b) => valeurRang(b.rang) - valeurRang(a.rang))
            .slice(0, 1);
        return { categorie: CategorieMain.DeuxPaires, cartes: [...toutesPaires, ...kickers] };
    }

    if (paires.length === 1 && paires[0]) {
        const paire = paires[0];
        const kickers = cartes
            .filter(c => !paire.includes(c))
            .sort((a, b) => valeurRang(b.rang) - valeurRang(a.rang))
            .slice(0, 3);
        return { categorie: CategorieMain.Paire, cartes: [...paire, ...kickers] };
    }

    const carteMax = cartes.reduce((max, c) => (valeurRang(c.rang) > valeurRang(max.rang) ? c : max), cartes[0]!);
    return { categorie: CategorieMain.CarteHaute, cartes: [carteMax] };
}

function combinaisonsDeCinq(cartes: Carte[]): Carte[][] {
    const resultats: Carte[][] = [];
    for (let i = 0; i < cartes.length - 4; i++) {
        for (let j = i + 1; j < cartes.length - 3; j++) {
            for (let k = j + 1; k < cartes.length - 2; k++) {
                for (let l = k + 1; l < cartes.length - 1; l++) {
                    for (let m = l + 1; m < cartes.length; m++) {
                        resultats.push([cartes[i]!, cartes[j]!, cartes[k]!, cartes[l]!, cartes[m]!]);
                    }
                }
            }
        }
    }
    return resultats;
}

export function evaluerMeilleureMain(cartes: Carte[]): ResultatMain {
    if (cartes.length < 5) throw new Error("Au moins 5 cartes sont requises");

    const combinaisons = combinaisonsDeCinq(cartes);
    let meilleure = detecterMain(combinaisons[0]!);

    for (let i = 1; i < combinaisons.length; i++) {
        const courant = detecterMain(combinaisons[i]!);
        if (comparerResultats(courant, meilleure) > 0) {
            meilleure = courant;
        }
    }

    return meilleure;
}
