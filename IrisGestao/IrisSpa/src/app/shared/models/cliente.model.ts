import { ClienteTipo } from "./cliente-tipo.model";

export class Cliente {

    constructor(
        public guidReferencia: string,
        public DataNascimento?: Date,
        public CpfCnpj?: string,
        public nome?: string,
        public telefone?: string,
        public email?: string,
        public cep?: string,
        public estado?: string,
        public cidade?: string,
        public bairro?: string,
        public endereco?: string,
        public idTipoClienteNavigation?: ClienteTipo,
    ) { }
}

export type ClienteType = {
    TipoCliente: number;
    CpfCnpj: string;
    DataNascimento: string;
    Nome: string;
    Telefone: string;
    Email: string;
    Cep: string;
    Endereco: string;
    Bairro: string;
    Cidade: string;
    Estado: string;
};
