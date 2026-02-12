import { describe, it, expect } from 'vitest';
import { detecterCarteHaute } from '../src/domain/EvaluerMain.js';
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
        const resultat = detecterCarteHaute(cartes);
        expect(resultat.carteHaute.rang).toBe(10);
    });

    it('devrait retourner l’As comme carte haute', () => {
        const cartes = [
            creerCarte('J', '♠'),
            creerCarte('Q', '♥'),
            creerCarte('K', '♦'),
            creerCarte('A', '♣'),
            creerCarte(10, '♠')
        ];
        const resultat = detecterCarteHaute(cartes);
        expect(resultat.carteHaute.rang).toBe('A');
    });

    it('devrait lancer une erreur si main vide', () => {
        expect(() => detecterCarteHaute([])).toThrow("Aucune carte fournie");
    });
});


