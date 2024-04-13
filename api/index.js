const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

///  WEB3 ///

// const { Web3 } = require("web3");
// const RideHailingSystemABI = require("../RideHandlingSystemABI.json");
// const web3 = new Web3("http://localhost:8545"); // Replace with your Ethereum node URL
// const contractAddress = "0x123456789..."; // Replace with the deployed contract address
// const rideHailingSystemContract = new web3.eth.Contract(
//   RideHailingSystemABI,
//   contractAddress
// );
// // Request a ride
// app.post("/ride/request", async (req, res) => {
//   const { rider } = req.body;
//   try {
//     const accounts = await web3.eth.getAccounts();
//     const result = await rideHailingSystemContract.methods
//       .requestRide(rider)
//       .send({ from: accounts[0] });
//     res.json({ transactionHash: result.transactionHash });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Accept a ride
// app.post("/ride/accept", async (req, res) => {
//   const { rideId } = req.body;
//   try {
//     const accounts = await web3.eth.getAccounts();
//     const result = await rideHailingSystemContract.methods
//       .acceptRide(rideId)
//       .send({ from: accounts[0] });
//     res.json({ transactionHash: result.transactionHash });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start a ride
// app.post("/ride/start", async (req, res) => {
//   const { rideId } = req.body;
//   try {
//     const accounts = await web3.eth.getAccounts();
//     const result = await rideHailingSystemContract.methods
//       .startRide(rideId)
//       .send({ from: accounts[0] });
//     res.json({ transactionHash: result.transactionHash });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // End a ride
// app.post("/ride/end", async (req, res) => {
//   const { rideId } = req.body;
//   try {
//     const accounts = await web3.eth.getAccounts();
//     const result = await rideHailingSystemContract.methods
//       .endRide(rideId)
//       .send({ from: accounts[0] });
//     res.json({ transactionHash: result.transactionHash });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
