# nXd3

Use [d3.js](https://d3js.org/) to make interactive visualisations of [NetworkX](https://networkx.github.io/) graphs. This method was initially based on a fork of code from [jrladd/marvel_network](https://github.com/jrladd/marvel_network), but later expanded significantly by merging into [this example](https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03) by [Steve Haroz](https://github.com/steveharoz). The resulting visualisation extends [Mike Bostock's simple graph demo](http://bl.ocks.org/mbostock/4062045) with additional features:

- [ ] s

Run 
`$ python e2j.py` 
to produce `graph.json` from `edges.csv`.

Start a http server in the directory of the project:

`$ python -m http.server`

Note the port number (e.g. `:8000`).

Open a browser at `<your-host-ip>:8000` to view the graph.
