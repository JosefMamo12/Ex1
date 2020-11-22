package ex1;



public class myTest {
	public static void main(String[] args) {
		weighted_graph graph = new WGraph_DS();
		graph.addNode(0);
		graph.addNode(1);
		graph.addNode(2);
		graph.addNode(3);
		graph.addNode(4);
		graph.addNode(5);
		graph.addNode(6);
		graph.addNode(7);
		graph.addNode(8);
		graph.addNode(9);
		graph.addNode(11);
		graph.addNode(12);
		graph.addNode(13);
		graph.addNode(14);
		graph.addNode(25);
		
		graph.connect(2, 4, 1);
		graph.connect(2, 3, 1);
		graph.connect(0, 1, 3);
		graph.connect(0, 2, 2);
		graph.connect(0, 3, 5 );
		graph.connect(3, 4, 8);
		graph.connect(4, 6, 3);
		graph.connect(4, 7, 3);
		graph.connect(0, 5, 3);
		graph.connect(1,8, 16);
		graph.connect(9, 8, 3);
		graph.connect(1, 9, 2);
		
	weighted_graph g2 = new WGraph_DS();
	weighted_graph_algorithms g1 = new WGraph__Algo();
	g1.init(graph);
	g2 = g1.copy();
	System.out.println(g1.shortestPathDist(0, 4));
	System.out.println(g1.shortestPath(0, 32));
	System.out.println(g1.isConnected());
 	System.out.println(graph.hasEdge(0, 4));
	System.out.println(graph.getV(0));	
	
	

	
		
	}
}
