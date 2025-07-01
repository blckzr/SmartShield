import requests

def weatherAPI(latitude, longitude, API_KEY):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()
    tempC = data['main']['temp']
    tempF = tempConverter(tempC, "C")

    relative_humidity = data['main']['humidity']
    HIinFahrenheit = calculateHeatIndex(relative_humidity, tempF)
    HIinCelcius = tempConverter(HIinFahrenheit, "F")


    print(f"Latitude:{latitude}\nLongitude:{longitude}\n Temperature: "
          f"{tempC}\n Humidity: {relative_humidity}\n Heat_Index:{HIinCelcius} ")

    return relative_humidity, tempC, HIinCelcius


def calculateHeatIndex(relative_humidity, temperatureF):
    #Formula = HI= c1+c2T+c3R+c4TR+c5T2+c6R2+c7T2R+c8TR2+c9T2R2
    CONSTANTS = [
        0,
        -42.379,
        2.04901523,
        10.14333127,
        -0.22475541,
        -6.83783e-3,
        -5.481717e-2,
        1.22874e-3,
        8.5282e-4,
        -1.99e-6
        ]

    HI = (CONSTANTS[1] + (CONSTANTS[2]*temperatureF) + (CONSTANTS[3]*relative_humidity) + (CONSTANTS[4]*temperatureF*relative_humidity)
          + (CONSTANTS[5]*temperatureF**2) + (CONSTANTS[6]*relative_humidity**2) + (CONSTANTS[7]*temperatureF**2*relative_humidity)
          +(CONSTANTS[8]*temperatureF*relative_humidity**2) + (CONSTANTS[9]*temperatureF**2*relative_humidity**2)
          )

    return HI

def tempConverter(temperature, code):
    if code == 'C':
        convertedtemp = (temperature * 9/5) + 32
    elif code == 'F':
        convertedtemp = (temperature - 32) * 5/9
    else:
        print("Temperature Code Invalid")
        return
    return convertedtemp