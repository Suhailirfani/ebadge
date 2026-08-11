from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('data-table/', views.data_table_view, name='data_table'),
    path('scanner/', views.scanner_view, name='scanner'),
    path('verify/<str:code>/', views.participant_detail_view, name='participant_detail'),
    path('export/csv/', views.export_csv_view, name='export_csv'),
    path('api/register/', views.register_participant_api, name='api_register'),
    path('api/verify/', views.verify_qr_api, name='api_verify'),
    path('api/participant/<int:pk>/delete/', views.delete_participant_api, name='api_delete_participant'),
]
