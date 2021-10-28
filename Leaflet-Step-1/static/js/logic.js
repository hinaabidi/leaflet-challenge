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
      var color = getColor(feature.geometry.coordinates[2]);
      var geojsonMarkerOptions = {
        radius: 5*feature.properties.mag,
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
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [];

      div.innerHTML+='Depth<br><hr>'
  
      // loop through our depth intervals and 
      // generate a label with a colored square for each interval
      for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
  
  return div;
  };
  
  legend.addTo(myMap);

}

// Give each feature a popup describing 
//the place, time, magnitude and depth of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
      "</h3><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
  }

function getColor(d) {
      return d > 90 ? 'rgb(255,95,101)' :
      		 d > 70 ? 'rgb(252,163,93)' :
      		 d > 50 ? 'rgb(253,183,42)' :
      		 d > 30 ? 'rgb(247,219,17)' :
      		 d > 10 ? 'rgb(220,244,0)' : 'rgb(163,246,0)';

  }

getDataFromApi();
