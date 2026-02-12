import {CategorieMain} from "../constant/CategorieMainEnum.js";
import {Carte} from "./Carte.js";

export interface ResultatMain {
    categorie: CategorieMain;
    cartes: Carte[];
}