import json

# Load the raw data from the file
with open(r"C:\Users\Jay\Desktop\IRCTC API\traindata.json") as f:
    train_data = json.load(f)

# Function to clean and preprocess the station list
def preprocess_station_list(station_list_str):
    try:
        # Convert the station list string to a Python list of dictionaries
        if isinstance(station_list_str, str):
            return json.loads(station_list_str)
        return station_list_str
    except json.JSONDecodeError as e:
        print(f"Error decoding stationList: {e}")
        return []

# Function to preprocess each train entry
def preprocess_train_data(train_data):
    cleaned_data = []
    
    for train in train_data:
        # Skip trains that have "train does not run" error
        if "errorMessage" in train and "train does not run" in train["errorMessage"].lower():
            print(f"Skipping train {train.get('trainNumber', 'Unknown')}: {train.get('errorMessage')}")
            continue
        
        # Clean and preprocess the station list
        train["stationList"] = preprocess_station_list(train.get("stationList", []))

        # If needed, you can further clean other fields here (e.g., removing empty or irrelevant fields)

        cleaned_data.append(train)
    
    return cleaned_data

# Preprocess the train data
cleaned_train_data = preprocess_train_data(train_data)

# Save the cleaned data to a new JSON file
cleaned_file_path = r"C:\Users\Jay\Desktop\IRCTC API\cleaned_traindata.json"
with open(cleaned_file_path, "w") as f:
    json.dump(cleaned_train_data, f, indent=4)

print(f"Data cleaned and saved to {cleaned_file_path}")
