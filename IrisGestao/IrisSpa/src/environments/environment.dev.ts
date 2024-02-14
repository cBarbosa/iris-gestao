
const baseUrl = 'https://irisgestao-devapi.azurewebsites.net/'
 
export const environment = {
    production: true,
    config: {
        baseUrl,
        apiUrl: `${baseUrl}api/`,
        b2cAuthUrl: 'https://irisgestaodev.b2clogin.com/irisgestaodev.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn&client_id=2409fdc1-f08c-4900-b5a4-789978aba8fc&nonce=defaultNonce&redirect_uri=https%3A%2F%2Flively-bush-0749dd110.4.azurestaticapps.net%2Fauthenticate&scope=openid%20https%3A%2F%2Firisgestaodev.onmicrosoft.com%2F2409fdc1-f08c-4900-b5a4-789978aba8fc%2Fauth.read&response_type=id_token%20token&prompt=login&ui_locales=pt-BR'
    }
};
