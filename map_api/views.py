import json
import math

import pandas as pd
from django.http import JsonResponse
from utils import formate_datetime, get_weather_data, get_model, get_path, get_places

from constants import MODLE_ID_RANGE


# Create your views here.

def render_map(request):
    # get future date from frontend
    data = json.loads(request.body)

    # formate date which is from frontend
    date_time = data['date']
    formatted_dt = formate_datetime.formate_frontend_datetime(date_time)
    month = formatted_dt.month
    # according to date to get month and time_of_week
    time_of_week = formate_datetime.formate_dt_for_model(formatted_dt)

    # according date to get weather data from weather API

    temp = get_weather_data.get_weather_data(formatted_dt)['temp']

    # use each model to generate calm rate
    if request.method == 'POST':
        predictions = []
        # using prediction model to produce result
        for id in MODLE_ID_RANGE:
            model = get_model.get_model_by_id(id)
            predict_result = model.predict([[temp, month, time_of_week]])[0]
            predictions.append({'Taxi_Zone_ID': id, 'calm rate': predict_result})

        # Test simplified data: (street_zones_factor_simplified.parquet instead of street_zones_factor.parquet)
        df_street_busyness = pd.read_parquet('predictions/street_zones_factor_simplified.parquet')
        df_predictions = pd.DataFrame(predictions)
        result = pd.merge(df_predictions, df_street_busyness, how='left', on='Taxi_Zone_ID')
        result['street_calm_rate'] = 1 - (1 - result['calm rate']) * result['highway_factor']
        result = result[['Taxi_Zone_ID', 'geometry', 'street_calm_rate']]
        result = result.to_dict(orient='records')
    return JsonResponse(
        result, safe=False)


def best_path(request):
    data = json.loads(request.body)
    with open('output_data.json', 'r') as f:
        street_data = json.load(f)
    path = get_path.find_best_path(street_data, data['mode'], data['source'], data['target'])
    distance = 0
    for index in range(len(path) - 1):
        current_point = path[index]
        next_point = path[index + 1]
        distance += get_path.haversine_distance(current_point[0], current_point[1], next_point[0], next_point[1])

    walking_time = distance / 5

    hour = math.floor(walking_time)
    minute = math.ceil((walking_time * 60) % 60)

    km = math.floor(distance)
    meter = math.ceil((distance * 1000) % 1000)
    return JsonResponse({
        'path': path,
        'time': {
            'hour': hour,
            'minute': minute
        },
        'distance': {
            'km': km,
            'meter': meter
        }
    }, safe=False)


def get_near_places(request):
    data = json.loads(request.body)

    center_location = str(data["lat"]) + "," + str(data['lon'])
    places_data = get_places.get_places_in_radius(center_location, data["radius"])
    results = []
    for place in places_data:
        results.append(get_places.get_detail_info(place['place_id']))

    return JsonResponse({
        "results": results
    }, safe=False)


def quite_places(request):
    place_info = get_places.get_quiet_place_info()
    return JsonResponse({
        'results': place_info
    }, safe=False)
