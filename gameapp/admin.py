from django.contrib import admin
from .models import Game, Player, Tournament,  Wager, Games

# Register your models here.
admin.site.register(Games)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Wager)
admin.site.register(Tournament)

