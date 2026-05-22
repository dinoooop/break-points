from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    """Serializer that exposes `phone`, `about`, and `avatar` as top-level
    fields on the User payload while storing them on the related Profile model.

    Important behaviour:
    - Reads: top-level fields are returned from Profile (if it exists).
    - Writes: top-level fields are accepted and the create/update methods will
      create or update the Profile accordingly (no nested `profile` key).
    """

    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    about = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    avatar = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    action = serializers.CharField(write_only=True, required=False)
    old_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",    # kept for compatibility but we'll fill it from email if missing
            "email",
            "password", # field only for create
            "first_name",
            "is_active",
            "phone",
            "about",
            "avatar",
            # security/action fields (write-only)
            "action",
            "old_password",
            "new_password",
            "confirm_password",
        ]
        read_only_fields = ["id", "is_active"]
        extra_kwargs = {
            # password is write-only. We'll enforce required-on-create in validate()
            "password": {"write_only": True, "required": False, "allow_blank": True, "allow_null": True},
            "email": {"required": False},
            "username": {"required": False},  # we'll set it automatically if not provided
        }

    def to_representation(self, instance):
        """Return top-level profile fields taken from the related Profile if present.
        This keeps the serialized payload flat (no nested `profile` key).
        """
        data = super().to_representation(instance)
        # fetch profile safely
        profile = getattr(instance, 'profile', None)
        if profile:
            data['phone'] = profile.phone
            data['about'] = profile.about
            data['avatar'] = profile.avatar
        else:
            # ensure keys exist and are null when profile missing
            data['phone'] = None
            data['about'] = None
            data['avatar'] = None
        return data

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
        
    def validate(self, attrs):
        action = attrs.get("action")
        request = self.context.get("request")

        # ------------------------------------------------------------------
        # ADMIN CREATE USER
        # ------------------------------------------------------------------
        if action == "admin_create_user":
            self._require_fields(attrs, ["first_name", "email", "password"])

            # Email is used as username, so must be unique
            if User.objects.filter(username=attrs["email"]).exists():
                raise serializers.ValidationError({
                    "email": "A user with this email already exists."
                })
            attrs["username"] = attrs["email"] 
        
        # ------------------------------------------------------------------
        # ADMIN EDIT USER
        # ------------------------------------------------------------------
        elif action == "admin_edit_user":
            self._require_fields(attrs, ["first_name", "email"])

            # Password may be omitted, null, or empty.
            # If null is sent, remove it so min_length is not checked.
            if attrs.get("password") in [None, ""]:
                attrs.pop("password", None)
            attrs["username"] = attrs["email"] 
        
        # ------------------------------------------------------------------
        # USER EDIT HIS PROFILE
        # ------------------------------------------------------------------
        elif action == "user_edit_profile":
            self._require_fields(attrs, ["first_name", "email"])
            attrs["username"] = attrs["email"] 

        # ------------------------------------------------------------------
        # USER EDIT HIS SECURITY (PASSWORD CHANGE)
        # ------------------------------------------------------------------
        elif action == "user_edit_security":
            self._require_fields(
                attrs,
                ["old_password", "new_password", "confirm_password"]
            )

            if attrs["new_password"] != attrs["confirm_password"]:
                raise serializers.ValidationError({
                    "confirm_password": "Passwords do not match."
                })

            # Validate old password against logged-in user
            
            if request and request.user.is_authenticated:
                if not request.user.check_password(attrs["old_password"]):
                    raise serializers.ValidationError({
                        "old_password": "Old password is incorrect."
                    })
            attrs["password"] = attrs["new_password"]
            
        return attrs
       
    def create(self, validated_data):
        
        action = validated_data.pop("action", None)
        if action == "admin_create_user":
            allow_create_user_data = ['email', 'first_name', 'username']
            user_data = {}
            for field in allow_create_user_data:
                if field in validated_data:
                    user_data[field] = validated_data.pop(field)
            user = User.objects.create(**user_data)
            password = validated_data.pop("password", None)
            if password:
                user.set_password(password)
                user.save()
                
            # CREATE PROFILE
            allow_create_profile_data = ['phone', 'about', 'avatar']
            profile_data = {}
            for field in allow_create_profile_data:
                if field in validated_data:
                    profile_data[field] = validated_data.pop(field)
            if profile_data:
                Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        
        action = validated_data.pop("action", None)
        
        if action == 'admin_edit_user' or action == 'user_edit_profile':
            allow_update_user_data = ['email', 'first_name', 'username']
            user_data = {}
            for field in allow_update_user_data:
                if field in validated_data:
                    user_data[field] = validated_data.pop(field)
            for attr, value in user_data.items():
                setattr(instance, attr, value)
        
            if action == 'admin_edit_user':
                password = validated_data.pop("password", None)
                if password:
                    instance.set_password(password)

            instance.save()
                    
            allow_update_profile_data = ['phone', 'about', 'avatar']
            profile_data = {}
            for field in allow_update_profile_data:
                if field in validated_data:
                    profile_data[field] = validated_data.pop(field)
            if profile_data:
                Profile.objects.update_or_create(user=instance, defaults=profile_data)
        
        if action == 'user_edit_security':
            # NOTE: validation already checked old_password/new_password/confirm_password
            new_password = validated_data.pop("new_password", None)
            
            if new_password:
                instance.set_password(new_password)
                instance.save()

        return instance
