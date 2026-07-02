from django.urls import path
from .views import (
    StatementUploadView,
    StatementListView,
    StatementDetailView,
    ReparseStatementView,
    BankAccountListCreateView,
)

urlpatterns = [
    path('', StatementListView.as_view(), name='statement-list'),
    path('upload/', StatementUploadView.as_view(), name='statement-upload'),
    path('<int:pk>/', StatementDetailView.as_view(), name='statement-detail'),
    path('<int:pk>/reparse/', ReparseStatementView.as_view(), name='statement-reparse'),
    path('accounts/', BankAccountListCreateView.as_view(), name='bank-accounts'),
]
