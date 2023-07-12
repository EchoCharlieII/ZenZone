from datetime import timedelta, datetime


# formate the datetime which is used in the usl of weather API
# for example, 2023-07-11 21:19:56.531113 as input, then 2023-07-11T21:00:00 as output
def formate_dt(dt):
    delta = timedelta(minutes=60)
    rounded_dt = datetime.min + round((dt - datetime.min) / delta) * delta
    return rounded_dt.strftime('%Y-%m-%dT%H:%M:%S')


def formate_dt_for_model(dt):
    time_of_week = (dt.hour * 60 + dt.minute) // 15 + 96 * dt.weekday()
    return time_of_week
