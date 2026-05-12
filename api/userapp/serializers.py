# userapp/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    """
    Single serializer to validate multiple forms based on `action`.

    Supported actions:
    - admin_create_user
    - admin_edit_user
    - user_edit_profile
    - user_edit_security
    """

    ACTION_CHOICES = [
        "admin_create_user",
        "admin_edit_user",
        "user_edit_profile",
        "user_edit_security",
    ]

    # Hidden field sent by client
    action = serializers.ChoiceField(choices=ACTION_CHOICES)

    # Common fields
    full_name = serializers.CharField(required=False, allow_blank=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(
        required=False,
        allow_blank=False,
        min_length=7,
        write_only=True,
    )

    phone = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=15,
    )
    about = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    avatar = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=100,
    )

    # Security fields
    old_password = serializers.CharField(
        required=False,
        allow_blank=False,
        write_only=True,
    )
    new_password = serializers.CharField(
        required=False,
        allow_blank=False,
        min_length=7,
        write_only=True,
    )
    confirm_new_password = serializers.CharField(
        required=False,
        allow_blank=False,
        write_only=True,
    )

    def validate(self, attrs):
        action = attrs.get("action")

        # ------------------------------------------------------------------
        # admin_create_user
        # Required:
        # - full_name
        # - email
        # - password (min_length already enforced)
        # ------------------------------------------------------------------
        if action == "admin_create_user":
            self._require_fields(attrs, ["full_name", "email", "password"])

            # Email is used as username, so must be unique
            if User.objects.filter(username=attrs["email"]).exists():
                raise serializers.ValidationError({
                    "email": "A user with this email already exists."
                })
            attrs["username"] = attrs["email"] 
            attrs["first_name"] = attrs["full_name"]
            return attrs
        # ------------------------------------------------------------------
        # admin_edit_user
        # Required:
        # - full_name
        # - email
        # Optional:
        # - password (if provided, min_length already enforced)
        # ------------------------------------------------------------------
        elif action == "admin_edit_user":
            self._require_fields(attrs, ["full_name", "email"])

            # Password may be omitted, null, or empty.
            # If null is sent, remove it so min_length is not checked.
            if attrs.get("password") in [None, ""]:
                attrs.pop("password", None)
            attrs["username"] = attrs["email"] 
            attrs["first_name"] = attrs["full_name"]
            return attrs

        # ------------------------------------------------------------------
        # user_edit_profile
        # Required:
        # - full_name
        # - email
        # ------------------------------------------------------------------
        elif action == "user_edit_profile":
            self._require_fields(attrs, ["full_name", "email"])
            attrs["username"] = attrs["email"] 
            attrs["first_name"] = attrs["full_name"]
            return attrs

        # ------------------------------------------------------------------
        # user_edit_security
        # Required:
        # - old_password
        # - new_password
        # - confirm_new_password
        # Checks:
        # - new_password == confirm_new_password
        # - old_password matches current user password (if request context exists)
        # ------------------------------------------------------------------
        elif action == "user_edit_security":
            self._require_fields(
                attrs,
                ["old_password", "new_password", "confirm_new_password"]
            )

            if attrs["new_password"] != attrs["confirm_new_password"]:
                raise serializers.ValidationError({
                    "confirm_new_password": "Passwords do not match."
                })

            # Validate old password against logged-in user
            request = self.context.get("request")
            if request and request.user.is_authenticated:
                if not request.user.check_password(attrs["old_password"]):
                    raise serializers.ValidationError({
                        "old_password": "Old password is incorrect."
                    })
            attrs["password"] = attrs["new_password"]
            return attrs

    def _require_fields(self, attrs, fields):
        """
        Helper to ensure required fields are present and not empty.
        """
        errors = {}

        for field in fields:
            value = attrs.get(field)

            if value is None:
                errors[field] = "This field is required."
            elif isinstance(value, str) and value.strip() == "":
                errors[field] = "This field is required."

        if errors:
            raise serializers.ValidationError(errors)