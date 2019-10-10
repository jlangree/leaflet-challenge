// outdoors map background tile layer
var outdoorsmap =  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// satellite map background tile layer
var satellitemap =  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// dark map background tile layer
var darkmap =  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.dark",
    accessToken: API_KEY
});

// Initialize all of the LayerGroups to be used
var layers = {
    EARTHQUAKES: new L.LayerGroup(),
    FAULT_LINES: new L.LayerGroup(),
  };

// Create the map with our layers
var map = L.map("map", {
    center: [10, -90],
    zoom: 3,
    layers: [
      layers.EARTHQUAKES,
      layers.FAULT_LINES
    ]
});

// Add 'darkmap' tile layer to the map as default
darkmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "Earthquakes": layers.EARTHQUAKES,
    "Fault Lines": layers.FAULT_LINES
};

// create baseMaps object to add to layer control
var baseMaps = {
    "Dark Map": darkmap,
    "Satellite": satellitemap,
    "Outdoors": outdoorsmap
};
  


// function to determine color of earthquake marker based on magnitude
function getColor(magnitude) {

    return magnitude < 1 ? "lightgreen" :   // 0-1
        magnitude < 2 ? "yellowgreen" :     // 1-2
        magnitude < 3 ? "yellow" :          // 2-3
        magnitude < 4 ? "orange" :          // 3-4
        magnitude < 5 ? "red" :      // 4-5 
                        "purple";              // 5+

}

// Layer Control
L.control.layers(baseMaps, overlays).addTo(map);

// Create a legend
var legend = L.control({
    position: "bottomright"
});

var bins = [0, 1, 2, 3, 4, 5];

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    
    // legend title
    div.innerHTML += '<h4>Earthquake<br>Magnitude</h4>';

    // loop through bins to create legend
    for (var i = 0; i < bins.length; i++) {

        // ternary operator checks if there is another number in 'bins' --> if not adds a '+'
        div.innerHTML += '<i style="background:' + getColor(bins[i]) + '"></i> ' + bins[i] + (bins[i + 1] ?
            ' - ' + bins[i + 1] + '<br>' : ' +');
    }
    return div;
};

// Add the legend to the map
legend.addTo(map);


// =================================================================================================
// EARTHQUAKES LAYER
// =================================================================================================

// Store API query variables
var urlEarthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab eqrthquake data with d3, then add earthquake markers to map layer
d3.json(urlEarthquake, function(response) {
    console.log(response);

    var features = response.features;

    // Loop through data
    for (var i = 0; i < features.length; i++) {
  
        // Set the lat long to variable
        var latlng = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0] ];
  
        // set properties as variable, then get magnitude
        var properties = features[i].properties;
        var magnitude = properties.mag;

        // assign color based on magnitude
        var color = getColor(magnitude);

        // create circle marker at coordinates, with scaled radius and color
        var marker = L.circleMarker( latlng,
            {   radius: magnitude * 3.5,
                weight: 0.5,
                color: color,
                fill: true,
                fillColor: color,
                fillOpacity: 0.7
            }
        );
        // append marker to markers list
        marker.addTo(layers.EARTHQUAKES)
            .bindPopup(`<center>Magnitude: ${magnitude}<hr>${properties.place}</center>`);
    }
});


// =================================================================================================
// FAULT LINES LAYER
// =================================================================================================

// Store API query variables
var urlFaultLines = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// grab data with d3, then add layer for plate boundaries
d3.json(urlFaultLines, function(response) {
    console.log(response);

    var plates = L.geoJSON(response, {
        style: lines => {return {color: "blue"}}
    });

    plates.addTo(layers.FAULT_LINES);


});


