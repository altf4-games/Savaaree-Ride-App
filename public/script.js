// Initialize the map
var map = tt.map({
  key: "pCKjhiDCnrgyjAqbqaeEMeJYmenJGWz6",
  container: "map",
  center: [0, 0], // This will be updated with the user's location
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
