// do an API call to get the earthquake info using .then to wait for response
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  

    // making the main lightmap layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 15,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });
    
    // making the features for the map
    function makefeature(featuredata, layer) {
      layer.bindPopup(
          "<h3>"
           + featuredata.properties.place
           + "</h3><hr><p>"
           + new Date(featuredata.properties.time) 
           + "</p><p>"
           + featuredata.properties.mag
           +"</p>"
        );
    };

    // setting colors for the different quake levels
    function quakecolors(quakedepth){
        switch (true) {
            case quakedepth > 90:
                return "#FF0000";
            case quakedepth > 70:
                return "#F96000";
            case quakedepth > 50:
                return "#e59100";
            case quakedepth > 30:
                return "#c4ba00";
            case quakedepth > 10:
                return "#91df00";
            default:
                return "#00FF00";}
        };
  
    quakedata = data.features
    var earthquakes = L.geoJSON(quakedata, {
      makefeature: makefeature,
      pointToLayer: function (featuredata, latlng) {
        return L.circle(latlng,
          {radius: featuredata.properties.mag*100000,
           color: "#000000",
           weight: .5,
           fillColor: quakecolors(featuredata.geometry.coordinates[2])},
           )}
      });

    // adding basemaps and overlay
    var baseMaps = {"Light Map": lightmap};
    var overlayMaps = {Earthquakes: earthquakes};

    // create the map
    var myMap = L.map("map-id", {
        center: [41, -11],
        layers: [lightmap, earthquakes],
        zoom: 3
    });
  
    // adding in layer control for lightmap and earthquake data
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  });
  