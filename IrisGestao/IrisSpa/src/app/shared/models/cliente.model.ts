import { ClienteTipo } from "./cliente-tipo.model";

export class Cliente {

    constructor(
        public guidReferencia: string,
        public cpfCnpj?: string,
        public nome?: string,
        public cep?: string,
        public estado?: string,
        public cidade?: string,
        public bairro?: string,
        public endereco?: string,
        public idTipoClienteNavigation?: ClienteTipo,
    ) { }
}
