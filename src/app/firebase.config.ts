import { FirebaseOptions } from '@angular/fire/app';
import { environment } from '../environments/environment';

export const firebaseConfig: FirebaseOptions = {
    projectId: environment.FIREBASE_PROJECT_ID,
    appId: environment.FIREBASE_APP_ID,
    storageBucket: environment.FIREBASE_STORAGE_BUCKET,
    apiKey: environment.FIREBASE_API_KEY,
    authDomain: environment.FIREBASE_AUTH_DOMAIN,
    messagingSenderId: environment.FIREBASE_MESSAGING_SENDER_ID,
    measurementId: environment.FIREBASE_MEASUREMENT_ID,
};