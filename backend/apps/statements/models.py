from django.db import models
from apps.users.models import User


class BankAccount(models.Model):
    BANK_CHOICES = [
        ('sbi', 'State Bank of India'),
        ('hdfc', 'HDFC Bank'),
        ('icici', 'ICICI Bank'),
        ('axis', 'Axis Bank'),
        ('kotak', 'Kotak Mahindra Bank'),
        ('pnb', 'Punjab National Bank'),
        ('other', 'Other'),
    ]

    ACCOUNT_TYPE = [
        ('savings', 'Savings Account'),
        ('current', 'Current Account'),
        ('salary', 'Salary Account'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bank_accounts')
    bank_name = models.CharField(max_length=20, choices=BANK_CHOICES)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE)
    account_last4 = models.CharField(max_length=4, blank=True, null=True)
    nickname = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_bank_name_display()} - {self.account_last4}"


class Statement(models.Model):
    STATUS_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('csv', 'CSV'),
        ('excel', 'Excel'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='statements')
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='statements', null=True, blank=True)
    file = models.FileField(upload_to='statements/%Y/%m/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    file_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploaded')
    error_message = models.TextField(blank=True, null=True)
    transaction_count = models.IntegerField(default=0)
    date_from = models.DateField(null=True, blank=True)
    date_to = models.DateField(null=True, blank=True)
    parsed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} | {self.status}"

    class Meta:
        ordering = ['-created_at']