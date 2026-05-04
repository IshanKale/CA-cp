// @ts-nocheck
// Implements the Boykov-Kolmogorov algorithm for max flow.
// This algorithm uses two search trees growing from source and sink simultaneously.

/**
 * Finds augmenting paths using bidirectional BFS from source and sink.
 * @param {object} residualGraph - The residual graph.
 * @param {string} source - The source node ID.
 * @param {string} sink - The sink node ID.
 * @param {Array<string>} nodes - A list of all node IDs.
 * @returns {object|null} An object containing the path and its bottleneck flow, or null if no path exists.
 */
function findAugmentingPathBidirectional(residualGraph, source, sink, nodes) {
  const fromSource = new Set();
  const fromSink = new Set();
  const parentFromSource = {};
  const parentFromSink = {};

  const sourceQueue = [source];
  const sinkQueue = [sink];

  fromSource.add(source);
  fromSink.add(sink);
  parentFromSource[source] = null;
  parentFromSink[sink] = null;

  let meetingNode = null;

  // Bidirectional BFS
  while (sourceQueue.length > 0 || sinkQueue.length > 0) {
    // Expand from source
    if (sourceQueue.length > 0) {
      const u = sourceQueue.shift();
      for (const v of nodes) {
        if (!fromSource.has(v) && residualGraph[u][v] > 0) {
          fromSource.add(v);
          parentFromSource[v] = u;

          if (fromSink.has(v)) {
            meetingNode = v;
            break;
          }
          sourceQueue.push(v);
        }
      }
      if (meetingNode) break;
    }

    // Expand from sink using incoming residual edges.
    if (sinkQueue.length > 0) {
      const u = sinkQueue.shift();
      for (const v of nodes) {
        if (!fromSink.has(v) && residualGraph[v][u] > 0) {
          fromSink.add(v);
          parentFromSink[v] = u;

          if (fromSource.has(v)) {
            meetingNode = v;
            break;
          }
          sinkQueue.push(v);
        }
      }
      if (meetingNode) break;
    }
  }

  if (!meetingNode) return null;

  // Reconstruct path from source to meeting node
  let path = [];
  let current = meetingNode;
  while (current !== null) {
    path.push(current);
    current = parentFromSource[current];
  }
  path.reverse();

  // Append path from meeting node to sink
  current = parentFromSink[meetingNode];
  while (current !== null) {
    path.push(current);
    current = parentFromSink[current];
  }

  // Calculate bottleneck flow
  let pathFlow = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    pathFlow = Math.min(pathFlow, residualGraph[path[i]][path[i + 1]]);
  }

  return { path, pathFlow };
}

/**
 * Runs the Boykov-Kolmogorov algorithm.
 * @param {Array<string>} nodeIds - Array of unique node IDs.
 * @param {Array<object>} edges - Array of edge objects { source, target, capacity }.
 * @param {string} source - The source node ID.
 * @param {string} sink - The sink node ID.
 * @returns {Array<object>} An array of step objects for visualization.
 */
export function runBoykovKolmogorov(nodeIds, edges, source, sink) {
  const steps = [];
  let cumulativeFlows = {};

  edges.forEach((edge) => {
    cumulativeFlows[`${edge.source}-${edge.target}`] = 0;
  });

  const residualGraph = {};
  nodeIds.forEach((u) => {
    residualGraph[u] = {};
    nodeIds.forEach((v) => {
      residualGraph[u][v] = 0;
    });
  });

  edges.forEach((edge) => {
    residualGraph[edge.source][edge.target] = edge.capacity;
  });

  // Initial step
  steps.push({
    path: [],
    pathFlow: 0,
    description:
      "Starting Boykov-Kolmogorov algorithm. Growing two search trees from source and sink.",
    edgeFlows: { ...cumulativeFlows },
  });

  let pathResult;
  let iteration = 0;

  while (
    (pathResult = findAugmentingPathBidirectional(
      residualGraph,
      source,
      sink,
      nodeIds,
    ))
  ) {
    iteration++;
    const { path, pathFlow } = pathResult;

    // Update residual graph
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      residualGraph[u][v] -= pathFlow;
      residualGraph[v][u] += pathFlow;
    }

    // Update cumulative flows
    const newCumulativeFlows = { ...cumulativeFlows };
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const edgeId = `${u}-${v}`;
      const reverseEdgeId = `${v}-${u}`;

      const reverseEdgeExists = edges.some(
        (e) => e.source === v && e.target === u,
      );

      if (reverseEdgeExists && newCumulativeFlows[reverseEdgeId] > 0) {
        const flowToReturn = Math.min(
          newCumulativeFlows[reverseEdgeId],
          pathFlow,
        );
        newCumulativeFlows[reverseEdgeId] -= flowToReturn;
      } else {
        newCumulativeFlows[edgeId] =
          (newCumulativeFlows[edgeId] || 0) + pathFlow;
      }
    }
    cumulativeFlows = newCumulativeFlows;

    steps.push({
      path: path,
      pathFlow: pathFlow,
      description: `Iteration ${iteration}: Bidirectional search found path ${path.join(" → ")}. Flow: ${pathFlow}.`,
      edgeFlows: { ...cumulativeFlows },
    });
  }

  // Final step
  const totalFlow = edges
    .filter((e) => e.source === source)
    .reduce(
      (sum, e) => sum + (cumulativeFlows[`${e.source}-${e.target}`] || 0),
      0,
    );

  steps.push({
    path: [],
    pathFlow: 0,
    description: `No more augmenting paths. Boykov-Kolmogorov algorithm terminates. Total max flow: ${totalFlow}`,
    edgeFlows: { ...cumulativeFlows },
  });

  return steps;
}
