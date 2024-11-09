from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from train_booking_chatbot import TrainBookingSystem
import eventlet

# Initialize eventlet
eventlet.monkey_patch()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Dictionary to store client-specific booking systems
client_sessions = {}

@app.route('/')
def index():
    return "Hello World"

@socketio.on('connect')
def handle_connect():
    # Create a new booking system instance for each client
    client_sessions[request.sid] = TrainBookingSystem()
    print(f'Client connected: {request.sid}')
    emit('message', {'response': 'Welcome to Train Booking Assistant! How can I help you today?'})

@socketio.on('disconnect')
def handle_disconnect():
    # Clean up the client's booking system instance
    if request.sid in client_sessions:
        del client_sessions[request.sid]
    print(f'Client disconnected: {request.sid}')

@socketio.on('message')
def handle_message(data):
    # Handle both string and dictionary inputs
    if isinstance(data, dict):
        user_input = data.get('message', '')
    else:
        user_input = str(data)
    
    booking_system = client_sessions.get(request.sid)
    
    if not booking_system:
        booking_system = TrainBookingSystem()
        client_sessions[request.sid] = booking_system
    
    if user_input.lower() == 'quit':
        response = "Thank you for using Train Booking Assistant. Goodbye!"
        client_sessions[request.sid] = TrainBookingSystem()
        emit('message', {'response': response, 'type': 'text'})
    else:
        response = booking_system.process_query(user_input)
        
        try:
            import json
            response_data = json.loads(response)
            
            # Check if 'type' key exists and determine its value
            if 'type' in response_data and response_data['type'] == 'summary':
                emit('message', {'response': 'Here is your booking summary:', 'summary': response_data, 'type': 'summary'})
            elif 'type' in response_data and response_data['type'] == 'confirmation':
                emit('message', {'response': 'Your booking is confirmed!', 'ticket': response_data, 'type': 'confirmation'})
            else:
                emit('message', {'response': 'Here are the available trains:', 'train_list': response_data, 'type': 'train_list'})


        except json.JSONDecodeError:
            # If response is not JSON, it's a regular text message
            emit('message', {'response': response, 'type': 'text'})
        except Exception as e:
            # Handle any other unexpected errors
            print(f"Error processing response: {e}")
            emit('message', {'response': 'Sorry, there was an error processing the train list.', 'type': 'text'})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)