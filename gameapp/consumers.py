from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Handle WebSocket connection with authentication
        """
        self.room_group_name = 'game_lobby'
        self.user = None

        try:
            # Parse and validate token
            query_string = self.scope['query_string'].decode()
            if 'token=' not in query_string:
                raise ValueError("No authentication token provided")
            
            token = query_string.split('token=')[1].split('&')[0]
            
            try:
                # Verify token and get user
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                self.user = await database_sync_to_async(User.objects.get)(id=user_id)
                self.scope['user'] = self.user
                
                # Join room group first
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                
                # Accept the connection
                await self.accept()
                
                # Announce user connection
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'system_message',
                        'message': f'{self.user.username} has joined the chat',
                        'message_type': 'user_joined'
                    }
                )
                
            except TokenError as e:
                logger.warning(f"Invalid token: {str(e)}")
                await self.close(code=4001)
            except User.DoesNotExist:
                logger.warning(f"User not found for ID: {user_id}")
                await self.close(code=4002)
                
        except Exception as e:
            logger.error(f"Connection error: {str(e)}")
            await self.close(code=4000)

    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection
        """
        if hasattr(self, 'user') and self.user:
            try:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'system_message',
                        'message': f'{self.user.username} has left the chat',
                        'message_type': 'user_left'
                    }
                )
            except Exception as e:
                logger.error(f"Error sending disconnect message: {str(e)}")

        # Leave room group
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            logger.error(f"Error leaving group: {str(e)}")

    async def receive(self, text_data):
        """
        Handle incoming messages from WebSocket
        """
        try:
            data = json.loads(text_data)
            
            if not isinstance(data, dict):
                raise ValueError("Invalid message format")
                
            message = data.get('message')
            if not message or not isinstance(message, str):
                raise ValueError("Invalid or missing message")

            # Get the username of the logged-in user
            username = self.user.username
            timestamp = datetime.now().isoformat()

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                    'timestamp': timestamp,
                    'message_type': 'user_message'
                }
            )

        except json.JSONDecodeError:
            logger.warning("Invalid JSON received")
            await self.send(text_data=json.dumps({
                'error': 'Invalid message format',
                'message_type': 'error'
            }))
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': 'Server error processing message',
                'message_type': 'error'
            }))

    async def chat_message(self, event):
        """
        Handle chat messages received from room group
        """
        try:
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': event['message'],
                'username': event['username'],
                'timestamp': event['timestamp'],
                'message_type': event['message_type']
            }))
        except Exception as e:
            logger.error(f"Error sending chat message: {str(e)}")

    async def system_message(self, event):
        """
        Handle system messages (join/leave notifications)
        """
        try:
            await self.send(text_data=json.dumps({
                'message': event['message'],
                'message_type': event['message_type']
            }))
        except Exception as e:
            logger.error(f"Error sending system message: {str(e)}")