export type Fornecedor = {
	guidReferencia: string;
	nome: string;
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
		conta: number;
		chavePix: string;
		dataCriacao: string;
	};
	contato?: {
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
