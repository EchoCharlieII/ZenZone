import json
from _datetime import datetime, timedelta
import pickle
import requests
import psycopg2

from constants import MODLE_ID_RANGE
from utils import get_model

# modelId = 4
# modelName = './predictions/models/model-' + str(modelId) + '.pkl'
# with open(modelName, 'rb') as f:
#     model = pickle.load(f)
#
# predicted = model.predict([[11, 1, 100]])
# print(predicted)
# date = datetime.now()
# print(date)
# print(date.month)
# print(date.weekday())
# formatted_date = date.strftime('%Y-%m-%dT%H:%M:%S')
# print(formatted_date)
#
# print(date)
#
# print(9 % 2)

# def get_data_as_json(url):
#     response = requests.get(url)
#     return response.json()
#
#
# data = get_data_as_json('https://data.cityofnewyork.us/resource/755u-8jsi.json?borough=Manhattan')
# print(data[1]['the_geom']['coordinates'][0][0])
#
# polygon_coordinates = [(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]
#
# # Convert the numeric list to a WKT string
# wkt_polygon = 'POLYGON((' + ','.join([f'{x} {y}' for x, y in data[1]['the_geom']['coordinates'][0][0]]) + '))'
#
# print(wkt_polygon)

# api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
# location = "40.7128,-74.0060"  # Example: New York City coordinates
# radius = 1000  # Example: 1 kilometer radius
# types = "restaurant"  # Example: only retrieve restaurants
# api_key = "AIzaSyBZO63KhZ_rj2j4ldsaCSVqOhtAKV5GgEY"  # Replace with your API key
#
# params = {
#     "location": location,
#     "radius": radius,
#     "types": types,
#     "key": api_key
# }
#
# response = requests.get(api_url, params=params)
# data = response.json()
#
# print(data)

input_string = "2023-07-19 15:30:00"

# Define the format of your input string
# The format should match the structure of your input string
import pandas as pd
predictions = []

for id in MODLE_ID_RANGE:
    model = get_model.get_model_by_id(id)
    predict_result = model.predict([[11, 1, 123]])[0]
    predictions.append({'Taxi_Zone_ID': id, 'calm rate': predict_result})

df_street_busyness = pd.read_parquet('predictions/street_zones_factor.parquet')
df_predictions = pd.DataFrame(predictions)
result = pd.merge(df_predictions, df_street_busyness, how='left', on='Taxi_Zone_ID')
result['street_calm_rate'] = 1 - (1 - result['calm rate']) * result['highway_factor']
result = result[['Taxi_Zone_ID', 'geometry', 'street_calm_rate']]
result_json = result.to_json(orient='records')

# return render data
print(result)
