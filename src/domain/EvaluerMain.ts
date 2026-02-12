import { Carte, Rang } from '../entities/Carte.js';
import {CategorieMain} from "../constant/CategorieMainEnum.js";
import {ResultatMain} from "../entities/Main.js";

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

function trierCartesDesc(cartes: Carte[]): Carte[] {
    return [...cartes].sort((a, b) => valeurRang(b.rang) - valeurRang(a.rang));
}

function extraireKickers(cartes: Carte[], exclude: Carte[], n: number): Carte[] {
    return trierCartesDesc(cartes.filter(c => !exclude.includes(c))).slice(0, n);
}

function groupesParRang(cartes: Carte[]): Carte[][] {
    const compte: Record<string, Carte[]> = {};
    for (const c of cartes) {
        const cle = c.rang.toString();
        if (!compte[cle]) compte[cle] = [];
        compte[cle].push(c);
    }
    return Object.values(compte).sort((a, b) => valeurRang(b[0]!.rang) - valeurRang(a[0]!.rang));
}

function groupesParCouleur(cartes: Carte[]): Carte[][] {
    const compte: Record<string, Carte[]> = {};
    for (const c of cartes) {
        if (!compte[c.couleur]) compte[c.couleur] = [];
        compte[c.couleur].push(c);
    }
    return Object.values(compte).filter(g => g.length >= 5);
}

function detecterSuite(cartes: Carte[]): Carte[] | null {
    const valeursUniq = Array.from(new Set(cartes.map(c => valeurRang(c.rang)))).sort((a, b) => b - a);
    const valeurs = [...valeursUniq];
    if (valeurs.includes(14)) valeurs.push(1); // As bas possible
    for (let i = 0; i <= valeurs.length - 5; i++) {
        const window = valeurs.slice(i, i + 5);
        if (window[0] - window[4] === 4) {
            const suite: Carte[] = window.map(v => {
                const target = v === 1 ? 14 : v;
                return cartes.find(c => valeurRang(c.rang) === target)!;
            });
            if (suite.length === 5) return suite;
        }
    }
    return null;
}

function detecterQuinteFlush(cartes: Carte[]): ResultatMain | null {
    const flushs = groupesParCouleur(cartes);
    for (const flush of flushs) {
        const suite = detecterSuite(flush);
        if (suite) return { categorie: CategorieMain.QuinteFlush, cartes: suite };
    }
    return null;
}

function detecterCarre(cartes: Carte[]): ResultatMain | null {
    const groupes = groupesParRang(cartes).filter(g => g.length === 4);
    if (groupes.length === 0) return null;
    const carre = groupes[0]!;
    const kicker = extraireKickers(cartes, carre, 1);
    return { categorie: CategorieMain.Carre, cartes: [...carre, ...kicker] };
}

function detecterFull(cartes: Carte[]): ResultatMain | null {
    const groupes = groupesParRang(cartes);
    const brelans = groupes.filter(g => g.length === 3);
    const paires = groupes.filter(g => g.length === 2);
    if (brelans.length === 0) return null;
    const triplet = brelans[0]!;
    let paire: Carte[] | undefined = paires[0];
    if (!paire && brelans.length > 1) {
        paire = brelans[1]!.slice(0, 2);
    }
    if (!paire) return null;
    return { categorie: CategorieMain.Full, cartes: [...triplet, ...paire] };
}

function detecterCouleur(cartes: Carte[]): ResultatMain | null {
    const flushs = groupesParCouleur(cartes);
    if (flushs.length === 0) return null;
    return { categorie: CategorieMain.Couleur, cartes: trierCartesDesc(flushs[0]).slice(0, 5) };
}

function detecterSuiteSimple(cartes: Carte[]): ResultatMain | null {
    const suite = detecterSuite(cartes);
    if (!suite) return null;
    return { categorie: CategorieMain.Suite, cartes: suite };
}

function detecterBrelan(cartes: Carte[]): ResultatMain | null {
    const groupes = groupesParRang(cartes).filter(g => g.length === 3);
    if (groupes.length === 0) return null;
    const triplet = groupes[0]!;
    const kickers = extraireKickers(cartes, triplet, 2);
    return { categorie: CategorieMain.Brelan, cartes: [...triplet, ...kickers] };
}

function detecterDeuxPaires(cartes: Carte[]): ResultatMain | null {
    const groupes = groupesParRang(cartes).filter(g => g.length === 2);
    if (groupes.length < 2) return null;
    const toutesPaires = [...groupes[0], ...groupes[1]];
    const kicker = extraireKickers(cartes, toutesPaires, 1);
    return { categorie: CategorieMain.DeuxPaires, cartes: [...toutesPaires, ...kicker] };
}

function detecterPaire(cartes: Carte[]): ResultatMain | null {
    const groupes = groupesParRang(cartes).filter(g => g.length === 2);
    if (groupes.length === 0) return null;
    const paire = groupes[0]!;
    const kickers = extraireKickers(cartes, paire, 3);
    return { categorie: CategorieMain.Paire, cartes: [...paire, ...kickers] };
}

function detecterCarteHaute(cartes: Carte[]): ResultatMain {
    return { categorie: CategorieMain.CarteHaute, cartes: trierCartesDesc(cartes).slice(0, 5) };
}

export function detecterMain(cartes: Carte[]): ResultatMain {
    if (cartes.length === 0) throw new Error("Aucune carte fournie");

    return (
        detecterQuinteFlush(cartes) ??
        detecterCarre(cartes) ??
        detecterFull(cartes) ??
        detecterCouleur(cartes) ??
        detecterSuiteSimple(cartes) ??
        detecterBrelan(cartes) ??
        detecterDeuxPaires(cartes) ??
        detecterPaire(cartes) ??
        detecterCarteHaute(cartes)
    );
}

function valeurSuite(cartes: Carte[]): number {
    const valeurs = cartes.map(c => valeurRang(c.rang));
    const uniques = new Set(valeurs);
    if (uniques.has(14) && uniques.has(5) && uniques.has(4) && uniques.has(3) && uniques.has(2)) return 5;
    return Math.max(...valeurs);
}

function comparerValeursCartes(a: Carte[], b: Carte[]): number {
    const longueur = Math.min(a.length, b.length);
    for (let i = 0; i < longueur; i++) {
        const diff = valeurRang(a[i]!.rang) - valeurRang(b[i]!.rang);
        if (diff !== 0) return diff;
    }
    return a.length - b.length;
}

export function comparerResultats(a: ResultatMain, b: ResultatMain): number {
    if (a.categorie !== b.categorie) return a.categorie - b.categorie;

    switch (a.categorie) {
        case CategorieMain.Suite:
        case CategorieMain.QuinteFlush:
            return valeurSuite(a.cartes) - valeurSuite(b.cartes);
        default:
            return comparerValeursCartes(a.cartes, b.cartes);
    }
}

function combinaisonsDeCinq(cartes: Carte[]): Carte[][] {
    const resultats: Carte[][] = [];
    for (let i = 0; i < cartes.length - 4; i++)
        for (let j = i + 1; j < cartes.length - 3; j++)
            for (let k = j + 1; k < cartes.length - 2; k++)
                for (let l = k + 1; l < cartes.length - 1; l++)
                    for (let m = l + 1; m < cartes.length; m++)
                        resultats.push([cartes[i]!, cartes[j]!, cartes[k]!, cartes[l]!, cartes[m]!]);
    return resultats;
}

export function evaluerMeilleureMain(cartes: Carte[]): ResultatMain {
    if (cartes.length < 5) throw new Error("Au moins 5 cartes sont requises");

    const combinaisons = combinaisonsDeCinq(cartes);
    let meilleure = detecterMain(combinaisons[0]!);

    for (let i = 1; i < combinaisons.length; i++) {
        const courant = detecterMain(combinaisons[i]!);
        if (comparerResultats(courant, meilleure) > 0) meilleure = courant;
    }

    return meilleure;
}
