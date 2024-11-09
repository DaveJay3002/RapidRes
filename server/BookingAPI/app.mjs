import express from "express";
import { IRCTC } from "irctc-api";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json()); // Ensure body is parsed correctly

// Endpoint to initiate booking (existing /book route)
app.post("/book", async (req, res) => {
  const { bookingDetails } = req.body;
  console.log(req.body);
  if (!bookingDetails) {
    return res.status(400).send("No booking details provided");
  }

  try {
    // Initialize the IRCTC client with your user ID and password
    const client = new IRCTC({
      userID: "davejay", // Your IRCTC user ID
      password: "Dave@3002", // Your IRCTC password
    });

    // Extract the booking parameters from the request
    const {
      train,
      from,
      to,
      date,
      passengers,
      payment,
      class: trainClass,
      quota,
      mobile,
    } = bookingDetails;

    // Define booking parameters
    const bookingParams = {
      payment, // UPI ID
      class: trainClass, // Train class (e.g., 3A for Third AC)
      quota, // Quota (e.g., GN for General)
      train, // Train number
      from, // Boarding station code
      to, // Destination station code
      date, // Travel date in YYYYMMDD format
      mobile, // Mobile number
      passengers, // Passengers info
    };
    // Attempt to book the ticket

    const response = await client.book(bookingParams);
    // In between these two lines we have to use our captcha solver to take the captcha.png and then the returned text should be passed into the terminal as an input

    res.send({ message: "Booking successful", response });
  } catch (error) {
    res.status(500).send("Booking failed: " + error.message);
  }
});

// Endpoint to get PNR status
app.post("/pnr_status", async (req, res) => {
  const { pnr } = req.body;

  if (!pnr || pnr.length !== 10) {
    return res
      .status(400)
      .send("Invalid PNR number. It must be a 10-digit string.");
  }

  try {
    // Initialize the IRCTC client with your user ID and password
    const client = new IRCTC({
      userID: "davejay", // Your IRCTC user ID
      password: "Dave@3002", // Your IRCTC password
    });

    // Call the pnr_status function from irctc-api
    const response = await client.pnr_status({ pnr });


    // Send the response back to the client
    res.send({
      message: "PNR Status retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).send("Failed to fetch PNR status: " + error.message);
  }
});

// Endpoint to get Last Transaction status
app.get("/last_transaction", async (req, res) => {
  try {
    // Initialize the IRCTC client with your user ID and password
    const client = new IRCTC({
      userID: "davejay", // Your IRCTC user ID
      password: "Dave@3002", // Your IRCTC password
    });

    // Call the last_transaction function from irctc-api
    const response = await client.last_transaction();

    // Send the response back to the client
    res.send({
      message: "Last Transaction retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).send("Failed to fetch last transaction: " + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
