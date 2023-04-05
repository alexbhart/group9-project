//PIE
  //This line reads in a JSON file named "new_file.json" using the D3.js library. The then() function is used to perform some action on the data after it has been loaded. In this case, the data is passed as a parameter to an anonymous function.
  d3.json("new_file.json").then(function(data) {
    //These lines initialize two variables with a value of zero.
    var kidsTotal = 0;
    var seniorsTotal = 0;
    var adultsTotal = 0;
    //- This code filters the data.features array to only include features with a County property equal to "Amador County". The forEach() function then iterates over each filtered feature and adds the TractKids and TractSeniors values to the kidsTotal and seniorsTotal variables, respectively.
    data.features.filter(function(feature) {
      return feature.properties.County === "Amador County";
    }).forEach(function(feature) {
      kidsTotal += feature.properties.TractKids;
      seniorsTotal += feature.properties.TractSeniors;
      adultsTotal += feature.properties.Pop2010 - feature.properties.TractKids - feature.properties.TractSeniors;
    });
    // This line creates an array of two objects, each containing a label property and a value property. These objects represent the data that will be used to generate the pie chart.
    var ageData = [
      { label: "Kids", value: kidsTotal },
      { label: "Seniors", value: seniorsTotal },
      { label: "Adults", value: adultsTotal },
    ];
      console.log(ageData)
​
    // Set the dimensions of the canvas
    var width = 200;
    var height = 200;
    var radius = Math.min(width, height) / 2;
  
    // Define the color scale for the chart
    var color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888"]);
  
    // Create the SVG canvas
    var svg = d3.select('#piechart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  
    // Define the pie layout
    var pie = d3.pie().value(function(d) { return d.value; });
  
    // Define the arc for each slice  
    var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);
  
    // Create the chart
    var path = svg.selectAll('path')
      .data(pie(ageData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d) { return color(d.data.label); });
  
    // Add percentage values for each slice
    var label = svg.selectAll('text')
      .data(pie(ageData))
      .enter()
      .append('text')
      .attr('transform', function(d) { 
        var a = arc.centroid(d);
        return 'translate(' + a[0] * 1.4 + ',' + a[1] * 1.4 + ')'; 
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function(d) { return ((d.data.value / d3.sum(ageData, function(d) { return d.value; })) * 100).toFixed(2) + '%'; });
  
    // Add a legend
    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { return 'translate(' + (-width / 2 + 30) + ',' + (i * 20 - height / 2 + 30) + ')'; });
  
    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);
  
    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(function(d) { return d; });
  });
