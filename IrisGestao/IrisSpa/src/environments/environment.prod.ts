
const baseUrl = 'irisgestao-api.azurewebsites.net/'

export const environment = {
    production: true,
    config: {
        baseUrl,
        apiUrl: `${baseUrl}api/`,
        b2cAuthUrl: 'https://irisgestaopatrimonial.b2clogin.com/irisgestaopatrimonial.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn&client_id=b3280fd3-bd17-46e9-a810-d06af7e0a632&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fpolite-beach-0ba132510.3.azurestaticapps.net%3A4200%2Fauthenticate&scope=openid&response_type=id_token&prompt=login&ui_locales=pt-BR'
    }
};
