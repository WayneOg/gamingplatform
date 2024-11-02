# views.py
from rest_framework import viewsets
from .models import Game
from .serializers import GameSerializer
from rest_framework.response import Response
from .models import Tournament
from .serializers import TournamentSerializer
from .models import Wager
from .serializers import WagerSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class TournamentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

class WagerViewSet(viewsets.ModelViewSet):
    queryset = Wager.objects.all()
    serializer_class = WagerSerializer

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        token['email'] = user.email
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

