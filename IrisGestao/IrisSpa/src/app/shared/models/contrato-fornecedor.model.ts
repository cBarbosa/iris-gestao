export type ContratoFornecedor = {
	numeroContrato: string;
	percentual: number;
	dataAtualizacao: string;
	valorServicoContratado: number;
	dataInicioContrato: string;
	prazoTotalMeses: number;
	dataFimContrato: string;
	diaPagamento: number;
	periodicidadeReajuste: number;
	guidReferencia: string;
	dataCriacao: string;
	dataAtualização: string;
	status: boolean;
	descricaoServico: string;
	exibirAlertaVencimento: boolean;
	imgCapa: string;
	imagens: {
		thumbUrl: string;
		url: string;
	}[];
	anexos: {
		nome: string;
		tipo: number;
		fileName: string;
		uri: string;
	}[];
	imovel: {
		guidReferencia: string;
		nome: string;
		numCentroCusto: number;
		status: boolean;
		areaTotal: number;
		areaUtil: number;
		areaHabitese: number;
		nroUnidades: number;
		imovelEndereco: [
			{
				idImovel: number;
				rua: string;
				complemento: string;
				bairro: string;
				cidade: string;
				uf: string;
				cep: number;
				dataCriacao: string;
				dataUltimaModificacao: string;
				id: number;
			}
		];
		idCategoriaImovelNavigation: {
			id: number;
			nome: string;
		};
	};
	indiceReajuste: {
		id: number;
		nome: string;
		percentual: number;
		dataAtualizacao: string;
	};
	formaPagamento: {
		id: number;
		nome: string;
	};
	fornecedor: {
		guidReferencia: string;
		nome: string;
		cpfCnpj: string;
		razaoSocial: string;
		dataUltimaModificacao: string;
		dataCriacao: string;
		cep: number;
		endereco: string;
		bairro: string;
		cidade: string;
		estado: string;
		dadoBancario: {
			agencia: number;
			operacao: number;
			dadoBancario: string;
			conta: number;
			chavePix: string;
			dataCriacao: string;
		};
		contato: {
			nome: string;
			cargo: string;
			email: string;
			telefone: string;
			dataNascimento: string;
			dataCriacao: string;
			dataAtualização: string;
			guidReferenciaContato: string;
		}[];
	};
};
