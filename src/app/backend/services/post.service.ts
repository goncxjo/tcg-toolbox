import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post, PostList } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseRoute: string;

  constructor(
      private httpClient: HttpClient,
  ) {
      this.baseRoute = 'http://localhost:3000';
  }

  getAll(): Observable<PostList[]> {
      const url = `${this.baseRoute}/posts`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.httpClient.get<PostList[]>(url, { headers: headers });
  }

  getById(id: string): Observable<Post> {
      const url = `${this.baseRoute}/posts/${id}`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.httpClient.get<Post>(url, { headers: headers });
  }

  new(): Observable<Post> {
    return of<Post>({
      id: '',
      name: '',
      createdAt: '',
      modifiedAt: '',
      cards: []
    });
  }
}
