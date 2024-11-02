# serializers.py
from rest_framework import serializers
from .models import Game, Player, Tournament,  Wager
from django.contrib.auth.models import User


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['rank', 'username', 'points', 'wins']

class GameSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)

    class Meta:
        model = Game
        fields = ['name', 'players']

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'game', 'start_time', 'prize_pool', 'entry_fee', 'players', 'max_players', 'image_url']

class WagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wager
        fields = ['id', 'game', 'amount', 'players', 'status']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user