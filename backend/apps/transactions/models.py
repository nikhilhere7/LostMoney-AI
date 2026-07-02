from django.db import models
from apps.users.models import User


class Category(models.Model):
    CATEGORY_CHOICES = [
        ('food_dining', 'Food & Dining'),
        ('groceries', 'Groceries'),
        ('transport', 'Transport'),
        ('utilities', 'Utilities'),
        ('rent_housing', 'Rent & Housing'),
        ('subscriptions', 'Subscriptions'),
        ('shopping', 'Shopping'),
        ('healthcare', 'Healthcare'),
        ('entertainment', 'Entertainment'),
        ('salary_income', 'Salary & Income'),
        ('transfers', 'Transfers'),
        ('investments', 'Investments'),
        ('emi_loans', 'EMI & Loans'),
        ('education', 'Education'),
        ('miscellaneous', 'Miscellaneous'),
    ]

    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True)
    is_income = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name

    class Meta:
        verbose_name_plural = 'Categories'


class Transaction(models.Model):
    TRANSACTION_TYPE = [
        ('debit', 'Debit'),
        ('credit', 'Credit'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    statement = models.ForeignKey('statements.Statement', on_delete=models.CASCADE, related_name='transactions', null=True)
    date = models.DateField()
    value_date = models.DateField(null=True, blank=True)
    description = models.TextField()
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE)
    balance = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    is_recurring = models.BooleanField(default=False)
    recurring_group = models.ForeignKey('RecurringGroup', on_delete=models.SET_NULL, null=True, blank=True)
    raw_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date} | {self.description[:40]} | {self.amount}"

    class Meta:
        ordering = ['-date']


class RecurringGroup(models.Model):
    FREQUENCY_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
        ('irregular', 'Irregular'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recurring_groups')
    merchant_pattern = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    average_amount = models.DecimalField(max_digits=12, decimal_places=2)
    last_detected = models.DateField(auto_now=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.merchant_pattern} | {self.frequency}"