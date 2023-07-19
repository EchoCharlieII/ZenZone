import pickle


def get_model_by_id(id):
    model_path = '/home/tong/Desktop/UCD/ZenZone/predictions/models/model-' + str(id) + '.pkl'
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model
