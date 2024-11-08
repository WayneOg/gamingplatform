# serializers.py
from rest_framework import serializers
from .models import Game, Player, Tournament,  Wager, Games
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


User = get_user_model()

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['rank', 'username', 'points', 'wins']

class GameSerializer(serializers.ModelSerializer):
    #players = PlayerSerializer(many=True)

    class Meta:
        model = Game
        fields = ['id', 'name',  'description', 'release_date']

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'game', 'start_time', 'prize_pool', 'entry_fee', 'players', 'max_players', 'image_url']

    def validate(self, attrs):
        # Custom validation logic can be added here
        if attrs['max_players'] <= 0:
            raise serializers.ValidationError({"max_players": "Must be greater than zero."})
        if attrs['entry_fee'] < 0:
            raise serializers.ValidationError({"entry_fee": "Must be a non-negative value."})
        return attrs

        
class WagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wager
        fields = ['id', 'game', 'amount', 'players', 'status']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    game_id = serializers.IntegerField(write_only=True)  # Game selection from user

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'game_id']  # Include game_id

    def validate_game_id(self, value):
        if not Game.objects.filter(id=value).exists():
            raise serializers.ValidationError("Game does not exist.")
        return value

    def create(self, validated_data):
        game_id = validated_data.pop('game_id')  # Remove game_id from validated_data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Get the game instance from the provided game_id
        try:
            game = Game.objects.get(id=game_id)  # Fetch the game instance
        except Game.DoesNotExist:
            raise serializers.ValidationError({"game_id": "Game does not exist."})

        # Create the Player instance
        Player.objects.create(
            user=user,
            game=game,  # Use the fetched game instance
            rank=0,     # Set initial rank, or adjust as necessary
            points=0,   # Set initial points
            wins=0      # Set initial wins
        )

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = User.objects.filter(username=data['username']).first()
        if user and user.check_password(data['password']):
            refresh = RefreshToken.for_user(user)
            return {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'username': user.username,
            }
        raise serializers.ValidationError('Invalid credentials')


class GamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Games
        fields = '__all__'

class OnlinePlayerSerializer(serializers.ModelSerializer):
    last_active = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Player
        fields = ['id', 'username', 'status', 'game', 'last_active']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        return token
    
