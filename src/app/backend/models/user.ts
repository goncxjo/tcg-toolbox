import { DocumentEntity } from "./document";

export interface User extends DocumentEntity {
    username: string;
}