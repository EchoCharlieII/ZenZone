from django.contrib import admin
from django.urls import path, include
from . import views
# The following import is for testing purposes

urlpatterns = [
    path('predict-by-id', views.predict_by_id),
]
