# Earthquake Map Webpage

[Visit Site here](https://jlangree.github.io/leaflet-challenge/)

This webpage's purpose is to display locations and magnitudes of all earthquakes measured in the last week. Data is extracted from the USGS's public API ([USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)).

D3.js is used in combination with Leaflet.js to create a dynamic map of the world including:
* Geologic Plate Boundaries
* Markers indicating location of earthquakes from the last 7 days
* Legend correlating marker color to magnitude
* Popups that display exact magnitude and location of a given earthquake
* 3 different base map options for a better user experience
