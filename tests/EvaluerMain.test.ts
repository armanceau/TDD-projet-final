import { describe, it, expect } from 'vitest';
import { detecterMain, CategorieMain } from '../src/domain/EvaluerMain.js';
import { creerCarte } from '../src/domain/CreerCarte.js';

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
            creerCarte('Q', '♥'),
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
});
