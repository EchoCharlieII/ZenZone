from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('predict-by-id', views.predict_by_id),
]
