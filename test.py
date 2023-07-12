from _datetime import datetime, timedelta
import pickle

modelId = 4
modelName = './predictions/models/model-' + str(modelId) + '.pkl'
with open(modelName, 'rb') as f:
    model = pickle.load(f)

predicted = model.predict([[11, 1, 100]])
print(predicted)
date = datetime.now()
print(date.month)
print(date.weekday())
formatted_date = date.strftime('%Y-%m-%dT%H:%M:%S')

print(date)

print(9 % 2)

