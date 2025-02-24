import { CardPrice } from "./card";

export interface SearchTcgPlayer {
    errors: any[];
    results: SearchResultTcgPlayer[];
}

export interface SearchResultTcgPlayer {
	aggregations: any;
	algorithm: string;
	searchType: string;
	didYouMean: any;
	totalResults: number;
	resultId: string;
	results: SearchProductResultTcgPlayer[];
}

export interface SearchProductResultTcgPlayer {
	shippingCategoryId: number;
	duplicate: boolean;
	productLineUrlName: string;
	productUrlName: string;
	productTypeId: number;
	rarityName: string;
	sealed: boolean;
	marketPrice: number;
	customAttributes: any;
	lowestPriceWithShipping: number;
	productName: string;
	setId: number;
	productId: number;
	score: number;
	setName: string;
	foilOnly: boolean;
	setUrlName: string;
	sellerListable: boolean;
	totalListings: number;
	productLineId: number;
	productStatusId: number;
	productLineName: string;
	maxFulfillableQuantity: number;
	listings: any;
	lowestPrice: number;
}

export interface ProductDetailsTcgPlayer {
    customListings: number;
    shippingCategoryId: number;
    duplicate: boolean;
    productLineUrlName: string;
    productTypeName: string;
    productUrlName: string;
    productTypeId: number;
    rarityName: string;
    sealed: boolean;
    marketPrice: number;
    customAttributes: any;
    lowestPriceWithShipping: number;
    productName: string;
    setId: number;
    setCode: string;
    productId: number;
    imageCount: number;
    score: number;
    setName: string;
    sellers: number;
    foilOnly: boolean;
    setUrlName: string;
    sellerListable: boolean;
    productLineId: number;
    productStatusId: number;
    productLineName: string;
    maxFulfillableQuantity: number;
    normalOnly: boolean;
    listings: number;
    lowestPrice: number;
    formattedAttributes: any;
}

export interface ProductPriceTcgPlayer {
	printingType: string;
	marketPrice: number;
	buylistMarketPrice: number;
	listedMedianPrice: number;
}

export interface CardPriceTcgPlayer {
	tcg_player_normal: CardPrice | null,
	tcg_player_foil: CardPrice | null
}

export interface ExpansionTcgPlayer {
	abbreviation: string; 
	active: string; 
	categoryId: number; 
	cleanSetName: string; 
	name: string; 
	releaseDate: string; 
	setNameId: number; 
	urlName: string; 
}

export enum CardPriceTcgPlayerType {
	MARKET_PRICE = 'market_price',
	LISTED_MEDIAN_PRICE = 'listed_median_price'
}