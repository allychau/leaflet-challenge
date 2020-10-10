var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

//Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

    /*d3.json(queryUrl, function(data) {
        var features = data.features;
        features.forEach( function(feature) {
          console.log(feature.properties.place);
        });*/
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
});
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);

}
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",  //"mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
    };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
    
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
    return magnitude / 3;
}

function createMarkers(response)
{
    // Pull the "mag" property off of response.data
  var magnitude = response.data.mag;
  // Initialize an array to hold bike markers
  var magMarkers = [];
  // Loop through the stations array
  magnitude.forEach(function(mag) {
    // For each station, create a marker and bind a popup with the station's name
    // Add the marker to the bikeMarkers array
    magMarkers.push(
      L.marker([stations[i].lat,stations[i].lon]).
      bindPopup("<h3>" + stations[i].name + "</h3><h3>Capacity: "+ stations[i].capacity + "</h3>")
    );
  });
 // Create a layer group made from the bike markers array, pass it into the createMap function
 createMap(L.layerGroup(magMarkers));
}

