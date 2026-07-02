from rest_framework import serializers
from .models import Transaction, Category, RecurringGroup


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'display_name', 'is_income']


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )

    class Meta:
        model = Transaction
        fields = [
            'id', 'date', 'description', 'amount',
            'transaction_type', 'balance', 'reference_no',
            'category', 'category_id', 'is_recurring',
            'statement', 'created_at'
        ]
        read_only_fields = [
            'id', 'date', 'description', 'amount',
            'transaction_type', 'balance', 'reference_no',
            'statement', 'created_at'
        ]


class RecurringGroupSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    transaction_count = serializers.SerializerMethodField()

    class Meta:
        model = RecurringGroup
        fields = [
            'id', 'merchant_pattern', 'frequency',
            'average_amount', 'category', 'is_active',
            'last_detected', 'transaction_count'
        ]

    def get_transaction_count(self, obj):
        return obj.transaction_set.count()