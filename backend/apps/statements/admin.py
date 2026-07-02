from django.contrib import admin
from .models import BankAccount, Statement


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ['user', 'bank_name', 'account_type', 'account_last4', 'created_at']
    search_fields = ['user__email', 'bank_name']
    list_filter = ['bank_name', 'account_type']


@admin.register(Statement)
class StatementAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'user', 'file_type', 'status', 'transaction_count', 'created_at']
    search_fields = ['file_name', 'user__email']
    list_filter = ['status', 'file_type']
    readonly_fields = ['parsed_at', 'created_at']