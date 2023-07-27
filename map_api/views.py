import json
import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from utils import formate_datetime, get_weather_data, get_model

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

        df_street_busyness = pd.read_parquet('predictions/street_zones_factor.parquet')
        df_predictions = pd.DataFrame(predictions)
        result = pd.merge(df_predictions, df_street_busyness, how='left', on='Taxi_Zone_ID')
        result['street_calm_rate'] = 1 - (1 - result['calm rate']) * result['highway_factor']
        result = result[['Taxi_Zone_ID', 'geometry', 'street_calm_rate']]
        result = result.to_dict(orient='records')
    return JsonResponse(
        result, safe=False)
