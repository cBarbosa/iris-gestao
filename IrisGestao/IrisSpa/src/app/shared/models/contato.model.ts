export type Contato =
	| {
			nome: string;
			cargo?: string;
			email?: string;
			telefone?: string;
			dataNascimento?: string;
			dataCriacao: string;
			dataAtualização?: string;
			guidReferenciaContato?: string;
			guidReferencia?: never;
			guidClienteReferencia: string;
	  }
	| {
			nome: string;
			cargo?: string;
			email?: string;
			telefone?: string;
			dataNascimento?: string;
			dataCriacao: string;
			dataAtualização?: string;
			guidReferenciaContato?: never;
			guidReferencia?: string;
			guidClienteReferencia: string;
	  };
