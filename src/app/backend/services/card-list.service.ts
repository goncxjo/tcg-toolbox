import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { CardList, CardListFilters, CardListList } from '../models';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, Firestore, query, QueryConstraint, updateDoc, where } from '@angular/fire/firestore';
import _ from 'lodash';
import { LoaderService, UserService } from '../../core';

const PATH = 'cardLists';

@Injectable({
  providedIn: 'root'
})
export class CardListService {
  private _firestore: Firestore;
  private _collection: CollectionReference;

  constructor(
      private userService: UserService,
      private loaderService: LoaderService
  ) {
      this._firestore = inject(Firestore);
      this._collection = collection(this._firestore, PATH);
  }

  getAll(filters: CardListFilters): Observable<CardListList[]> {
    const queries: QueryConstraint[] = [
      where('user', '==', this.userService.getUserId()),
    ]

    const res = collectionData(
      query(this._collection, ...queries
    ), { idField: "id" }) as Observable<CardListList[]>;

    return res.pipe(
      tap(() => this.loaderService.show()),
      map((cards: CardListList[]) => {
        var regex = new RegExp(`${filters.name}`, 'gi');  
        return _.filter(cards, (c: CardListList) => regex.test(c.name));
      }),
      tap(() => this.loaderService.hide()),
    );
  }
  
  getById(id: string): Observable<CardList> {
    const docRef = doc(this._firestore, PATH, id);
    return docData(docRef, { idField: "id" }) as Observable<CardList>;
  }
  
  async update(entity: CardList) {
    entity.user = this.userService.getUserId();
    const docRef = doc(this._firestore, PATH, entity.id);
    return updateDoc(docRef, { ...entity });
  }
  
  async create(doc: CardList) {
    doc.user = this.userService.getUserId();
    return await addDoc(this._collection, doc);
  }

  async delete(id: string) {
    const docRef = doc(this._firestore, PATH, id);
    return await deleteDoc(docRef);
  }

  new(): Observable<CardList> {
    return of<CardList>({
      id: '',
      name: '',
      description: '',
      createdAt: '',
      updatedAt: '',
      cards: []
    });
  }
}
