**Project writer:** Joseph Mamo , Ariel university.

**Project description:** This project describe a weighted graph and his algorithms, the project is divided to 2 interfaces weighted_graph and the weighted_graph_algorithm that wrote by Prof' **Boaz Ben Moshe** , and 2 classes which implements the 2 interface.

**Links**: [Dijkstra Algorithm](https://www.youtube.com/watch?v=pVfj6mxhdMw) ,

**Classes and functions**:

##### Node_Info:(inner class WGraph_DS)
This class describe the vertex build and the vertex features like
tag, information about the node. each node got unique key. 

## Functions:
* The **getKey()** will return the key for the node i want  to work on. O(1) Time Complexity.
*  The **getTag()** and **setTag(int t)** functions help to tag and get each node by integer values.
* The **getInfo()** and **setInfo(String s)** functions help to get information about that particular string, and add information to him.

## Edge:(inner class WGraph_DS)
  This inner class is represent the edge between nodes by using an edge hash-map for each node in the graph which represent the adjacency of the current node.    

#### Functions:

A regular getters and setters functions for each field in the class.
and the main constructur that build the edge **Edge (int src , int dest , double weight)**.

    
## WGraph_DS:
This class will build the weighted graph by using hash-map data structure for the vertices, in addition edges hash-map which classified to each node which edge relate to this  current node, MC Counter, nodeSize counter and edgeSize counter. 

#### Functions:

* The  **getNode(int key)** will return the node by his key.O(1) Time Complexity.
* The **hasEdge(int node1, int node2)** return true or false if there is edge between two nodes by the keys of them.O(1) Time Complexity.
* The **getEdge (int node1,int node2)** will return the weight of the edge between two nodes by their keys and using in the _edges hash-map. O(1) Time complexity. 
* The **addNode(int key)** will add node to the graph hash-map.O(1) Time complexity.
* The **connect(int node1, int node2)** will add an edge between to nodes and update the _edges hash-map. O(1) Time complexity.
* The **Collection<node_info> getV()** return values of vertices in O(1) time complexity.
* The **Collection<node_info> getV(int node_id)** return the values of all of the by searching the node at the edges hash O(1), iterate over all of his adjacency list, put in a new hash-map O(K) and than return the values of the new hash-map O(1) .O(K) Time complexity.
* The **removeNode(int key)**  method removing all the edges from this node and than remove the node by his key.O(K) Time complexity when K is the number of the adjacency.
* The **removeEdge(int node1, int node2)** method remove the edge between two nodes by their integer keys.O(1) Time complexity
* The **nodeSize()** return the size of the nodes in graph by returning the hash-map vertexSize , The **edgeSize()** returning by the counter and The **getMC()** returning all the changes i have made in this graph.

## WGraph_Algo:
This class is about all the graph algorithms like if the graph is connected graph and what is the shortest path between two nodes. this class has only one field which is a graph.

#### Functions; 
* The **init(graph g)** to use an other graph on the graph algorithms class.
* The **Copy()** this is a function which do a deep copy of this graph for another graph i use here the copy constructor from NodeData class which help creating a new copy nodes.
* The **isConnected()**  method use the Dijkstra function which help to see by the distances hash-map if all the nodes are connected to each other.
* The **shortestPathDist(int src, int dest)** method use the Dijkstra algorithm and return double value of the shortest path.
* The **List<node_info shortestPath(int src, int dest)** also using the BFS and after return back from the dest node to the src node by the tags.
* The **dijkstra(node_data startNode)** is a main function which almost help to all function in this class.
* The **returnIntKey(node_info current)**  method help to find the parent path.
* The **mindistance()** function that help to the Dijkstra to find the node with minimum weight by use distance hash-map.
* The **setDistanceWeight()** method initialize the parent hash-map, the distance hash-map and reset the tag of each nodes before using the Dijkstra.