import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AppConfig } from "./app-config.model";
import { Observable } from 'rxjs';

@Injectable()
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
    getPromise() {
        return this.httpClient.get(this.jsonFile);
    }

    get() {
        return this.config;
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
            TCG_PLAYER_PRODUCT_URL: environment.TCG_PLAYER_PRODUCT_URL,
            DOLAR_API_BASE_URL: environment.DOLAR_API_BASE_URL,
            CRYPTO_SECRET_KEY: environment.CRYPTO_SECRET_KEY,
            appVersion: environment.appVersion,
            production: environment.production,
        }
    }
}
