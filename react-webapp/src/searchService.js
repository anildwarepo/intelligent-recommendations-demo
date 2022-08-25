import { searchConfig, azureFunctionAppAuthCode } from './appConfig'

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */

 export async function getSearchResults(searchTerm) {
    const headers = new Headers();
    //const bearer = `Bearer ${accessToken}`;

    //headers.append("Authorization", bearer);

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(searchTerm)
    };

    return fetch(searchConfig.searchApiEndPoint + azureFunctionAppAuthCode.code, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}


export async function getFacetedSearchResults(searchTerm, facet) {
    const headers = new Headers();
    //const bearer = `Bearer ${accessToken}`;

    //headers.append("Authorization", bearer);

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(searchTerm)
    };

    return fetch(searchConfig.searchApiEndPoint + '/keyphrases/' + facet + azureFunctionAppAuthCode.code, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}