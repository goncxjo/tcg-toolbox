import { inject, Injectable } from '@angular/core';
import { finalize, map, Observable, of, take, tap } from 'rxjs';
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
    this.loaderService.show();
    const queries: QueryConstraint[] = [
      where('user', '==', this.userService.getUserId()),
    ]

    const res = collectionData(
      query(this._collection, ...queries
    ), { idField: "id" }) as Observable<CardListList[]>;

    return res.pipe(
      take(1),
      map((cards: CardListList[]) => {
        var regex = new RegExp(`${filters.name}`, 'gi');  
        return _.filter(cards, (c: CardListList) => regex.test(c.name));
      }),
      finalize(() => this.loaderService.hide())
    );
  }
  
  getById(id: string): Observable<CardList> {
    const docRef = doc(this._firestore, PATH, id);
    const res = docData(docRef, { idField: "id" }) as Observable<CardList>;
    return res;
  }
  
  async update(entity: CardList) {
    this.loaderService.show();
    entity.user = this.userService.getUserId();
    const docRef = doc(this._firestore, PATH, entity.id);
    const res = updateDoc(docRef, { ...entity });
    this.loaderService.hide();
    return res;
  }
  
  async create(doc: CardList) {
    this.loaderService.show();
    doc.user = this.userService.getUserId();
    const res = await addDoc(this._collection, doc);
    this.loaderService.hide();
    return res;
  }

  async delete(id: string) {
    this.loaderService.show();
    const docRef = doc(this._firestore, PATH, id);
    const res = await deleteDoc(docRef);
    this.loaderService.hide();
    return res;
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
