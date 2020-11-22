package ex1;

import java.io.File;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectInputStream.GetField;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Stack;




public class WGraph__Algo implements weighted_graph_algorithms, Serializable {


	weighted_graph _graph;
	HashMap <Integer,node_info> _parent;
	HashMap <node_info,Double> _distance;
	static final double infinity = Double.POSITIVE_INFINITY;


	@Override
	public void init(weighted_graph g) {
		this._graph = g;

	}

	@Override
	public weighted_graph getGraph() {
		return this._graph;
	}

	@Override
	public weighted_graph copy() {
		weighted_graph copyGraph = new WGraph_DS();
		HashMap<node_info,HashMap<Integer,Edge>> copyEdgesHashMap = new HashMap<node_info, HashMap<Integer,Edge>>();
		Collection <node_info> list = this._graph.getV();
		for (node_info nodes : list) {
			copyGraph.addNode(nodes.getKey());
			copyEdgesHashMap.put(nodes, new HashMap<Integer, Edge>());

		}
		for (node_info nodes : list) {
			Collection<node_info> Edges = this._graph.getV(nodes.getKey());
			for (node_info addToEdgesHash : Edges) {
				double edgeWeight = _graph.getEdge(nodes.getKey(), addToEdgesHash.getKey());
				if(!(copyGraph.hasEdge(nodes.getKey(),addToEdgesHash.getKey())))
					copyGraph.connect(nodes.getKey(), addToEdgesHash.getKey(), edgeWeight);

			}
		}
		return copyGraph;
	}
	
	@Override
	public boolean isConnected() {
		if(_graph.nodeSize() == 0 || _graph.edgeSize()==1)
			return true;
		ArrayList<node_info> v = new ArrayList<node_info>(_graph.getV());
		dijkestra(v.get(0).getKey());
		for (node_info node : v) {
			if(_distance.get(node)==infinity) {
				return false;
			}
		}
		return true;
	}

	@Override
	public double shortestPathDist(int src, int dest) {
		node_info nodeSrc = _graph.getNode(src);
		node_info nodeDest= _graph.getNode(dest);
		if(src == dest) {
			return 0;
		}
		else if(!(_graph.getV().contains(nodeSrc))||!(_graph.getV().contains(nodeDest)))	{
			return -1;
		}
		else if(_graph.nodeSize()==0 ||_graph.nodeSize()==1) {
			return-1;
		}
		else {
			dijkestra(src);
			return _distance.get(this._graph.getNode(dest));
		}
	}
	@Override
	public List<node_info> shortestPath(int src, int dest) {
		Stack <node_info> stack = new Stack<node_info>();
		if(shortestPathDist(src,dest) == -1) {
			return null;
		}

		else if (shortestPathDist(src, dest)== infinity) {
			return null;
		}
		else
		{
			stack.add(_graph.getNode(dest));
			while(src!=dest) {
				node_info parentNode = _parent.get(dest);
				stack.add(parentNode);
				dest = returnIntKey(parentNode);
			}
		}
		LinkedList<node_info> ll = new LinkedList<node_info>();
		while(!stack.isEmpty()){
			ll.add(stack.pop());
		}
		return ll;

	}

	@Override
	public boolean save(String file) {
		try {
			FileOutputStream file_to_save = new FileOutputStream(file);
			ObjectOutputStream out = new ObjectOutputStream(file_to_save);

			out.writeObject(_graph);
			
			out.close();
			file_to_save.close();
			return true;
		} catch (IOException ex) {
			System.out.println("IOException is caught");
			
		}
		return false;
	}
		


	@Override
	public boolean load(String file) {
		
		try {
			FileInputStream file_to_load = new FileInputStream(file);
			ObjectInputStream in = new ObjectInputStream(file_to_load);

			_graph =  (weighted_graph) in.readObject();

			in.close();
			file_to_load.close();
			return true;
		}

		catch (IOException ex) {
			System.out.println("IOException is caught");
			
		}

		catch (ClassNotFoundException ex) {
			System.out.println("ClassNotFoundException is caught");
			
		}
		return false;
	}
	



	/**
	 * dijkestra algoritham is an Algorithm which you can find the shortest path from the source node to the 
	 * every node in the graph i chose to use a two more hashmaps one is to the distances and the second one is for the
	 * parent path.
	 * @param nodeSrc
	 * @return
	 */

	public void dijkestra(int nodeSrc) {
		node_info first = this._graph.getNode(nodeSrc);
		_parent = new HashMap<Integer, node_info>();
		_distance = new HashMap <node_info,Double>();
		setDistanceWeight();
		_parent.put(first.getKey(), null);
		_distance.put(first, 0.0);
		for (int i = 0; i < _graph.nodeSize(); i++) {
			node_info current = mindistance(); 
			current.setTag(0);
			ArrayList <node_info> nodeNei = new ArrayList<node_info>(_graph.getV(current.getKey())); 
			for (node_info neibo : nodeNei) {
				if(neibo!=null) {
					double neiboWei = this._graph.getEdge(neibo.getKey(), current.getKey());
					if(neibo.getTag()==-1 && _distance.get(current)+neiboWei<_distance.get(neibo)) {
						_distance.put(neibo,_distance.get(current)+neiboWei);
						_parent.put(neibo.getKey(), current);
					}
				}
			}
		}
	}
	/**
	 * this method link in parent hashmap between the node_info values to the integer keys.
	 * this private function espacilly for the shortestDistance method.
	 * @param current
	 * @return int
	 */
	private int returnIntKey(node_info current) {
		int d = 0;
		for(Entry<Integer, node_info> entry: _parent.entrySet()){
			if(entry.getKey()==current.getKey())
				d =entry.getKey();
		}
		return d;
	}
	/**
	 * private function for the dijkestra that find the node with the smallest weight node.
	 * use the Entry map which help to use the keys and the values of the _distance hashmap. 
	 * @return node_info
	 */
	private node_info mindistance() {
		Entry<node_info, Double> min = null;
		for (Entry<node_info, Double> entry : _distance.entrySet()) {
			if(entry.getKey().getTag()!=0) {//check if we already visit the node
				if(min==null ||min.getValue()>entry.getValue()) {// check for the minmum value that associated with the node
					min = entry;
				}
			}
		}
		return min.getKey();
	}
	/**
	 * reset buffer which set the tag of every node in -1.
	 * intialize _parent and_distance hashMaps before using dijkestra.
	 * @return
	 */
	private void setDistanceWeight() {
		Collection <node_info> setHash = new ArrayList<node_info>(_graph.getV());
		for (node_info node_info : setHash) {
			node_info.setTag(-1);
			_parent.put(node_info.getKey(), null);
			_distance.put(node_info, infinity);

		}
	}

}
