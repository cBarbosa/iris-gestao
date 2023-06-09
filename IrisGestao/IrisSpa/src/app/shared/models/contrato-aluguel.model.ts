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
	prazoDesconto: number;
	dataInicioContrato: string;
	prazoTotalContrato: number;
	dataOcupacao: string;
	diaVencimentoAluguel: number;
	dataVencimentoPrimeraParcela: string;
	periodicidadeReajuste: number;
	lstImoveis: {
		guidImovel: string;
		lstUnidades: string[];
	}[];
};
