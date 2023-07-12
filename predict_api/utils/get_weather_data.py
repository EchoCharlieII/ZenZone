from datetime import datetime, timedelta
from .formate_datetime import formate_dt

import requests


# get current temperature from weather API based on current time
def get_weather_data(dt):
    formatted_dt = formate_dt(dt)
    response = requests.get(
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
        + formatted_dt +
        'dublin?unitGroup=metric&key=4S88ECKBXGLZJUJ5QTVDFMBB8&contentType=json')
    if response.status_code == 200:
        weatherData = response.json()
    return weatherData['currentConditions']
