from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from .models import Transaction, Category, RecurringGroup
from .serializers import TransactionSerializer, CategorySerializer, RecurringGroupSerializer


class TransactionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user).select_related('category')
        category = self.request.query_params.get('category')
        txn_type = self.request.query_params.get('type')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        search = self.request.query_params.get('search')
        if category:
            qs = qs.filter(category__name=category)
        if txn_type:
            qs = qs.filter(transaction_type=txn_type)
        if date_from:
            qs = qs.filter(date__gte=date_from)
        if date_to:
            qs = qs.filter(date__lte=date_to)
        if search:
            qs = qs.filter(description__icontains=search)
        return qs


class TransactionDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class TransactionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Transaction.objects.filter(user=request.user)
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        if month and year:
            qs = qs.filter(date__month=month, date__year=year)
        total_income = qs.filter(transaction_type='credit').aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = qs.filter(transaction_type='debit').aggregate(total=Sum('amount'))['total'] or 0
        return Response({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_savings': total_income - total_expenses,
            'total_transactions': qs.count(),
        })


class TransactionByCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Transaction.objects.filter(user=request.user, transaction_type='debit')
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        if month and year:
            qs = qs.filter(date__month=month, date__year=year)
        breakdown = qs.values('category__name', 'category__display_name').annotate(
            total=Sum('amount'), count=Count('id')
        ).order_by('-total')
        return Response([{
            'category': i['category__name'] or 'miscellaneous',
            'display_name': i['category__display_name'] or 'Miscellaneous',
            'total': i['total'],
            'count': i['count']
        } for i in breakdown])


class CategoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class RecurringGroupListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecurringGroupSerializer

    def get_queryset(self):
        return RecurringGroup.objects.filter(user=self.request.user, is_active=True)


class DetectRecurringView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from apps.statements.tasks import detect_recurring_task
        detect_recurring_task.delay(request.user.id)
        return Response({'message': 'Recurring detection started in background'})
