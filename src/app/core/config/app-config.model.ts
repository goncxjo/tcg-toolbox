export interface AppConfig {
	ENVIRONMENT_NAME: string;
	CARD_TRADER_API_BASE_URL: string;
	CARD_TRADER_API_JWT_TOKEN: string;
	CARD_TRADER_API_GAME_ID: number;
	CARD_TRADER_API_CATEGORY_ID: number;
	TCG_PLAYER_API_SEARCH_ENDPOINT: string;
	TCG_PLAYER_API_PRODUCT_ENDPOINT: string;
	TCG_PLAYER_API_PRICE_ENDPOINT: string;
	TCG_PLAYER_API_IMAGE_ENDPOINT: string;
	TCG_PLAYER_API_IMAGE_EXPANSION_ENDPOINT: string;
	TCG_PLAYER_PRODUCT_URL: string;
	DOLAR_API_BASE_URL: string;
	CRYPTO_SECRET_KEY: string;
	FIREBASE_PROJECT_ID: string;
	FIREBASE_APP_ID: string;
	FIREBASE_STORAGE_BUCKET: string;
	FIREBASE_API_KEY: string;
	FIREBASE_AUTH_DOMAIN: string;
	FIREBASE_MESSAGING_SENDER_ID: string;
	FIREBASE_MEASUREMENT_ID: string;
	ADVERTISING_BANNER_HIDDEN: boolean;
	appVersion: string;
	production: boolean;
}
