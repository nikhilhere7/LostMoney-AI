from rest_framework import serializers
from .models import Statement, BankAccount


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ['id', 'bank_name', 'account_type', 'account_last4', 'nickname', 'created_at']
        read_only_fields = ['id', 'created_at']


class StatementSerializer(serializers.ModelSerializer):
    bank_account = BankAccountSerializer(read_only=True)
    bank_account_id = serializers.PrimaryKeyRelatedField(
        queryset=BankAccount.objects.all(),
        source='bank_account',
        write_only=True,
        required=False
    )

    class Meta:
        model = Statement
        fields = [
            'id', 'file', 'file_name', 'file_type', 'status',
            'bank_account', 'bank_account_id', 'transaction_count',
            'date_from', 'date_to', 'error_message', 'parsed_at', 'created_at'
        ]
        read_only_fields = [
            'id', 'status', 'transaction_count', 'date_from',
            'date_to', 'error_message', 'parsed_at', 'created_at'
        ]


class StatementUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
    bank_name = serializers.ChoiceField(choices=BankAccount.BANK_CHOICES)
    account_type = serializers.ChoiceField(choices=BankAccount.ACCOUNT_TYPE)
    account_last4 = serializers.CharField(max_length=4, required=False)

    class Meta:
        model = Statement
        fields = ['file', 'bank_name', 'account_type', 'account_last4']

    def validate_file(self, value):
        ext = value.name.split('.')[-1].lower()
        if ext not in ['pdf', 'csv', 'xlsx', 'xls']:
            raise serializers.ValidationError(
                'Only PDF, CSV, and Excel files are allowed'
            )
        if value.size > 10 * 1024 * 1024:  # 10MB limit
            raise serializers.ValidationError(
                'File size must not exceed 10MB'
            )
        return value