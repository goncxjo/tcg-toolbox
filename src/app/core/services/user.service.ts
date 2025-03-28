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

  getAvatar() {
    if (!this.auth.currentUser) {
      return `assets/default-user.jpg`;
    }
    return `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${this.auth.currentUser.uid[0]}`
  }

  getUserId() {
    return this.auth.currentUser?.uid;
  }

  isLoggedIn() {
    return !!this.auth.currentUser
  }
}