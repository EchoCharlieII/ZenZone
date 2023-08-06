import json
import math

from django.http import JsonResponse
from utils import get_path, get_places, get_predictions
from django.core.cache import cache


# Create your views here.

def render_map(request):
    # get future date from frontend
    data = json.loads(request.body)

    # formate date which is from frontend
    date_time = data['date']

    # use each model to generate calm rate
    predictions = get_predictions.get_prediction_result(date_time)

    # Test simplified data: (street_zones_factor_simplified.parquet instead of street_zones_factor.parquet)
    result = get_predictions.formatted_prediction_data(predictions)

    return JsonResponse(result, safe=False)


def best_path(request):
    data = json.loads(request.body)

    street_data = get_predictions.formatted_prediction_data(
        get_predictions.get_prediction_result(data['date'])
    )
    G = get_path.create_street_graph(street_data, data['mode'])
    path = get_path.find_best_path(G, data['source'], data['target'])
    distance = get_path.calculate_distance(path)

    walking_time = distance / 5

    hour = math.floor(walking_time)
    minute = math.ceil((walking_time * 60) % 60)

    km = math.floor(distance)
    meter = math.ceil((distance * 1000) % 1000)
    return JsonResponse({
        'mode': data['mode'],
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
    cached_response = cache.get('place_info')

    if cached_response:
        return JsonResponse({
            'results': cached_response
        }, safe=False)

    place_info = get_places.get_quiet_place_info()
    cache.set('api_response', place_info, 900)

    return JsonResponse({
        'results': place_info
    }, safe=False)


def circular_walking(request):
    data = json.loads(request.body)

    street_data = get_predictions.formatted_prediction_data(
        get_predictions.get_prediction_result(data['date'])
    )
    G = get_path.create_street_graph(street_data, 'balance')

    desired_walking_time = data['duration']
    user_location = data['source']
    circular_path = get_path.generate_circular_path(G, user_location, desired_walking_time)
    distance = get_path.calculate_distance(circular_path)

    km = math.floor(distance)
    meter = math.ceil((distance * 1000) % 1000)
    return JsonResponse(
        {
            'path': circular_path,
            'distance': {
                'km': km,
                'meter': meter
            }
        },
        safe=False
    )
