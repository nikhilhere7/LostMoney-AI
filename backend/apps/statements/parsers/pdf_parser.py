import pdfplumber
import camelot
import pandas as pd
from datetime import datetime
import re
import tempfile
import requests
import os

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
        return float(amount_str)
    except ValueError:
        return None

def detect_columns(df):
    col_map = {}

    for col in df.columns:
        col_lower = str(col).lower().strip()

        if "date" in col_lower:
            col_map["date"] = col

        elif "description" in col_lower:
            col_map["description"] = col

        elif "withdrawal" in col_lower or "debit" in col_lower:
            col_map["debit"] = col

        elif "deposit" in col_lower or "credit" in col_lower:
            col_map["credit"] = col

        elif "balance" in col_lower:
            col_map["balance"] = col

        elif "ref" in col_lower or "chq" in col_lower:
            col_map["reference"] = col

    print("Detected Columns:", col_map)
    return col_map

def extract_transactions_from_df(df, statement):
    from apps.transactions.models import Transaction, Category
    from apps.statements.categorizer import categorize_transaction

    col_map = detect_columns(df)
    transactions = []

    if 'date' not in col_map or 'description' not in col_map:
        print(f"Missing required columns. col_map: {col_map}")
        return transactions

    for _, row in df.iterrows():
        try:
            date = parse_date(row[col_map['date']])
            if not date:
                continue

            description = " ".join(
                str(row[col_map["description"]].split)
            )
            if not description or description.lower() in ['nan', 'none', '']:
                continue

            # skip header-like or opening balance rows
            if description.lower() in ['opening balance', 'closing balance']:
                continue

            debit = clean_amount(row[col_map['debit']]) if 'debit' in col_map else None
            credit = clean_amount(row[col_map['credit']]) if 'credit' in col_map else None
            balance = clean_amount(row[col_map['balance']]) if 'balance' in col_map else None
            reference = str(row[col_map['reference']]).strip() if 'reference' in col_map else ''

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

            Transaction.objects.create(
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
            print(f'Row parse error: {e}')
            continue

    return transactions

def parse_with_camelot(pdf_path, statement):
    try:
        tables = camelot.read_pdf(pdf_path, pages='all', flavor='lattice')
        if not tables or tables.n == 0:
            tables = camelot.read_pdf(pdf_path, pages='all', flavor='stream')

        all_transactions = []
        for table in tables:
            df = table.df
            print("=" * 80)
            print(df.head(10))
            print("=" * 80)
            print(df.columns)
            print("=" * 80)
        df.columns = (
            df.iloc[0]
            .astype(str)
            .str.replace("\n", " ", regex=False)
            .str.replace(r"\s+", " ", regex=True)
            .str.strip()
        )
        df = df[1:].reset_index(drop=True)
            
        df = df.replace('', None)
        txns = extract_transactions_from_df(df, statement)
        all_transactions.extend(txns)

        return all_transactions
    except Exception as e:
        print(f'Camelot parse error: {e}')
        return []

def parse_with_pdfplumber(pdf_path, statement):
    try:
        all_transactions = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if not table or len(table) < 3:
                        continue
                    # find the real header row
                    header_row = 0
                    for i, row in enumerate(table):
                        row_str = ' '.join(str(c).lower() for c in row if c)
                        if 'date' in row_str and ('withdrawal' in row_str or 'debit' in row_str or 'deposit' in row_str or 'credit' in row_str):
                            header_row = i
                            break
                    headers = table[header_row]
                    data_rows = table[header_row + 1:]
                    df = pd.DataFrame(data_rows, columns=headers)
                    df = df.replace('', None)
                    txns = extract_transactions_from_df(df, statement)
                    all_transactions.extend(txns)
        return all_transactions
    except Exception as e:
        print(f'pdfplumber parse error: {e}')
        return []

def parse_pdf(statement):
    print("Cloudinary URL:", statement.file_url)

    response = requests.get(statement.file_url)

    print("Status Code:", response.status_code)
    print("Response:", response.text[:300])

    if response.status_code != 200:
        raise Exception("Could not download PDF from Cloudinary")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
        temp_pdf.write(response.content)
        temp_path = temp_pdf.name

    try:
        transactions = parse_with_camelot(temp_path, statement)

        if not transactions:
            print("Camelot found no transactions, trying pdfplumber...")
            transactions = parse_with_pdfplumber(temp_path, statement)

        return transactions

    finally:
        import gc
        import time

        gc.collect()
        time.sleep(1)

        try:
            os.remove(temp_path)
        except PermissionError:
            pass