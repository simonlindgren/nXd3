# pynx-d3

Use [d3.js](https://d3js.org/) to make interactive visualisations of [NetworkX](https://networkx.github.io/) graphs. This method is based on a fork of code from [jrladd/marvel_network](https://github.com/jrladd/marvel_network). The resulting visualisation extends [Mike Bostock's simple graph demo](http://bl.ocks.org/mbostock/4062045) with additional features: filtering by edge weight, selecting between three different types of node centrality, and clicking nodes to see ego networks.

Run 
`$ python e2j.py` 
to produce `graph.json` from `edges.csv`.

Start a http server in the directory of the project:

`$ python -m http.server`

Note the port number (e.g. `:8000`).

Open a browser at `<your-host-ip>:8000` to view the graph.
