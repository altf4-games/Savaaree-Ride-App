// Initialize the map
const apiKey = "pCKjhiDCnrgyjAqbqaeEMeJYmenJGWz6";

var map = tt.map({
  key: apiKey,
  container: "map",
  center: [0, 0],
  zoom: 10,
});

let coordinatesD;
let coordinatesS;

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
    startPoint = feature.geometry.coordinates[0][0]; //get first point from first line
    endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]; //get last point from last line
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
        document.getElementsByClassName("details")[0].innerHTML =
          `Distance: ${distanceInKilometers.toFixed(2)} km` +
          `<br>` +
          `Time: ${Math.round(
            response.routes[0].summary.travelTimeInSeconds / 60
          )} m`;
        console.log(`Distance: ${distanceInKilometers.toFixed(2)} km`);
        console.log(
          `Time: ${response.routes[0].summary.travelTimeInSeconds} m`
        );
      } else {
        console.log("Could not calculate distance.");
      }
    });
}

function fetchWeather() {
  fetch(
    "http://api.weatherapi.com/v1/current.json?key=7d273806546e4e64aed52511242003&q=mumbai&aqi=no"
  )
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.current.temp_c;
      const weatherDescription = data.current.condition.text;
      const weatherInfo = `Weather: ${weatherDescription}, Temperature: ${temperature}°C`;
      updateTimeAndWeather(weatherInfo);
    })
    .catch((error) => console.error("Error fetching weather:", error));
}

// Function to get current system time
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const timeString = `Time: ${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  return timeString;
}

// Function to update the display
function updateTimeAndWeather(weatherInfo) {
  const weatherTimeDiv = document.getElementById("weatherTime");
  weatherTimeDiv.innerHTML = "";

  if (weatherInfo) {
    const weatherPara = document.createElement("p");
    weatherPara.textContent = weatherInfo;
    weatherTimeDiv.appendChild(weatherPara);
  }

  const timeString = getCurrentTime();
  const timePara = document.createElement("p");
  timePara.textContent = timeString;
  weatherTimeDiv.appendChild(timePara);
}

// Initial fetch
fetchWeather();
updateTimeAndWeather();

// Update every minute
setInterval(() => {
  fetchWeather();
  updateTimeAndWeather();
}, 60000);
