import requests


def get_places_in_radius(center_location, radius):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": center_location,
        "radius": radius,
        "key": "AIzaSyBZO63KhZ_rj2j4ldsaCSVqOhtAKV5GgEY",
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()
        return data.get('results', [])
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)
        return []


def get_detail_info(place_id):
    params = {
        'key': "AIzaSyBZO63KhZ_rj2j4ldsaCSVqOhtAKV5GgEY",
        'place_id': 'ChIJq3tH0I5YwokRfL6Y8j8E6DM'
    }

    response = requests.get('https://maps.googleapis.com/maps/api/place/details/json',
                            params=params)
    json_data = response.json()
    results = json_data['result']
    detail_info = {
        'place_id': results['place_id'],
        'title': results['name'],
        'address': results['formatted_address'],
        'borough': results['address_components'][2]['long_name'],
        'latitude': results['geometry']['location']['lat'],
        'longitude': results['geometry']['location']['lng'],
        'website': results['website'],
        'phone': results['formatted_phone_number'],
        'type': results['types'],
        'loge': results['icon'],
        'description': results['editorial_summary']['overview'],
        'rating': results['rating'],
        'reviews': results['reviews'],
        'workinghours': results['current_opening_hours']['weekday_text']
    }
    return detail_info


def get_quiet_place_info():
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        "Authorization": "Bearer NG8reME6LqKh5SG0ECrn_II_ydUFDGMSgvIJvhkNj-O4W4zlYP2yqfxCHB2D9xjdTDOmlLg3Ciat1ZTjhLby6kMLsDQmyQMi1ORp_oL4bWaFxxcA15thd-E6MGLHZHYx",
    }
    params = {
        "cafe": {
            'term': 'Cozy Cafe To Study',
            'location': 'New York, NY',
            'limit': 10
        },
        "library": {
            'term': 'Quiet Library',
            'location': 'New York, NY',
            'limit': 10
        },
        "museum": {
            'term': 'Museums',
            'location': 'New York, NY',
            'limit': 10
        },
        "read_place": {
            'term': 'Quiet Places To Read',
            'location': 'New York, NY',
            'limit': 10
        },
        "study_place": {
            'term': 'Quiet Places To Study',
            'location': 'New York, NY',
            'limit': 10
        },
        "secluded_spot": {
            'term': 'Secluded Spots',
            'location': 'New York, NY',
            'limit': 10
        },
        "secret_spot": {
            'term': 'Secret Spots',
            'location': 'New York, NY',
            'limit': 10
        }
    }
    result = {}
    for param in params:
        data = []
        response = requests.get(url, headers=headers, params=params[param])
        json_data = response.json()['businesses']
        for item in json_data:
            tem_dic = {}
            tem_dic['name'] = item['name']
            tem_dic['is_closed'] = item['is_closed']
            tem_dic['url'] = item['url']
            tem_dic['review_count'] = item['review_count']
            tem_dic['rating'] = item['rating']
            tem_dic['coordinates'] = item['coordinates']
            tem_dic['price'] = item.get('price', None)
            tem_dic['location'] = item['location']
            tem_dic['phone'] = item['phone']
            data.append(tem_dic)
        result[param] = data
    return result
