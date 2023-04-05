

// var geoJSON = 'Resources/us-county-boundaries_catxva.geojson'
var geoJSON2 = 'new_file.json'
var chooser = document.getElementById('selDataset');
var selDataset = d3.select(chooser);


// d3.json(geoJSON2).then(data => {
//   // Create an array of unique county names
//   var countyNames = [];
//   data.features.forEach(feature => {
//     var countyName = feature.properties.County;
//     if (!countyNames.includes(countyName)) {
//       countyNames.push(countyName);
//     }
//   });

//   // Use the county names array to create options for the dropdown list
//   var options = selDataset.selectAll('option')
//     .data(countyNames)
//     .enter()
//     .append('option')
//     .attr('value', d => { return d; })
//     .text(d => { return d; });
// });
var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

d3.json(geoJSON2).then(function(data) {
    // var countyName = "";
    geojson = L.geoJson(data, {
            
      style: styles,   
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.County + "</strong><br /><br />Diabetes Percentage: " +
        feature.properties.DiagnosedDiabetesPercentage + "<br /><br />Total Population: " + feature.properties.Pop2010);
        countyName = feature.properties.County;
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
    // console.log(countyName);

  })
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
var select = d3.select("#dropdown")
    .append("select")
    .on("change", function() {
      var county = this.value;
      updatePieChart(county);
    });

    function updatePieChart(county) {
      var countyData = data.features.filter(function(feature) {
        return feature.properties.County === county;
      });
      var kidsTotal = 0;
      var seniorsTotal = 0;
      var adultsTotal = 0;
      countyData.forEach(function(feature) {
        kidsTotal += feature.properties.TractKids;
        seniorsTotal += feature.properties.TractSeniors;
        adultsTotal += feature.properties.Pop2010 - feature.properties.TractKids - feature.properties.TractSeniors;
      });
      var ageData = [      { label: "Kids", value: kidsTotal },      { label: "Seniors", value: seniorsTotal },      { label: "Adults", value: adultsTotal },    ];
      var labels = ageData.map(function(d) { return d.label; });
      var values = ageData.map(function(d) { return d.value; });
      var trace = {
        type: 'pie',
        labels: labels,
        values: values,
        marker: {
          colors: ['#feedde', '#fff2cc', '#f7b977']
        }
      };
      var layout = {
        autosize: false,
        width: 500,
        height: 500,
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4
        },
        plot_bgcolor: '#c7c7c7',
        title: 'Age distribution in the population'
      };
      var chartData = [trace];
      Plotly.newPlot('piechart', chartData, layout);
    }
  
  // });