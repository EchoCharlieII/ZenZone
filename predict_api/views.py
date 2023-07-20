from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .utils.get_model import get_model_by_id
from .utils.get_weather_data import get_weather_data
from .utils.formate_datetime import formate_dt_for_model
import json

modelIdRange = [4, 12, 13, 24, 41, 42, 43, 45, 48, 50, 68, 74, 75, 79, 87, 88, 90, 100, 107, 113, 114, 116, 120, 125,
                127, 128, 137, 140, 141, 142, 143, 144, 148, 151, 152, 153, 158, 161, 162, 163, 164, 166, 170, 186,
                194, 202, 209, 211, 224, 229, 230, 231, 232, 233, 234, 236, 237, 238, 239, 243, 244, 246, 249, 261,
                262, 263]


@csrf_exempt
def predict_by_id(request):
    current_time = datetime.now()
    data = json.loads(request.body)

    # check the passed data is number and in the specific range
    if isinstance(data['id'], int) and (data['id'] in modelIdRange):
        model_id = data['id']
        model = get_model_by_id(model_id)
    else:
        return JsonResponse({'error': 'Invalid Model Id'}, status=400)

    # get current time from local or frontend
    if bool(data['month']) and (1 <= int(data['month']) <= 12):
        month = data['month']
    else:
        month = current_time.month

    # get current temperature from weather api or frontend
    if bool(data['temp']):
        temp = data['temp']
    else:
        # get temperature from api
        temp = get_weather_data(current_time)['temp']

    if bool(data['time_of_week']):
        time_of_week = data['time_of_week']
    else:
        time_of_week = formate_dt_for_model(current_time)

    # check the method of request
    if request.method == 'POST':
        # using prediction model to produce result
        predict_result = model.predict([[temp, month, time_of_week]])[0]

    # return result
    return JsonResponse({
        'Taxi_Zone_ID': model_id,
        'calm_rate': predict_result}
    )


@csrf_exempt
def my_view_function(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('Data type recieved:', type(data))
            print('Data Format:', data)
        
            # Process the JSON data as needed
            # For example, you can access specific values using data['key']
            
            # Generate a response JSON
            response_data = {
                'message': 'Data received successfully',
                'received_data': data
            }
            return JsonResponse(response_data)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    
    # Return an error if the request method is not POST
    return JsonResponse({'error': 'Invalid request method'}, status=405)