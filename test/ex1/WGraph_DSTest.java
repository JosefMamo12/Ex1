package ex1;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.Random;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;




class WGraph_DSTest {
	

/*
 * simple test which create graph with 15 vertices and check if the vertices are in the graph by their keys.
 */
@Test
void testGetNode() {
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);
		assertEquals(graph.getNode(i).getKey(), i);
	}
}
/*
 * Create graph and connect between all the even keys and check if 
 * its true.
 */
@Test
void testHasEdgeAndConnect() {
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);	
	}
	for (int i = 0; i < 15; i+=2) {
		graph.connect(0, i, 1);
	}
	int i = 2;
	while(i<15) {
		if(!graph.hasEdge(0, i))
			fail();
		i+=2;
	}
}
/*
 * Connect between 0 to every other node and than check
 * the weight of every edge in the graph.
 */
@Test
void testgetEdge() {
	weighted_graph graph = new WGraph_DS();
	double checkWeight = 1;
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);	
	}	
	for (int i = 1; i < 15; i++) {
		graph.connect(0, i, checkWeight);
		checkWeight+=3;
	}
	checkWeight = 1;
	for (int i = 1; i < 15; i++) {
		assertEquals(graph.getEdge(0, i), checkWeight);
		checkWeight+=3;
	}
}
/*
 * Simple test that check if collection size is equal to the 
 * graph nodeSize.
 */
@Test
void testGetV() {
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);
	}
	Collection<node_info> graphV = graph.getV();
	assertEquals(graph.nodeSize(),graphV.size());
}
/*
 *  Test that check if removenode work by using the count.
 */
@Test
void testremoveNode() {
	int count=0;
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);
		count++;
	}
	graph.removeNode(0);
	if(!(graph.getNode(0)==null))
		fail();
	assertEquals(count-1,graph.nodeSize());
}
/*
 * check if you trying to remove not exisitng edge and if the edge size 
 * is changing.
 */
@Test
void testremoveEdge0() {
	int expected = 1;
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 5; i++) {
		graph.addNode(i);
	}
	graph.connect(1, 3, 2);
	assertEquals(expected, graph.edgeSize());
	graph.removeEdge(1, 3);
	assertEquals(0, graph.edgeSize());
	graph.removeEdge(1, 3);
	assertEquals(0, graph.edgeSize());

}
/*
 * check if remove the edge effect on edge size and the is not exist 
 * in the graph.
 */	

@Test
void testremoveEdge1() {
	int count = 0;
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);
	}
	graph.connect(0, 1, 3);
	count++;
	graph.removeEdge(0, 1);
	assertEquals(count-1, graph.edgeSize());
	assertEquals(false,graph.hasEdge(0, 1) );
}
/*
 * simple test that creates a graph which sum by count the number
 * of additions of the nodes and equals it to the function nodeSize.
 */
@Test
void testNodeSize() {
	int count = 0;
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);
		count++;
	}
	assertEquals(count, graph.nodeSize());
}
/*
 * Testing the mc counter create a graph add 4 edges and 
 * remove one of them and than try to remove an other one and it still 
 * the same mc.
 *
 */
@Test 
void testMC() {
	int count = 0;
	weighted_graph graph = new WGraph_DS();
	for (int i = 0; i < 15; i++) {
		graph.addNode(i);
		count++;
	}
	int j = 0 ;
	for (int i = 0; i <=3; i++) {
		j = (int) (Math.random()*14);
		if(!graph.hasEdge(0, j)) {
			graph.connect(0, j, 1);
			if(j!=0)
			count++;
		}
	}
	if(graph.hasEdge(0, j)) {
	graph.removeEdge(0,j);
	count++;
	}
	graph.removeEdge(0,j);//count suppose not to move also the mc counter.
	assertEquals(count, graph.getMC());
}

}