from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import MonthlyReport, SavingsSuggestion
from .serializers import MonthlyReportSerializer, SavingsSuggestionSerializer


class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from apps.analytics.engine import generate_monthly_report, generate_savings_suggestions
        year = request.data.get('year', date.today().year)
        month = request.data.get('month', date.today().month)

        report = generate_monthly_report(request.user, int(year), int(month))
        generate_savings_suggestions(request.user)

        return Response({
            'message': f'Report generated for {year}-{month:02d}',
            'report': MonthlyReportSerializer(report).data
        })


class MonthlyReportListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MonthlyReportSerializer

    def get_queryset(self):
        return MonthlyReport.objects.filter(user=self.request.user)


class SavingsSuggestionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SavingsSuggestionSerializer

    def get_queryset(self):
        return SavingsSuggestion.objects.filter(
            user=self.request.user
        )


class MarkSuggestionReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            suggestion = SavingsSuggestion.objects.get(
                pk=pk, user=request.user
            )
            suggestion.is_read = True
            suggestion.save()
            return Response({'message': 'Marked as read'})
        except SavingsSuggestion.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)