from rest_framework import serializers
from .models import MonthlyReport, SavingsSuggestion


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = [
            'id', 'year', 'month', 'total_income',
            'total_expenses', 'net_savings',
            'category_breakdown', 'generated_at'
        ]


class SavingsSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsSuggestion
        fields = [
            'id', 'suggestion_type', 'title',
            'description', 'potential_savings',
            'category', 'is_read', 'created_at'
        ]