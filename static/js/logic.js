// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

// Assemble API query URL
//var url = baseURL;

// Grab the data with d3
d3.json(url, function(response) {

  //console.log(response)
  earthquakesData = response.features

  //OnEachFeature function used to bind pop up to the geojson layer
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: "+feature.properties.mag+"</p>");
  }

  //function to set color based on the magnitude of the earthequake
  function getColor(mag) {
    switch (true) {
      case mag < 1:
        return  '#555';
      case mag < 2:
        return 'green';
      case mag < 3:
        return 'yellow';
      case mag < 4:
        return 'orange';
      case mag < 5:
        return 'red';
      default:
        return 'black';
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakesData, {
      onEachFeature: onEachFeature,

      pointToLayer: function (feature, latlng) {
        //console.log(feature.properties.mag)

        let geojsonMarkerOptions = {
          radius: feature.properties.mag *5,
          fillColor: getColor(feature.properties.mag),
          //color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      };

        return L.circleMarker(latlng, geojsonMarkerOptions)
      }
      
    });


  // Add our marker cluster layer to the map
  //myMap.addLayer(markers);
  function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
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


    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        magnitute = [0, 1, 2, 3, 4, 5],
        labels = ['<strong> magnitute of</strong>','<strong> earthquake </strong>'],
        from, to;

    // loop through our density intervals and generate a label with a colored square for each interval

        for (var i = 0; i < magnitute.length; i++) {
          from = magnitute[i];
          to = magnitute[i+1];      
          //tenary operator for setting the range of the maginitude, recall tenary operator: '(condition) ? expression on true : expression on false'
          labels.push('<i style="background:' + getColor(from) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
        }
            div.innerHTML = labels.join('<br>');
        
        return div;
    
    };


    

    legend.addTo(myMap);

  }

  createMap(earthquakes)

});
