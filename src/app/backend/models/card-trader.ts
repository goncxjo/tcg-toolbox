export interface ExpansionCardTrader {
	id: number;
	game_id: number;
	code: string;
	name: string;
}
 
export interface BlueprintCardTrader {
	id: number;		
	name: string;
	version: string;
	game_id: number;		
	category_id: number;		
	expansion_id: number;		
	image_url: string;
	editable_properties: any;
	fixed_properties: any;
	scryfall_id: string;
	card_market_id: string;
	tcg_player_id: string;
}

export interface ProductCardTrader {
	id: number;
	blueprint_id: number;
	name_en: string;
	quantity: number;
	price: ProductPriceCardTrader;
	description: string;
	properties_hash: object;
	expansion: any;
	user: any;
	graded: boolean;
	on_vacation: boolean;
	bundle_size: number;
};

export interface ProductPriceCardTrader {
	cents: number;
	currency: string;
	currency_symbol: string;
	formatted: string;
}