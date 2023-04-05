export interface IReceita {
	[index: string]: any;
}

export class Receita {
	constructor(public guidReferencia: string) {}

	deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}
