import { Injectable } from '@angular/core';
import { Auth, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: Auth
  ) {}

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  getUserName() {
    return this.auth.currentUser?.displayName ?? 'Invitado'
  }

  getUserPicture() {
    return this.auth.currentUser?.photoURL
  }

  getCurrentUser() {
    return this.auth.currentUser ?? {
      displayName: 'Invitado',
      photoURL: `assets/default-user.jpg`
    };
  }

  getUserId() {
    return this.auth.currentUser?.uid;
  }

  isLoggedIn() {
    return !!this.auth.currentUser
  }
}