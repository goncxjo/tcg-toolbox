export function createTcgPlayerQuery(productId: number = 0, filters: FiltersTcgPlayerQuery, page: number = 1, pageSize: number = 20): any {
	const query: any = {
		algorithm: "revenue_dismax",
		from: (page-1)*pageSize,
		size: 20,
		filters: {
		  term: {
			productLineName: [],
			productTypeName: [],
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

	  if(filters.expansions) {
		query.filters.term.setName = filters.expansions;
	  }

	  if(filters.productLineName) {
		query.filters.term.productLineName = filters.productLineName;
	  }
	  	  
	  if(filters.productTypeName) {
		query.filters.term.productTypeName = filters.productTypeName;
	  }
	  	  
	  if(filters.categories) {
		query.filters.term.cardType = filters.categories;
	  }
	  
	  if(filters.colors) {
		query.filters.term.color = filters.colors;
	  }

	  if(filters.rarities) {
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
