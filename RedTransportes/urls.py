from django.urls import path
from .views import ConductorListCreateAPIView, ConductorDetailAPIView, LocalidadesListCreateAPIView, \
    ClienteListCreateAPIView, ClienteDetailAPIView, PedidoListCreateAPIView, PedidoDetailAPIView

urlpatterns = [
    path('api/conductores/', ConductorListCreateAPIView.as_view(), name='conductor-list-create'),
    path('api/localidades/', LocalidadesListCreateAPIView.as_view(), name='conductor-list-create'),
    path('api/conductores/<int:pk>/', ConductorDetailAPIView.as_view(), name='conductor-detail'),
    path('api/clientes/', ClienteListCreateAPIView.as_view(), name='cliente-list-create'),
    path('api/clientes/<int:pk>/', ClienteDetailAPIView.as_view(), name='cliente-detail'),
    path('api/pedidos/', PedidoListCreateAPIView.as_view(), name='pedido-list-create'),
    path('api/pedidos/<int:pk>/', PedidoDetailAPIView.as_view(), name='pedido-detail'),

]
