import React from "react";
import "../LearnPage.css";

function BoykovKolmogorovInfo() {
  const cppCode = `const int INF = 1000000000;

struct BoykovKolmogorov {
    struct Edge {
        int to, cap, flow;
    };

    vector<Edge> edges;
    vector<vector<int>> adj;
    vector<int> parent, parentEdge;
    vector<int> active;
    int n, s, t;

    BoykovKolmogorov(int n, int s, int t) : n(n), s(s), t(t) {
        adj.resize(n);
        parent.resize(n, -1);
        parentEdge.resize(n, -1);
    }

    void addEdge(int u, int v, int cap) {
        adj[u].push_back(edges.size());
        edges.push_back({v, cap, 0});
        adj[v].push_back(edges.size());
        edges.push_back({u, 0, 0});
    }

    bool bfsFromSource() {
        fill(parent.begin(), parent.end(), -1);
        parent[s] = s;
        queue<int> q;
        q.push(s);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : adj[u]) {
                if (parent[edges[id].to] == -1 && 
                    edges[id].flow < edges[id].cap) {
                    parent[edges[id].to] = u;
                    parentEdge[edges[id].to] = id;
                    if (edges[id].to == t) return true;
                    q.push(edges[id].to);
                }
            }
        }
        return false;
    }

    bool bfsToSink() {
        fill(parent.begin(), parent.end(), -1);
        parent[t] = t;
        queue<int> q;
        q.push(t);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : adj[u]) {
                if (parent[edges[id].to] == -1 && 
                    edges[id ^ 1].flow < edges[id ^ 1].cap) {
                    parent[edges[id].to] = u;
                    parentEdge[edges[id].to] = id;
                    if (edges[id].to == s) return true;
                    q.push(edges[id].to);
                }
            }
        }
        return false;
    }

    int maxflow() {
        int flow = 0;
        while (bfsFromSource() && bfsToSink()) {
            // Find bottleneck from s to t
            int bottleneck = INF;
            for (int u = t; u != s; u = parent[u]) {
                bottleneck = min(bottleneck, 
                    edges[parentEdge[u]].cap - edges[parentEdge[u]].flow);
            }

            // Update flow
            for (int u = t; u != s; u = parent[u]) {
                edges[parentEdge[u]].flow += bottleneck;
                edges[parentEdge[u] ^ 1].flow -= bottleneck;
            }
            flow += bottleneck;
        }
        return flow;
    }
};`;

  return (
    <div className="learn-article">
      <h2>Boykov–Kolmogorov Algorithm</h2>
      <p className="algo-subtitle">
        Advanced Max Flow with Bidirectional Search (2004)
      </p>

      <h3>Core Concept</h3>
      <p>
        The <strong>Boykov–Kolmogorov algorithm</strong> is a modern max flow
        algorithm that uses <strong>bidirectional search</strong> from both the
        source and sink simultaneously. It maintains two{" "}
        <strong>search trees</strong> (one rooted at the source, one at the
        sink) and grows them until they meet, forming an augmenting path. This
        is particularly efficient for{" "}
        <strong>low-capacity-edge networks</strong> and is widely used in{" "}
        <strong>computer vision</strong> applications.
      </p>

      <h3>Key Innovations</h3>
      <ul>
        <li>
          <strong>Bidirectional search:</strong> Grows trees from both source
          and sink simultaneously, reducing search space.
        </li>
        <li>
          <strong>Tree-based structure:</strong> Maintains parent pointers to
          reconstruct paths efficiently.
        </li>
        <li>
          <strong>Multiple augmentations per BFS:</strong> Can find and process
          multiple paths per iteration.
        </li>
        <li>
          <strong>Orphan node handling:</strong> Advanced versions reuse search
          trees across iterations (not covered in basic version).
        </li>
      </ul>

      <h3>Algorithm Outline</h3>
      <ol>
        <li>
          <strong>Initialize:</strong> Create residual graph with forward and
          backward edges.
        </li>
        <li>
          <strong>BFS from source:</strong> Build a tree from the source{" "}
          <code>s</code> to find reachable nodes.
        </li>
        <li>
          <strong>BFS from sink:</strong> Build a tree from the sink{" "}
          <code>t</code> to find nodes that can reach <code>t</code>.
        </li>
        <li>
          <strong>Find meeting point:</strong> When the two trees meet at a
          node, an augmenting path is formed.
        </li>
        <li>
          <strong>Push flow:</strong> Calculate bottleneck capacity and push
          flow through the path.
        </li>
        <li>
          <strong>Repeat:</strong> Rebuild trees and continue until no
          augmenting path exists.
        </li>
      </ol>

      <h3>Search Tree Structure</h3>
      <p>The algorithm maintains two disjoint search trees:</p>
      <ul>
        <li>
          <strong>Source tree:</strong> Contains nodes reachable from{" "}
          <code>s</code> using forward edges with available capacity.
        </li>
        <li>
          <strong>Sink tree:</strong> Contains nodes from which <code>t</code>{" "}
          is reachable using reverse edges with available capacity.
        </li>
        <li>
          When the trees overlap at a node <code>v</code>, the path{" "}
          <code>s → ... → v → ... → t</code> is an augmenting path.
        </li>
      </ul>

      <h3>Why Bidirectional Search?</h3>
      <p>Bidirectional search is faster because:</p>
      <ul>
        <li>
          <strong>Reduced search space:</strong> Instead of searching from{" "}
          <code>s</code> to all <code>O(V)</code> nodes, we search from both
          ends, meeting in the middle.
        </li>
        <li>
          <strong>Fewer edges explored:</strong> We only explore edges that are
          useful for flow, ignoring dead ends earlier.
        </li>
        <li>
          <strong>Better for sparse graphs:</strong> Especially efficient when
          the graph has low average degree.
        </li>
      </ul>

      <h3>Time Complexity</h3>
      <ul>
        <li>
          <strong>Worst case:</strong> <code>O(V³)</code> (same as
          Ford–Fulkerson with DFS)
        </li>
        <li>
          <strong>Practice:</strong> Often <code>O(V²E)</code> or better,
          especially on low-capacity networks.
        </li>
        <li>
          <strong>Special cases:</strong> <code>O(√V · E)</code> on
          unit-capacity graphs.
        </li>
      </ul>

      <h3>Practical Performance</h3>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Graph Type</th>
            <th>Edmonds–Karp</th>
            <th>Dinic's</th>
            <th>Boykov–Kolmogorov</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Sparse, low-capacity</strong>
            </td>
            <td>Moderate</td>
            <td>Good</td>
            <td>
              <strong>Excellent</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Dense graphs</strong>
            </td>
            <td>Slow</td>
            <td>Moderate</td>
            <td>Good</td>
          </tr>
          <tr>
            <td>
              <strong>Unit-capacity networks</strong>
            </td>
            <td>Very slow</td>
            <td>Good</td>
            <td>
              <strong>Fast</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Bipartite matching</strong>
            </td>
            <td>Slow</td>
            <td>
              <strong>Excellent</strong>
            </td>
            <td>Good</td>
          </tr>
        </tbody>
      </table>

      <h3>Pros & Cons</h3>
      <ul className="pros-cons">
        <li className="pro">
          <strong>✅ Very efficient on low-capacity networks:</strong> Dominant
          algorithm for computer vision applications (graph cuts).
        </li>
        <li className="pro">
          <strong>✅ Good practical performance:</strong> Often beats Dinic's
          and Edmonds–Karp on real-world graphs.
        </li>
        <li className="pro">
          <strong>✅ Bidirectional intuition:</strong> More intuitive than
          Push-Relabel or level graphs.
        </li>
        <li className="con">
          <strong>❌ More complex to implement:</strong> Requires maintaining
          two search trees and parent pointers.
        </li>
        <li className="con">
          <strong>❌ Advanced optimizations are complex:</strong> "Orphan reuse"
          adds significant complexity.
        </li>
        <li className="con">
          <strong>❌ Higher memory overhead:</strong> Stores parent and tree
          information for all nodes.
        </li>
      </ul>

      <h3>Example Walkthrough</h3>
      <p>Consider the following graph:</p>
      <pre>
        <code>
          {`Vertices: s, a, b, t
Edges (capacity):
s → a (8)
s → b (5)
a → b (3)
a → t (4)
b → t (6)`}
        </code>
      </pre>

      <p>
        <strong>Iteration 1: BFS from source</strong>
      </p>
      <pre>
        <code>
          {`Source tree after BFS:
  s (root)
  ├─ a (parent: s)
  └─ b (parent: s)`}
        </code>
      </pre>

      <p>
        <strong>BFS from sink</strong>
      </p>
      <pre>
        <code>
          {`Sink tree after BFS:
  t (root)
  ├─ a (parent: t)
  └─ b (parent: t)

Trees meet at node 'a':
  Path: s → a → t`}
        </code>
      </pre>

      <p>
        <strong>Push flow along path</strong>
      </p>
      <pre>
        <code>
          {`Bottleneck: min(8, 4) = 4
Flow pushed: 4
Updated residuals:
  s → a: 4 (8 - 4)
  a → t: 0 (saturated)
  t → a: 4 (reverse)`}
        </code>
      </pre>

      <p>
        <strong>Iteration 2: Rebuild trees</strong>
      </p>
      <pre>
        <code>
          {`New path found: s → b → t
Bottleneck: min(5, 6) = 5
Flow pushed: 5

Continue until no more augmenting paths exist.`}
        </code>
      </pre>

      <h3>Applications</h3>
      <ul>
        <li>
          <strong>Computer Vision:</strong> Graph cuts for image segmentation,
          3D reconstruction.
        </li>
        <li>
          <strong>Minimal Cut:</strong> Finding optimal segmentation with energy
          minimization.
        </li>
        <li>
          <strong>Stereo Matching:</strong> Computing depth maps in stereo
          vision.
        </li>
        <li>
          <strong>General Max Flow:</strong> Any application requiring efficient
          max flow on sparse graphs.
        </li>
      </ul>

      <h3>Comparison with Other Algorithms</h3>
      <ul>
        <li>
          <strong>vs. Ford–Fulkerson:</strong> Much more efficient, especially
          on large graphs.
        </li>
        <li>
          <strong>vs. Edmonds–Karp:</strong> Bidirectional search is faster in
          practice.
        </li>
        <li>
          <strong>vs. Dinic's:</strong> More efficient on low-capacity networks;
          Dinic's better on unit-capacity.
        </li>
        <li>
          <strong>vs. Push-Relabel:</strong> Similar asymptotic complexity, but
          different approach (tree-based vs. height-based).
        </li>
      </ul>

      <h3>Code Example</h3>
      <p>Here's a simplified C++ implementation of Boykov–Kolmogorov:</p>
      <pre>
        <code>{cppCode}</code>
      </pre>

      <h3>Further Reading</h3>
      <ul>
        <li>
          <strong>Original Paper:</strong> "An Experimental Comparison of
          Min-Cut/Max-Flow Algorithms for Energy Minimization in Vision" by
          Boykov and Kolmogorov (2004).
        </li>
        <li>
          <strong>Key Innovation:</strong> Bidirectional search combined with
          tree reuse across iterations.
        </li>
        <li>
          <strong>Extensions:</strong> Modern implementations include orphan
          reuse, gap heuristics, and other optimizations.
        </li>
      </ul>
    </div>
  );
}

export default BoykovKolmogorovInfo;
