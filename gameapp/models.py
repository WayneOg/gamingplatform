# models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

class Game(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    release_date = models.DateField(null=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)  # Ensure this field exists
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=True) # Ensure this field exists if you are linking to games
    username = models.CharField(max_length=100)
    rank = models.PositiveIntegerField(default=0)
    points = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, default='offline')  # Example field for status
    last_active = models.DateTimeField(auto_now=True)  # Automatically updates on activity

    def __str__(self):
        return self.user.username

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
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    game = models.CharField(max_length=100, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    players = models.JSONField()  # Stores list of player IDs/names
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def clean(self):
        if not isinstance(self.players, list):
            raise ValidationError('Players must be a list')
        
        if len(self.players) > 2:
            raise ValidationError('A wager can only have up to 2 players')
        
        if len(set(self.players)) != len(self.players):
            raise ValidationError('Each player can only be listed once')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class Games(models.Model):
    title = models.CharField(max_length=100)
    players = models.CharField(max_length=10)  # E.g., "5v5"
    current_players = models.IntegerField(default=0)
    prize_pool = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField()
    image = models.ImageField(upload_to='games/images/', blank=True, null=True)

    def __str__(self):
        return self.title