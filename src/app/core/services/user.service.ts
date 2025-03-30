import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Auth, signOut, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  actualUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.actualUser())
  avatar = computed(() => {
    if (this.isLoggedIn()) {
      return `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${this.actualUser()?.uid[0]}`
    }
    return `assets/default-user.jpg`;
  })

  userId = computed(() => this.actualUser()?.uid)

  constructor(
    private auth: Auth
  ) {
    this.auth.onAuthStateChanged((userResult => {
      this.actualUser.set(userResult);
    }))
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }
}