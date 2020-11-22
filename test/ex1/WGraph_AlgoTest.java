package ex1;

import static org.junit.jupiter.api.Assertions.*;

import java.awt.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
import java.util.Random;
import org.junit.jupiter.api.Test;

class WGraph_AlgoTest {
	private static Random _rand;
	private static long _seed;
	public static void initSeed(long seed) {
		_seed = seed;
		_rand = new Random(_seed);
	}
	public static void initSeed() {
		initSeed(_seed);
	}
	/*
	 *graph contains 15 vertices , 0 edges.
	 */
	@Test
	void testisConnected0() {
		int v = 15 , e = 0;
		weighted_graph g = graph_creator(v, e, 1);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		assertEquals(false, g1.isConnected());
	}
	/*
	 * test is connected for a graph with no edges and no vertices.
	 */
	@Test
	void testisConnected1 () {
		int v = 0 , e = 0;
		weighted_graph g = graph_creator(v, e, 1);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		assertEquals(true, g1.isConnected());
	
	}
	/*
	 * testing a graph with 10 vertices and 16 edges after 
	 * one change thats stay the graph connected and after the second change
	 * the graph should not be connected.
	 */
	@Test
	void tesisConnected2() {
		int v = 10 , e = 16;
		weighted_graph g = graph_creator1(v, e, 1);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		g.removeNode(5);
		assertEquals(true,g1.isConnected());
		g.removeNode(4);
		assertEquals(false,g1.isConnected());
	}
	/*
	 * big graph test is connected
	 */
	@Test
	void tesisConnected3() {
		int v = 10*500 , e = 16*500;
		weighted_graph g = graph_creator1(v, e, 1);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		assertEquals(false, g1.isConnected());
	}
	/*
	 * this test checking the shortest path in complex graph
	 * and after a few changes in the graph check again.
	 */
	@Test
	void testshortestPathDistance0() {
		int v = 10 , e = 16 ;
		weighted_graph g = graph_creator1(v, e, 2);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		assertEquals(19, g1.shortestPathDist(0, 8));
		g.removeNode(4);
		g.removeNode(5);
		assertEquals(Double.POSITIVE_INFINITY,g1.shortestPathDist(0, 8));
	}
	
	@Test 
	void testshortestPath0(){
		int v = 10 , e = 16 ;
		weighted_graph g = graph_creator1(v, e, 1);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		LinkedList<node_info> ans = new LinkedList<node_info>();
		ans =  (LinkedList<node_info>) g1.shortestPath(0, 9);
		String s = "";
		for (int i = 0; i <ans.size(); i++) {
			if(i==ans.size()-1)
				s+=ans.get(i).getKey();
			else
			s+= ans.get(i).getKey() + "-->";
		}
		assertEquals("0-->2-->4-->6-->7-->9",s);
	}
	
	/**
	 * shortest path for empty graph
	 */
	@Test
	void testshortestPath1() {
		int v = 0 , e = 0;
		weighted_graph g = graph_creator1(v, e, 1);
		weighted_graph_algorithms g1 = new WGraph__Algo();
		g1.init(g);
		assertEquals(null,g1.shortestPath(0, 12));
	}
	
	@Test
	void testCopy() {
		int v = 2 ,  e = 1;
		weighted_graph g = graph_creator(v, e, 1);
		weighted_graph g2 = null;
		weighted_graph_algorithms g1 = new WGraph__Algo();
		weighted_graph_algorithms g3 = new WGraph__Algo();
		g1.init(g);
		g2 = g1.copy();
		g3.init(g2);
		if(g3.equals(g1))
			fail(); // if the two graphs were on the same address means shallow copy.
	}
	@Test
	void testload() {
	weighted_graph g = new WGraph_DS();
	for (int i =1 ; i<10 ;i++){
		g.addNode(i);
	}
	for(int i =2 ; i <g.nodeSize() ;i++) {
		g.connect(1, i, i);
	}
	
	weighted_graph_algorithms graph = new WGraph__Algo();
	graph.init(g);
	graph.save("test_save2.txt");
	weighted_graph_algorithms graph1 = new WGraph__Algo();
	graph1.load("test_save2.txt");
	
	
}
	
	
	/////////////////////////////////////////////////
	private static int nextRnd(int min, int max) {
		double v = nextRnd(0.0+min, (double)max);
		int ans = (int)v;
		return ans;
	}
	private static double nextRnd(double min, double max) {
		double d = _rand.nextDouble();
		double dx = max-min;
		double ans = d*dx+min;
		return ans;
	}
	/*
	 * Simple method for returning an array with all the node_data of the graph,
	 * Note: this should be using an  Iterator<node_edge> to be fixed in Ex1
	 * @param g
	 * @return
	 */
	private static int[] nodes(weighted_graph g) {
		int size = g.nodeSize();
		Collection<node_info> V = g.getV();
		node_info[] nodes = new node_info[size];
		V.toArray(nodes); // O(n) operation
		int[] ans = new int[size];
		for(int i=0;i<size;i++) {ans[i] = nodes[i].getKey();}
		Arrays.sort(ans);
		return ans;
	}

	/*
	 * Generate a random graph with v_size nodes and e_size edges
	 * @param v_size
	 * @param e_size
	 * @param seed
	 * @return
	 */
	private static weighted_graph graph_creator(int v_size, int e_size, int seed) {
		weighted_graph g = new WGraph_DS();
		initSeed(seed);
		for(int i=0;i<v_size;i++) {
			g.addNode(i);
		}
		
		int[] nodes = nodes(g);
		while(g.edgeSize() < e_size) {
			double w = nextRnd(1, 10);
			int a = nextRnd(0,v_size);
			int b = nextRnd(0,v_size);
			int i = nodes[a];
			int j = nodes[b];
			g.connect(i,j,w);
		}
		return g;
		/*
		 *Create a unique graph which help to the tests.
		 *@param v_size
		 *@param e_size
		 *@param seed
		 *@return weighted_graph
		 */
	}
	private static weighted_graph graph_creator1(int v_size, int e_size, int seed) {
		weighted_graph g = new WGraph_DS();
		initSeed(seed);
		for(int i=0;i<v_size;i++) {
			g.addNode(i);
		}
		int[] nodes = nodes(g);
		int i = 2;
		while(g.edgeSize() < e_size) {
			if(i<v_size) {
			int a = nodes [i-2];
			int b = nodes[i-1];
			int c =nodes [i];
			double w = nextRnd(1, 10);
			g.connect(a,b,w);
			w = nextRnd(1,10);
			g.connect(a, c, w);
			i++;
			}
		}
		return g;
	}
}


