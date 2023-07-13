from _datetime import datetime, timedelta
import pickle
import requests
import psycopg2


# modelId = 4
# modelName = './predictions/models/model-' + str(modelId) + '.pkl'
# with open(modelName, 'rb') as f:
#     model = pickle.load(f)
#
# predicted = model.predict([[11, 1, 100]])
# print(predicted)
# date = datetime.now()
# print(date.month)
# print(date.weekday())
# formatted_date = date.strftime('%Y-%m-%dT%H:%M:%S')
#
# print(date)
#
# print(9 % 2)

def get_data_as_json(url):
    response = requests.get(url)
    return response.json()


data = get_data_as_json('https://data.cityofnewyork.us/resource/755u-8jsi.json?borough=Manhattan')
print(data[1]['the_geom']['coordinates'][0][0])

polygon_coordinates = [(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]

# Convert the numeric list to a WKT string
wkt_polygon = 'POLYGON((' + ','.join([f'{x} {y}' for x, y in data[1]['the_geom']['coordinates'][0][0]]) + '))'

print(wkt_polygon)
