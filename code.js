var svg = d3.select("svg"),
  width = +svg.node().getBoundingClientRect().width,
  height = +svg.node().getBoundingClientRect().height;

// svg objects
var link, node;
// the data - an object with nodes and links
var graph;

// sets the color
var color = d3.scaleOrdinal(d3.schemeCategory20);

// load the data
d3.json("graph.json", function (error, _graph) {
  if (error) throw error;
  graph = _graph;
  initializeDisplay();
  initializeSimulation();
  initializeSliders();
});

//////////// FORCE SIMULATION ////////////

// force simulator
var simulation = d3.forceSimulation();

// set up the simulation and event to update locations after each tick
function initializeSimulation() {
  simulation.nodes(graph.nodes);
  initializeForces();
  simulation.on("tick", ticked);
}

function initializeSliders() {
  var thresholdSlider = document.getElementById("threshold");
  threshold.setAttribute(
    "min",
    d3.min(graph.links, function (d) {
      return d.weight;
    })
  );
  threshold.setAttribute(
    "max",
    d3.max(graph.links, function (d) {
      return d.weight;
    })
  );
}

// Linear scale for degree centrality.
var degreeSize = d3
  .scaleLinear()
  .domain([
    d3.min(graph.nodes, function (d) {
      return d.degree;
    }),
    d3.max(graph.nodes, function (d) {
      return d.degree;
    }),
  ])
  .range([8, 25]);

// values for all forces
forceProperties = {
  center: {
    x: 0.5,
    y: 0.5,
  },
  charge: {
    enabled: true,
    strength: -30,
    distanceMin: 1,
    distanceMax: 2000,
  },
  collide: {
    enabled: true,
    strength: 0.7,
    iterations: 1,
    radius: 5,
  },
  forceX: {
    enabled: false,
    strength: 0.1,
    x: 0.5,
  },
  forceY: {
    enabled: false,
    strength: 0.1,
    y: 0.5,
  },
  link: {
    enabled: true,
    distance: 30,
    iterations: 1,
  },
};

// add forces to the simulation
function initializeForces() {
  // add forces and associate each with a name
  simulation
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide())
    .force("center", d3.forceCenter())
    .force("forceX", d3.forceX())
    .force("forceY", d3.forceY());
  // apply properties to each of the forces
  updateForces();
}

// apply new force properties
function updateForces() {
  // get each force by name and update the properties
  simulation
    .force("center")
    .x(width * forceProperties.center.x)
    .y(height * forceProperties.center.y);
  simulation
    .force("charge")
    .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
    .distanceMin(forceProperties.charge.distanceMin)
    .distanceMax(forceProperties.charge.distanceMax);
  simulation
    .force("collide")
    .strength(
      forceProperties.collide.strength * forceProperties.collide.enabled
    )
    .radius(forceProperties.collide.radius)
    .iterations(forceProperties.collide.iterations);
  simulation
    .force("forceX")
    .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
    .x(width * forceProperties.forceX.x);
  simulation
    .force("forceY")
    .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
    .y(height * forceProperties.forceY.y);
  simulation
    .force("link")
    .id(function (d) {
      return d.id;
    })
    .distance(forceProperties.link.distance)
    .iterations(forceProperties.link.iterations)
    .links(forceProperties.link.enabled ? graph.links : []);

  // updates ignored until this is run
  // restarts the simulation (important if simulation has already slowed down)
  simulation.alpha(1).restart();
}

//////////// DISPLAY ////////////

// generate the svg objects and force simulation
function initializeDisplay() {
  // set the data and properties of link lines
  link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line");

  // set the data and properties of node circles
  node = svg
    .append("g")
    .attr("class", "nodes")

    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("fill", function (d) {
      return color(d.group);
    })
    .attr("stroke", "black")
    .attr("stroke-width", 0.75)
    //.attr('r', function(d, i) { return degreeSize(d.degree); })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  // node tooltip
  node.append("title").text(function (d) {
    return d.name;
  });
  // visualize the graph
  updateDisplay();
}

// update the display based on the forces (but not positions)
function updateDisplay() {
  node.attr("r", forceProperties.collide.radius);

  link
    .attr("stroke-width", forceProperties.link.enabled ? 1 : 0.5)
    .attr("opacity", forceProperties.link.enabled ? 1 : 0);
}

// update the display positions after each simulation tick
function ticked() {
  link
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });

  node
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
  d3.select("#alpha_value").style("flex-basis", simulation.alpha() * 100 + "%");
}

//////////// UI EVENTS ////////////

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0.0001);
  d.fx = null;
  d.fy = null;
}

// update size-related forces
d3.select(window).on("resize", function () {
  width = +svg.node().getBoundingClientRect().width;
  height = +svg.node().getBoundingClientRect().height;
  updateForces();
});

// convenience function to update everything (run after UI input)
function updateAll() {
  updateForces();
  updateDisplay();
}

// edge weight slider

function setEdgeWeight(value) {
  var threshold = parseInt(value);
  d3.select("#link_ThresholdSliderOutput").text(threshold);

  // Find the links that are at or above the threshold.
  var newData = [];
  graph.links.forEach(function (d) {
    if (d.weight >= threshold) {
      newData.push(d);
    }
  });

  // Data join with only those new links.
  link = link.data(newData, function (d) {
    return d.source + ", " + d.target;
  });
  link.exit().remove();
  var linkEnter = link.enter().append("line").attr("class", "link");
  link = linkEnter.merge(link);

  node = node.data(graph.nodes);

  // Restart simulation with new link data.
  simulation.nodes(graph.nodes).on("tick", ticked).force("link").links(newData);

  simulation.alphaTarget(0.1).restart();
}
