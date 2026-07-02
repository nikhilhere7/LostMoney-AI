from celery import shared_task
from django.utils import timezone


@shared_task
def parse_statement_task(statement_id):
    from .models import Statement

    # First, safely fetch the statement
    try:
        statement = Statement.objects.get(id=statement_id)
    except Statement.DoesNotExist:
        return f"Statement with ID {statement_id} does not exist."

    try:
        # Update status
        statement.status = "processing"
        statement.save()

        # Parse according to file type
        if statement.file_type == "pdf":
            from apps.statements.parsers.pdf_parser import parse_pdf
            transactions = parse_pdf(statement)

        elif statement.file_type in ["csv", "excel"]:
            from apps.statements.parsers.csv_parser import parse_csv
            transactions = parse_csv(statement)

        else:
            raise ValueError(f"Unsupported file type: {statement.file_type}")

        # Update statement after successful parsing
        statement.status = "completed"
        statement.transaction_count = len(transactions)
        statement.parsed_at = timezone.now()

        if transactions:
            dates = [t["date"] for t in transactions]
            statement.date_from = min(dates)
            statement.date_to = max(dates)

        statement.save()

        # Trigger recurring payment detection
        detect_recurring_task.delay(statement.user.id)

        return f"Successfully parsed {len(transactions)} transactions"

    except Exception as e:
        # Mark statement as failed
        statement.status = "failed"
        statement.error_message = str(e)
        statement.save()

        raise


@shared_task
def detect_recurring_task(user_id):
    from apps.transactions.recurring import detect_recurring_payments
    from apps.users.models import User

    try:
        user = User.objects.get(id=user_id)
        count = detect_recurring_payments(user)
        return f"Detected {count} recurring payment groups"

    except User.DoesNotExist:
        return f"User with ID {user_id} does not exist."

    except Exception as e:
        raise