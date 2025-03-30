import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { CardList, CardListFilters, CardListList } from '../models';
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, query, QuerySnapshot, updateDoc, where } from '@angular/fire/firestore';
import _ from 'lodash';
import { FireHttpService, LoaderService, UserService } from '../../core';

const PATH = 'cardLists';

@Injectable({
  providedIn: 'root'
})
export class CardListService {
  private _firestore: Firestore;
  private _collection: CollectionReference;
  private httpService = inject(FireHttpService);

  constructor(
      private userService: UserService,
      private loaderService: LoaderService
  ) {
      this._firestore = inject(Firestore);
      this._collection = collection(this._firestore, PATH);
  }

  getAll(filters: CardListFilters): Observable<CardListList[]> {
    const _query = query(this._collection,
      where('user', '==', this.userService.userId()),
    );

    return this.httpService.run<CardListList[]>(
      from(getDocs(_query)).pipe(
        map((res: QuerySnapshot) => {
          const cards = res.docs.map((n) => this.createEntity(n));
          var regex = new RegExp(`${filters.name}`, 'gi');  
          return _.filter(cards, (c: CardListList) => regex.test(c.name));
        })
      )
    )
  }
  
  getById(id: string): Observable<CardList> {
    const docRef = doc(this._firestore, PATH, id);
    return this.httpService.run<CardList>( 
      from(getDoc(docRef)).pipe(
        map((res: DocumentSnapshot) => this.createEntity(res))
      )
    );
  }
  
  async update(entity: CardList) {
    entity.user = this.userService.userId();
    const docRef = doc(this._firestore, PATH, entity.id);
    return this.httpService.run<CardList>( 
      from(updateDoc(docRef, {...entity})).pipe(
        map((_) => this.createEntity(entity))
      )
    );
  }
  
  async create(entity: CardList) {
    return this.httpService.run<CardList>( 
      from(addDoc(this._collection, {...entity})).pipe(
        map((res: DocumentReference) => this.createEntity(res, res.id))
      )
    );
  }

  async delete(id: string) {
    const docRef = doc(this._firestore, PATH, id);
    return this.httpService.run<void>( 
      from(deleteDoc(docRef)).pipe(
        map((_) => true)
      )
    );
  }

  private createEntity(res: DocumentSnapshot | Partial<CardList>, id?: string): CardList {
    const d = res instanceof DocumentSnapshot ? res.data() ?? this.new() : res;
    d['id'] = res.id || id;
    return d as CardList;
  }

  new(): CardList {
    return {
      id: '',
      name: '',
      description: '',
      createdAt: '',
      updatedAt: '',
      cards: []
    };
  }
}
