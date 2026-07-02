from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from pprint import pprint
from django.shortcuts import get_object_or_404

import cloudinary.uploader

from .models import Statement, BankAccount
from .serializers import (
    StatementSerializer,
    StatementUploadSerializer,
    BankAccountSerializer,
)


class BankAccountListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BankAccountSerializer

    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StatementListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StatementSerializer

    def get_queryset(self):
        return Statement.objects.filter(user=self.request.user)


class StatementUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = StatementUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        file = serializer.validated_data["file"]
        bank_name = serializer.validated_data["bank_name"]
        account_type = serializer.validated_data["account_type"]
        account_last4 = serializer.validated_data.get("account_last4", "")

        # Create/Get Bank Account
        bank_account, _ = BankAccount.objects.get_or_create(
            user=request.user,
            bank_name=bank_name,
            account_type=account_type,
            defaults={
                "account_last4": account_last4
            },
        )

        # Detect file type
        ext = file.name.split(".")[-1].lower()

        file_type_map = {
            "pdf": "pdf",
            "csv": "csv",
            "xlsx": "excel",
            "xls": "excel",
        }

        file_type = file_type_map.get(ext, "csv")

        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            file,
            resource_type="raw",
            folder="statements",
        )
        pprint(upload_result)
        
        # Save Statement
        statement = Statement.objects.create(
            user=request.user,
            bank_account=bank_account,
            file_url=upload_result["secure_url"],
            public_id=upload_result["public_id"],
            file_name=file.name,
            file_type=file_type,
            status="uploaded",
        )

        # Background Parsing
        from apps.statements.tasks import parse_statement_task

        parse_statement_task.delay(statement.id)

        return Response(
            {
                "message": "Statement uploaded successfully. Parsing started.",
                "statement_id": statement.id,
                "status": statement.status,
                "file_name": statement.file_name,
            },
            status=status.HTTP_201_CREATED,
        )


class StatementDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StatementSerializer

    def get_queryset(self):
        return Statement.objects.filter(user=self.request.user)


class ReparseStatementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        statement = get_object_or_404(
            Statement,
            pk=pk,
            user=request.user,
        )

        if statement.status == "processing":
            return Response(
                {
                    "error": "Statement is already being processed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        statement.status = "uploaded"
        statement.error_message = None
        statement.save()

        from apps.statements.tasks import parse_statement_task

        parse_statement_task.delay(statement.id)

        return Response(
            {
                "message": "Reparse started.",
                "statement_id": statement.id,
            }
        )