import { irServiceConfig, azureFunctionAppAuthCode} from './appConfig'
/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */

export async function getSimilarItems(itemId) {
    const headers = new Headers();
    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(irServiceConfig.apiSimilarEndPoint + '/' + itemId + azureFunctionAppAuthCode.code, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}


export async function getPopularItems() {
    const headers = new Headers();
    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(irServiceConfig.apiPopularEndPoint + azureFunctionAppAuthCode.code, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}