import { DocumentEntity } from "./document";

export interface CardListList extends DocumentEntity {
    name: string;
    user?: string;
}

export interface CardList extends CardListList {
    description: string;
    cards: CardForm[];
}

export interface CardForm {
    tcgPlayerId: number;
    qty: number;
}

export interface CardListFilters {
    name: string;
}