export interface IConstrucao {
	[index: string]: any;
}

export class Construcao {
	constructor(public guidReferencia: string) {}

	deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}
