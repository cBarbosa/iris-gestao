import { ReportSupplyContractsRoutingModule } from "src/app/pages/report/report-supply-contracts/report-supply-contracts-routing.module";

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
	//diaVencimentoAluguel: number;
	dataVencimentoPrimeraParcela: string;
	periodicidadeReajuste: number;
	lstImoveis: {
		guidImovel: string;
		lstUnidades: string[];
	}[];
	lstImoveisVinculados: {
		guidImovel: String;
		idContratoImovel: number;
		lstUnidades: {
			idContratoUnidade: number;
			guidUnidade: string;
			ativo: boolean
		}[];
	}[]; 
};
