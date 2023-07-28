import pickle


def get_model_by_id(id):
    # Model Path will only work with users local path!!!
    model_path = 'C:\\Users\\james\\OneDrive\\Documents\\GitHub\\ZenZone\\predictions\\models\\model-' + str(id) + '.pkl'
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model


