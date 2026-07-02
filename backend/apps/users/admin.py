from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'phone', 'is_active', 'created_at']
    search_fields = ['email', 'username']
    ordering = ['-created_at']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone',)}),
    )