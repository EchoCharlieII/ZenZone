import math
import random
import networkx as nx
from math import radians, sin, cos, sqrt, atan2


# Function to calculate the distance between two points on the Earth's surface using their latitude and
# longitude.
def haversine_distance(lon1, lat1, lon2, lat2):
    """                 lat1, lon1,
    Calculate the great-circle distance between two points
    on the Earth's surface given their latitude and longitude
    in decimal degrees.
    """

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
        calm_rate = street['street_calm_rate']
        # Extract the latitude and longitude from the line string and create a list of tuples
        # representing the nodes along the street.
        nodes = extract_vertices_from_linestring(line)

        # Add the street as an edge to the graph and set the busyness as the edge weight.
        for i in range(len(nodes) - 1):
            distance = haversine_distance(nodes[i][0], nodes[i][1], nodes[i + 1][0], nodes[i + 1][1])
            edge_attributes = {"street_calm_rate": calm_rate}
            G.add_edge(nodes[i], nodes[i + 1], weight=distance, **edge_attributes)

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
            edge_attributes = {"street_calm_rate": calm_rate}
            # more focus on calm
            G.add_edge(nodes[i], nodes[i + 1], weight=(1 - calm_rate), **edge_attributes)
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
            edge_attributes = {"street_calm_rate": calm_rate}
            # more focus on calm
            G.add_edge(nodes[i], nodes[i + 1], weight=(1 - calm_rate) * distance, **edge_attributes)
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
def find_best_path(graph, source, target):
    """
    Find the best path from source to target in the graph using Dijkstra's algorithm.
    graph: The graph with streets as edges and busyness as edge weight.
    source: The starting location as a tuple (latitude, longitude).
    target: The target location as a tuple (latitude, longitude).
    """
    nearest_crossing = find_nearest_crossing_points(graph, source, target)
    try:
        path = nx.shortest_path(graph, source=nearest_crossing[0], target=nearest_crossing[1], weight='weight')

        path_and_calm_rate = []
        for u, v in zip(path, path[1:]):
            edge_attributes = graph.edges[u, v]
            path_and_calm_rate.append(
                {
                    "coordinates": u,
                    "street_calm_rate": edge_attributes['street_calm_rate']
                })
        path_and_calm_rate.append({
                    "coordinates": path[-1],
                    "street_calm_rate": graph.edges[path[-2], path[-1]]['street_calm_rate']
                })

        return path_and_calm_rate
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


def random_walk(graph, starting_node, desired_time):
    current_node = starting_node
    total_time = 0
    forward_path = [current_node]

    while total_time < (desired_time / 2):
        neighboring_crossings = list(graph.neighbors(current_node))
        next_node = random.choice(neighboring_crossings)
        distance = haversine_distance(current_node[0], current_node[1], next_node[0], next_node[1])
        # edge_data = graph.get_edge_data(current_node, next_node)
        walking_time = math.ceil((distance / 5) * 60)  # Use busyness or other factors to estimate walking time
        total_time += walking_time

        current_node = next_node
        forward_path.append(current_node)
    back_path = find_best_path(graph, current_node, starting_node)

    return forward_path + back_path


# Step 5: Main function to generate the circular path
def generate_circular_path(graph, user_location, desired_walking_time):
    # Step 1: Find the nearest crossing point to the user's starting location
    nearest_user_crossing, _ = find_nearest_crossing_points(graph, user_location, user_location)

    # Step 2 and 3: Perform a random walk
    random_walk_path = random_walk(graph, nearest_user_crossing, desired_walking_time)

    # return circular_path
    return random_walk_path
