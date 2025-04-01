import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from "@angular/common/http";
import { AppConfig } from "./app-config.model";
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {

    private httpClient!: HttpClient;
    private jsonFile = `./assets/config/environment.json`;
    private exampleDataFile = `./assets/config/example_data.json`;

    config!: AppConfig;

    // NOTA: sin esto, no andaba
    constructor(private handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
     }
    
    public load() {
        return new Promise<void>((resolve, reject) => {
            this.config = this.InitAppConfig();
            resolve();
        });
    }

    public getExampleData(): Observable<Object> {
        return this.httpClient.get(this.exampleDataFile);
    }

    // TODO: esto está por el AuthModule, ya que el método load no llega a traerle la data.
    // ver si es posible evitar esto.
    getPromise(): Observable<AppConfig> {
        return this.httpClient.get<AppConfig>(this.jsonFile || "{}");
    }

    get() {
        return this.config || {};
    }

    InitAppConfig(): AppConfig {
        return {
            ENVIRONMENT_NAME: environment.ENVIRONMENT_NAME,
            CARD_TRADER_API_BASE_URL: environment.CARD_TRADER_API_BASE_URL,
            CARD_TRADER_API_JWT_TOKEN: environment.CARD_TRADER_API_JWT_TOKEN,
            CARD_TRADER_API_GAME_ID: environment.CARD_TRADER_API_GAME_ID,
            CARD_TRADER_API_CATEGORY_ID: environment.CARD_TRADER_API_CATEGORY_ID,
            TCG_PLAYER_API_SEARCH_ENDPOINT: environment.TCG_PLAYER_API_SEARCH_ENDPOINT,
            TCG_PLAYER_API_PRODUCT_ENDPOINT: environment.TCG_PLAYER_API_PRODUCT_ENDPOINT,
            TCG_PLAYER_API_PRICE_ENDPOINT: environment.TCG_PLAYER_API_PRICE_ENDPOINT,
            TCG_PLAYER_API_IMAGE_ENDPOINT: environment.TCG_PLAYER_API_IMAGE_ENDPOINT,
            TCG_PLAYER_API_IMAGE_EXPANSION_ENDPOINT: environment.TCG_PLAYER_API_IMAGE_EXPANSION_ENDPOINT,
            TCG_PLAYER_PRODUCT_URL: environment.TCG_PLAYER_PRODUCT_URL,
            DOLAR_API_BASE_URL: environment.DOLAR_API_BASE_URL,
            CRYPTO_SECRET_KEY: environment.CRYPTO_SECRET_KEY,
            FIREBASE_PROJECT_ID: environment.FIREBASE_PROJECT_ID,
            FIREBASE_APP_ID: environment.FIREBASE_APP_ID,
            FIREBASE_STORAGE_BUCKET: environment.FIREBASE_STORAGE_BUCKET,
            FIREBASE_API_KEY: environment.FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: environment.FIREBASE_AUTH_DOMAIN,
            FIREBASE_MESSAGING_SENDER_ID: environment.FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_MEASUREMENT_ID: environment.FIREBASE_MEASUREMENT_ID,
            ADVERTISING_BANNER_HIDDEN: environment.ADVERTISING_BANNER_HIDDEN,
            appVersion: environment.appVersion,
            production: environment.production,
        }
    }
}
