from django.urls import path
from .views import (
    GenerateReportView,
    MonthlyReportListView,
    SavingsSuggestionListView,
    MarkSuggestionReadView,
)

urlpatterns = [
    path('generate-report/', GenerateReportView.as_view(), name='generate-report'),
    path('monthly-reports/', MonthlyReportListView.as_view(), name='monthly-reports'),
    path('suggestions/', SavingsSuggestionListView.as_view(), name='suggestions'),
    path('suggestions/<int:pk>/read/', MarkSuggestionReadView.as_view(), name='suggestion-read'),
]