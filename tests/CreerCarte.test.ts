import { describe, it, expect } from 'vitest';
import { creerCarte } from '../src/domain/CreerCarte.js';

describe('Création de carte', () => {
    it('devrait créer une carte correctement', () => {
        const carte = creerCarte(5, '♠');
        expect(carte.rang).toBe(5);
        expect(carte.couleur).toBe('♠');
    });

    it('devrait créer un As correctement', () => {
        const carte = creerCarte('A', '♥');
        expect(carte.rang).toBe('A');
        expect(carte.couleur).toBe('♥');
    });
});
