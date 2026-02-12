# TDD-projet-final

Evaluateur et comparateur de mains Texas Hold'em (TDD).

## Fonctionnement

- `detecterMain(cartes)` : détecte la catégorie sur 5 cartes.
- `evaluerMeilleureMain(cartes)` : choisit la meilleure main de 5 cartes parmi 5 à 7 cartes.
- `comparerJoueurs(board, joueurs)` : évalue chaque joueur et retourne les gagnants (égalités possibles).

## Ordre des cartes

Les 5 cartes retournées dans `ResultatMain.cartes` sont ordonnées pour rendre les tests déterministes :

- Quinte / Quinte flush : de la plus haute à la plus basse (cas As bas = 5,4,3,2,A).
- Carre : les 4 cartes du carré puis le kicker.
- Full : brelan puis paire.
- Couleur : ordre décroissant.
- Brelan : brelan puis deux kickers décroissants.
- Deux paires : paire haute, paire basse, kicker.
- Paire : paire puis trois kickers décroissants.
- Carte haute : 5 cartes décroissantes.

## Hypothèses d'entrée

- Les cartes en double ne sont pas gérées (on suppose les entrées valides).
- Le board doit contenir exactement 5 cartes.
- Chaque joueur doit fournir exactement 2 cartes.

## Tests

```bash
npm test
```

## Auteur

[MANCEAU Arthur 🙉](https://www.linkedin.com/in/arthur-manceau/)
