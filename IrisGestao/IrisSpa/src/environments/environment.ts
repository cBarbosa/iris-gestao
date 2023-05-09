// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const baseUrl = 'https://localhost:7295/';
const baseUrl = 'https://irisgestao-api.azurewebsites.net/';

export const environment = {
	production: false,
	config: {
		baseUrl,
		apiUrl: `${baseUrl}api/`,
		b2cAuthUrl:
			'https://irisgestaopatrimonial.b2clogin.com/irisgestaopatrimonial.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn&client_id=b3280fd3-bd17-46e9-a810-d06af7e0a632&nonce=defaultNonce&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauthenticate&scope=openid&response_type=id_token&prompt=login&ui_locales=pt-BR',
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
