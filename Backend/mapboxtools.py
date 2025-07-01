import requests

q = "mall"

def searchpoi(lat, lon, API_KEY):
    url = f"https://api.mapbox.com/search/searchbox/v1/forward"
    params = {
        "q" : q,
        "access_token" : API_KEY,
        "language" : "en",
        "limit" : 5,
        "proximity" : f"{lon},{lat}",
        "poi_category" : "shopping_mall"
    }

    response = requests.get(url, params)
    print(f"searchpoi status code: {response.status_code}")
    response.raise_for_status()
    poiplaces = response.json()

    suggested_shelters = []

    for i in range(params.get("limit")):
        place = poiplaces["features"][i]

        name = place["properties"]["name"]
        coordinates = place["geometry"]["coordinates"]
        address = place["properties"]["full_address"]

        suggested_shelters.append({
            "name": name,
            "longitude": coordinates[0],
            "latitude": coordinates[1],
            "address": address
        })

    return suggested_shelters



def directions(profile : str, startpointlon:float, startpointlat:float, endpointlon:float, endpointlat:float, API_KEY):
    url = f"https://api.mapbox.com/directions/v5/mapbox/{profile}/{startpointlon},{startpointlat};{endpointlon},{endpointlat}"
    params={
        "access_token" : API_KEY,
        "geometries" : "geojson"
    }

    response = requests.get(url, params)
    print(f"status code: {response.status_code}")
    response.raise_for_status()
    directiondata = response.json()

    route = directiondata["routes"][0]

    values = {
        "distance_meters" : route["distance"],
        "duration_seconds" : route["duration"],
        "linestring_coordinates" : route["geometry"]["coordinates"]
    }

    return values

