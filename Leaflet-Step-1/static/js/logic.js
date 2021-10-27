//Global variables
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var geojsonData;
var titleLayer;
var geojsonLayer;
// initializing a new map
    //map = L.map('map', { scrollWheelZoom: false }).setView([46, 2], 1);

function getDataFromApi(){
	geojsonData = [];
	fetch(link)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			geojsonData = data;
			setupMap(geojsonData);

		})
		.catch(err =>{
			console.error('An error occured', err);
		})
}



function setupMap(data){
// Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=" + API_KEY);
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(data, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color = getColor(feature.properties.mag);
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
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
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}

// Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

function getColor(d) {
      return d < 1.000 ? 'rgb(183,243,77)' :
            d < 2.000  ? 'rgb(225,243,77)' :
            d < 3.000  ? 'rgb(243,219,77)' :
            d < 4.000  ? 'rgb(243,186,77)' :
            d < 5.000  ? 'rgb(240,167,107)' : 'rgb(240,107,107)';
  }

getDataFromApi();
