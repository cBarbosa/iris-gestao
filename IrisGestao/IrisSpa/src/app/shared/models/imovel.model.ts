import { Cliente } from "./cliente.model";
import { ImovelCategoria } from "./imovel-categoria.model";
import { ImovelEndereco } from "./imovel-endereco.model";
import { ImovelUnidade } from "./imovel-unidade.model";

export class Imovel {
    constructor(
        public guidReferencia: string,
        public nome?: string,
        public nroUnidades?: number,
        public areaTotal?: number,
        public areaUtil?: number,
        public areaHabitese?: number,
        public imgCapa?: string,
        public idCategoriaImovelNavigation?: ImovelCategoria,
        public idClienteProprietarioNavigation?: Cliente,
        public imovelEndereco?: ImovelEndereco[],
        public unidade?: ImovelUnidade[],
    ) { }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}