from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('render-map', views.render_map),
    path('best-path', views.best_path),
    path('get-near-places', views.get_near_places),
    path('quiet-place-info', views.quite_places),
    path('circle-path', views.circular_walking)
]
