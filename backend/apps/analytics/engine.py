from django.db.models import Sum, Count, Avg
from decimal import Decimal


def generate_monthly_report(user, year, month):
    """Generate a monthly financial report for a user."""
    from apps.transactions.models import Transaction
    from apps.analytics.models import MonthlyReport

    qs = Transaction.objects.filter(
        user=user,
        date__year=year,
        date__month=month
    )

    total_income = qs.filter(
        transaction_type='credit'
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

    total_expenses = qs.filter(
        transaction_type='debit'
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

    net_savings = total_income - total_expenses

    # category breakdown for expenses
    breakdown = qs.filter(
        transaction_type='debit'
    ).values(
        'category__name',
        'category__display_name'
    ).annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')

    category_breakdown = {}
    for item in breakdown:
        cat_name = item['category__name'] or 'miscellaneous'
        category_breakdown[cat_name] = {
            'display_name': item['category__display_name'] or 'Miscellaneous',
            'total': float(item['total']),
            'count': item['count']
        }

    report, created = MonthlyReport.objects.update_or_create(
        user=user,
        year=year,
        month=month,
        defaults={
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_savings': net_savings,
            'category_breakdown': category_breakdown,
        }
    )

    return report


def generate_savings_suggestions(user):
    """Generate savings suggestions based on spending patterns."""
    from apps.transactions.models import Transaction, RecurringGroup
    from apps.analytics.models import SavingsSuggestion, MonthlyReport

    suggestions = []

    # suggestion 1 — flag unused subscriptions
    subscriptions = RecurringGroup.objects.filter(
        user=user,
        category__name='subscriptions',
        is_active=True
    )
    for sub in subscriptions:
        SavingsSuggestion.objects.get_or_create(
            user=user,
            suggestion_type='subscription',
            title=f'Recurring subscription detected: {sub.merchant_pattern}',
            defaults={
                'description': f'You are spending ₹{sub.average_amount} {sub.frequency} on {sub.merchant_pattern}. Review if you still use this service.',
                'potential_savings': sub.average_amount * 12,
                'category': sub.category,
            }
        )
        suggestions.append(sub.merchant_pattern)

    # suggestion 2 — overspending alert
    # compare last month vs previous month
    from datetime import date
    today = date.today()
    current_month_qs = Transaction.objects.filter(
        user=user,
        transaction_type='debit',
        date__year=today.year,
        date__month=today.month
    )
    prev_month = today.month - 1 if today.month > 1 else 12
    prev_year = today.year if today.month > 1 else today.year - 1
    prev_month_qs = Transaction.objects.filter(
        user=user,
        transaction_type='debit',
        date__year=prev_year,
        date__month=prev_month
    )

    current_total = current_month_qs.aggregate(
        total=Sum('amount')
    )['total'] or Decimal('0')

    prev_total = prev_month_qs.aggregate(
        total=Sum('amount')
    )['total'] or Decimal('0')

    if prev_total > 0 and current_total > prev_total * Decimal('1.2'):
        increase = current_total - prev_total
        SavingsSuggestion.objects.get_or_create(
            user=user,
            suggestion_type='overspending',
            title='Spending increased significantly this month',
            defaults={
                'description': f'Your expenses this month (₹{current_total:.0f}) are 20%+ higher than last month (₹{prev_total:.0f}). Difference: ₹{increase:.0f}.',
                'potential_savings': increase,
            }
        )

    # suggestion 3 — recurring bank charges
    bank_charges = RecurringGroup.objects.filter(
        user=user,
        is_active=True,
        merchant_pattern__icontains='chrg'
    )
    for charge in bank_charges:
        SavingsSuggestion.objects.get_or_create(
            user=user,
            suggestion_type='recurring',
            title=f'Recurring bank charge detected',
            defaults={
                'description': f'You are being charged ₹{charge.average_amount} {charge.frequency} for: {charge.merchant_pattern}. Contact your bank to waive these fees.',
                'potential_savings': charge.average_amount * 12,
            }
        )

    return len(suggestions)