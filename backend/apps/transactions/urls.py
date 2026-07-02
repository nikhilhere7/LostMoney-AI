from django.urls import path
from .views import (
    TransactionListView,
    TransactionDetailView,
    TransactionSummaryView,
    TransactionByCategoryView,
    CategoryListView,
    RecurringGroupListView,
    DetectRecurringView,
)

urlpatterns = [
    path('', TransactionListView.as_view(), name='transaction-list'),
    path('<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('summary/', TransactionSummaryView.as_view(), name='transaction-summary'),
    path('by-category/', TransactionByCategoryView.as_view(), name='transaction-by-category'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('recurring/', RecurringGroupListView.as_view(), name='recurring-list'),
    path('detect-recurring/', DetectRecurringView.as_view(), name='detect-recurring'),
]