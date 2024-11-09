// Import the IRCTC class
import { IRCTC } from "irctc-api";

async function testBooking() {
  // Instantiate the IRCTC client
  const client = new IRCTC({
    userID: "davejay", // Your IRCTC user ID
    password: "", // Your IRCTC password
  });

  // Define booking parameters
  const bookingParams = {
    payment: "davejay3002@okaxis", // Replace with your UPI ID
    class: "2S", // Train class (e.g., 3A for Third AC)
    quota: "GN", // Quota (e.g., GN for General)
    train: "22959", // Train number
    from: "BRC", // Boarding station code
    to: "ADI", // Destination station code
    date: "20241108", // Travel date in YYYYMMDD format
    mobile: "9265605893", // Mobile number
    passengers: [
      {
        name: "Jay Dave", // Passenger name
        age: 20, // Passenger age
        gender: "M", // Gender (M, F, or T)
      }
    ]
  };

  try {
    // Attempt to book a ticket
    const response = await client.book(bookingParams);
    console.log("Booking Response:", response);
  } catch (error) {
    console.error("Booking failed:", error);
  }
}

// Run the booking test
testBooking();
