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

// Get the user's location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Update the map's center to the user's location
      var userLocation = [position.coords.longitude, position.coords.latitude];
      map.setCenter(userLocation);

      // Add a marker at the user's location
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

function Search() {
  locationName = document.getElementsByClassName("form-control")[0].value;
  console.log(locationName);
  getLocationCoordinates(locationName).then((coordinates) => {
    if (coordinates) {
      console.log(
        `Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`
      );
      coordinatesD = [coordinates.longitude, coordinates.latitude];
      new tt.Marker().setLngLat(coordinatesD).addTo(map);
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
