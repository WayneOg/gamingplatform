# models.py
from django.db import models

class Game(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Player(models.Model):
    game = models.ForeignKey(Game, related_name="players", on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    rank = models.PositiveIntegerField()
    points = models.PositiveIntegerField()
    wins = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.username} ({self.game.name})"

class Tournament(models.Model):
    name = models.CharField(max_length=200)
    game = models.CharField(max_length=100, null=True)
    start_time = models.DateTimeField()
    prize_pool = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    entry_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    players = models.PositiveIntegerField(default=0)
    max_players = models.PositiveIntegerField(null=True)
    image_url = models.URLField(default="")

    def __str__(self):
        return self.name
    
class Wager(models.Model):
    game = models.CharField(max_length=100, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    players = models.JSONField(default=list)  # Store players as a list
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('closed', 'Closed')], default='open')

    def __str__(self):
        return f"{self.game} - ${self.amount} - {self.status}"