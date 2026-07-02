import pandas as pd
from datetime import datetime
import re


DATE_FORMATS = [
    '%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y',
    '%d-%b-%Y', '%d %b %Y', '%d-%b-%y',
    '%Y-%m-%d', '%d.%m.%Y',
]


def parse_date(date_str):
    if not date_str:
        return None
    date_str = str(date_str).strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None


def clean_amount(amount_str):
    if not amount_str:
        return None
    amount_str = str(amount_str).strip()
    amount_str = amount_str.replace(',', '').replace(' ', '')
    amount_str = re.sub(r'[₹$£€]', '', amount_str)
    try:
        val = float(amount_str)
        return abs(val)
    except ValueError:
        return None


def detect_columns(df):
    col_map = {}
    for col in df.columns:
        col_lower = str(col).lower().strip()
        if any(k in col_lower for k in ['date', 'txn date', 'tran date']):
            if 'date' not in col_map:
                col_map['date'] = col
            else:
                col_map['value_date'] = col
        elif any(k in col_lower for k in ['narration', 'description', 'particulars', 'details', 'remarks']):
            col_map['description'] = col
        elif any(k in col_lower for k in ['debit', 'dr', 'withdrawal']):
            col_map['debit'] = col
        elif any(k in col_lower for k in ['credit', 'cr', 'deposit']):
            col_map['credit'] = col
        elif any(k in col_lower for k in ['balance', 'bal']):
            col_map['balance'] = col
        elif any(k in col_lower for k in ['chq', 'cheque', 'ref', 'reference']):
            col_map['reference'] = col
        elif any(k in col_lower for k in ['amount']):
            col_map['amount'] = col
    return col_map


def parse_csv(statement):
    """Parse CSV or Excel bank statements."""
    from apps.transactions.models import Transaction, Category
    from apps.statements.categorizer import categorize_transaction

    file_path = statement.file.path

    try:
        if statement.file_type == 'excel':
            df = pd.read_excel(file_path, header=None)
        else:
            # try different encodings
            for encoding in ['utf-8', 'latin-1', 'cp1252']:
                try:
                    df = pd.read_csv(file_path, header=None, encoding=encoding)
                    break
                except UnicodeDecodeError:
                    continue

        # find the header row (look for 'date' keyword)
        header_row = 0
        for i, row in df.iterrows():
            row_str = ' '.join(str(v).lower() for v in row.values)
            if 'date' in row_str and ('debit' in row_str or 'credit' in row_str or 'amount' in row_str):
                header_row = i
                break

        df.columns = df.iloc[header_row]
        df = df[header_row + 1:].reset_index(drop=True)
        df = df.dropna(how='all')

        col_map = detect_columns(df)
        transactions = []

        if 'date' not in col_map:
            return transactions

        for _, row in df.iterrows():
            try:
                date = parse_date(row.get(col_map['date']))
                if not date:
                    continue

                description = str(row.get(col_map.get('description', ''), '')).strip()
                if not description or description.lower() in ['nan', 'none', '']:
                    continue

                debit = clean_amount(row.get(col_map.get('debit', ''), ''))
                credit = clean_amount(row.get(col_map.get('credit', ''), ''))
                balance = clean_amount(row.get(col_map.get('balance', ''), ''))
                reference = str(row.get(col_map.get('reference', ''), '')).strip()

                # handle single amount column
                if 'amount' in col_map and not debit and not credit:
                    raw_amount = row.get(col_map['amount'], '')
                    amount_val = clean_amount(raw_amount)
                    raw_str = str(raw_amount)
                    if amount_val:
                        if '-' in raw_str:
                            debit = amount_val
                        else:
                            credit = amount_val

                if debit and debit > 0:
                    amount = debit
                    txn_type = 'debit'
                elif credit and credit > 0:
                    amount = credit
                    txn_type = 'credit'
                else:
                    continue

                category_name = categorize_transaction(description, amount, txn_type)
                category = Category.objects.filter(name=category_name).first()

                txn = Transaction.objects.create(
                    user=statement.user,
                    statement=statement,
                    date=date,
                    description=description,
                    reference_no=reference if reference != 'nan' else '',
                    amount=amount,
                    transaction_type=txn_type,
                    balance=balance,
                    category=category,
                    raw_data={}
                )
                transactions.append({
                    'date': date,
                    'description': description,
                    'amount': amount,
                    'type': txn_type
                })

            except Exception as e:
                print(f'Row error: {e}')
                continue

        return transactions

    except Exception as e:
        print(f'CSV parse error: {e}')
        return []
