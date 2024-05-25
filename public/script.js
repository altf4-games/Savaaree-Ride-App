// Initialize the map
const apiKey = "pCKjhiDCnrgyjAqbqaeEMeJYmenJGWz6";

var map = tt.map({
  key: apiKey,
  container: "map",
  center: [0, 0],
  zoom: 10,
});

var coordinatesD;
var coordinatesS;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var userLocation = [position.coords.longitude, position.coords.latitude];
      map.setCenter(userLocation);

      new tt.Marker().setLngLat(userLocation).addTo(map);
      coordinatesS = [position.coords.longitude, position.coords.latitude];
    },
    function (error) {
      console.error(
        "Error occurred while getting user location: " + error.message
      );
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

const getLocationCoordinates = async (locationName) => {
  const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
    locationName
  )}.json?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { position } = data.results[0];
      const { lat, lon } = position;
      return { latitude: lat, longitude: lon };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Error fetching location coordinates:", error);
    return null;
  }
};

let locationName = document.getElementsByClassName("form-control")[0].value;
let marker;

function Search() {
  locationName = document.getElementsByClassName("form-control")[0].value;
  console.log(locationName);
  getLocationCoordinates(locationName).then((coordinates) => {
    if (coordinates) {
      console.log(
        `Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`
      );
      coordinatesD = [coordinates.longitude, coordinates.latitude];
      if (marker) marker.remove();
      marker = new tt.Marker().setLngLat(coordinatesD).addTo(map);
      showRoute(coordinatesD);
    } else {
      console.log("Could not find coordinates for the specified location.");
    }
  });
}

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

function createMarkerElement(type) {
  var element = document.createElement("div");
  var innerElement = document.createElement("div");

  element.className = "route-marker";
  innerElement.className = "icon tt-icon -white -" + type;
  element.appendChild(innerElement);
  return element;
}

function addMarkers(feature) {
  var startPoint, endPoint;
  if (feature.geometry.type === "MultiLineString") {
    startPoint = feature.geometry.coordinates[0][0];
    endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0];
  } else {
    startPoint = feature.geometry.coordinates[0];
    endPoint = feature.geometry.coordinates.slice(-1)[0];
  }

  new tt.Marker({ element: createMarkerElement("start") })
    .setLngLat(startPoint)
    .addTo(map);
  new tt.Marker({ element: createMarkerElement("finish") })
    .setLngLat(endPoint)
    .addTo(map);
}

function findFirstBuildingLayerId() {
  var layers = map.getStyle().layers;
  for (var index in layers) {
    if (layers[index].type === "fill-extrusion") {
      return layers[index].id;
    }
  }

  throw new Error(
    "Map style does not contain any layer with fill-extrusion type."
  );
}

function showRoute(coordinatesD) {
  if (!coordinatesS || !coordinatesD) {
    console.error("Coordinates not available.");
    return;
  }

  let loc = `${coordinatesS[0]},${coordinatesS[1]}:${coordinatesD[0]},${coordinatesD[1]}`;
  console.log(loc);
  tt.services
    .calculateRoute({
      key: apiKey,
      traffic: false,
      locations: loc,
    })
    .then(function (response) {
      var geojson = response.toGeoJson();
      map.addLayer(
        {
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          paint: {
            "line-color": "#4a90e2",
            "line-width": 8,
          },
        },
        findFirstBuildingLayerId()
      );

      addMarkers(geojson.features[0]);

      var bounds = new tt.LngLatBounds();
      geojson.features[0].geometry.coordinates.forEach(function (point) {
        bounds.extend(tt.LngLat.convert(point));
      });
      map.fitBounds(bounds, { duration: 0, padding: 50 });
    });
}

var ethPrice;
var time;
var distance;

function showRoute(coordinatesD) {
  if (!coordinatesS || !coordinatesD) {
    console.error("Coordinates not available.");
    return;
  }

  let loc = `${coordinatesS[0]},${coordinatesS[1]}:${coordinatesD[0]},${coordinatesD[1]}`;
  console.log(loc);
  tt.services
    .calculateRoute({
      key: apiKey,
      traffic: false,
      locations: loc,
    })
    .then(function (response) {
      var geojson = response.toGeoJson();
      map.addLayer(
        {
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          paint: {
            "line-color": "#4a90e2",
            "line-width": 8,
          },
        },
        findFirstBuildingLayerId()
      );

      addMarkers(geojson.features[0]);

      var bounds = new tt.LngLatBounds();
      geojson.features[0].geometry.coordinates.forEach(function (point) {
        bounds.extend(tt.LngLat.convert(point));
      });
      map.fitBounds(bounds, { duration: 0, padding: 50 });

      if (response.routes && response.routes[0] && response.routes[0].summary) {
        const distanceInMeters = response.routes[0].summary.lengthInMeters;
        const distanceInKilometers = distanceInMeters / 1000;
        const price = distanceInKilometers * 10;
        time = response.routes[0].summary.travelTimeInSeconds / 60;
        distance = distanceInKilometers;
        ethPrice = price / 311777;
        document.getElementById("total").innerHTML =
          ethPrice.toFixed(6) + " ETH";

        document.getElementById("distance").innerHTML =
          distanceInKilometers.toFixed(2) + " km";
        document.getElementById("time").innerHTML =
          Math.round(response.routes[0].summary.travelTimeInSeconds / 60) +
          " m";
        console.log(`Distance: ${distanceInKilometers.toFixed(2)} km`);
        console.log(
          `Time: ${response.routes[0].summary.travelTimeInSeconds} m`
        );
      } else {
        console.log("Could not calculate distance.");
      }
    });
}

const currentAccount = "";
const accountDiv = document.getElementById("currentAccount");
const connectWallet = document.getElementById("connectWallet");

if (currentAccount) {
  accountDiv.textContent = `${currentAccount.slice(
    0,
    6
  )}...${currentAccount.slice(-4)}`;
  connectWallet.style.display = "none";
} else {
  accountDiv.style.display = "none";
  connectWallet.style.display = "flex";
}

var ride = "Go";
document.addEventListener("DOMContentLoaded", (event) => {
  const rideOptions = document.querySelectorAll(".ride-option");

  rideOptions.forEach((option) => {
    option.addEventListener("click", function () {
      rideOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      ride = this.getAttribute("data-ride");
      console.log("Selected ride:", ride);
    });
  });
});

let userAccount = "";
document.addEventListener("DOMContentLoaded", function () {
  const connectButton = document.getElementById("connectWallet");

  connectButton.addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access if needed
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        userAccount = accounts[0];
        console.log("Connected", accounts[0]);

        // Here you can add code to interact with the user's account
        // For example, displaying the account address on the page
        connectButton.innerHTML = `Connected: ${accounts[0]}`;
      } catch (error) {
        console.error(error);
        connectButton.innerHTML = "Error connecting to MetaMask";
      }
    } else {
      console.log("MetaMask is not installed");
      connectButton.innerHTML = "MetaMask is not installed";
    }
  });
});
