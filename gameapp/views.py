# views.py
from rest_framework import viewsets, status
from .models import Game, Wager, Tournament, Games, Player
from .serializers import GameSerializer, TournamentSerializer, UserSerializer, GameSerializer, GamesSerializer, WagerSerializer, OnlinePlayerSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework import status
from django.utils.timezone import now
from datetime import timedelta


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameList(APIView):
    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WagerViewSet(viewsets.ModelViewSet):
    queryset = Wager.objects.all()
    serializer_class = WagerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class SignupView(APIView):
    def post(self, request):
        # Extract user information from the request
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        game_id = request.data.get('game_id')
        rank = request.data.get('rank', 0) 

        try:
            # Check if the game_id exists
            game = Game.objects.get(id=game_id)  # Fetch the game instance
        except Game.DoesNotExist:
            return Response({'error': 'Game does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the user
            user = User.objects.create_user(username=username, email=email, password=password)

            # Get the game instance
            game_instance = Game.objects.get(id=game_id)  # Ensure this ID exists

            # Create a Player instance
            player = Player.objects.create(user=user, game=game_instance, rank=rank)  # Pass the game instance

            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Here you can add custom data to the response if needed
        return Response({
            'access': response.data['access'],
            'refresh': response.data['refresh'],
            'username': request.user.username,  # Send back the username
        })

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class GamesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Games.objects.all()
    serializer_class = GamesSerializer

class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'isAuthenticated': True}, status=status.HTTP_200_OK)

class OnlinePlayersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Define online threshold (e.g., players active within the last 2 minutes)
            online_threshold = now() - timedelta(minutes=2)
            
            # Query players with active status and recent activity
            online_players = Player.objects.filter(status='online', last_active__gte=online_threshold)
            
            # Serialize player data for a consistent output
            serializer = OnlinePlayerSerializer(online_players, many=True)
            
            # Get the logged-in user
            logged_in_user = request.user
            
            # Include logged-in user in the response
            online_players_data = serializer.data
            
            # Add logged-in user to the list if not already present
            if logged_in_user.username not in [player['username'] for player in online_players_data]:
                online_players_data.append({
                    'username': logged_in_user.username,
                    'status': 'online',  # Assuming they're online since they're authenticated
                    'game': None  # Add any default value or relevant game info
                })

            return Response(online_players_data, status=status.HTTP_200_OK)
        
        except Player.DoesNotExist:
            # Handle case where no players are found
            return Response({"error": "No online players found."}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            # Handle other unexpected errors
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
