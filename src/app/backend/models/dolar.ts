export interface Dolar {
	compra: number;
	venta: number;
	casa: string;
	nombre: string;
	fechaActualizacion: string;
}

export interface DivisasBluelytics {
	oficial: DivisaValoresBluelytics;
    blue: DivisaValoresBluelytics;
    oficial_euro: DivisaValoresBluelytics;
    blue_euro: DivisaValoresBluelytics;
    last_update: string;
}

export interface DivisaValoresBluelytics {
	value_avg: number;
	value_sell: number;
	value_buy: number;
}
