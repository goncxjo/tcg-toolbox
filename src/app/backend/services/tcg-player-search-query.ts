import _, { Dictionary } from "lodash";

let nameMappings: Dictionary<string> = {};
nameMappings["digimon"] = "digimon-card-game";
nameMappings["one-piece"] = "one-piece-card-game";
nameMappings["yu-gi-oh"] = "yugioh";
nameMappings["magic"] = "magic";
nameMappings["pokemon"] = "pokemon";


export function createTcgPlayerQuery(productId: number = 0, filters: FiltersTcgPlayerQuery, page: number = 1, pageSize: number = 20): any {
	const query: any = {
		algorithm: "revenue_dismax",
		from: (page - 1) * pageSize,
		size: 20,
		filters: {
			term: {
				productLineName: [
					nameMappings["digimon"],
					nameMappings["one-piece"],
					nameMappings["yu-gi-oh"],
					nameMappings["magic"],
					nameMappings["pokemon"]
				],
				productTypeName: ['Cards'],
			},
			range: {},
			match: {},
		},
		listingSearch: {
			context: { cart: {} },
			filters: {
				term: { sellerStatus: "Live", channelId: 0 },
				range: { quantity: { gte: 1 } },
				exclude: { channelExclusion: 0 },
			},
		},
		context: { cart: {}, shippingCountry: "US" },
		settings: { useFuzzySearch: true, didYouMean: {} },
		sort: {},
	};

	if (productId !== 0) {
		query.filters.term.productId = `${productId}`;
	}

	if (filters.expansions) {
		query.filters.term.setName = filters.expansions;
	}

	if (filters.productLineName.length) {
		query.filters.term.productLineName = _.map(filters.productLineName, (g: string) => nameMappings[g]);
	}

	if (filters.productTypeName) {
		query.filters.term.productTypeName = filters.productTypeName
	}

	if (filters.categories) {
		query.filters.term.cardType = filters.categories;
	}

	if (filters.colors) {
		query.filters.term.color = filters.colors;
	}

	if (filters.rarities) {
		query.filters.term.rarityName = filters.rarities;
	}

	return query;
}

export interface FiltersTcgPlayerQuery {
	expansions: string[],
	categories: string[],
	colors: string[],
	rarities: string[],
	isPreRelease: boolean,
	productLineName: string[]
	productTypeName: string[]
}
