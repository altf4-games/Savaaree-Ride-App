const web3 = new Web3(window.ethereum);
const toAddress = "0xB4c50096028d45fa44657B1A76316ACCb6a8bCCB";

async function connectMetaMask() {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected to MetaMask account:", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return null;
  }
}

async function buildTransaction(value) {
  const connectedAccount = await connectMetaMask();
  if (!connectedAccount) {
    return null;
  }

  const tx = {
    from: connectedAccount,
    to: toAddress,
    value: web3.utils.toWei(value, "ether"),
    gas: 2100000,
    gasPrice: web3.utils.toWei("10", "gwei"),
  };
  return tx;
}

async function sendTransaction(value) {
  const tx = await buildTransaction(value);
  if (!tx) {
    return;
  }

  try {
    web3.eth
      .sendTransaction({
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
      })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
        if (receipt.status) {
          bookRide();
          alert("Transaction successful");
        }
      });
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

function bookRide() {
  const rideDetails = {
    ride,
    ethPrice,
    distance,
    time,
    coordinatesS,
    coordinatesD,
  };

  fetch("/book-ride", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rideDetails),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("payButton").addEventListener("click", async () => {
    if (
      ethPrice !== undefined &&
      ethPrice !== null &&
      ethPrice !== "" &&
      ethPrice > 0 &&
      ethPrice <= 1000
    )
      sendTransaction(ethPrice.toString());
  });
});
