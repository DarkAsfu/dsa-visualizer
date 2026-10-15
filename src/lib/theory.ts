export type Theory = {
  name: string;
  blurb: string;
  points: string[];
};

export const THEORY: Record<string, Theory> = {
  sorting: {
    name: "Sorting",
    blurb: "Ordering data so search and structure get cheap.",
    points: [
      "Comparison sorts can't beat O(n log n) on average.",
      "Bubble / Selection / Insertion are O(n²) — teaching tools, not production.",
      "Stable keeps equal items in order; in-place uses O(1) extra space.",
    ],
  },
  "bubble-sort": {
    name: "Bubble Sort",
    blurb: "Adjacent out-of-order pairs swap until sorted.",
    points: [
      "After pass i, the last i items are final.",
      "Early exit if a pass swaps nothing: O(n) best.",
      "Stable, in-place, but O(n²) average.",
    ],
  },
  "selection-sort": {
    name: "Selection Sort",
    blurb: "Grow a sorted prefix by picking minima.",
    points: [
      "Pass i plants the minimum of a[i..] at i.",
      "Always O(n²) comparisons, O(n) swaps.",
      "Not stable by default; in-place.",
    ],
  },
  "insertion-sort": {
    name: "Insertion Sort",
    blurb: "Insert each key into the sorted left part.",
    points: [
      "Nearly-sorted input runs in O(n).",
      "Stable and in-place; great for small n.",
      "Shifts cost — binary search can't fix that.",
    ],
  },
  "merge-sort": {
    name: "Merge Sort",
    blurb: "Divide, conquer, merge.",
    points: [
      "Always O(n log n), worst case included.",
      "Stable — equal items never cross.",
      "Costs O(n) extra space for merging.",
    ],
  },
  "quick-sort": {
    name: "Quick Sort",
    blurb: "Partition around a pivot, recurse both sides.",
    points: [
      "Average O(n log n); sorted input can hit O(n²).",
      "In-place partitioning, tiny constants — usually fastest.",
      "Random or median-of-three pivots dodge the worst case.",
    ],
  },
  "heap-sort": {
    name: "Heap Sort",
    blurb: "Heapify once, then pluck the max home.",
    points: [
      "Max-heap: every parent beats its children.",
      "Swap root to the end, shrink, sift down — repeat.",
      "O(n log n) guaranteed, O(1) space, not stable.",
    ],
  },
  "counting-sort": {
    name: "Counting Sort",
    blurb: "Count first, place by numbers.",
    points: [
      "No comparisons — needs a small value range k.",
      "O(n + k) time, O(k) extra space.",
      "Stable if you place from the counts carefully.",
    ],
  },
  "radix-sort": {
    name: "Radix Sort",
    blurb: "Sort digit by digit, LSD first.",
    points: [
      "Each pass must be stable — counting sort fits.",
      "O(d·(n + k)) for d digits.",
      "No comparisons at all.",
    ],
  },
  "bucket-sort": {
    name: "Bucket Sort",
    blurb: "Scatter, sort small piles, gather.",
    points: [
      "Uniform data spreads evenly — near O(n).",
      "Each bucket sorted separately (insertion is fine).",
      "Skewed data piles up and slows down.",
    ],
  },
  "shell-sort": {
    name: "Shell Sort",
    blurb: "Insertion sort with a shrinking gap.",
    points: [
      "Far-apart compares move items fast early.",
      "Gap 1 is plain insertion on nearly-sorted data.",
      "Gap sequence decides the complexity.",
    ],
  },
  "sorting-race": {
    name: "Sorting Race",
    blurb: "Same array, same clock — may the best sort win.",
    points: [
      "Step counts decide the finish order.",
      "O(n²) sorts fade as n grows.",
      "Linear-time sorts dominate small ranges.",
    ],
  },
  complexity: {
    name: "Complexity",
    blurb: "Big-O is the growth shape as n → ∞.",
    points: [
      "Drop constants: O(2n) is O(n).",
      "Judge by the worst case first.",
      "Time vs space is a trade — memoization buys speed with memory.",
    ],
  },
  recursion: {
    name: "Recursion",
    blurb: "A function that calls a smaller copy of itself.",
    points: [
      "The base case stops it — without one, the stack overflows.",
      "Each call waits: frames pile up, then unwind.",
      "Naive Fibonacci branches into ~2ⁿ calls.",
    ],
  },
  "backtracking-basics": {
    name: "Backtracking",
    blurb: "Try a move — undo it when stuck.",
    points: [
      "Choose → explore → unchoose.",
      "Prune early: skip branches that already break a rule.",
      "Same engine behind N-Queens, Sudoku, and mazes.",
    ],
  },
  "bit-manipulation": {
    name: "Bit Manipulation",
    blurb: "Numbers are switches — flip them directly.",
    points: [
      "AND masks, OR sets, XOR flips.",
      "<< k multiplies by 2^k, >> k divides.",
      "x & (x−1) clears the lowest set bit — the power-of-two test.",
    ],
  },
  "linear-search": {
    name: "Linear Search",
    blurb: "Check every cell in order.",
    points: [
      "Works on unsorted data.",
      "O(n) time, O(1) space.",
      "Return −1 when the target is absent.",
    ],
  },
  "binary-search": {
    name: "Binary Search",
    blurb: "Halve a sorted range per check.",
    points: [
      "Needs sorted input — the sort cost counts too.",
      "O(log n): a million items take ~20 checks.",
      "Mid without overflow: lo + (hi − lo) / 2.",
    ],
  },
  "jump-search": {
    name: "Jump Search",
    blurb: "Leap in √n blocks, walk the last one.",
    points: [
      "Sorted input required.",
      "O(√n) — sits between linear and binary.",
      "Block size √n balances jumps against scans.",
    ],
  },
  "interpolation-search": {
    name: "Interpolation Search",
    blurb: "Guess the position from the value, not the middle.",
    points: [
      "Best on uniform data: ~O(log log n).",
      "Skewed data degrades toward O(n).",
      "Same narrow-the-range loop as binary search.",
    ],
  },
  "exponential-search": {
    name: "Exponential Search",
    blurb: "Find the range by doubling, then binary search it.",
    points: [
      "Shines when the target sits near the front.",
      "O(log i), where i is the target index.",
      "Works on unbounded streams.",
    ],
  },
  "ternary-search": {
    name: "Ternary Search",
    blurb: "Two midpoints split the range into thirds.",
    points: [
      "Keeps one third per round: O(log₃ n).",
      "More comparisons per step than binary — rarely faster in practice.",
      "Sorted input required.",
    ],
  },
  "array-ops": {
    name: "Array Operations",
    blurb: "Contiguous memory: middle edits shift neighbors.",
    points: [
      "Insert and delete cost O(n) shifts.",
      "Rotate by k; reverse with two pointers.",
      "Need cheap growth? That is what dynamic arrays are for.",
    ],
  },
  "two-pointers": {
    name: "Two Pointers",
    blurb: "Two indices, one pass.",
    points: [
      "Opposite ends on sorted data (pair sum).",
      "Move the weaker side (container).",
      "Slow trails fast to compact in place (dedup).",
    ],
  },
  "sliding-window": {
    name: "Sliding Window",
    blurb: "A window glides — add one end, drop the other.",
    points: [
      "Fixed size k: slide in O(n), never recompute.",
      "Variable size: expand right, shrink left while invalid.",
      "Needs monotonic validity — works on non-negative numbers.",
    ],
  },
  stack: {
    name: "Stack",
    blurb: "Last in, first out — like plates.",
    points: [
      "Push adds to the top, pop removes from it.",
      "Peek reads without touching.",
      "Call stacks, undo, and bracket matching all use it.",
    ],
  },
  queue: {
    name: "Queue",
    blurb: "First in, first out — like a line.",
    points: [
      "Enqueue joins the rear, dequeue leaves from the front.",
      "Fair order for tasks, printers, and BFS.",
      "A circular buffer reuses the freed front space.",
    ],
  },
  "prefix-sum": {
    name: "Prefix Sum",
    blurb: "Running totals answer range sums in O(1).",
    points: [
      "P[i] holds a[0] + … + a[i−1]; P[0] = 0.",
      "sum[l..r] = P[r+1] − P[l].",
      "One O(n) build, then every query is instant.",
    ],
  },
  kadane: {
    name: "Kadane's Algorithm",
    blurb: "Best subarray ending here — carried forward.",
    points: [
      "cur = max(a[i], cur + a[i]) at every step.",
      "Negative running sum? Drop it, restart at i.",
      "One pass, O(n) time, O(1) space.",
    ],
  },
  "dutch-flag": {
    name: "Dutch Flag",
    blurb: "Three pointers, one pass, three groups.",
    points: [
      "low grows 0s from the left, high grows 2s from the right.",
      "mid scans the unknown middle; 1s stay put.",
      "O(n) time, O(1) space — no counting pass needed.",
    ],
  },
  kmp: {
    name: "KMP",
    blurb: "Never rewind the text — fall back inside the pattern.",
    points: [
      "LPS[i] = longest prefix that is also a suffix.",
      "Mismatch? j jumps to lps[j−1], text stays.",
      "O(n + m) total — each character compared O(1) times.",
    ],
  },
  "rabin-karp": {
    name: "Rabin-Karp",
    blurb: "Compare hashes, verify only on hits.",
    points: [
      "Rolling hash slides in O(1) per window.",
      "Equal hash ≠ match — verify chars (spurious hits).",
      "Average O(n + m), worst O(n·m).",
    ],
  },
  "z-algorithm": {
    name: "Z-Algorithm",
    blurb: "Reuse old matches through the Z-box.",
    points: [
      "Z[i] = matches between s and s[i..].",
      "Inside [l, r]? Copy Z[i−l] when it fits.",
      "Touching the edge? Extend and move the box.",
    ],
  },
  "palindrome-anagram": {
    name: "Palindrome & Anagram",
    blurb: "Mirror from the ends; count every letter.",
    points: [
      "Palindrome: s[l] must equal s[r], walk inward.",
      "Anagram: same letters, same counts.",
      "Both linear — one pass each.",
    ],
  },
  "singly-linked-list": {
    name: "Singly Linked List",
    blurb: "Nodes chained by next-pointers.",
    points: [
      "Insert/delete rewires links — no shifting.",
      "No index access: reach node i in O(i).",
      "Head pointer is the only entry.",
    ],
  },
  "reverse-linked-list": {
    name: "Reverse Linked List",
    blurb: "Flip every arrow in one pass.",
    points: [
      "Track prev, curr, and next.",
      "Each step: curr.next = prev, then advance.",
      "Head becomes the old tail.",
    ],
  },
  "cycle-detection": {
    name: "Cycle Detection",
    blurb: "Tortoise vs hare on the chain.",
    points: [
      "Slow walks 1, fast walks 2.",
      "They meet iff there is a cycle.",
      "Fast hitting null means acyclic.",
    ],
  },
  "doubly-linked-list": {
    name: "Doubly Linked List",
    blurb: "Links both ways; tail can meet head.",
    points: [
      "Each node holds prev and next.",
      "Delete by joining both neighbors.",
      "Circular: tail.next = head, head.prev = tail.",
    ],
  },
  "merge-sorted-lists": {
    name: "Merge Two Sorted Lists",
    blurb: "Zip two sorted chains into one.",
    points: [
      "Compare heads, take the smaller.",
      "A dummy head avoids edge cases.",
      "Drain the remainder when one side ends.",
    ],
  },
  "linked-list-middle": {
    name: "Middle & Nth from End",
    blurb: "Runners measure the chain for you.",
    points: [
      "Fast at 2× lands slow on the middle.",
      "A lead of n puts slow on Nth-from-end.",
      "One pass, no length counting.",
    ],
  },
  bfs: {
    name: "BFS",
    blurb: "Level by level, nearest first.",
    points: [
      "A queue spreads in waves from the start.",
      "First visit is the shortest path (unweighted).",
      "O(V + E) time, O(V) memory.",
    ],
  },
  dfs: {
    name: "DFS",
    blurb: "Dive deep, backtrack when stuck.",
    points: [
      "A stack (or recursion) goes far before wide.",
      "Path found is not necessarily shortest.",
      "O(V + E) time, O(V) memory.",
    ],
  },
  "graph-representation": {
    name: "Graph Representation",
    blurb: "Same graph, two storages.",
    points: [
      "Matrix: O(1) edge query, O(V²) space.",
      "List: neighbors in O(degree), space O(V + E).",
      "Dense → matrix, sparse → list.",
    ],
  },
  dijkstra: {
    name: "Dijkstra",
    blurb: "Finalize the nearest unknown vertex.",
    points: [
      "A popped distance never changes (non-negative weights).",
      "Greedy + priority queue: O(E log V).",
      "Breaks on negative edges — see Bellman-Ford.",
    ],
  },
  "bellman-ford": {
    name: "Bellman-Ford",
    blurb: "Relax every edge V−1 times.",
    points: [
      "Handles negative weights.",
      "One more relaxing pass means a negative cycle.",
      "O(V·E) — slow but dependable.",
    ],
  },
  "floyd-warshall": {
    name: "Floyd-Warshall",
    blurb: "Allow going via k.",
    points: [
      "dist[i][j] = min(direct, i→k→j).",
      "All pairs at once: O(V³).",
      "Negative diagonal = cycle.",
    ],
  },
  "topological-sort": {
    name: "Topological Sort",
    blurb: "Dependencies first, jobs after.",
    points: [
      "Zero indegree means ready.",
      "Erase edges, drop indegrees (Kahn).",
      "Leftovers mean a cycle.",
    ],
  },
  prims: {
    name: "Prim's MST",
    blurb: "Grow one tree on cheap edges.",
    points: [
      "Cheapest edge across the cut is safe.",
      "key = cheapest link into the tree.",
      "O(E log V) with a heap.",
    ],
  },
  kruskals: {
    name: "Kruskal's MST",
    blurb: "Cheapest edge first, skip cycles.",
    points: [
      "Sort by weight.",
      "Different sets? Take it. Same? Skip.",
      "Union-Find spots cycles in O(α).",
    ],
  },
  "union-find": {
    name: "Union-Find",
    blurb: "Everyone points up to one root.",
    points: [
      "Union: smaller tree under larger (rank).",
      "Find: compress everyone's path.",
      "Near-constant amortized cost.",
    ],
  },
  "cycle-detection-graph": {
    name: "Cycle Detection",
    blurb: "Gray-to-gray edge means cycle.",
    points: [
      "Gray = currently on the stack.",
      "To white = tree edge.",
      "Black = fully done.",
    ],
  },
  kosaraju: {
    name: "Kosaraju's SCC",
    blurb: "Two passes, strong components.",
    points: [
      "Pass 1: remember finish order.",
      "Pass 2: reversed graph, latest first.",
      "Each tree is one SCC.",
    ],
  },
  "bipartite-check": {
    name: "Bipartite Check",
    blurb: "Can two colors split it?",
    points: [
      "Neighbors get the opposite color.",
      "One same-color edge fails everything.",
      "Odd cycles make it impossible.",
    ],
  },
  astar: {
    name: "A* Search",
    blurb: "Dijkstra with direction: f = g + h.",
    points: [
      "g = cost so far, h = guessed remainder.",
      "Expand smallest f first.",
      "Good heuristic = less wandering.",
    ],
  },
  "flood-fill": {
    name: "Flood Fill",
    blurb: "Pour the bucket, watch it spread.",
    points: [
      "4-neighbor BFS.",
      "Walls block, visited skips.",
      "The paint app bucket tool.",
    ],
  },
  "tree-traversals": {
    name: "Tree Traversals",
    blurb: "Four ways to walk one tree.",
    points: [
      "Inorder (L·N·R) prints a BST sorted.",
      "Preorder copies shape, postorder frees children first.",
      "Level order = BFS with a queue.",
    ],
  },
  bst: {
    name: "Binary Search Tree",
    blurb: "Ordered tree, halving search.",
    points: [
      "Left < node < right, always.",
      "Delete: leaf snips, 1-child pulls up, 2-children copy the successor.",
      "Degenerate input → linked list; AVL fixes that.",
    ],
  },
  "avl-tree": {
    name: "AVL Tree",
    blurb: "Self-balancing BST.",
    points: [
      "Balance factor must stay in {−1, 0, 1}.",
      "LL → right rotate, RR → left rotate, LR/RL → double.",
      "Height stays O(log n), guaranteed.",
    ],
  },
  "heap-ds": {
    name: "Heap",
    blurb: "Parent beats children.",
    points: [
      "Max-heap root is the maximum.",
      "Insert bubbles up, extract sifts down: O(log n).",
      "Array index i → children 2i+1, 2i+2.",
    ],
  },
  trie: {
    name: "Trie",
    blurb: "Share prefixes, find words fast.",
    points: [
      "One node per character, root is empty.",
      "Search/insert cost = word length.",
      "End-flag separates words from prefixes.",
    ],
  },
  "segment-tree": {
    name: "Segment Tree",
    blurb: "Range queries in O(log n).",
    points: [
      "Node [l,r] stores the aggregate (sum here).",
      "Query: take inside, skip outside, split partial.",
      "Build O(n), point update O(log n).",
    ],
  },
  "fenwick-tree": {
    name: "Fenwick Tree",
    blurb: "Prefix sums, tiny code.",
    points: [
      "bit[i] covers lowbit(i) elements.",
      "Update: i += lowbit(i). Query: i −= lowbit(i).",
      "Less memory than segment tree, sums only.",
    ],
  },
  lca: {
    name: "LCA",
    blurb: "Deepest shared ancestor.",
    points: [
      "Root-to-node paths share a prefix.",
      "Last common node = answer.",
      "BST trick: split point where a/b diverge.",
    ],
  },
  "tree-diameter": {
    name: "Tree Diameter & Views",
    blurb: "Longest path + four readings.",
    points: [
      "Double BFS gives the diameter ends.",
      "Top/bottom = first/last per horizontal distance.",
      "Left/right = first/last per level.",
    ],
  },
  "circular-queue": {
    name: "Circular Queue",
    blurb: "Ring buffer, no shifting.",
    points: [
      "rear = (rear+1) % k, front = (front+1) % k.",
      "Full when count == k (or rear+1 == front).",
      "Fixed memory, O(1) ops — schedulers love it.",
    ],
  },
  "monotonic-stack": {
    name: "Monotonic Stack",
    blurb: "Sorted stack, instant queries.",
    points: [
      "Pop while top breaks the order, then push.",
      "Each element pushed + popped once: O(n).",
      "Powers NGE, stock span, histogram area.",
    ],
  },
  "infix-postfix": {
    name: "Infix to Postfix",
    blurb: "Precedence decides the order.",
    points: [
      "Numbers print immediately.",
      "Pop operators with ≥ precedence before pushing.",
      ") flushes until (, ( gets dropped.",
    ],
  },
  "next-greater": {
    name: "Next Greater Element",
    blurb: "Right-to-left, one pass.",
    points: [
      "Stack holds decreasing candidates.",
      "Pop ≤ x — they block nobody's view.",
      "Answer = stack top, or −1 when empty.",
    ],
  },
  "lru-cache": {
    name: "LRU Cache",
    blurb: "Forget the stalest first.",
    points: [
      "Get/put moves the key to MRU front.",
      "Evict from the LRU tail when full.",
      "Hashmap + order list = O(1) both.",
    ],
  },
};

export const THEORY_BN: Record<string, { blurb: string; points: string[] }> = {
  sorting: {
    blurb: "ডেটা সাজানো থাকলে সার্চ আর গঠন সস্তা হয়।",
    points: [
      "তুলনামূলক সর্ট গড়ে O(n log n)-এর নিচে যেতে পারে না।",
      "বাবল/সিলেকশন/ইনসার্শন O(n²) — শেখার জন্য, প্রোডাকশনের জন্য নয়।",
      "Stable মানে সমান মানের ক্রম থাকে; in-place মানে O(1) অতিরিক্ত জায়গা।",
    ],
  },
  "bubble-sort": {
    blurb: "পাশাপাশি উল্টো জোড়া বদলাতে বদলাতে সাজে।",
    points: [
      "i-তম পাসের পর শেষের i-টা চূড়ান্ত।",
      "কোনো পাসে বদল না হলে আগেই থামো: সেরা O(n)।",
      "Stable, in-place, কিন্তু গড়ে O(n²)।",
    ],
  },
  "selection-sort": {
    blurb: "ক্ষুদ্রতম বেছে সাজানো অংশ বাড়াও।",
    points: [
      "i-তম পাসে a[i..]-এর minimum i-তে বসে।",
      "সবসময় O(n²) তুলনা, O(n) বদল।",
      "ডিফল্টে stable নয়; in-place।",
    ],
  },
  "insertion-sort": {
    blurb: "প্রতিটা key বামের সাজানো অংশে ঢুকাও।",
    points: [
      "প্রায়-সাজানো ইনপুটে O(n) চলে।",
      "Stable ও in-place; ছোট n-এ দারুণ।",
      "শিফটের খরচ — বাইনারি সার্চ তা কমায় না।",
    ],
  },
  "merge-sort": {
    blurb: "ভাগ করো, জয় করো, জোড়া দাও।",
    points: [
      "সবসময় O(n log n), ওয়ার্স্ট কেস সহ।",
      "Stable — সমান মান কখনো ক্রস করে না।",
      "মার্জে O(n) অতিরিক্ত জায়গা লাগে।",
    ],
  },
  "quick-sort": {
    blurb: "pivot ঘিরে ভাগ করো, দুই দিকে recurse।",
    points: [
      "গড়ে O(n log n); সাজানো ইনপুটে O(n²) হতে পারে।",
      "In-place পার্টিশন, ছোট ধ্রুবক — সাধারণত দ্রুততম।",
      "র‍্যান্ডম বা median-of-three pivot ওয়ার্স্ট কেস এড়ায়।",
    ],
  },
  "heap-sort": {
    blurb: "একবার হিপিফাই, তারপর ম্যাক্স ঘরে তোলো।",
    points: [
      "ম্যাক্স-হিপ: প্রতিটা প্যারেন্ট সন্তানদের হারায়।",
      "রুট শেষে পাঠাও, সংকুচিত করো, নিচে নামাও — আবার।",
      "নিশ্চিত O(n log n), O(1) স্পেস, stable নয়।",
    ],
  },
  "counting-sort": {
    blurb: "আগে গুনো, সংখ্যা দেখে বসাও।",
    points: [
      "তুলনা নেই — ছোট মান-পরিসর k লাগে।",
      "O(n + k) টাইম, O(k) বাড়তি জায়গা।",
      "যত্নে বসালে stable হয়।",
    ],
  },
  "radix-sort": {
    blurb: "অঙ্ক ধরে ধরে সাজাও, LSD আগে।",
    points: [
      "প্রতি পাস stable হতেই হবে — কাউন্টিং সর্ট মানায়।",
      "d অঙ্কে O(d·(n + k))।",
      "কোনো তুলনাই নেই।",
    ],
  },
  "bucket-sort": {
    blurb: "ছড়াও, ছোট স্তূপ সাজাও, জড়ো করো।",
    points: [
      "সুষম ডেটা সমান ছড়ায় — প্রায় O(n)।",
      "প্রতিটা বালতি আলাদা সাজে (insertion চলে)।",
      "বাঁকা ডেটা জমে গিয়ে ধীর হয়।",
    ],
  },
  "shell-sort": {
    blurb: "কমতে থাকা gap-এর insertion sort।",
    points: [
      "দূরের তুলনা শুরুতেই মাল দ্রুত সরায়।",
      "Gap ১ মানে প্রায়-সাজানো ডেটায় সাধারণ insertion।",
      "Gap সিকোয়েন্সই কমপ্লেক্সিটি ঠিক করে।",
    ],
  },
  "sorting-race": {
    blurb: "এক অ্যারে, এক ঘড়ি — সেরা সর্ট জিতুক।",
    points: [
      "ধাপ-সংখ্যাই ফিনিশ অর্ডার ঠিক করে।",
      "n বাড়লে O(n²) সর্ট হারিয়ে যায়।",
      "ছোট রেঞ্জে লিনিয়ার-টাইম সর্ট রাজত্ব করে।",
    ],
  },
  complexity: {
    blurb: "n → ∞ হলে অপারেশন কীভাবে বাড়ে, Big-O সেটাই।",
    points: [
      "ধ্রুবক বাদ দাও: O(2n) মানেই O(n)।",
      "আগে ওয়ার্স্ট কেস দেখো।",
      "টাইম বনাম স্পেস একটা লেনদেন — মেমোইজেশন মেমরি দিয়ে গতি কেনে।",
    ],
  },
  recursion: {
    blurb: "এমন ফাংশন যা নিজের ছোট কপিকে ডাকে।",
    points: [
      "বেস কেস থামায় — এটা না থাকলে স্ট্যাক ওভারফ্লো।",
      "প্রতিটা কল অপেক্ষা করে: ফ্রেম জমে, তারপর খুলে যায়।",
      "সরল Fibonacci ~2ⁿ কলে ফেটে পড়ে।",
    ],
  },
  "backtracking-basics": {
    blurb: "চাল দাও — আটকে গেলে ফিরিয়ে নাও।",
    points: [
      "বাছো → ঘুরে দেখো → ফিরিয়ে নাও।",
      "আগে ছাঁটো: যে ডাল নিয়ম ভাঙে সেটা বাদ দাও।",
      "N-Queens, Sudoku, গোলকধাঁধা — একই ইঞ্জিন।",
    ],
  },
  "bit-manipulation": {
    blurb: "সংখ্যা মানেই সুইচ — সরাসরি উল্টাও।",
    points: [
      "AND মাস্ক করে, OR সেট করে, XOR উল্টায়।",
      "<< k মানে 2^k দিয়ে গুণ, >> k মানে ভাগ।",
      "x & (x−1) সর্বনিম্ন সেট বিট মুছে — পাওয়ার-অফ-টু পরীক্ষা।",
    ],
  },
  "linear-search": {
    blurb: "প্রতিটা সেল ক্রমে পরীক্ষা করো।",
    points: [
      "অসাজানো ডেটাতেও চলে।",
      "O(n) টাইম, O(1) স্পেস।",
      "না পেলে −1 ফেরত দাও।",
    ],
  },
  "binary-search": {
    blurb: "প্রতি চেকে সাজানো রেঞ্জ অর্ধেক করো।",
    points: [
      "সাজানো ইনপুট লাগে — সর্টের খরচও ধরো।",
      "O(log n): দশ লাখ আইটেমে ~২০ চেক।",
      "ওভারফ্লো ছাড়া mid: lo + (hi − lo) / 2।",
    ],
  },
  "jump-search": {
    blurb: "√n ব্লকে লাফ দাও, শেষটা হেঁটে দেখো।",
    points: [
      "সাজানো ইনপুট লাগে।",
      "O(√n) — লিনিয়ার আর বাইনারির মাঝে।",
      "√n ব্লক সাইজ জাম্প ও স্ক্যানের ভারসাম্য রাখে।",
    ],
  },
  "interpolation-search": {
    blurb: "মাঝখানা নয়, মান দেখে অবস্থান আন্দাজ করো।",
    points: [
      "সুষম ডেটায় সেরা: ~O(log log n)।",
      "বাঁকা ডেটায় O(n)-এর দিকে নামে।",
      "বাইনারি সার্চের মতোই রেঞ্জ সরু করার লুপ।",
    ],
  },
  "exponential-search": {
    blurb: "দ্বিগুণ করে রেঞ্জ খুঁজে, ভেতরে বাইনারি সার্চ।",
    points: [
      "টার্গেট সামনে থাকলে দারুণ।",
      "O(log i), যেখানে i টার্গেটের ইনডেক্স।",
      "অসীম স্ট্রিমেও চলে।",
    ],
  },
  "ternary-search": {
    blurb: "দুই mid দিয়ে রেঞ্জ তিন ভাগ করো।",
    points: [
      "প্রতি রাউন্ডে এক-তৃতীয়াংশ থাকে: O(log₃ n)।",
      "প্রতি ধাপে তুলনা বেশি — বাস্তবে কদাচিৎ দ্রুত।",
      "সাজানো ইনপুট লাগে।",
    ],
  },
  "array-ops": {
    blurb: "একটানা মেমরি: মাঝে বদলালে প্রতিবেশী সরে।",
    points: [
      "ইনসার্ট-ডিলিটে O(n) শিফট লাগে।",
      "k দিয়ে রোটেট; দুই পয়েন্টারে রিভার্স।",
      "সস্তায় বাড়তে চাইলে ডাইনামিক অ্যারে লাগে।",
    ],
  },
  "two-pointers": {
    blurb: "দুই ইনডেক্স, এক পাস।",
    points: [
      "সাজানো ডেটায় দুই প্রান্ত (পেয়ার সাম)।",
      "দুর্বল দিকটা সরাও (কনটেইনার)।",
      "জায়গাতেই compact করতে slow fast-কে অনুসরণ করে।",
    ],
  },
  "sliding-window": {
    blurb: "উইন্ডো গড়ায় — এক প্রান্তে যোগ, অন্য প্রান্তে বাদ।",
    points: [
      "ফিক্সড k: O(n)-এ সরাও, নতুন করে গুনো না।",
      "ভেরিয়েবল: ডানে বাড়াও, অবৈধ হলে বামে সংকুচিত করো।",
      "শর্ত একমুখী হতে হয় — অঋণাত্মক সংখ্যায় চলে।",
    ],
  },
  stack: {
    blurb: "সবার শেষে ঢুকলে সবার আগে বেরোবে — থালার গাদার মতো।",
    points: [
      "পুশ উপরে যোগ করে, পপ উপর থেকে সরায়।",
      "পিক না সরিয়ে দেখে।",
      "কল স্ট্যাক, undo, ব্র্যাকেট মিল — সব এটাই ব্যবহার করে।",
    ],
  },
  queue: {
    blurb: "আগে এলে আগে পাবে — লাইনের মতো।",
    points: [
      "এনকিউ পেছনে যোগ দেয়, ডিকিউ সামনে থেকে নেয়।",
      "টাস্ক, প্রিন্টার, BFS-এর জন্য ন্যায্য ক্রম।",
      "সার্কুলার বাফার খালি হওয়া সামনের জায়গা আবার ব্যবহার করে।",
    ],
  },
  "prefix-sum": {
    blurb: "চলমান যোগফল O(1)-এ রেঞ্জ-সাম দেয়।",
    points: [
      "P[i] = a[0] + … + a[i−1]; P[0] = 0।",
      "sum[l..r] = P[r+1] − P[l]।",
      "একবার O(n) বানাও, তারপর সব প্রশ্ন মুহূর্তে।",
    ],
  },
  kadane: {
    blurb: "এখানে শেষ হওয়া সেরা সাবঅ্যারে — হাতে নিয়ে এগোও।",
    points: [
      "প্রতি ধাপে cur = max(a[i], cur + a[i])।",
      "চলমান যোগফল ঋণাত্মক? ফেলে দাও, i থেকে শুরু।",
      "এক পাস, O(n) টাইম, O(1) স্পেস।",
    ],
  },
  "dutch-flag": {
    blurb: "তিন পয়েন্টার, এক পাস, তিন দল।",
    points: [
      "low বাম থেকে ০ বাড়ায়, high ডান থেকে ২ বাড়ায়।",
      "mid অজানা মাঝখান স্ক্যান করে; ১ থাকে।",
      "O(n) টাইম, O(1) স্পেস — গুনে দেখার দরকার নেই।",
    ],
  },
  kmp: {
    blurb: "টেক্সট কখনো পেছায় না — প্যাটার্নের ভেতরে ফিরে যাও।",
    points: [
      "LPS[i] = সবচেয়ে লম্বা প্রিফিক্স যা সাফিক্সও।",
      "অমিল? j যায় lps[j−1]-এ, টেক্সট থামে।",
      "মোট O(n + m) — প্রতিটা অক্ষরে O(1) তুলনা।",
    ],
  },
  "rabin-karp": {
    blurb: "হ্যাশ মিলাও, শুধু হিটে যাচাই করো।",
    points: [
      "রোলিং হ্যাশ প্রতি উইন্ডোতে O(1)।",
      "সমান হ্যাশ মানেই মিল নয় — অক্ষর যাচাই করো।",
      "গড়ে O(n + m), ওয়ার্স্ট O(n·m)।",
    ],
  },
  "z-algorithm": {
    blurb: "Z-বক্স দিয়ে পুরনো মিল আবার ব্যবহার করো।",
    points: [
      "Z[i] = s ও s[i..]-এর মিল।",
      "[l, r]-এর ভেতরে? ফিট করলে Z[i−l] কপি।",
      "প্রান্ত ছুঁলে? বাড়াও, বক্স সরাও।",
    ],
  },
  "palindrome-anagram": {
    blurb: "প্রান্ত থেকে আয়না; প্রতিটা অক্ষর গুনো।",
    points: [
      "প্যালিনড্রোম: s[l] == s[r] হতেই হবে, ভেতরে যাও।",
      "অ্যানাগ্রাম: একই অক্ষর, একই গণনা।",
      "দুটোই লিনিয়ার — এক পাস করে।",
    ],
  },
  "singly-linked-list": {
    blurb: "next-পয়েন্টারে গাঁথা নোডের শেকল।",
    points: [
      "ইনসার্ট/ডিলিটে লিংক বদলায় — শিফট নেই।",
      "ইনডেক্স অ্যাক্সেস নেই: i-তম নোডে O(i)।",
      "একমাত্র প্রবেশপথ head পয়েন্টার।",
    ],
  },
  "reverse-linked-list": {
    blurb: "এক পাসে প্রতিটা তীর উল্টাও।",
    points: [
      "prev, curr, next — তিনটা ধরে রাখো।",
      "প্রতি ধাপে curr.next = prev, তারপর এগোও।",
      "পুরনো tail-ই নতুন head।",
    ],
  },
  "cycle-detection": {
    blurb: "শেকলে কচ্ছপ বনাম খরগোশ।",
    points: [
      "Slow হাঁটে ১, fast হাঁটে ২।",
      "দেখা হলেই সাইকেল আছে।",
      "fast null-এ পৌঁছালে সাইকেল নেই।",
    ],
  },
  "doubly-linked-list": {
    blurb: "দুই দিকে লিংক; লেজ মাথায় মিলতে পারে।",
    points: [
      "প্রতিটা নোডে prev ও next।",
      "ডিলিটে দুই প্রতিবেশী জোড়া দাও।",
      "গোলাকার: tail.next = head, head.prev = tail।",
    ],
  },
  "merge-sorted-lists": {
    blurb: "দুই সাজানো শেকল এক করো।",
    points: [
      "মাথা তুলনা করো, ছোটটা নাও।",
      "ডামি হেডে edge case থাকে না।",
      "এক দিক শেষে বাকিটা ঢালো।",
    ],
  },
  "linked-list-middle": {
    blurb: "দৌড়বিদরাই শেকল মেপে দেয়।",
    points: [
      "২× গতির fast slow-কে মাঝখানে নামায়।",
      "n ঘরের lead slow-কে শেষ-থেকে-nতমে বসায়।",
      "এক পাস, দৈর্ঘ্য গুনতে হয় না।",
    ],
  },
  bfs: {
    blurb: "স্তরে স্তরে, কাছেরটা আগে।",
    points: [
      "queue শুরু থেকে ঢেউ তুলে ছড়ায়।",
      "প্রথম দেখাই ক্ষুদ্রতম পথ (unweighted)।",
      "O(V + E) টাইম, O(V) মেমরি।",
    ],
  },
  dfs: {
    blurb: "গভীরে ডুব দাও, আটকে গেলে ফিরে এসো।",
    points: [
      "stack (বা recursion) চওড়ার আগে দূরে যায়।",
      "পাওয়া পথ ক্ষুদ্রতম নাও হতে পারে।",
      "O(V + E) টাইম, O(V) মেমরি।",
    ],
  },
  "graph-representation": {
    blurb: "একই গ্রাফ, দুই স্টোরেজ।",
    points: [
      "ম্যাট্রিক্স: এজ প্রশ্নে O(1), জায়গা O(V²)।",
      "লিস্ট: প্রতিবেশী ঘোরে O(degree), জায়গা O(V + E)।",
      "ঘন গ্রাফে ম্যাট্রিক্স, পাতলায় লিস্ট।",
    ],
  },
  dijkstra: {
    blurb: "নিকটতম অজানাকে চূড়ান্ত করো।",
    points: [
      "পপ করা দূরত্ব আর বদলায় না (অঋণাত্মক ওজন)।",
      "গ্রিডি + অগ্রাধিকার queue: O(E log V)।",
      "ঋণাত্মক এজে ভাঙে — Bellman-Ford দেখো।",
    ],
  },
  "bellman-ford": {
    blurb: "সব এজ V−১ বার শিথিল করো।",
    points: [
      "ঋণাত্মক ওজনেও চলে।",
      "আরেক পাসে শিথিল হলে ঋণাত্মক চক্র।",
      "O(V·E) — ধীর কিন্তু নির্ভরযোগ্য।",
    ],
  },
  "floyd-warshall": {
    blurb: "k হয়ে যাওয়ার অনুমতি দাও।",
    points: [
      "dist[i][j] = min(সরাসরি, i→k→j)।",
      "সব জোড়া একসাথে: O(V³)।",
      "ডায়াগোনালে ঋণাত্মক = চক্র।",
    ],
  },
  "topological-sort": {
    blurb: "নির্ভরতা আগে, কাজ পরে।",
    points: [
      "indegree শূন্য মানে প্রস্তুত।",
      "এজ মুছে indegree কমাও (Kahn)।",
      "সব না বসলে চক্র আছে।",
    ],
  },
  prims: {
    blurb: "এক গাছ বাড়াও সস্তা এজে।",
    points: [
      "কাট পেরোনো সবচেয়ে সস্তা এজ নিরাপদ।",
      "key = গাছে জোড়ার সর্বনিম্ন খরচ।",
      "O(E log V) heap দিয়ে।",
    ],
  },
  kruskals: {
    blurb: "সস্তা এজ আগে, চক্র বাদ।",
    points: [
      "ওজন ধরে সাজাও।",
      "আলাদা সেট? নাও। একই? বাদ।",
      "Union-Find চক্র ধরে O(α)।",
    ],
  },
  "union-find": {
    blurb: "সবাই উপরে তাকায় এক রুট পর্যন্ত।",
    points: [
      "union: rank-এ ছোট গাছ বড়র নিচে।",
      "find: পথের সবাই সরাসরি রুটে।",
      "প্রায়-ধ্রুবক amortized খরচ।",
    ],
  },
  "cycle-detection-graph": {
    blurb: "ধূসর-থেকে-ধূসর এজ মানেই চক্র।",
    points: [
      "ধূসর = স্ট্যাকে আছে।",
      "সাদায় গেলে গাছের এজ।",
      "কালো = সম্পূর্ণ শেষ।",
    ],
  },
  kosaraju: {
    blurb: "দুই পাসে strong component।",
    points: [
      "পাস ১: finish ক্রম মনে রাখো।",
      "পাস ২: উল্টো গ্রাফে বড় finish আগে।",
      "প্রতিটা গাছ এক SCC।",
    ],
  },
  "bipartite-check": {
    blurb: "দুই রঙে ভাগ করা যায়?",
    points: [
      "প্রতিবেশী উল্টো রং পায়।",
      "একরঙা এজ = ব্যর্থ।",
      "বিজোড় চক্র থাকলে অসম্ভব।",
    ],
  },
  astar: {
    blurb: "দিশা-সহ Dijkstra: f = g + h।",
    points: [
      "g = এখন পর্যন্ত, h = আন্দাজ বাকি।",
      "সবচেয়ে ছোট f আগে বাড়াও।",
      "ভালো heuristic = কম ঘোরা।",
    ],
  },
  "flood-fill": {
    blurb: "বালতি ঢালো, রং ছড়াক।",
    points: [
      "৪-প্রতিবেশী BFS।",
      "দেয়াল আটকায়, দেখা বাদ যায়।",
      "পেইন্ট অ্যাপের বালতি টুল।",
    ],
  },
  "tree-traversals": {
    blurb: "এক গাছে হাঁটার চার উপায়।",
    points: [
      "ইনঅর্ডার (বাম·নোড·ডান) BST সাজিয়ে ছাপে।",
      "প্রিঅর্ডার গঠন নকল করে, পোস্টঅর্ডার আগে সন্তান মুক্ত করে।",
      "লেভেল অর্ডার = কিউ দিয়ে BFS।",
    ],
  },
  bst: {
    blurb: "ক্রম-গাছ, অর্ধেক-খোঁজ।",
    points: [
      "বাম < নোড < ডান, সবসময়।",
      "মোছা: পাতা কাটো, ১-সন্তান তোলো, ২-সন্তানে উত্তরসূরি কপি।",
      "খারাপ ইনপুট → লিংকড লিস্ট; AVL তা ঠিক করে।",
    ],
  },
  "avl-tree": {
    blurb: "নিজে-ভারসাম্য BST।",
    points: [
      "ব্যালান্স ফ্যাক্টর {−১, ০, ১}-এ থাকতে হবে।",
      "LL → ডান ঘূর্ণন, RR → বাম, LR/RL → জোড়া।",
      "উচ্চতা O(log n)-এ বাঁধা, গ্যারান্টি।",
    ],
  },
  "heap-ds": {
    blurb: "বাবা সন্তানকে হারায়।",
    points: [
      "ম্যাক্স-হিপের মূলই সর্বোচ্চ।",
      "ইনসার্ট বাবল-আপ, extract সিফট-ডাউন: O(log n)।",
      "অ্যারে i → সন্তান 2i+1, 2i+2।",
    ],
  },
  trie: {
    blurb: "প্রিফিক্স ভাগ করো, দ্রুত খুঁজো।",
    points: [
      "প্রতি অক্ষরে এক নোড, মূল খালি।",
      "খোঁজা/ঢোকানোর খরচ = শব্দের দৈর্ঘ্য।",
      "end-পতাকা শব্দ আর প্রিফিক্স আলাদা করে।",
    ],
  },
  "segment-tree": {
    blurb: "O(log n)-এ রেঞ্জ জিজ্ঞাসা।",
    points: [
      "[l,r] নোড সমষ্টি রাখে (এখানে যোগ)।",
      "জিজ্ঞাসা: ভেতর নাও, বাইর বাদ, আংশিক ভাঙো।",
      "বানানো O(n), পয়েন্ট আপডেট O(log n)।",
    ],
  },
  "fenwick-tree": {
    blurb: "প্রিফিক্স যোগ, ছোট কোড।",
    points: [
      "bit[i] lowbit(i)-টা উপাদান ঢাকে।",
      "আপডেট: i += lowbit(i)। জিজ্ঞাসা: i −= lowbit(i)।",
      "সেগমেন্ট ট্রির চেয়ে কম মেমরি, শুধু যোগ।",
    ],
  },
  lca: {
    blurb: "গভীরতম ভাগ করা পূর্বপুরুষ।",
    points: [
      "মূল-থেকে-নোড পথে মিল-শুরু থাকে।",
      "শেষ মিল-নোড = উত্তর।",
      "BST কৌশল: যেখানে a/b আলাদা হয়।",
    ],
  },
  "tree-diameter": {
    blurb: "দীর্ঘতম পথ + চার পাঠ।",
    points: [
      "ডাবল BFS ব্যাসের প্রান্ত দেয়।",
      "টপ/বটম = প্রতি horizontal দূরত্বে প্রথম/শেষ।",
      "লেফট/রাইট = প্রতি স্তরে প্রথম/শেষ।",
    ],
  },
  "circular-queue": {
    blurb: "রিং বাফার, সরানো নেই।",
    points: [
      "rear = (rear+1) % k, front = (front+1) % k।",
      "count == k হলেই ভর্তি।",
      "নির্দিষ্ট মেমরি, O(1) অপ — শিডিউলারের প্রিয়।",
    ],
  },
  "monotonic-stack": {
    blurb: "সাজানো স্ট্যাক, instant প্রশ্ন।",
    points: [
      "ক্রম ভাঙা top ফেলো, তারপর ঠেলো।",
      "প্রতিটা একবার ঢোকে + বেরোয়: O(n)।",
      "NGE, স্টক স্প্যান, হিস্টোগ্রাম ক্ষেত্রফলের শক্তি।",
    ],
  },
  "infix-postfix": {
    blurb: "প্রাধান্যই ক্রম ঠিক করে।",
    points: [
      "সংখ্যা সাথে সাথে ছাপে।",
      "≥ প্রাধান্য অপারেটর ফেলে তারপর ঠেলো।",
      ") পেলে ( পর্যন্ত খালাস, ( বাদ।",
    ],
  },
  "next-greater": {
    blurb: "ডান-থেকে-বাম, এক পাস।",
    points: [
      "স্ট্যাকে কমন্ত প্রার্থী থাকে।",
      "≤ x ফেলো — এরা কারো দৃশ্য আটকায় না।",
      "উত্তর = স্ট্যাক-top, খালি হলে −১।",
    ],
  },
  "lru-cache": {
    blurb: "পুরনোকে আগে ভোলো।",
    points: [
      "Get/put key-কে MRU সামনে আনে।",
      "ভর্তি হলে LRU লেজ বাদ।",
      "হ্যাশম্যাপ + ক্রম-তালিকা = দুটোই O(1)।",
    ],
  },
};
