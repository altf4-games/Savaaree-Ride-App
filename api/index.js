const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.post("/book-ride", (req, res) => {
  const { ride, ethPrice, distance, time, coordinatesS, coordinatesD } =
    req.body;

  console.log("Booking Details:");
  console.table([
    { Field: "Selected Ride", Value: ride },
    { Field: "Fare", Value: ethPrice },
    { Field: "Distance", Value: distance },
    { Field: "Time", Value: time },
    { Field: "From", Value: coordinatesS },
    { Field: "To", Value: coordinatesD },
  ]);

  res.send("Ride booked successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
