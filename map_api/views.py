import json
import math
from django.core.cache import cache
from django.http import JsonResponse
from django.http import Http404
from utils import get_path, get_places, get_predictions


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

    distance, km, meter = get_path.format_distance(path)

    walking_time = distance / 5

    hour = math.floor(walking_time)
    minute = math.ceil((walking_time * 60) % 60)

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
    cached_response = cache.get(request.GET.get('place'))
    if cached_response:
        return JsonResponse({
            'results': cached_response
        }, safe=False)

    place_type = request.GET.get('place', None)
    place_info = get_places.get_quiet_place_info()
    if place_type is not None:
        place_info = place_info.get(place_type, None)
        cache.set(request.GET.get('place'), place_info, 86400)
        if place_info is None:
            raise Http404("Place type does not exist")
    return JsonResponse({
        'results': place_info
    }, safe=False)


def circular_walking(request):
    data = json.loads(request.body)

    street_data = get_predictions.formatted_prediction_data(
        get_predictions.get_prediction_result(data['date'])
    )
    G = get_path.create_street_graph(street_data, 'calm')
    back_graph = get_path.create_street_graph(street_data, 'distance')

    desired_walking_time = data['duration']
    user_location = data['source']
    circular_path = get_path.generate_circular_path(G, back_graph, user_location, desired_walking_time)

    distance, km, meter = get_path.format_distance(circular_path)

    return JsonResponse(
        {
            'path': circular_path,
            'time': {
                'hour': (km // 5),
                'minute': (int(((km *1000 + meter) % 5000)/5000 * 60)),
            },
            'distance': {
                'km': km,
                'meter': meter
            }
        },
        safe=False
    )
