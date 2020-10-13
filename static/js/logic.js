//var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
  function styleEarthquake(feature) {
    return {
      radius: feature.properties.mag * 3,
      fillColor: getColor(feature.properties.mag),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng)
    },
    style: styleEarthquake,
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
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Setup legend control
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magLevel = [0, 1, 2, 3, 4, 5, 6],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magLevel.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magLevel[i] + 1) + '"></i> ' +
            magLevel[i] + (magLevel[i + 1] ? '&ndash;' + magLevel[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap);
  }

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
  if (magnitude === 0) 
    return 1;
  else 
    return magnitude * 3;
}
function getColor(magnitude) {
  switch(true) {
      case magnitude > 6:
          return "black";
      case magnitude > 5:
          return "red";
      case magnitude > 4:
          return "#800026";
      case magnitude > 3:
          return "orange";
      case magnitude > 2:
          return "#FED976";
      case magnitude > 1:
          return "#ffffa1";
      default:
          return "#32CD32";
  }
}