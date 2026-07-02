from django.contrib import admin
from .models import Category, Transaction, RecurringGroup


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_name', 'is_income']
    list_filter = ['is_income']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['date', 'description', 'amount', 'transaction_type', 'category', 'is_recurring']
    search_fields = ['description', 'reference_no']
    list_filter = ['transaction_type', 'category', 'is_recurring']
    readonly_fields = ['created_at']


@admin.register(RecurringGroup)
class RecurringGroupAdmin(admin.ModelAdmin):
    list_display = ['merchant_pattern', 'frequency', 'average_amount', 'is_active']
    list_filter = ['frequency', 'is_active']