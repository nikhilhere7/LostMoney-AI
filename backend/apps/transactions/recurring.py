from collections import defaultdict
from datetime import timedelta
from rapidfuzz import fuzz
import re


def normalize_description(description):
    """Clean description for matching."""
    desc = description.lower()
    # remove UPI transaction IDs and numbers
    desc = re.sub(r'upi[-/]\w+', 'upi', desc)
    desc = re.sub(r'\d{6,}', '', desc)
    desc = re.sub(r'/\w+/\w+', '', desc)
    desc = ' '.join(desc.split())
    return desc.strip()


def detect_frequency(dates):
    """Detect payment frequency from a list of dates."""
    if len(dates) < 2:
        return 'irregular'

    dates = sorted(dates)
    gaps = []
    for i in range(1, len(dates)):
        gap = (dates[i] - dates[i-1]).days
        gaps.append(gap)

    avg_gap = sum(gaps) / len(gaps)

    if avg_gap <= 10:
        return 'weekly'
    elif 25 <= avg_gap <= 35:
        return 'monthly'
    elif 85 <= avg_gap <= 95:
        return 'quarterly'
    elif 350 <= avg_gap <= 380:
        return 'yearly'
    else:
        return 'irregular'


def group_similar_transactions(transactions):
    """Group transactions with similar descriptions."""
    groups = []
    used = set()

    txn_list = list(transactions)

    for i, txn in enumerate(txn_list):
        if i in used:
            continue

        group = [txn]
        used.add(i)
        norm_i = normalize_description(txn.description)

        for j, other in enumerate(txn_list):
            if j in used or i == j:
                continue

            norm_j = normalize_description(other.description)
            similarity = fuzz.ratio(norm_i, norm_j)

            # also check amount similarity (within 10%)
            amount_similar = abs(float(txn.amount) - float(other.amount)) / max(float(txn.amount), 1) < 0.10

            if similarity >= 70 and amount_similar:
                group.append(other)
                used.add(j)

        if len(group) >= 2:
            groups.append(group)

    return groups


def detect_recurring_payments(user):
    """
    Main function — detect all recurring payments for a user.
    Returns number of recurring groups found.
    """
    from apps.transactions.models import Transaction, RecurringGroup

    # only look at debit transactions
    transactions = Transaction.objects.filter(
        user=user,
        transaction_type='debit'
    ).order_by('date')

    if not transactions.exists():
        return 0

    groups = group_similar_transactions(transactions)
    recurring_count = 0

    for group in groups:
        if len(group) < 2:
            continue

        dates = [t.date for t in group]
        amounts = [float(t.amount) for t in group]
        avg_amount = sum(amounts) / len(amounts)
        frequency = detect_frequency(dates)
        pattern = normalize_description(group[0].description)
        category = group[0].category

        # create or update recurring group
        rg, created = RecurringGroup.objects.update_or_create(
            user=user,
            merchant_pattern=pattern[:200],
            defaults={
                'frequency': frequency,
                'average_amount': round(avg_amount, 2),
                'category': category,
                'is_active': True,
            }
        )

        # mark all transactions in group as recurring
        for txn in group:
            txn.is_recurring = True
            txn.recurring_group = rg
            txn.save(update_fields=['is_recurring', 'recurring_group'])

        recurring_count += 1

    return recurring_count