RULES = {
    'food_dining': [
        'swiggy', 'zomato', 'dominos', 'domino', 'pizza', 'mcdonald',
        'burger king', 'kfc', 'subway', 'dunkin', 'starbucks', 'cafe',
        'restaurant', 'food', 'eat', 'dining', 'biryani', 'hotel',
    ],
    'groceries': [
        'bigbasket', 'grofers', 'blinkit', 'zepto', 'dmart', 'reliance fresh',
        'more supermarket', 'spencer', 'nature basket', 'grocery', 'supermarket',
        'vegetables', 'fruits', 'kirana',
    ],
    'transport': [
        'uber', 'ola', 'rapido', 'auto', 'taxi', 'cab', 'metro', 'irctc',
        'indian railways', 'bus', 'petrol', 'diesel', 'fuel', 'hp petrol',
        'indian oil', 'bharat petroleum', 'indigo', 'air india', 'spicejet',
        'goair', 'vistara', 'flight', 'airways', 'airlines', 'parking',
        'fastag', 'toll',
    ],
    'utilities': [
        'electricity', 'bescom', 'mseb', 'tata power', 'adani electric',
        'water', 'gas', 'mahanagar gas', 'indraprastha gas', 'airtel',
        'jio', 'vodafone', 'vi ', 'bsnl', 'broadband', 'internet',
        'postpaid', 'prepaid', 'recharge', 'bill payment', 'bbps',
    ],
    'subscriptions': [
        'netflix', 'spotify', 'hotstar', 'disney', 'amazon prime',
        'prime video', 'youtube premium', 'apple', 'google play',
        'zee5', 'sonyliv', 'jiocinema', 'subscription', 'membership',
    ],
    'shopping': [
        'amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho',
        'snapdeal', 'shopclues', 'tata cliq', 'reliance digital',
        'croma', 'vijay sales', 'online shopping',
    ],
    'healthcare': [
        'pharmacy', 'medical', 'hospital', 'clinic', 'doctor', 'apollo',
        'medplus', 'netmeds', 'pharmeasy', '1mg', 'diagnostic', 'lab',
        'health', 'medicine', 'insurance', 'star health', 'hdfc ergo',
    ],
    'entertainment': [
        'pvr', 'inox', 'bookmyshow', 'cinema', 'movie', 'theatre',
        'gaming', 'steam', 'playstation', 'xbox', 'concert', 'event',
    ],
    'salary_income': [
        'salary', 'sal ', 'payroll', 'neft cr', 'credit salary',
        'stipend', 'wages', 'income',
    ],
    'investments': [
        'zerodha', 'groww', 'upstox', 'kuvera', 'coin', 'mutual fund',
        'mf ', 'sip', 'nse', 'bse', 'stock', 'equity', 'demat',
        'ppf', 'nps', 'lic', 'insurance premium',
    ],
    'emi_loans': [
        'emi', 'loan', 'nach', 'ecs', 'equated', 'home loan',
        'car loan', 'personal loan', 'bajaj finance', 'hdfc loan',
        'icici loan', 'repayment',
    ],
    'education': [
        'school', 'college', 'university', 'tuition', 'coaching',
        'udemy', 'coursera', 'byju', 'unacademy', 'fees', 'exam',
    ],
    'transfers': [
        'upi', 'neft', 'imps', 'rtgs', 'transfer', 'trf', 'sent to',
        'received from', 'payment to', 'payment from', 'self transfer',
    ],
}
def categorize_transaction(description, amount, transaction_type):
    """
    Categorize a transaction based on its description.
    Returns category name string.
    """
    desc_lower = description.lower()
    # salary is always credit
    if transaction_type == 'credit':
        for keyword in RULES['salary_income']:
            if keyword in desc_lower:
                return 'salary_income'
    # check each category's keywords
    for category, keywords in RULES.items():
        if category == 'salary_income' and transaction_type == 'debit':
            continue
        for keyword in keywords:
            if keyword in desc_lower:
                return category
    # default
    return 'miscellaneous'