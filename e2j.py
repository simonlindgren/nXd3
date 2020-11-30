#!/usr/bin/env python3

import networkx as nx
from networkx.readwrite import json_graph
import json, community
from networkx.algorithms import centrality as cn
from networkx.algorithms import bipartite
import pandas as pd

# Read edgelist from edges.csv
edgelist = pd.read_csv("edges.csv")

# Calculate weights
G = nx.from_pandas_edgelist(edgelist, 'source', 'target')
W = bipartite.weighted_projected_graph(G, edgelist['target'].unique())
W.edges(data=True)
edgelist = nx.to_pandas_edgelist(W)

# Make nodelist based on edgelist
sources = list(set(edgelist.source))
targets = list(set(edgelist.target))
nodes = list(set(sources + targets))
nodelist = pd.DataFrame(nodes).reset_index()
nodelist.columns = ['id', 'name']

# Make a node dictionary
node_dict = {k: v for k, v in zip(nodelist.name, nodelist.id)}
nodes = node_dict.keys()
node_ids = node_dict.values()

# Make edge tuples
sources = [node_dict.get(s) for s in edgelist.source]
targets = [node_dict.get(s) for s in edgelist.target]
weights = [w for w in edgelist.weight]

edge_tuples = []
for s,t,w in zip(sources,targets,weights):
    edge_tuples.append((s,t,w))

# Make a node names dictionary
name_dict = {k: v for k, v in zip(nodelist.id, nodelist.name)}

# Initialize graph, add nodes and edges, calculate modularity and centrality.
G = nx.Graph()
G.add_nodes_from(list(node_ids))
G.add_weighted_edges_from(edge_tuples)
groups = community.best_partition(G)
degree = cn.degree_centrality(G)
betweenness = cn.betweenness_centrality(G, weight='weight')
eigenvector = cn.eigenvector_centrality(G, weight='weight')

# Add node attributes for name, modularity, and three types of centrality.
nx.set_node_attributes(G, name = 'name', values = name_dict)
nx.set_node_attributes(G, name = 'group', values = groups)
nx.set_node_attributes(G, name = 'degree', values = degree)
nx.set_node_attributes(G, name = 'betweenness', values = betweenness)
nx.set_node_attributes(G, name = 'eigenvector', values = eigenvector)

# Create json representation of the graph (for d3).
data = json_graph.node_link_data(G)

# Output json of the graph.
with open('marvel.json', 'w') as output:
    json.dump(data, output, sort_keys=True, indent=4, separators=(',',':'))
