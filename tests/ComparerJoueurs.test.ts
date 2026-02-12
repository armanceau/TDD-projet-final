import { describe, it, expect } from 'vitest';
import { comparerJoueurs } from '../src/domain/ComparerJoueurs.js';
import { creerCarte } from '../src/domain/CreerCarte.js';
import { CategorieMain } from '../src/domain/EvaluerMain.js';

describe('Comparateur de joueurs', () => {
    it('devrait retourner le joueur avec la meilleure categorie', () => {
        const board = [
            creerCarte('A','♥'),
            creerCarte('J','♥'),
            creerCarte(9,'♥'),
            creerCarte(4,'♥'),
            creerCarte(2,'♣')
        ];
        const joueurs = [
            { id: 'J1', cartes: [creerCarte(6,'♥'), creerCarte('K','♦')] },
            { id: 'J2', cartes: [creerCarte(2,'♦'), creerCarte(2,'♠')] }
        ];
        const resultat = comparerJoueurs(board, joueurs);
        expect(resultat.gagnants.length).toBe(1);
        expect(resultat.gagnants[0]?.joueur.id).toBe('J1');
        expect(resultat.gagnants[0]?.resultat.categorie).toBe(CategorieMain.Couleur);
    });

    it('devrait retourner une egalite quand les catégories sont identiques', () => {
        const board = [
            creerCarte(5,'♣'),
            creerCarte(6,'♦'),
            creerCarte(7,'♥'),
            creerCarte(8,'♠'),
            creerCarte(9,'♦')
        ];
        const joueurs = [
            { id: 'J1', cartes: [creerCarte('A','♣'), creerCarte('A','♦')] },
            { id: 'J2', cartes: [creerCarte('K','♣'), creerCarte('Q','♦')] }
        ];
        const resultat = comparerJoueurs(board, joueurs);
        const ids = resultat.gagnants.map(g => g.joueur.id).sort();
        expect(ids).toEqual(['J1', 'J2']);
    });

    it('devrait retourner une erreur quand il n y a pas assez de carte sur le board', () => {
        const board = [
            creerCarte(5,'♣'),

            creerCarte(9,'♦')
        ];
        const joueurs = [
            { id: 'J1', cartes: [creerCarte('A','♣'), creerCarte('A','♦')] },
            { id: 'J2', cartes: [creerCarte('K','♣'), creerCarte('Q','♦')] }
        ];
        expect(() => comparerJoueurs(board, joueurs)).toThrow('Le board doit contenir 5 cartes');
    });

    it('devrait retourner une erreur quand il n y a pas de joueur', () => {
        const board = [
            creerCarte(5,'♣'),
            creerCarte(6,'♦'),
            creerCarte(7,'♥'),
            creerCarte(8,'♠'),
            creerCarte(9,'♦')
        ];
        expect(() => comparerJoueurs(board, [])).toThrow('Aucun joueur fourni');
    });

    it('devrait departager deux suites par la hauteur', () => {
        const board = [
            creerCarte(2,'♣'),
            creerCarte(3,'♦'),
            creerCarte(4,'♥'),
            creerCarte(5,'♠'),
            creerCarte('K','♦')
        ];
        const joueurs = [
            { id: 'J1', cartes: [creerCarte('A','♣'), creerCarte(9,'♠')] },
            { id: 'J2', cartes: [creerCarte(6,'♣'), creerCarte(7,'♣')] }
        ];
        const resultat = comparerJoueurs(board, joueurs);
        expect(resultat.gagnants.length).toBe(1);
        expect(resultat.gagnants[0]?.joueur.id).toBe('J2');
        expect(resultat.gagnants[0]?.resultat.categorie).toBe(CategorieMain.Suite);
    });

    it('devrait gerer l egalite sur une suite du board', () => {
        const board = [
            creerCarte(5,'♣'),
            creerCarte(6,'♦'),
            creerCarte(7,'♥'),
            creerCarte(8,'♠'),
            creerCarte(9,'♦')
        ];
        const joueurs = [
            { id: 'J1', cartes: [creerCarte('A','♣'), creerCarte('A','♦')] },
            { id: 'J2', cartes: [creerCarte('K','♣'), creerCarte('Q','♦')] }
        ];
        const resultat = comparerJoueurs(board, joueurs);
        const ids = resultat.gagnants.map(g => g.joueur.id).sort();
        expect(ids).toEqual(['J1', 'J2']);
    });

    it("devrait departager deux paires par la valeur de la paire", () => {
        const board = [
            creerCarte(2, "♣"),
            creerCarte(5, "♦"),
            creerCarte(7, "♥"),
            creerCarte("J", "♠"),
            creerCarte("K", "♦"),
        ];
        const joueurs = [
            { id: "J1", cartes: [creerCarte(9, "♣"), creerCarte(9, "♦")] },
            { id: "J2", cartes: [creerCarte(8, "♣"), creerCarte(8, "♦")] },
        ];
        const resultat = comparerJoueurs(board, joueurs);
        expect(resultat.gagnants.length).toBe(1);
        expect(resultat.gagnants[0]?.joueur.id).toBe("J1");
        expect(resultat.gagnants[0]?.resultat.categorie).toBe(CategorieMain.Paire);
    });

    it("devrait departager une paire par les kickers", () => {
        const board = [
            creerCarte(9, "♠"),
            creerCarte(9, "♥"),
            creerCarte(2, "♣"),
            creerCarte(5, "♦"),
            creerCarte(7, "♣"),
        ];
        const joueurs = [
            { id: "J1", cartes: [creerCarte("A", "♠"), creerCarte("K", "♦")] },
            { id: "J2", cartes: [creerCarte("Q", "♠"), creerCarte("J", "♦")] },
        ];
        const resultat = comparerJoueurs(board, joueurs);
        expect(resultat.gagnants.length).toBe(1);
        expect(resultat.gagnants[0]?.joueur.id).toBe("J1");
        expect(resultat.gagnants[0]?.resultat.categorie).toBe(CategorieMain.Paire);
    });

    it("devrait departager deux doubles paires", () => {
        const board = [
            creerCarte(2, "♣"),
            creerCarte(2, "♦"),
            creerCarte(5, "♥"),
            creerCarte(7, "♠"),
            creerCarte(9, "♦"),
        ];
        const joueurs = [
            { id: "J1", cartes: [creerCarte(9, "♣"), creerCarte(7, "♦")] },
            { id: "J2", cartes: [creerCarte(9, "♥"), creerCarte(5, "♣")] },
        ];
        const resultat = comparerJoueurs(board, joueurs);
        expect(resultat.gagnants.length).toBe(1);
        expect(resultat.gagnants[0]?.joueur.id).toBe("J1");
        expect(resultat.gagnants[0]?.resultat.categorie).toBe(
            CategorieMain.DeuxPaires,
        );
    });
});
