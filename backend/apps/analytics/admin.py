from django.contrib import admin
from .models import MonthlyReport, SavingsSuggestion


@admin.register(MonthlyReport)
class MonthlyReportAdmin(admin.ModelAdmin):
    list_display = ['user', 'year', 'month', 'total_income', 'total_expenses', 'net_savings']
    list_filter = ['year', 'month']
    readonly_fields = ['generated_at']


@admin.register(SavingsSuggestion)
class SavingsSuggestionAdmin(admin.ModelAdmin):
    list_display = ['user', 'suggestion_type', 'title', 'potential_savings', 'is_read']
    list_filter = ['suggestion_type', 'is_read']