import { describe, it, expect } from 'vitest';
import { detecterMain, evaluerMeilleureMain } from '../src/domain/EvaluerMain.js';
import { creerCarte } from '../src/domain/CreerCarte.js';
import {CategorieMain} from "../src/constant/CategorieMainEnum.js";

describe('Détecteur de carte haute', () => {
    it('devrait retourner la carte la plus haute parmi des nombres', () => {
        const cartes = [
            creerCarte(2, '♠'),
            creerCarte(5, '♥'),
            creerCarte(10, '♦'),
            creerCarte(3, '♣'),
            creerCarte(7, '♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.CarteHaute);
        // @ts-ignore
        expect(resultat.cartes[0].rang).toBe(10);
    });

    it('devrait retourner l’As comme carte haute', () => {
        const cartes = [
            creerCarte('J', '♠'),
            creerCarte(9, '♥'),
            creerCarte('K', '♦'),
            creerCarte('A', '♣'),
            creerCarte(10, '♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.CarteHaute);
        // @ts-ignore
        expect(resultat.cartes[0].rang).toBe('A');
    });
});

describe('Détecteur de main', () => {
    it('devrait détecter une paire', () => {
        const cartes = [
            creerCarte(2,'♠'),
            creerCarte(2,'♥'),
            creerCarte(5,'♦'),
            creerCarte(7,'♣'),
            creerCarte(9,'♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Paire);
    });

    it('devrait détecter deux paires', () => {
        const cartes = [
            creerCarte(2,'♠'),
            creerCarte(2,'♥'),
            creerCarte(5,'♦'),
            creerCarte(5,'♣'),
            creerCarte(9,'♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.DeuxPaires);
    });

    it('devrait détecter un brelan', () => {
        const cartes = [
            creerCarte(3,'♠'),
            creerCarte(3,'♥'),
            creerCarte(3,'♦'),
            creerCarte(7,'♣'),
            creerCarte(9,'♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Brelan);
    });

    it('devrait détecter une suite', () => {
        const cartes = [
            creerCarte(2,'♠'),
            creerCarte(3,'♥'),
            creerCarte(4,'♦'),
            creerCarte(5,'♣'),
            creerCarte(6,'♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Suite);
    });

    it('devrait détecter une couleur', () => {
        const cartes = [
            creerCarte(2,'♠'),
            creerCarte(5,'♠'),
            creerCarte(9,'♠'),
            creerCarte("J",'♠'),
            creerCarte("K",'♠'),
            creerCarte(3,'♦')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Couleur);
        expect(resultat.cartes.length).toBe(5);
    });

    it('devrait détecter un carré', () => {
        const cartes = [
            creerCarte(9,'♠'),
            creerCarte(9,'♥'),
            creerCarte(9,'♦'),
            creerCarte(9,'♣'),
            creerCarte(2,'♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Carre);

        const rangs = resultat.cartes.map(c => c.rang);
        const carreRang = 9;
        const compteRang = rangs.filter(r => r === carreRang).length;
        expect(compteRang).toBe(4);

        expect(resultat.cartes.length).toBe(5);
    });

    it('devrait détecter un full', () => {
        const cartes = [
            creerCarte(4,'♠'),
            creerCarte(4,'♥'),
            creerCarte(4,'♦'),
            creerCarte(9,'♣'),
            creerCarte(9,'♠')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Full);
        expect(resultat.cartes.length).toBe(5);
    });

    it('devrait détecter une quinte flush', () => {
        const cartes = [
            creerCarte(6,'♣'),
            creerCarte(7,'♣'),
            creerCarte(8,'♣'),
            creerCarte(9,'♣'),
            creerCarte(10,'♣'),
            creerCarte(2,'♦')
        ];
        const resultat = detecterMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.QuinteFlush);
        expect(resultat.cartes.length).toBe(5);
    });

});

describe('Meilleure main sur 7 cartes', () => {
    it('devrait choisir la couleur comme meilleure main', () => {
        const cartes = [
            creerCarte('A','♥'),
            creerCarte('J','♥'),
            creerCarte(9,'♥'),
            creerCarte(4,'♥'),
            creerCarte(2,'♣'),
            creerCarte(6,'♥'),
            creerCarte('K','♦')
        ];
        const resultat = evaluerMeilleureMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Couleur);
        expect(resultat.cartes.length).toBe(5);
        expect(resultat.cartes.every(c => c.couleur === '♥')).toBe(true);
    });

    it('devrait choisir un full comme meilleure main', () => {
        const cartes = [
            creerCarte(4,'♠'),
            creerCarte(4,'♥'),
            creerCarte(4,'♦'),
            creerCarte(9,'♣'),
            creerCarte(9,'♠'),
            creerCarte(2,'♠'),
            creerCarte('K','♦')
        ];
        const resultat = evaluerMeilleureMain(cartes);
        expect(resultat.categorie).toBe(CategorieMain.Full);
        expect(resultat.cartes.length).toBe(5);
    });

    it('devrait retourner une erreur', () => {
        const cartes = [
            creerCarte('A','♥'),
            creerCarte('J','♥'),
        ];
        expect(() => evaluerMeilleureMain(cartes)).toThrow("Au moins 5 cartes sont requises");
    });
});
