// Initialize the map
const apiKey = "pCKjhiDCnrgyjAqbqaeEMeJYmenJGWz6";

var map = tt.map({
  key: apiKey,
  container: "map",
  center: [0, 0],
  zoom: 10,
});

// Get the user's location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Update the map's center to the user's location
      var userLocation = [position.coords.longitude, position.coords.latitude];
      map.setCenter(userLocation);

      // Add a marker at the user's location
      new tt.Marker().setLngLat(userLocation).addTo(map);
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
      var coordinatesM = [coordinates.longitude, coordinates.latitude];
      new tt.Marker().setLngLat(coordinatesM).addTo(map);
    } else {
      console.log("Could not find coordinates for the specified location.");
    }
  });
}
