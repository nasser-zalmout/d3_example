//parts of the logiz is inspired by the example at http://bl.ocks.org/weiglemc/6185069
var dataset = {}
d3.csv("car.csv", function(data) {
   dataset = data.map(function(d) { return { name:d.name, mpg: +d.mpg, cylinders: +d.cylinders, displacement: +d.displacement, 
   	weight: +d.weight, acceleration: +d.acceleration, 'model.year': +d['model.year'], origin: d.origin }; });
}).get(function(error, dataset){
   console.log(dataset)
   keys = Object.keys(dataset[0])

    var i = keys.indexOf("origin");
	if(i != -1) {
		keys.splice(i, 1);
	}

   var x_dropDown = d3.select("#sel-x")
	.selectAll("option")
    .data(keys)
    .enter()
    .append("option")
	.text(function (d) { return d; })
       .attr("value", function (d) { return d; });

   var y_dropDown = d3.select("#sel-y")
	.selectAll("option")
    .data(keys)
    .enter()
    .append("option")
	.text(function (d) { return d; })
       .attr("value", function (d) { return d; });

    $(document).ready(function(){
    	mpg_min = d3.select('#mpg-min').property("value");
    	mpg_max = d3.select('#mpg-max').property("value");

    	filtered_dataset = dataset.filter(function(item) {
    		return (item.mpg > +mpg_min && item.mpg < +mpg_max);
		});

    	draw(filtered_dataset, 'displacement', 'mpg');

    $("#update").click(function() {
    	d3.selectAll("svg > *").remove();
    	sel_x = d3.select("#sel-x").property("value");
    	sel_y = d3.select("#sel-y").property("value");

    	mpg_min = d3.select('#mpg-min').property("value");
    	mpg_max = d3.select('#mpg-max').property("value");

    	filtered_dataset = dataset.filter(function(item) {
    		return (item.mpg > +mpg_min && item.mpg < +mpg_max);
		});

    	draw(filtered_dataset, sel_x, sel_y);
    });
  });
});


var draw = function(d, xData, yData) {
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xValue = function(d) { return +d[xData];}, 
    xScale = d3.scale.linear().range([0, width]), 
    xMap = function(d) { return xScale(xValue(d));}, 
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yValue = function(d) { return +d[yData];}, 
    yScale = d3.scale.linear().range([height, 0]), 
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");

  xScale.domain([d3.min(d, xValue)-1, d3.max(d, xValue)+1]);
  yScale.domain([d3.min(d, yValue)-1, d3.max(d, yValue)+1]);

      // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(xData);

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yData);

     // draw dots
  var dots = svg.selectAll(".dot")
      .data(d)

    dots.enter().append("circle")

    dots.attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .on("mouseover", function(d) {
      	$("#hovered").text(d.name);
      })
      .on("mouseout", function(d) {
		$("#hovered").text("Hover over other points...");
      })
   dots.exit().remove();
};




