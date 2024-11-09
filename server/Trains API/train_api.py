from flask import Flask, jsonify, request
import json
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Load your train data (assuming train info JSON is available)
train_data = json.load(open(r"C:\Users\Jay\Desktop\IRCTC API\cleaned_traindata.json"))

def convert_time_to_minutes(time_str):
    """
    Convert a time string (HH:MM) into total minutes.
    """
    if time_str == '--':
        return None
    hours, minutes = map(int, time_str.split(':'))
    total_minutes = hours * 60 + minutes
    return total_minutes

def calculate_travel_time(departure_time, arrival_time):
    """
    Calculate the travel time between departure and arrival times.
    """
    dep_minutes = convert_time_to_minutes(departure_time)
    arr_minutes = convert_time_to_minutes(arrival_time)

    if dep_minutes is None or arr_minutes is None:
        return None

    # Handle cases where arrival time is past midnight (next day)
    if arr_minutes < dep_minutes:
        arr_minutes += 24 * 60

    travel_time = arr_minutes - dep_minutes
    return travel_time

def get_day_of_week(date_str):
    try:
        # Clean the input date by stripping any extra spaces or newlines
        date_str = date_str.strip()
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        day_of_week = date_obj.strftime("%a")
        return day_of_week
    except ValueError as e:
        return f"Error: {e}"

@app.route('/search_trains', methods=['GET'])
def search_trains():
    # Get the input parameters
    start_station = request.args.get('start_station')
    dest_station = request.args.get('dest_station')
    travel_date = request.args.get('date_of_travel')

    if not start_station or not dest_station or not travel_date:
        return jsonify({"error": "Please provide start_station, dest_station, and date_of_travel parameters"}), 400
    
    # Convert the travel date into the day of the week
    day_of_week = get_day_of_week(travel_date)

    # Filter trains that run on the given day
    trains_on_day = []
    for train in train_data:
        # Check if the train runs on the specified day
        if f"trainRunsOn{day_of_week.capitalize()}" not in train or train[f"trainRunsOn{day_of_week.capitalize()}"] != 'Y':
            continue

        train_info = {
            "trainNumber": train.get("trainNumber"),
            "trainName": train.get("trainName"),
            "departureStation": None,
            "departureTime": None,
            "arrivalStation": None,
            "arrivalTime": None,
            "travelTime": None
        }

        # Initialize variables to check if the train has the required start and end stations
        start_found = False
        end_found = False

        # Iterate over the stationList to find the relevant stations
        for station in train.get("stationList", []):
            if station.get("stationName") == start_station:
                train_info["departureStation"] = station.get("stationName")
                train_info["departureTime"] = station.get("departureTime")
                start_found = True

            if station.get("stationName") == dest_station:
                train_info["arrivalStation"] = station.get("stationName")
                train_info["arrivalTime"] = station.get("arrivalTime")
                end_found = True

            # If both start and destination stations are found, stop the loop
            if start_found and end_found:
                break

        # Only add the train if both start and destination stations are found and both times are valid
        if start_found and end_found and train_info["departureTime"] != '--' and train_info["arrivalTime"] != '--':
            # Calculate the travel time
            departure_time = train_info["departureTime"]
            arrival_time = train_info["arrivalTime"]
            train_info["travelTime"] = calculate_travel_time(departure_time, arrival_time)

            trains_on_day.append(train_info)

    # Return the filtered trains in JSON format
    return jsonify(trains_on_day)

if __name__ == '__main__':
    app.run(debug=True)
