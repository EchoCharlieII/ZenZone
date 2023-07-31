from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('render-map', views.render_map),
    path('best-path', views.best_path),
]
