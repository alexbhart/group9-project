

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