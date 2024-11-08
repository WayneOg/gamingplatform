# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, GameList,LoginView, GamesViewSet, TournamentViewSet, WagerViewSet, SignupView, OnlinePlayersView
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CheckAuthView
from django.conf.urls.static import static
from django.conf import settings


router = DefaultRouter()
router.register(r'game', GameViewSet)
router.register(r'wagers', WagerViewSet)
router.register(r'games', GamesViewSet)
router.register(r'tournaments', TournamentViewSet, basename='tournament')


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/check-auth/", CheckAuthView.as_view(), name="check_auth"),
    path("api/online-players/", OnlinePlayersView.as_view(), name="online_players"),
    path('api/gameslist/', GameList.as_view(), name='game-list'),
  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

