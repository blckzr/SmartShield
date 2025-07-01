import uvicorn
from fastapi import FastAPI, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from weathertools import *
from mapboxtools import *

OPENWEATHER_APIKEY = "dae844ddfd6f64e5675dff334e04e621" #REMOVE BEFORE PUSHING
MAPBOX_APIKEY = "pk.eyJ1IjoiemVuemVueXRoIiwiYSI6ImNtYzduN2s0NTB6bGwyb3A5dm9lMXRyMmUifQ.WdSz2mcmS1V2tGni-so4aQ"

class LocationRequests(BaseModel):
    latitude: float
    longitude: float

class DirectionRequests(BaseModel):
    startpoint: LocationRequests
    endpoint: LocationRequests

class Shelter(BaseModel):
    name: str
    longitude: float
    latitude: float
    address: str

class ShelterDirections(BaseModel):
    distance_meters : float
    duration_seconds : float
    linestring_coordinates : List[List[float]]

class Response(BaseModel):
    heat_index: float
    humidity: float
    temperature: float
    suggested_shelters: List[Shelter]


app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/process_userlocation", response_model= Response)
def process_userlocation(location: LocationRequests):
    latitude = location.latitude
    longitude = location.longitude
    humidity, temperature, heatindex = weatherAPI(latitude, longitude, OPENWEATHER_APIKEY)

    shelters = searchpoi(latitude, longitude, MAPBOX_APIKEY)

    return Response(
        heat_index= heatindex,
        humidity= humidity,
        temperature= temperature,
        suggested_shelters= shelters
    )

@app.post("/process_shelter_direction", response_model=ShelterDirections)
def process_shelter_directions(coordinates: DirectionRequests):
    profile = "walking"
    startpointlat = coordinates.startpoint.latitude
    startpointlon = coordinates.startpoint.longitude
    endpointlat = coordinates.endpoint.latitude
    endpointlon = coordinates.endpoint.longitude

    values = directions(profile, startpointlon, startpointlat, endpointlon, endpointlat, MAPBOX_APIKEY)

    return ShelterDirections(**values)