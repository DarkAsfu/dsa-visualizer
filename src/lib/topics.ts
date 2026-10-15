export type Phase = "MVP" | "Phase 2" | "Phase 3" | "Phase 4";

export type Topic = {
  title: string;
  slug: string;
  desc: string;
  ready: boolean;
  phase: Phase;
};

export type TopicGroup = {
  title: string;
  topics: Topic[];
};

function t(
  title: string,
  slug: string,
  desc: string,
  phase: Phase,
  ready = false
): Topic {
  return { title, slug, desc, phase, ready };
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    title: "1. Basics & Foundations",
    topics: [
      t("Time & Space Complexity", "complexity", "Big-O growth chart comparison.", "MVP", true),
      t("Recursion", "recursion", "Call stack visualization.", "Phase 2", true),
      t("Backtracking Basics", "backtracking-basics", "Choice, constraint, goal intuition.", "Phase 3", true),
      t("Bit Manipulation", "bit-manipulation", "AND/OR/XOR, shifts, masks.", "Phase 3", true),
    ],
  },
  {
    title: "2. Arrays & Strings",
    topics: [
      t("Array Operations", "array-ops", "Insert, delete, rotate, reverse.", "MVP", true),
      t("Two Pointers", "two-pointers", "Opposite & same direction patterns.", "MVP", true),
      t("Sliding Window", "sliding-window", "Fixed & variable window.", "Phase 2", true),
      t("Prefix Sum", "prefix-sum", "Prefix sum / difference array.", "Phase 2", true),
      t("Kadane's Algorithm", "kadane", "Max subarray in O(n).", "Phase 2", true),
      t("Dutch National Flag", "dutch-flag", "3-way partition 0/1/2.", "Phase 3", true),
      t("KMP String Matching", "kmp", "LPS table + linear search.", "Phase 4", true),
      t("Rabin-Karp", "rabin-karp", "Rolling hash matching.", "Phase 4", true),
      t("Z-Algorithm", "z-algorithm", "Z-array pattern search.", "Phase 4", true),
      t("Palindrome & Anagram", "palindrome-anagram", "Checks & frequency tricks.", "Phase 2", true),
    ],
  },
  {
    title: "3. Searching",
    topics: [
      t("Linear Search", "linear-search", "Scan one by one.", "MVP", true),
      t("Binary Search", "binary-search", "Halve the sorted range.", "MVP", true),
      t("Jump Search", "jump-search", "Block jumps + linear scan.", "Phase 3", true),
      t("Interpolation Search", "interpolation-search", "Probe by value distribution.", "Phase 3", true),
      t("Exponential Search", "exponential-search", "Range doubling + binary.", "Phase 3", true),
      t("Ternary Search", "ternary-search", "Divide into thirds.", "Phase 3", true),
    ],
  },
  {
    title: "4. Sorting",
    topics: [
      t("Sorting Overview", "sorting", "Bubble, Selection, Insertion, Merge, Quick — animated.", "MVP", true),
      t("Bubble Sort", "bubble-sort", "Adjacent swaps, largest sinks.", "MVP", true),
      t("Selection Sort", "selection-sort", "Pick the minimum each pass.", "MVP", true),
      t("Insertion Sort", "insertion-sort", "Insert the key leftwards.", "MVP", true),
      t("Merge Sort", "merge-sort", "Divide, sort, merge.", "MVP", true),
      t("Quick Sort", "quick-sort", "Pivot partition, recurse.", "MVP", true),
      t("Heap Sort", "heap-sort", "Heapify + extract max.", "Phase 2", true),
      t("Counting Sort", "counting-sort", "Frequency counting.", "Phase 2", true),
      t("Radix Sort", "radix-sort", "Digit-by-digit sort.", "Phase 3", true),
      t("Bucket Sort", "bucket-sort", "Distribute into buckets.", "Phase 3", true),
      t("Shell Sort", "shell-sort", "Gapped insertion sort.", "Phase 4", true),
      t("Sorting Race", "sorting-race", "Side-by-side algorithm comparison.", "Phase 3", true),
    ],
  },
  {
    title: "5. Linked Lists",
    topics: [
      t("Singly Linked List", "singly-linked-list", "Nodes, insert, delete.", "MVP", true),
      t("Doubly & Circular List", "doubly-linked-list", "Prev pointers, circular links.", "Phase 2", true),
      t("Reverse a Linked List", "reverse-linked-list", "Iterative pointer flip.", "MVP", true),
      t("Cycle Detection", "cycle-detection", "Floyd's tortoise-hare.", "MVP", true),
      t("Merge Two Sorted Lists", "merge-sorted-lists", "Dummy node merge.", "Phase 2", true),
      t("Middle & Nth from End", "linked-list-middle", "Fast/slow pointer tricks.", "Phase 2", true),
    ],
  },
  {
    title: "6. Stack & Queue",
    topics: [
      t("Stack", "stack", "Push / pop LIFO.", "MVP", true),
      t("Queue", "queue", "Enqueue / dequeue FIFO.", "MVP", true),
      t("Circular Queue & Deque", "circular-queue", "Ring buffer, double-ended.", "Phase 2"),
      t("Monotonic Stack", "monotonic-stack", "Increasing/decreasing stack.", "Phase 3"),
      t("Infix to Postfix", "infix-postfix", "Shunting-yard + balanced parentheses.", "Phase 2"),
      t("Next Greater Element", "next-greater", "Classic stack problem.", "Phase 2"),
      t("LRU Cache", "lru-cache", "Linked list + HashMap.", "Phase 3"),
    ],
  },
  {
    title: "7. Hashing",
    topics: [
      t("Hash Table", "hash-table", "Chaining vs open addressing.", "Phase 3"),
      t("Hash Functions", "hash-functions", "How hashing works.", "Phase 3"),
      t("Bloom Filter", "bloom-filter", "Probabilistic membership.", "Phase 4"),
    ],
  },
  {
    title: "8. Trees",
    topics: [
      t("Tree Traversals", "tree-traversals", "Inorder, preorder, postorder, level order.", "MVP", true),
      t("Binary Search Tree", "bst", "Insert, delete, search.", "MVP", true),
      t("AVL Tree", "avl-tree", "Rotations demo.", "Phase 4", true),
      t("Heap (Min/Max)", "heap-ds", "Heapify steps.", "Phase 2", true),
      t("Trie", "trie", "Prefix tree for words.", "Phase 2", true),
      t("Segment Tree", "segment-tree", "Range queries.", "Phase 4", true),
      t("Fenwick Tree", "fenwick-tree", "BIT prefix sums.", "Phase 4"),
      t("LCA", "lca", "Lowest common ancestor.", "Phase 3"),
      t("Tree Diameter & Views", "tree-diameter", "Height, diameter, top/bottom views.", "Phase 3"),
    ],
  },
  {
    title: "9. Graphs",
    topics: [
      t("Graph Overview", "graph", "Representations + algo hub.", "MVP", true),
      t("Adjacency Matrix vs List", "graph-representation", "Compare representations.", "MVP", true),
      t("BFS", "bfs", "Level-order traversal on grid.", "MVP", true),
      t("DFS", "dfs", "Depth-first + backtracking.", "MVP", true),
      t("Dijkstra", "dijkstra", "Shortest path with weights.", "Phase 2", true),
      t("Bellman-Ford", "bellman-ford", "Handles negative edges.", "Phase 3", true),
      t("Floyd-Warshall", "floyd-warshall", "All-pairs shortest path.", "Phase 4", true),
      t("Topological Sort", "topological-sort", "Kahn's & DFS order.", "Phase 2", true),
      t("Prim's MST", "prims", "Grow minimum spanning tree.", "Phase 2", true),
      t("Kruskal's MST", "kruskals", "Sort edges + union-find.", "Phase 2", true),
      t("Union-Find", "union-find", "Path compression, union by rank.", "Phase 2", true),
      t("Cycle Detection", "cycle-detection-graph", "Directed & undirected.", "Phase 3", true),
      t("SCC (Kosaraju/Tarjan)", "kosaraju", "Strongly connected components.", "Phase 4", true),
      t("Bipartite Check", "bipartite-check", "2-coloring test.", "Phase 3", true),
      t("A* Search", "astar", "Heuristic pathfinding.", "Phase 3", true),
      t("Flood Fill", "flood-fill", "Paint-bucket grid fill.", "Phase 2", true),
    ],
  },
  {
    title: "10. Dynamic Programming",
    topics: [
      t("DP Intro", "dp-intro", "Memoization vs tabulation.", "Phase 3"),
      t("Fibonacci DP", "fibonacci-dp", "Naive vs DP table.", "Phase 3"),
      t("0/1 Knapsack", "knapsack", "Pick or skip table.", "Phase 3"),
      t("LCS", "lcs", "Longest common subsequence grid.", "Phase 3"),
      t("LIS", "lis", "Longest increasing subsequence.", "Phase 3"),
      t("Edit Distance", "edit-distance", "Insert/delete/replace grid.", "Phase 3"),
      t("Coin Change", "coin-change", "Min coins / ways.", "Phase 3"),
      t("Subset Sum", "subset-sum", "Reachable sums table.", "Phase 3"),
      t("Grid Paths", "grid-paths", "Unique paths, min path sum.", "Phase 3"),
    ],
  },
  {
    title: "11. Greedy",
    topics: [
      t("Activity Selection", "activity-selection", "Earliest-finish greedy.", "Phase 3"),
      t("Fractional Knapsack", "fractional-knapsack", "Value density greedy.", "Phase 3"),
      t("Huffman Coding", "huffman-coding", "Prefix codes from frequencies.", "Phase 4"),
      t("Merge Intervals", "merge-intervals", "Sort + sweep.", "Phase 2"),
    ],
  },
  {
    title: "12. Divide & Conquer",
    topics: [
      t("Closest Pair of Points", "closest-pair", "Geometric divide & conquer.", "Phase 4"),
      t("Karatsuba Multiplication", "karatsuba", "Fast big-int multiply.", "Phase 4"),
    ],
  },
  {
    title: "13. Backtracking",
    topics: [
      t("N-Queens", "n-queens", "Place queens safely.", "Phase 3"),
      t("Sudoku Solver", "sudoku-solver", "Constraint propagation.", "Phase 3"),
      t("Rat in a Maze", "rat-in-maze", "Path search + backtrack.", "Phase 3"),
      t("Subsets & Permutations", "subsets-permutations", "Combinatorial generation.", "Phase 3"),
      t("Word Search", "word-search", "Grid DFS with visited set.", "Phase 3"),
    ],
  },
  {
    title: "14. Math & Number Theory",
    topics: [
      t("GCD & LCM", "gcd-lcm", "Euclidean algorithm.", "Phase 2"),
      t("Sieve of Eratosthenes", "sieve", "Prime generation.", "Phase 2"),
      t("Fast Exponentiation", "fast-exponentiation", "Binary exponentiation.", "Phase 3"),
      t("Pascal's Triangle", "pascals-triangle", "Combinatorics triangle.", "Phase 3"),
    ],
  },
  {
    title: "15. Advanced",
    topics: [
      t("Sparse Table", "sparse-table", "O(1) RMQ.", "Phase 4"),
      t("Convex Hull", "convex-hull", "Graham scan.", "Phase 4"),
      t("Network Flow", "ford-fulkerson", "Max flow min cut.", "Phase 4"),
    ],
  },
];

export const ALL_TOPICS: Record<string, Topic> = Object.fromEntries(
  TOPIC_GROUPS.flatMap((g) => g.topics.map((topic) => [topic.slug, topic]))
);

export const ALL_SLUGS: string[] = Object.keys(ALL_TOPICS);

// Slugs that already have a dedicated static page (dynamic route must skip them)
export const STATIC_SLUGS = new Set(["sorting", "data-structures", "graph", "complexity", "recursion", "backtracking-basics", "bit-manipulation", "linear-search", "binary-search", "jump-search", "interpolation-search", "exponential-search", "ternary-search", "array-ops", "two-pointers", "sliding-window", "stack", "queue", "prefix-sum", "kadane", "dutch-flag", "kmp", "rabin-karp", "z-algorithm", "palindrome-anagram", "bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "heap-sort", "counting-sort", "radix-sort", "bucket-sort", "shell-sort", "sorting-race", "singly-linked-list", "reverse-linked-list", "cycle-detection", "doubly-linked-list", "merge-sorted-lists", "linked-list-middle", "bfs", "dfs", "graph-representation", "dijkstra", "bellman-ford", "floyd-warshall", "topological-sort", "prims", "kruskals", "union-find", "cycle-detection-graph", "kosaraju", "bipartite-check", "astar", "flood-fill", "tree-traversals", "bst", "avl-tree", "heap-ds", "trie", "segment-tree"]);

export const TOTAL_TOPICS = ALL_SLUGS.length;
export const READY_COUNT = Object.values(ALL_TOPICS).filter(
  (topic) => topic.ready
).length;
