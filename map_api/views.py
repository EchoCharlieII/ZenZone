import json
import pandas as pd
from django.http import JsonResponse
import json
import networkx as nx
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


def best_path(request):
    data = json.loads(request.body)
    with open('output_data.json', 'r') as f:
        street_data = json.load(f)
    path = find_best_path(street_data, data['mode'], data['source'], data['target'])

    return JsonResponse({'path': path}, safe=False)


# Function to calculate the distance between two points on the Earth's surface using their latitude and
# longitude.
def haversine_distance(lon1, lat1, lon2, lat2):
    """                 lat1, lon1,
    Calculate the great-circle distance between two points
    on the Earth's surface given their latitude and longitude
    in decimal degrees.
    """
    from math import radians, sin, cos, sqrt, atan2

    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Earth's radius in kilometers
    radius = 6371.0

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # Calculate distance in kilometers
    distance = radius * c
    return distance


# Load the streets as edges into the graph, and set the busyness value as edge weight.
def create_street_graph(streets_data, mode):
    """
    Create a graph from street data where streets are represented as edges.
    streets_data: A list of dictionaries containing 'line', 'busyness' keys for each street.
    """
    if mode == "distance":
        return distance_path(streets_data)
    elif mode == "calm":
        return calm_path(streets_data)
    elif mode == "balance":
        return balance_path(streets_data)

    return {'error_massage': "incorrect mode"}


def distance_path(streets_data):
    G = nx.Graph()
    for street in streets_data:
        line = street['geometry']
        # Extract the latitude and longitude from the line string and create a list of tuples
        # representing the nodes along the street.
        nodes = extract_vertices_from_linestring(line)

        # Add the street as an edge to the graph and set the busyness as the edge weight.
        for i in range(len(nodes) - 1):
            distance = haversine_distance(nodes[i][0], nodes[i][1], nodes[i + 1][0], nodes[i + 1][1])
            G.add_edge(nodes[i], nodes[i + 1], weight=distance)

    return G


def calm_path(streets_data):
    G = nx.Graph()
    for street in streets_data:
        line = street['geometry']
        calm_rate = street['street_calm_rate']

        # Extract the latitude and longitude from the line string and create a list of tuples
        # representing the nodes along the street.
        nodes = extract_vertices_from_linestring(line)

        # Add the street as an edge to the graph and set the busyness as the edge weight.
        for i in range(len(nodes) - 1):
            # more focus on calm
            G.add_edge(nodes[i], nodes[i + 1], weight=(1 - calm_rate))
    return G


def balance_path(streets_data):
    G = nx.Graph()
    for street in streets_data:
        line = street['geometry']
        calm_rate = street['street_calm_rate']

        # Extract the latitude and longitude from the line string and create a list of tuples
        # representing the nodes along the street.
        nodes = extract_vertices_from_linestring(line)

        # Add the street as an edge to the graph and set the busyness as the edge weight.
        for i in range(len(nodes) - 1):
            distance = haversine_distance(nodes[i][0], nodes[i][1], nodes[i + 1][0], nodes[i + 1][1])
            # more focus on calm
            G.add_edge(nodes[i], nodes[i + 1], weight=(1 - calm_rate) * distance)
    return G


def find_nearest_crossing_points(street_graph, user_location, destination_location):
    """
    Find the nearest crossing points for the user's location and destination.
    Returns two tuples representing the nearest crossing points for the user and destination.
    street_graph: The graph with crossings as nodes and busyness as edge weight.
    user_location: The user's current location as a tuple (latitude, longitude).
    destination_location: The destination location as a tuple (latitude, longitude).
    """
    # Find all crossing nodes in the graph
    crossing_nodes = [node for node in street_graph.nodes if len(list(street_graph.neighbors(node))) > 1]

    # Calculate the distance between the user's location and each crossing point
    user_distances = [haversine_distance(user_location[0], user_location[1], node[0], node[1])
                      for node in crossing_nodes]

    # Calculate the distance between the destination and each crossing point
    destination_distances = [haversine_distance(destination_location[0], destination_location[1], node[0], node[1])
                             for node in crossing_nodes]

    # Find the index of the minimum distance for the user and destination
    user_index = user_distances.index(min(user_distances))
    destination_index = destination_distances.index(min(destination_distances))

    # Return the nearest crossing points for the user and destination
    nearest_user_crossing = crossing_nodes[user_index]
    nearest_destination_crossing = crossing_nodes[destination_index]

    return nearest_user_crossing, nearest_destination_crossing


# Implement a function to find the best path using NetworkX's shortest path algorithms.
def find_best_path(streets_data, mode, source, target):
    """
    Find the best path from source to target in the graph using Dijkstra's algorithm.
    graph: The graph with streets as edges and busyness as edge weight.
    source: The starting location as a tuple (latitude, longitude).
    target: The target location as a tuple (latitude, longitude).
    """
    graph = create_street_graph(streets_data, mode)
    nearest_crossing = find_nearest_crossing_points(graph, source, target)
    try:
        path = nx.shortest_path(graph, source=nearest_crossing[0], target=nearest_crossing[1], weight='weight')
        return path
    except nx.NetworkXNoPath:
        return None


def extract_vertices_from_linestring(wkt_linestring):
    """
    Extract individual vertices (points) from a LINESTRING in WKT format.
    Returns a list of tuples, where each tuple contains the latitude and longitude of a vertex.
    """
    # Remove the 'LINESTRING' prefix and parentheses from the WKT string
    coords_str = wkt_linestring[len('LINESTRING ('):-1]

    # Split the WKT string into individual coordinate pairs
    coord_pairs = coords_str.split(',')

    # Extract latitude and longitude from each coordinate pair
    vertices = []
    for coord_pair in coord_pairs:
        lon, lat = map(float, coord_pair.strip().split(' '))
        vertices.append((lat, lon))  # Note the order (latitude, longitude)

    return vertices
