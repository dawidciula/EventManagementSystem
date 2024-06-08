from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from ..views import UserRegister, UserLogin, UserLogout, UserView

User = get_user_model()

class UserRegisterTestCase(TestCase):
    def setUp(self):
        self.client = Client()
    
    def test_get(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)

    def test_post_invalid_data(self):
        response = self.client.post(reverse('register'), data={})
        self.assertEqual(response.status_code, 200) 



class UserLoginTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client = Client()
    
    def test_get(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)

    def test_post_valid_data(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(reverse('login'), data=data)
        self.assertEqual(response.status_code, 302) 


class UserLogoutTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client = Client()
    
    def test_get(self):
        response = self.client.get(reverse('logout'))
        self.assertEqual(response.status_code, 302) 


class UserViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client = Client()
    
    def test_get(self):
        self.client.force_login(self.user) 
        response = self.client.get(reverse('user_detail', args=[self.user.pk]))
        self.assertEqual(response.status_code, 200)

    def test_post_invalid_data(self):
        self.client.force_login(self.user) 
        response = self.client.post(reverse('user_detail', args=[self.user.pk]), data={})
        self.assertEqual(response.status_code, 200)