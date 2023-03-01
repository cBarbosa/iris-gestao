export type ContratoAluguel = {
	guidCliente: string;
	idTipoCreditoAluguel: number;
	idIndiceReajuste: number;
	idTipoContrato: number;
	numeroContrato: string;
	valorAluguel: number;
	percentualRetencaoImpostos: number;
	percentualDescontoAluguel: number;
	carenciaAluguel: boolean;
	prazoCarencia: number;
	dataInicioContrato: string;
	prazoTotalContrato: number;
	dataOcupacao: string;
	diaVencimentoAluguel: number;
	periodicidadeReajuste: number;
	lstImoveis: {
		guidImovel: string;
		lstUnidades: string[];
	}[];
};
