
const baseUrl = 'https://irisgestao-api.azurewebsites.net/'

export const environment = {
    production: true,
    config: {
        baseUrl,
        apiUrl: `${baseUrl}api/`,
        b2cAuthUrl: 'https://irisgestaopatrimonial.b2clogin.com/irisgestaopatrimonial.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn&client_id=b3280fd3-bd17-46e9-a810-d06af7e0a632&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fpolite-beach-0ba132510.3.azurestaticapps.net%2Fauthenticate&scope=openid%20https%3A%2F%2Firisgestaopatrimonial.onmicrosoft.com%2Fb3280fd3-bd17-46e9-a810-d06af7e0a632%2FAuth.Read&response_type=id_token%20token&prompt=login&ui_locales=pt-BR'
    }
};
