# nXd3

Use [d3.js](https://d3js.org/) to make interactive visualisations of [NetworkX](https://networkx.github.io/) graphs. 

This method was based on a combination of [this example](https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03) by [Steve Haroz](https://github.com/steveharoz), and code from [jrladd/marvel_network](https://github.com/jrladd/marvel_network), both of which extend [Mike Bostock's simple graph demo](http://bl.ocks.org/mbostock/4062045) with additional features. In addition to those features, more functionality has been added, so that nXd3 now includes:

- [x] Nodes coloured by Louvain modularity
- [x] Size nodes by three different centrality measures calculated in NetworkX 
- [x] Slider to remove edges by weight
- [x] Sliders for Position, Charge, No Overlap, X Force, Y Force, and Edge Length
- [ ] Node search
- [ ] Toggle node label visibility
- [ ] Zoom the graph view
- [ ] Export the graph to image


### Prepare input file 

nXd3 takes as input an `edges.csv` file with (potentially) parallel edges and no calculated weights.

Run `$ python3 e2j.py` to produce `graph.json` from `edges.csv`. It will treat the graph as undirected. NetworkX is used to calculate edge weights, *Degree*, *Betweenness*, and *Eigenvector* centralities. Louvain modularity is calculated with [python-louvain](https://github.com/taynaud/python-louvain).

### Visualise the graph

The visualisation can't be run locally as d3.js (javascript) is not allowed to load filed from local disk. Therefore a web server must be set up to view the visualisation.

Start a http server in the directory of the project (`$ python3 -m http.server`). Note the port number (e.g. `:8000`). Then open a browser at `<your-host-ip>:8000` (e.g. `127.0.0.1:8000`) to view and manipulate the graph.
