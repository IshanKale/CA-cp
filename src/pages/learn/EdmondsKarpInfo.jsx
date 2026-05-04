import React from "react";
import "../LearnPage.css";

function EdmondsKarpInfo() {
  const cppCode = `int n;
vector<vector<int>> capacity;
vector<vector<int>> adj;

int bfs(int s, int t, vector<int>& parent) {
    fill(parent.begin(), parent.end(), -1);
    parent[s] = -2;
    queue<pair<int, int>> q;
    q.push({s, INT_MAX});

    while (!q.empty()) {
        int cur = q.front().first;
        int flow = q.front().second;
        q.pop();

        for (int next : adj[cur]) {
            if (parent[next] == -1 && capacity[cur][next]) {
                parent[next] = cur;
                int new_flow = min(flow, capacity[cur][next]);
                if (next == t)
                    return new_flow;
                q.push({next, new_flow});
            }
        }
    }

    return 0;
}

int maxflow(int s, int t) {
    int flow = 0;
    vector<int> parent(n);
    int new_flow;

    while ((new_flow = bfs(s, t, parent))) {
        flow += new_flow;
        int cur = t;
        while (cur != s) {
            int prev = parent[cur];
            capacity[prev][cur] -= new_flow;
            capacity[cur][prev] += new_flow;
            cur = prev;
        }
    }

    return flow;
}`;

  return (
    <div className="learn-article">
      <h2>Edmonds–Karp Algorithm</h2>
      <p className="algo-subtitle">
        The Efficient Variant of Ford-Fulkerson (1972)
      </p>

      <h3>Core Concept</h3>
      <p>
        The <strong>Edmonds–Karp algorithm</strong> is a specific implementation
        of the Ford–Fulkerson method that uses{" "}
        <strong>BFS (Breadth-First Search)</strong> to find the{" "}
        <strong>shortest augmenting path</strong> at each iteration. This
        guarantees <strong>polynomial-time performance</strong> of{" "}
        <code>O(VE²)</code>, compared to the potentially exponential behavior of
        arbitrary Ford–Fulkerson implementations.
      </p>

      <h3>Key Characteristics</h3>
      <ul>
        <li>
          <strong>BFS-based:</strong> Always finds the{" "}
          <strong>shortest path</strong> (by number of edges) from source to
          sink in the residual graph.
        </li>
        <li>
          <strong>Path-finding approach:</strong> Like Ford–Fulkerson, finds one
          augmenting path per iteration and updates the residual graph.
        </li>
        <li>
          <strong>Polynomial guarantee:</strong> Runs in <code>O(VE²)</code>{" "}
          time, ensuring termination regardless of capacity values.
        </li>
        <li>
          <strong>Simplicity:</strong> Easier to implement and understand than
          more complex algorithms like Dinic's or Push-Relabel.
        </li>
      </ul>

      <h3>Algorithm Outline</h3>
      <ol>
        <li>
          Initialize residual capacities with the original edge capacities.
        </li>
        <li>
          Use <strong>BFS</strong> to find the shortest augmenting path from
          source to sink.
        </li>
        <li>Calculate the bottleneck (minimum capacity) along the path.</li>
        <li>
          Push flow along the path and update residual capacities:
          <ul>
            <li>Decrease forward edge capacity by the flow</li>
            <li>
              Increase reverse edge capacity by the flow (to allow flow
              cancellation)
            </li>
          </ul>
        </li>
        <li>Repeat until no augmenting path exists.</li>
      </ol>

      <h3>Residual Graph</h3>
      <p>
        After each augmentation, the <strong>residual graph</strong> is updated:
      </p>
      <ul>
        <li>
          For each edge <code>(u, v)</code> with flow <code>f</code>:
        </li>
        <li>
          Forward residual capacity: <code>c(u, v) − f</code>
        </li>
        <li>
          Backward residual capacity: <code>f</code>
        </li>
      </ul>
      <p>
        The backward edge allows the algorithm to "undo" previous flow
        decisions, which is crucial for finding optimal solutions.
      </p>

      <h3>Time Complexity Analysis</h3>
      <p>
        The key insight is that after at most <code>O(VE)</code> iterations, the
        maximum flow is found:
      </p>
      <ul>
        <li>
          <strong>Upper bound on iterations:</strong> The distance from source
          to sink increases each phase, bounded by <code>V</code>. There can be
          up to <code>O(E)</code> iterations per distance level.
        </li>
        <li>
          <strong>Per iteration cost:</strong> BFS costs <code>O(V + E)</code>,
          so path finding is <code>O(E)</code>.
        </li>
        <li>
          <strong>Total:</strong> <code>O(VE²)</code> = <code>O(VE)</code>{" "}
          iterations × <code>O(E)</code> per iteration.
        </li>
      </ul>

      <h3>Comparison with Ford–Fulkerson</h3>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Ford–Fulkerson (Generic)</th>
            <th>Edmonds–Karp (BFS-based)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Path Finding</strong>
            </td>
            <td>Any method (DFS, BFS, random)</td>
            <td>Always BFS (shortest path)</td>
          </tr>
          <tr>
            <td>
              <strong>Time Complexity</strong>
            </td>
            <td>Potentially exponential</td>
            <td>O(VE²) guaranteed polynomial</td>
          </tr>
          <tr>
            <td>
              <strong>Worst Case</strong>
            </td>
            <td>Very long (e.g., on adversarial graphs)</td>
            <td>Predictable O(VE²)</td>
          </tr>
          <tr>
            <td>
              <strong>Practical Speed</strong>
            </td>
            <td>Highly variable</td>
            <td>Consistent, moderate</td>
          </tr>
          <tr>
            <td>
              <strong>Implementation</strong>
            </td>
            <td>Simple (generic)</td>
            <td>Simple (just use BFS)</td>
          </tr>
        </tbody>
      </table>

      <h3>Pros & Cons</h3>
      <ul className="pros-cons">
        <li className="pro">
          <strong>✅ Polynomial guarantee:</strong> Always terminates in
          polynomial time, no pathological cases.
        </li>
        <li className="pro">
          <strong>✅ Simple to implement:</strong> Just replace DFS with BFS in
          Ford–Fulkerson.
        </li>
        <li className="pro">
          <strong>✅ Easy to understand:</strong> The shortest-path intuition is
          clear and intuitive.
        </li>
        <li className="con">
          <strong>❌ Slower than Dinic's:</strong> O(VE²) is worse than Dinic's
          O(V²E), especially on larger graphs.
        </li>
        <li className="con">
          <strong>❌ One path per iteration:</strong> Unlike Dinic's blocking
          flow, it only processes one path at a time.
        </li>
        <li className="con">
          <strong>❌ Not optimal for matching:</strong> Dinic's or Push-Relabel
          are better for bipartite matching and unit-capacity networks.
        </li>
      </ul>

      <h3>Example Walkthrough</h3>
      <p>Consider the following graph:</p>
      <pre>
        <code>
          {`Vertices: s, a, b, t
Edges (capacity):
s → a (10)
s → b (10)
a → t (6)
a → b (4)
b → t (10)`}
        </code>
      </pre>

      <p>
        <strong>Iteration 1: Find shortest path with BFS</strong>
      </p>
      <pre>
        <code>
          {`BFS finds: s → a → t (bottleneck: min(10, 6) = 6)
Flow pushed: 6 units
Updated residual:
  s → a: 4   (capacity 10 - flow 6)
  a → s: 6   (reverse edge)
  a → t: 0   (saturated)
  t → a: 6   (reverse edge)
  s → b: 10  (unchanged)
  b → t: 10  (unchanged)`}
        </code>
      </pre>

      <p>
        <strong>Iteration 2: Find next shortest path</strong>
      </p>
      <pre>
        <code>
          {`BFS finds: s → b → t (bottleneck: min(10, 10) = 10)
Flow pushed: 10 units
Updated residual: (now s→t is saturated)`}
        </code>
      </pre>

      <p>
        <strong>Iteration 3: Attempt to find augmenting path</strong>
      </p>
      <pre>
        <code>
          {`BFS fails to reach t from s (no augmenting path exists)
Algorithm terminates.
Total max flow: 6 + 10 = 16`}
        </code>
      </pre>

      <h3>When to Use Edmonds–Karp</h3>
      <ul>
        <li>
          <strong>When simplicity matters:</strong> Easier to code correctly
          than Dinic's or Push-Relabel.
        </li>
        <li>
          <strong>For moderate-sized graphs:</strong> Good balance between
          simplicity and performance.
        </li>
        <li>
          <strong>Guaranteed termination:</strong> When you need to be sure the
          algorithm won't exhibit pathological behavior.
        </li>
        <li>
          <strong>Academic settings:</strong> Teaching max flow algorithms where
          clarity is paramount.
        </li>
      </ul>

      <h3>Code Example</h3>
      <p>Here's a clean C++ implementation of Edmonds–Karp:</p>
      <pre>
        <code>{cppCode}</code>
      </pre>

      <h3>Further Reading</h3>
      <ul>
        <li>
          <strong>Original Paper:</strong> "Theoretical improvements in
          algorithmic efficiency for network flow problems" by Jack Edmonds and
          Richard M. Karp (1972).
        </li>
        <li>
          <strong>Key Result:</strong> First polynomial-time algorithm for max
          flow, building on Ford–Fulkerson's framework.
        </li>
      </ul>
    </div>
  );
}

export default EdmondsKarpInfo;
