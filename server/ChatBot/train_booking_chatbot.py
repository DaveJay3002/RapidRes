import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta
import re
import random
import requests
import json
# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

SYSTEM_INSTRUCTION = """
You are a specialized Indian Railways booking assistant. Your core functions are:

1. Train Search:
   - Collect source station, destination station, and travel date`
   - Show available trains with timings and fares
   - Display seat availability in different classes

2. Ticket Booking:
   - Get train number from user
   - Ask for preferred class (1AC/2AC/3AC/SL/CC/EC)
   - Collect passenger details and confirm booking

3. PNR Status:
   - Accept 10-digit PNR number
   - Show booking status and journey details

4. Important Guidelines:
   - ONLY handle train-related queries
   - For non-train queries, politely redirect to train services
   - Collect information step by step
   - Validate all inputs before proceeding
   - Keep responses clear and concise

- important note:
 We are not using any predefined database please use search and find latest information for train in given formate
{
       "train_name": "Name of train",
       "train_id": "5-digit number",
       "departure_station": "three letter code",
       "departure_time": "HH:MM format",
       "arrival_station": "three letter code",
       "arrival_time": "HH:MM format",
       "classes": [
         {
           "class_type": "1AC/2AC/3AC/SL/CC/EC",
           "fare": "amount in INR",
           "seats_available": "number"
         }
       ]
     }

Remember: You are ONLY a train booking assistant. For any non-train queries, strictly deny the user and always give train search result in the json format only.
"""

class TrainBookingSystem:
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40
            },
            system_instruction=SYSTEM_INSTRUCTION
        )
        self.chat = self.model.start_chat(history=[])
        self.conversation_state = "idle"
        self.current_task = None
        self.user_data = {
            "source": None,
            "destination": None,
            "date": None,
            "train_id": None,
            "travel_class": None,
            "passengers": [],
            "pnr": None
        }
        self.booking_response = None

    def handle_journey_details(self, user_input: str) -> str:
        """Handle the journey details collection flow"""
        user_input = user_input.strip()
        
        # Handle source city
        if not self.user_data["source"]:
            # Ask model to validate if it's a valid Indian city
            validation_prompt = f"Is '{user_input}' a valid Indian city? Reply with only 'yes' or 'no'"
            response = self.chat.send_message(validation_prompt)
            if 'yes' in response.text.lower():
                self.user_data["source"] = user_input.title()
                return "Please specify your destination city"
            return "Please specify a valid Indian city name for departure"
        
        # Handle destination city
        if not self.user_data["destination"]:
            validation_prompt = f"Is '{user_input}' a valid Indian city? Reply with only 'yes' or 'no'"
            response = self.chat.send_message(validation_prompt)
            if 'yes' in response.text.lower():
                if user_input.title() == self.user_data["source"]:
                    return "Destination cannot be same as source. Please choose a different city"
                self.user_data["destination"] = user_input.title()
                return "When would you like to travel? Please specify the date (DD-MM-YYYY)"
            return "Please specify a valid Indian city name for destination"
        
        # Handle travel date
        if not self.user_data["date"]:
            try:
                date = datetime.strptime(user_input, '%d-%m-%Y')
                self.user_data["date"] = user_input
                return self.search_trains()
            except ValueError:
                return "Please provide date in DD-MM-YYYY format"
        
        return self.search_trains()

    def search_trains(self) -> str:
            """Search trains using the model"""
            # Check if route is Vadodara to Vasad
            if (self.user_data['source'].lower() == 'vadodara' and 
                self.user_data['destination'].lower() == 'vasad'):
                
                hardcoded_trains = [
                    {
                        "train_name": "SAURASHTRA EXP",
                        "train_id": "19015",
                        "departure_station": "BRC",
                        "departure_time": "18:02",
                        "arrival_station": "VSD",
                        "arrival_time": "18:22",
                        "classes": [
                            {
                                "class_type": "SL",
                                "fare": "145",
                                "seats_available": "50"
                            },
                            {
                                "class_type": "3A",
                                "fare": "505",
                                "seats_available": "20"
                            },
                            {
                                "class_type": "2A",
                                "fare": "710",
                                "seats_available": "10"
                            },
                            {
                                "class_type": "1A",
                                "fare": "1175",
                                "seats_available": "5"
                            }
                        ]
                    },
                    {
                        "train_name": "GUJARAT QUEEN",
                        "train_id": "19033",
                        "departure_station": "BRC",
                        "departure_time": "08:15",
                        "arrival_station": "VSD",
                        "arrival_time": "08:35",
                        "classes": [
                            {
                                "class_type": "2S",
                                "fare": "45",
                                "seats_available": "120"
                            },
                            {
                                "class_type": "CC",
                                "fare": "265",
                                "seats_available": "60"
                            }
                        ]
                    }
                ]
                self.conversation_state = "selecting_train"
                return json.dumps(hardcoded_trains)
            
            # For other routes, use the existing search logic
            search_prompt = f"""
            Search internet and return available real time trains from {self.user_data['source']} to {self.user_data['destination']} 
            for {self.user_data['date']}.  
        
            IMPORTANT: Return ONLY the raw JSON data without any markdown formatting or code block indicators.
            Do not include 
    json at the start or
    at the end.
        
            Return the data in this exact format:
            [
                {{
                    "train_name": "Name of train",
                    "train_id": "5-digit number",
                    "departure_station": "three letter code",
                    "departure_time": "HH:MM format",
                    "arrival_station": "three letter code",
                    "arrival_time": "HH:MM format",
                    "classes": [
                        {{
                            "class_type": "1AC/2AC/3AC/SL/CC/EC",
                            "fare": "amount in INR",
                            "seats_available": "number"
                        }}
                    ]
                }}
            ]
            """
            
            try:
                response = self.chat.send_message(search_prompt)
                self.conversation_state = "selecting_train"
                return response.text
                
            except Exception as e:
                print(f"Error in search_trains: {e}")
                return "Sorry, I couldn't find train information at the moment. Please try again."


    def handle_train_selection(self, user_input: str) -> str:
        """Handle train selection and class booking"""
        # Extract train ID from user input using regex
        train_id_match = re.search(r'\b\d{5}\b', user_input)
        
        if train_id_match:
            train_id = train_id_match.group(0)
            self.user_data["train_id"] = train_id
            self.conversation_state = "selecting_class"
            return "Please select your preferred class (1AC/2AC/3AC/SL/2S/CC/EC)"
        
        return "Please provide a valid 5-digit train number from the search results"

    def handle_class_selection(self, user_input: str) -> str:
        """Handle class selection and passenger details"""
        valid_classes = ['1AC', '2AC', '3AC', 'SL', "2S", 'CC', 'EC']
        class_input = user_input.upper()
        
        if class_input in valid_classes:
            self.user_data["travel_class"] = class_input
            self.conversation_state = "collecting_passengers"
            return "How many passengers would you like to book tickets for? (Maximum 6)"
        
        return "Please select a valid class (2S/1AC/2AC/3AC/SL/2S/CC/EC)"

    def handle_passenger_details(self, user_input: str) -> str:
        """Handle passenger information collection"""
        if "num_passengers" not in self.user_data:
            try:
                num = int(user_input)
                if 1 <= num <= 6:
                    self.user_data["num_passengers"] = num
                    self.user_data["current_passenger"] = 1
                    return f"Enter details for passenger 1 in format: Name, Age, Gender (M/F)"
                return "Please enter a number between 1 and 6"
            except ValueError:
                return "Please enter a valid number"
        
        if len(self.user_data["passengers"]) < self.user_data["num_passengers"]:
            try:
                name, age, gender = [x.strip() for x in user_input.split(',')]
                if not name or not age.isdigit() or gender.upper() not in ['M', 'F']:
                    return "Invalid format. Please enter: Name, Age, Gender (M/F)"
                
                passenger = {
                    "name": name,
                    "age": int(age),
                    "gender": gender.upper()
                }
                self.user_data["passengers"].append(passenger)
                
                if len(self.user_data["passengers"]) < self.user_data["num_passengers"]:
                    current = len(self.user_data["passengers"]) + 1
                    return f"Enter details for passenger {current} in format: Name, Age, Gender (M/F)"
                else:
                    self.conversation_state = "collecting_contact"
                    return "Please enter your contact number (10 digits)"
            except ValueError:
                return "Invalid format. Please enter: Name, Age, Gender (M/F)"

    def handle_contact_details(self, user_input: str) -> str:
        """Handle contact and payment details"""
        if "phone" not in self.user_data:
            if re.match(r'^\d{10}$', user_input):
                self.user_data["phone"] = user_input
                self.conversation_state = "collecting_payment"
                return "Please enter your UPI ID for payment"
            return "Please enter a valid 10-digit phone number"
        
        if self.conversation_state == "collecting_payment":
            if re.match(r'^[\w\.\-]+@[\w\-]+$', user_input):
                self.user_data["upi_id"] = user_input
                self.conversation_state = "confirming_booking"
                return self.show_booking_summary()
            return "Please enter a valid UPI ID"

    def show_booking_summary(self) -> dict:
        """Show booking summary and return it as a dictionary compatible with SummaryType"""
        # Keep date in DD-MM-YYYY format
        date_formatted = self.user_data['date']
        
        # Prepare the passengers list in the required format
        passengers = [
            {
                "name": passenger['name'],
                "age": passenger['age'],
                "gender": passenger['gender']
            }
            for passenger in self.user_data["passengers"]
        ]
        
        # Create and return the summary dictionary
        summary = {
            "trainId": self.user_data['train_id'],
            "train": f"{self.user_data['train_id']} - Class: {self.user_data['travel_class']}",
            "class": self.user_data['travel_class'],
            "from": self.user_data['source'],
            "to": self.user_data['destination'],
            "date": date_formatted,
            "passengers": passengers,
            "totalFare": f"₹{self.calculate_total_fare()}",
            "contact": self.user_data['phone'],
            "upid": self.user_data['upi_id'],
            "type" : "summary"
        }

        summary = json.dumps(summary)
        return summary

    def calculate_total_fare(self) -> int:
        """Calculate total fare based on number of passengers and class"""
        # Default base fare if we can't find the train data
        base_fare = 45  
        
        # Get the train data from the last search response
        try:
            response = self.chat.send_message(f"Get fare for train {self.user_data['train_id']} class {self.user_data['travel_class']}")
            import json
            data = json.loads(response.text)
            for train in data:
                if train['train_id'] == self.user_data['train_id']:
                    for class_info in train['classes']:
                        if class_info['class_type'] == self.user_data['travel_class']:
                            base_fare = int(class_info['fare'])
                            break
        except:
            pass  # Use default fare if there's any error
        
        return base_fare * len(self.user_data["passengers"])

    def process_query(self, user_input: str) -> str:
        """Process user queries and direct to appropriate handlers"""
        if self.conversation_state == "collecting_journey_details":
            return self.handle_journey_details(user_input)
        elif self.conversation_state == "selecting_train":
            return self.handle_train_selection(user_input)
        elif self.conversation_state == "selecting_class":
            return self.handle_class_selection(user_input)
        elif self.conversation_state == "collecting_passengers":
            return self.handle_passenger_details(user_input)
        elif self.conversation_state == "collecting_contact":
            return self.handle_contact_details(user_input)
        elif self.conversation_state == "collecting_payment":
            return self.handle_contact_details(user_input)
        elif self.conversation_state == "confirming_booking":
            if user_input.lower() == 'confirm':
                # Format the booking data
                date_obj = datetime.strptime(self.user_data['date'], '%d-%m-%Y')
                formatted_date = date_obj.strftime('%Y%m%d')
                
                booking_data = {
                    "bookingDetails": {
                        "train": self.user_data['train_id'],
                        "from": self.user_data['source'][:3].upper(),
                        "to": self.user_data['destination'][:3].upper(),
                        "date": formatted_date,
                        "passengers": self.user_data['passengers'],
                        "payment": self.user_data['upi_id'],
                        "class": self.user_data['travel_class'],
                        "quota": "GN",
                        "mobile": self.user_data['phone']
                    }
                }

                try:
                    # Make API request
                    # response = requests.post(
                    #     'http://localhost:3000/book',
                    #     json=booking_data
                    # )
                    # self.booking_response = response.json()
                    self.conversation_state = "awaiting_payment"
                    return "Payment request has been sent to your UPI ID. If yes then don't proceed with the transaction as it will cost real money."

                except Exception as e:
                    print(f"Booking API Error: {e}")
                    return "Sorry, there was an error processing your booking. Please try again."
                    
            elif user_input.lower() == 'cancel':
                self.conversation_state = "idle"
                return "Booking cancelled"
                
            return "Please type 'confirm' to proceed with booking or 'cancel' to cancel"
        
        elif self.conversation_state == "awaiting_payment":
            if user_input.lower() == 'done':
                try:
                    # Use the stored booking response (either from API or dummy data)
                    booking_info = self.booking_response
                    
                    confirmation_msg = {
                                    "message": "Booking confirmed!",
                                    "pnr": booking_info["pnr"],
                                    "train": booking_info["train_name"],
                                    "boarding_time": booking_info["boarding_time"],
                                    "coach": booking_info["coach"],
                                    "seat": booking_info["seat"],
                                    "type" : "confirmation"
                                }
                    
                    confirmation_msg = json.dumps(confirmation_msg)
                    
                    self.conversation_state = "idle"
                    # Clear the stored booking response
                    self.booking_response = None
                    return confirmation_msg
                    
                except Exception as e:
                    print(f"Error processing payment confirmation: {e}")
                    return "There was an error confirming your payment. Please contact support."
                    
            return "Please type 'done' once you've completed the payment."
        
        # Initial state - determine user intent
        intent_prompt = f"Determine if this query is about: 1) train search, 2) ticket booking, or 3) PNR status. Query: '{user_input}'. Reply with ONLY the number (1, 2, or 3)"
        response = self.chat.send_message(intent_prompt)
        
        if "1" in response.text or "2" in response.text:
            self.conversation_state = "collecting_journey_details"
            self.current_task = "train_search" if "1" in response.text else "ticket_booking"
            return "Please specify your source city"
        elif "3" in response.text:
            self.conversation_state = "pnr_status"
            return "Please provide your 10-digit PNR number"
        
        return "I can help you with train search, ticket booking, or PNR status. What would you like to do?"

def main():
    booking_system = TrainBookingSystem()
    print("Welcome to Train Booking Assistant! How can I help you today?")
    print("(Type 'quit' to exit)")
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == 'quit':
            print("Thank you for using Train Booking Assistant. Goodbye!")
            break
            
        response = booking_system.process_query(user_input)
        print("\nAssistant:", response)

if __name__ == "__main__":
    main()