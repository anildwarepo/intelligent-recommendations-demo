import logging
import http.client, urllib.request, urllib.parse, urllib.error, base64, json
import azure.functions as func
import os
import pandas as pd
from azure.identity import ClientSecretCredential


def getImageUrls():
    dict_from_csv = pd.read_csv('<blob url>', header=None, index_col=0, squeeze=True).to_dict()
    return dict_from_csv

def getItemDetails():
    dict_from_csv = pd.read_csv('<blob url>', header=None, index_col=0, squeeze=True).to_dict()
    return dict_from_csv

itemUrls = getImageUrls()
itemDetails = getItemDetails()

def getAccessToken():
    clientSecretCredential = ClientSecretCredential( os.getenv('TENANT_ID'),os.getenv('CLIENT_ID'),os.getenv('CLIENT_SECRET'))
    return clientSecretCredential.get_token("c5b731db-1b0a-43f6-bcf6-757667d9cdc6/.default").token

def getSimilarItems(itemId):
    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + getAccessToken(),
    }
    try:
        conn = http.client.HTTPSConnection(os.getenv('IRSERVICE_ENDPOINT'))
        conn.request("GET", f"/Reco/V1.0/similar/{itemId}?algoType=Textual&count=10", None ,headers)
        response = conn.getresponse()
        data = response.read()
        jsondata = json.loads(data.decode('utf8'))
        conn.close()
        for row in jsondata["items"]:
            row["ImageUrl"] = itemUrls[2][int(row["id"])]
            row["Title"] = itemDetails[2][int(row["id"])]
            row["Description"] = itemDetails[3][int(row["id"])]
        return json.dumps(jsondata)
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

def getPopularItems():
    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + getAccessToken(),
    }
    try:
        conn = http.client.HTTPSConnection(os.getenv('IRSERVICE_ENDPOINT'))
        conn.request("GET", f"/Reco/V1.0/popular?count=10", None ,headers)
        response = conn.getresponse()
        data = response.read()
        jsondata = json.loads(data.decode('utf8'))
        conn.close()
        for row in jsondata["items"]:
            row["ImageUrl"] = itemUrls[2][int(row["id"])]
            row["Title"] = itemDetails[2][int(row["id"])]
            row["Description"] = itemDetails[3][int(row["id"])]
        return json.dumps(jsondata)
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

def getSearchResults(searchTerm, searchIndex ,facet, filter):
    
    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'api-key': os.getenv('SEARCH_API_KEY'),
    }

    
    params = urllib.parse.urlencode({
        
    })    

    if filter is not None or facet is not None:
        filter = f"{facet}/any(p: p eq '{filter}')"
        facet = [f"facet={facet}"]
    else:
        filter = ""
        facet = []

    searchBody = {
        "search": searchTerm,
        "queryType": "semantic",
        "speller": "lexicon",
        "queryLanguage":"en-us",
        "facets":[],
        "filter": filter,
        "highlight": "Title",
        "searchFields":"Title, Description,keyphrases",
        "answers": "extractive|count-3",
        "select":"ItemId,ItemVariantId,Title,Description,ReleaseDate,keyphrases",
        "top": 10,
        "count": True
    }
    people = []
    organizations = []
    locations = []
    keyphrases = []
    #searchResults = {"results":}
    try:
        conn = http.client.HTTPSConnection(os.getenv('SEARCH_ENDPOINT'))
        conn.request("POST", f"/indexes/{searchIndex}/docs/search?api-version=2020-06-30-Preview%s" % params, json.dumps(searchBody), headers)
        response = conn.getresponse()
        data = response.read()
        jsondata = json.loads(data.decode('utf8'))
        for row in jsondata["value"]:
            try:
                row["ImageUrl"] = itemUrls[2][int(row["ItemId"])]
            except KeyError:
                # Key is not present
                pass            
        #jsondata['value'].sort(reverse=True, key=sortSearchScore)
        for v in jsondata['value']:
            for k in v['keyphrases']:
                if not k in keyphrases:
                    keyphrases.append(k)
        jsondata["KeyPhrases"] = keyphrases
        conn.close()
        return json.dumps(jsondata)
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    #searchIndex = os.getenv('SEARCH_INDEX')
    backendApi = req.route_params.get('backendApi')
    if(backendApi == "search"):
        searchIndex = req.route_params.get('routeParam')
        facet = req.route_params.get('facet')
        filter = req.route_params.get('filter')
        searchTerm = req.get_json()
        return getSearchResults(searchTerm, searchIndex, facet, filter)
    if(backendApi == "similar"):
        itemId = req.route_params.get('routeParam')
        return getSimilarItems(itemId)
    if(backendApi == "popular"):
        return getPopularItems()


