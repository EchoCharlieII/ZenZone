import pandas as pd

from constants import MODLE_ID_RANGE
from utils import get_model, formate_datetime, get_weather_data


def get_prediction_result(date_time):
    formatted_dt = formate_datetime.formate_frontend_datetime(date_time)
    month = formatted_dt.month
    # according to date to get month and time_of_week
    time_of_week = formate_datetime.formate_dt_for_model(formatted_dt)

    # according date to get weather data from weather API

    temp = get_weather_data.get_weather_data(formatted_dt)['temp']
    predictions = []
    # using prediction model to produce result
    for id in MODLE_ID_RANGE:
        model = get_model.get_model_by_id(id)
        predict_result = model.predict([[temp, month, time_of_week]])[0]
        predictions.append({'Taxi_Zone_ID': id, 'calm rate': predict_result})
    return predictions

def formatted_prediction_data(predictions):
    df_street_busyness = pd.read_parquet('predictions/street_zones_factor_simplified.parquet')
    df_predictions = pd.DataFrame(predictions)
    result = pd.merge(df_predictions, df_street_busyness, how='left', on='Taxi_Zone_ID')
    result['street_calm_rate'] = 1 - (1 - result['calm rate']) * result['highway_factor']
    result = result[['geometry', 'street_calm_rate']]
    result = result.to_dict(orient='records')
    return result

# data = get_prediction_result("2023-07-16T11:11:11.001Z")
# print(formatted_prediction_data(data))
