#!/usr/bin/env python3

import networkx as nx
import pandas as pd
from networkx.readwrite import json_graph
import json
from networkx.algorithms import centrality as cn
import community as community_louvain # installed as pip install python-louvain

# Input is an edgelist csv with only source and target columns (named)
# We import it and calculate weights

edgelist = pd.read_csv('edges.csv')
M = nx.from_pandas_edgelist(edgelist, 'source', 'target', create_using = nx.MultiGraph())

G = nx.Graph()
for u,v,data in M.edges(data=True):
    w = data['weight'] if 'weight' in data else 1.0
    if G.has_edge(u,v):
        G[u][v]['weight'] += w
    else:
        G.add_edge(u, v, weight=w)

# Louvain algorithm community detection
groups = community_louvain.best_partition(G)

# Calculate centrality measures
degree = cn.degree_centrality(G)
betweenness = cn.betweenness_centrality(G, weight='weight')
eigenvector = cn.eigenvector_centrality(G, weight='weight')

# Create a labels dict
labels = {}
for l in G.nodes():
    labels[l] = l

# Add node attributes for name, modularity, and three types of centrality.
nx.set_node_attributes(G, labels, 'name')
nx.set_node_attributes(G, groups, 'group')
nx.set_node_attributes(G, degree, 'degree')
nx.set_node_attributes(G, betweenness, 'betweenness')
nx.set_node_attributes(G, eigenvector, 'eigenvector')

# Create json representation of the graph for d3
data = json_graph.node_link_data(G)

# Save json to file
with open('graph.json', 'w') as output:
    json.dump(data, output, sort_keys=True, indent=4, separators=(',',':'))