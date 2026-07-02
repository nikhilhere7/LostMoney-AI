from django.db import models
from apps.users.models import User
from apps.transactions.models import Category


class MonthlyReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='monthly_reports')
    year = models.IntegerField()
    month = models.IntegerField()
    total_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_expenses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_savings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    category_breakdown = models.JSONField(default=dict)
    generated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} | {self.year}-{self.month:02d}"

    class Meta:
        unique_together = ['user', 'year', 'month']
        ordering = ['-year', '-month']


class SavingsSuggestion(models.Model):
    SUGGESTION_TYPE = [
        ('subscription', 'Unused Subscription'),
        ('overspending', 'Overspending Alert'),
        ('savings_goal', 'Savings Goal'),
        ('recurring', 'Recurring Payment Alert'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='suggestions')
    suggestion_type = models.CharField(max_length=20, choices=SUGGESTION_TYPE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    potential_savings = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.suggestion_type} | {self.title}"

    class Meta:
        ordering = ['-created_at']