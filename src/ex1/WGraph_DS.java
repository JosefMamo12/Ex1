package ex1;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;



class WGraph_DS implements weighted_graph,Serializable  {
	private HashMap<Integer, node_info> _vertices;
	private HashMap <node_info,HashMap<Integer, Edge>> _edges;
	int _size, _edgeSize, _mc;



	public WGraph_DS () {
		_vertices = new HashMap<Integer, node_info>();
		_edges= new HashMap<node_info,HashMap<Integer,Edge>>();
		_size = 0;
		_edgeSize = 0;
		_mc = 0; 
	}
		@Override
		public node_info getNode(int key) {
			if(_vertices.containsKey(key))
				return _vertices.get(key);
			return null;
		}

		@Override
		public boolean hasEdge(int node1, int node2) {
			if(_edges.containsKey(_vertices.get(node1)) && _edges.containsKey(_vertices.get(node2)) && node1 != node2) {
				if(_edges.get(_vertices.get(node1)).containsKey(node2)) return true;
			}
			return false;
		}

		@Override
		public double getEdge(int node1, int node2) {
			if(node1 == node2) 
				return -1;
			if(!(_vertices.containsKey(node1) || !(_vertices.containsKey(node2))))
				return -1;
			if(!hasEdge(node1, node2))
				return -1;
			Edge e = null;
			node_info src = this._vertices.get(node1);
			e = _edges.get(src).get(node2);
			return e.getWeight();
		}

		@Override
		public void addNode(int key) {
			if(_vertices.containsKey(key))
				return;
			node_info node = new NodeInfo(key);
			_vertices.put(key,node);
			_edges.put(_vertices.get(key), new HashMap<Integer, Edge>());
			_mc++;
			_size++;

		}

		@Override
		public void connect(int node1, int node2, double w) {
			if(node1 == node2) 
				return;
			else if(!(_vertices.containsKey(node1) || !(_vertices.containsKey(node2))))
				return;
			else if(w<0) // negative weight for an edge cannot be posible
				return;
			else if(hasEdge(node1, node2))
				return;
			else {
				_edges.get(_vertices.get(node1)).put(node2, new Edge(node1, node2, w));// connect between the hashmap of the vertices to the edges.
				_edges.get(_vertices.get(node2)).put(node1, new Edge(node2, node1, w));
				_edgeSize ++;
				_mc++;
			}
		}


		@Override
		public Collection<node_info> getV() {
			return this._vertices.values();
		}

		@Override
		public Collection<node_info> getV(int node_id) {
			node_info d =_vertices.get(node_id);
			HashMap<Integer,node_info> neighboors = new HashMap<Integer, node_info>();
			if(!(_vertices.containsKey(node_id))) {return null;}
			for (Integer key:_edges.get(d).keySet()) {//O(K)
				neighboors.put(key, _vertices.get(key));
			}
			return neighboors.values();//(O)1

		}

		@Override
		public node_info removeNode(int key) {
			if(!_vertices.containsKey(key)) {return null;}
			node_info keyToDelete = this._vertices.get(key);
			int minusEdges = getV(key).size();
			_edges.get(keyToDelete).clear();
			_edges.remove(keyToDelete);
			_edgeSize -=minusEdges;
			_mc+=minusEdges;
			_vertices.remove(key);
			_size--;
			_mc++;
			return keyToDelete;
		}

		@Override
		public void removeEdge(int node1, int node2) {
			if(node1 == node2) 
				return;
			if(!(_vertices.containsKey(node1) || !(_vertices.containsKey(node2))))
				return;
			if(!hasEdge(node1, node2))
				return;
			node_info src = _vertices.get(node1);
			node_info dest = _vertices.get(node2);
			_edges.get(src).remove(node2);
			_edges.get(dest).remove(node1);
			_edgeSize--;
			_mc++;

		}

		@Override
		public int nodeSize() {return this._size;}
		@Override
		public int edgeSize() {return this._edgeSize;}
		@Override
		public int getMC() {return this._mc;}

	
}



//------------------Inner node_info class--------------------------------------//
class NodeInfo implements node_info,Serializable{
	private  int _key;
	private String _str;
	private double _tag;
	private static int count;


	public NodeInfo () {
		this._key =	count++;
		_str = null;
		_tag = -1;
	}

	public NodeInfo(int key) {
		this._key = key;
		_str = null;
		_tag = -1;
	}


	@Override
	public String toString() {
		return " [Key=" + _key + "]";
	}
	@Override
	public int getKey() {return this._key;}

	@Override
	public String getInfo() {return this._str;}

	@Override
	public void setInfo(String s) {this._str = s;}

	@Override
	public double getTag() {return this._tag;}

	@Override
	public void setTag(double t) {this._tag = t;}
}

//--------------------------- inner Edge Class -----------------//	
/**
 * Edge class represents as it sounds the edge 
 * @author JosefMamo
 *
 */
class Edge {
	private int _src;
	private int _dest;
	private double _weight;

	public Edge (int src , int dest , double weight) {
		this._src = src;
		this._dest = dest;
		this._weight =weight;
	}
	public int getSrc() {return _src;}
	public void setSrc(int src) {this._src = src;}
	public int getDest() {return _dest;}
	public void setDest(int dest) {this._dest = dest;}
	public double getWeight() {return _weight;}
	public void setWeight(double weight) {	this._weight = weight;}
}

//-------------------------------Outer Class-----------------------------------------//

