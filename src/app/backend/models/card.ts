import * as uuid from 'uuid';
import { CardPriceTcgPlayer } from './tcg-player';

export class Card {
	id: string = uuid.v4();		
	name: string = '';
	fullName: string = '';
	expansion_id: number = 0;		
	image_small_url: string = '';
	image_url: string = '';
	card_trader_id: number | null = null;
	card_market_id: number | null = null;
	tcg_player_id: number | null = null;
	rarity_code: string = '';
	rarity_name: string = '';
	code: CardCode = new CardCode();
	expansion_name: string = '';
	tcg_player_url: string = '';
	price: CardPrice = new CardPrice();
	selectedPrice: string = 'custom';
	prices: Map<string, CardPrice | null> = new Map<string, CardPrice | null>();
	multiplier: number = 1;
	releaseDate: Date | null = null;
	infoReduced: boolean = true;
	image_base64: Blob | null = null;

	constructor() {
		this.prices.set("custom", new CardPrice());
	}

	setFromTcgPlayer(res: any, imageEndpoint: string, productUrl: string) {
		const cardId = `${res.productId}`.replace('.0', '');
		const [number_, rarity_code] = (res.customAttributes.number || '- -').split(" ");
		const preReleaseSuffix = res.setName.includes('Pre-Release') ? `(Pre-Release)`: '';
		const fullName = res.productName
			.replace(number_, '')
			.replace(' - ', '')
			.replace('[-]', '')
		;

		this.name = `${fullName} ${preReleaseSuffix}`;
		this.fullName = `[${number_}] ${this.name}`;
		this.expansion_id = res.setId;
		this.tcg_player_id = parseInt(cardId);
		this.rarity_code = rarity_code;
		this.rarity_name = res.rarityName;
		this.code = new CardCode(number_);
		this.expansion_name = res.setName;
		this.image_small_url = imageEndpoint.replace('{quality}', '1').replace('{id}', cardId);
		this.image_url = imageEndpoint.replace('{quality}', '100').replace('{id}', cardId);
		this.tcg_player_url = `${productUrl}`.replace('{id}', cardId);
		this.releaseDate = new Date(res.customAttributes.releaseDate);
	}


	changeMultiplier(i: number) {
		if (this.multiplier + i >= 1) {
			this.multiplier += i;
		}
	}

	exportEntity() {
		const model = {
			tcg_player_id: this.tcg_player_id,
			code: this.code.default,
			multiplier: this.multiplier,
			customPrice: this.prices.get('custom')
		} as CardExport;
		return model;
	}

	exportString() {
		const model = this.exportEntity();
		const customPrice: string = `${model.customPrice?.currency_symbol} ${model.customPrice?.currency_value}`
		return `${model.tcg_player_id}_${model.code}_${model.multiplier}_${customPrice}`;
	}

	mapExportToEntity(value: string) {
		try {
			const [tcg_player_id, code, multiplier, customPriceString] = value.split('_');
			const customPrice = new CardPrice();
			customPrice.setPrice(customPriceString);
	
			this.tcg_player_id = parseInt(tcg_player_id);
			this.code = new CardCode(code);
			this.multiplier = parseInt(multiplier);
			this.prices.set('custom', customPrice);
				
		} catch (error) {
			console.log(`error al mapear #${value}`)
		}
	}

	getPrecioOrDefault() {
		if (this.selectedPrice) {
			return this.prices.get(this.selectedPrice);
		}
		else {
			let precio: CardPrice | null = new CardPrice();
			this.prices.forEach(price => {
				if (!precio?.currency_value && price?.currency_value) {
					precio = price;
				}
			});
			return precio;
		}
	  }
}

export class CardPrices {
	tcg_player: CardPriceTcgPlayer = {} as CardPriceTcgPlayer;
	custom: CardPrice = new CardPrice();
}

export class CardPrice {
	currency_value: number;
	currency_symbol: string;

	constructor(symbol: string = 'ARS', value: number = 0) {
		this.currency_symbol = symbol;		
		this.currency_value = value;		
	}

	setPrice(price: string) {
		const [symbol, value] = price.split(' ');
		this.currency_value = parseFloat(value);
		this.currency_symbol = symbol;
	}
}

export class CardCode {
	expansion_code: string = '';
	id: number = 0;
	default = '-';

	constructor(code: string = '-') {
		this.default = code;
		if (code != '-') {
			const card_code = code.split('-');
			this.expansion_code = card_code[0];
			this.id = parseInt(card_code[1] || '0');
		}
	}

	get value() {
		return `${this.expansion_code}-${this.id}`.toLocaleUpperCase();
	}
}

export interface CardExport {
	tcg_player_id: number;
	code: string;
	selectedPrice: string;
	customPrice: CardPrice;
	multiplier: number;
}
