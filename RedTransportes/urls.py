from django.urls import path
from .views import ConductorListCreateAPIView, ConductorDetailAPIView,LocalidadesListCreateAPIView

urlpatterns = [
    path('api/conductores/', ConductorListCreateAPIView.as_view(), name='conductor-list-create'),
    path('api/localidades/', LocalidadesListCreateAPIView.as_view(), name='conductor-list-create'),
    path('api/conductores/<int:pk>/', ConductorDetailAPIView.as_view(), name='conductor-detail'),

]
