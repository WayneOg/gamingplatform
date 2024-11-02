# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet
from .views import TournamentViewSet
from .views import WagerViewSet
from .views import SignupView
from .views import LoginView


router = DefaultRouter()
router.register(r'games', GameViewSet)
router.register(r'tournaments', TournamentViewSet)
router.register(r'wagers', WagerViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
]
