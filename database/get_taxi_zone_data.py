import requests
import psycopg2


# create connection with database
def connection():
    conn = psycopg2.connect(
        host='localhost',
        port='5432',
        database='zenzone',
        user='zenzone',
        password='zenzone'
    )
    return conn


def get_data_as_json(url):
    response = requests.get(url)
    return response.json()


def insert_data_to_db(data_source_url):
    conn = connection()
    cursor = conn.cursor()

    raw_data = get_data_as_json(data_source_url)
    insert_query = "INSERT INTO taxi_zone_info (objectid, location_id, shape_leng, the_geom, shape_area, zone, borough) " \
                   "VALUES (%s, %s, %s, %s, %s, %s, %s)"

    for item in raw_data:
        objectid = item['objectid']
        location_id = item['location_id']
        shape_leng = item['shape_leng']
        the_geom = 'POLYGON((' + ','.join([f'{x} {y}' for x, y in item['the_geom']['coordinates'][0][0]]) + '))'
        shape_area = item['shape_area']
        zone = item['zone']
        borough = item['borough']
        cursor.execute(insert_query, (objectid, location_id, shape_leng, the_geom, shape_area, zone, borough))

    conn.commit()

    cursor.close()
    conn.close()

    return "insert data successfully"


print(insert_data_to_db('https://data.cityofnewyork.us/resource/755u-8jsi.json?borough=Manhattan'))
