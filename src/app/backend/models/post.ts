import { Card } from "./card";

export interface PostList {
    id: string;
    name: string;
    createdAt: string;
    modifiedAt: string;
}

export interface Post extends PostList {
    cards: Card[];
}