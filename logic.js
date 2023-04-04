// var geoData = 'updated_data.geojson'


// function createMap(counties) {
    

//     // Create the base layers.
//     var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     })

//     // var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     //     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     // });

//     // Create a baseMaps object.
//     var baseMaps = {
//         "Street Map": street
//         //   "Topographic Map": topo
//     };

//     // Create an overlay object to hold our overlay.
//     var overlayMaps = {
//         "counties": counties
//     };

//     // // Create our map, giving it the streetmap and earthquakes layers to display on load.
//     var map = L.map("map", {
//         center: [
//             37.09, -95.71
//         ],
//         zoom: 5,
//         layers: [street, counties]
//     });

//     // Create a layer control.
//     // Pass it our baseMaps and overlayMaps.
//     // Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(map);

// }

// function createMarkers(response) {

//     // console.log(response[0].geo_point_2d)
//     // Initialize an array to hold the markers.
//     var countyMarkers = [];
    
//     // Loop through the array.
//     for (var index = 0; index < response.length; index++) {
//         var county = response[index];
//         var countyLat = county.geo_point_2d.lat;
//         var countyLon = county.geo_point_2d.lon;
//         // console.log(countyLon);

//         // For each county, create a marker, and bind a popup with the station's name.
//         var countyMarker = L.marker([countyLat, countyLon]
//         //     {
//         //     radius: 10,
//         //     color: 'red'
//         // }
//         )
//             .bindPopup("<h3>" + county.name + "<h3><h3>State: " + county.state_name + "</h3>");

//         // Add the marker to the counties array.
//         countyMarkers.push(countyMarker);
//     }

//     // Create a layer group that's made from the array, and pass it to the createMap function.
//     createMap(L.layerGroup(countyMarkers));
// }

// d3.json(geoData).then(createMarkers);
// d3.json(geoData).then(data => {
//     console.log(data)
// });
var geojson;
// var geoJSON = 'Resources/us-county-boundaries_catxva.geojson'
var geoJSON2 = 'new_file.json'

d3.json(geoJSON2).then(d => {
    console.log(d.features[0].properties);
})

var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
d3.json(geoJSON2).then(function(data) {


    geojson = L.geoJson(data, {
            
      style: styles,   
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.County + "</strong><br /><br />Diabetes Percentage: " +
        feature.properties.DiagnosedDiabetesPercentage + "<br /><br />Total Population: " + feature.properties.Pop2010);
          
      }

    }).addTo(map);
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Diabetes Percentage:</h4>";
        div.innerHTML += `<i style="background: ${colors[6]}"></i><span> > 9.8 % </span><br>`;
        div.innerHTML += `<i style="background: ${colors[5]}"></i><span></span><br>`;
        div.innerHTML += `<i style="background: ${colors[4]}"></i><span></span><br>`;
        div.innerHTML += `<i style="background: ${colors[3]}"></i><span></span><br>`;
        div.innerHTML += `<i style="background: ${colors[2]}"></i><span></span><br>`;
        div.innerHTML += `<i style="background: ${colors[1]}"></i><span></span><br>`;
        div.innerHTML += `<i style="background: ${colors[0]}"></i><span> < 5.1 %</span><br>`;

        return div;
    };

    legend.addTo(map);
}
)
var colors = ['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04']
function getColor(d) {
    

    return d > 10.85 ? colors[6] :
        d > 9.7 ? colors[5] :
        d > 8.55 ? colors[4] :
        d > 7.4 ? colors[3] :
        d > 6.25 ? colors[2] :
        d > 5.1 ? colors[1] :
        colors[0];

}
function styles(feature) {
    return {
      fillColor: getColor(feature.properties.DiagnosedDiabetesPercentage),
      weight: 1,
      opacity: 1,
      color: getColor(feature.properties.DiagnosedDiabetesPercentage),
      fillOpacity: .7
    };
  }