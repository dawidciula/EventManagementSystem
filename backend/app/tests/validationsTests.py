from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from ..validations import custom_validation, validate_email, validate_username, validate_password

User = get_user_model()

class ValidationTests(TestCase):
    def test_custom_validation_valid_data(self):
        data = {
            "email": "valid@example.com",
            "username": "validuser",
            "password": "validpassword123"
        }
        validated_data = custom_validation(data)
        self.assertEqual(validated_data, data)

    def test_custom_validation_existing_email(self):
        User.objects.create_user(username='user1', email='existing@example.com', password='password123')
        data = {
            "email": "existing@example.com",
            "username": "validuser",
            "password": "validpassword123"
        }
        with self.assertRaises(ValidationError) as context:
            custom_validation(data)
        self.assertEqual(context.exception.messages[0], "choose another email")

    def test_custom_validation_short_password(self):
        data = {
            "email": "valid@example.com",
            "username": "validuser",
            "password": "short"
        }
        with self.assertRaises(ValidationError) as context:
            custom_validation(data)
        self.assertEqual(context.exception.messages[0], "choose another password, min 8 characters")

    def test_custom_validation_missing_username(self):
        data = {
            "email": "valid@example.com",
            "username": "",
            "password": "validpassword123"
        }
        with self.assertRaises(ValidationError) as context:
            custom_validation(data)
        self.assertEqual(context.exception.messages[0], "choose another username")

    def test_validate_email_valid(self):
        data = {"email": "valid@example.com"}
        result = validate_email(data)
        self.assertTrue(result)

    def test_validate_email_missing(self):
        data = {"email": ""}
        with self.assertRaises(ValidationError) as context:
            validate_email(data)
        self.assertEqual(context.exception.messages[0], "an email is needed")

    def test_validate_username_valid(self):
        data = {"username": "validuser"}
        result = validate_username(data)
        self.assertTrue(result)

    def test_validate_username_missing(self):
        data = {"username": ""}
        with self.assertRaises(ValidationError) as context:
            validate_username(data)
        self.assertEqual(context.exception.messages[0], "choose another username")

    def test_validate_password_valid(self):
        data = {"password": "validpassword123"}
        result = validate_password(data)
        self.assertTrue(result)

    def test_validate_password_missing(self):
        data = {"password": ""}
        with self.assertRaises(ValidationError) as context:
            validate_password(data)
        self.assertEqual(context.exception.messages[0], "a password is needed")
