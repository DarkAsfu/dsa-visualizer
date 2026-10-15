export type Lang = "en" | "bn";
export type Text = { en: string; bn: string };

const t = (en: string, bn: string): Text => ({ en, bn });

export const STR = {
  nav: {
    home: t("Home", "হোম"),
    sorting: t("Sorting", "সর্টিং"),
    topics: t("Topics", "টপিক"),
    graphs: t("Graphs", "গ্রাফ"),
  },
  side: {
    index: t("Index", "সূচি"),
    filterPh: t("Filter topics…", "টপিক খুঁজো…"),
    noMatch: t("No match for", "মিল পাওয়া যায়নি:"),
  },
  dijkstraX: {
    paths: t("Shortest paths from", "থেকে সংক্ষিপ্ততম পথ"),    table: t("Distance table", "দূরত্ব টেবিল"),
    finalS: t("final ✓", "চূড়ান্ত ✓"),
    tent: t("tentative", "অস্থায়ী"),
    trav: t("traverse", "যাও"),
  },
  outX: {    output: t("Output", "আউটপুট"),
    total: t("Total cost", "মোট খরচ"),
    take: t("take ✓", "নাও ✓"),
    skip: t("skip ✗", "বাদ ✗"),
    pass: t("Pass", "পাস"),
    order: t("Build order", "নির্মাণ ক্রম"),
    comps: t("Strong components", "দৃঢ় উপাদান"),
    group0: t("Group 0", "গ্রুপ ০"),
    group1: t("Group 1", "গ্রুপ ১"),
    filled: t("cells filled", "ঘর ভরেছে"),
    pathTo: t("Shortest path to", "পর্যন্ত সংক্ষিপ্ত পথ"),
    cost: t("cost", "খরচ"),
    queue: t("queue", "কিউ"),
    via: t("via", "হয়ে"),
  },
  treeX: {
    values: t("values", "মানগুলো"),
    keyK: t("key", "কী"),
    op: t("operation", "অপারেশন"),
    orderW: t("order", "ক্রম"),
    words: t("words", "শব্দগুলো"),
    word: t("word", "শব্দ"),
    range: t("range", "সীমা"),
    inorder: t("inorder", "ইনঅর্ডার"),
    heightW: t("height", "উচ্চতা"),
    sumW: t("sum", "যোগফল"),
    segments: t("segments", "খণ্ড"),
    extracted: t("extracted", "বেরোলো"),
    balanceW: t("balanced", "ভারসাম্য"),
    visitW: t("visit order", "দেখার ক্রম"),
    insertW: t("Insert", "ঢোকাও"),
    deleteW: t("Delete", "মুছো"),
    searchW: t("Search", "খুঁজো"),
    extractW: t("Extract", "বের করো"),
    queryW: t("Query", "জিজ্ঞাসা"),
    buildW: t("Build", "বানাও"),
    goL: t("go left", "বামে যাও"),
    goR: t("go right", "ডানে যাও"),
  },
  groups: {
    "1. Basics & Foundations": t("1. Basics & Foundations", "১. বেসিক ও ভিত্তি"),
    "2. Arrays & Strings": t("2. Arrays & Strings", "২. অ্যারে ও স্ট্রিং"),
    "3. Searching": t("3. Searching", "৩. সার্চিং"),
    "4. Sorting": t("4. Sorting", "৪. সর্টিং"),
    "5. Linked Lists": t("5. Linked Lists", "৫. লিংকড লিস্ট"),
    "6. Stack & Queue": t("6. Stack & Queue", "৬. স্ট্যাক ও কিউ"),
    "7. Hashing": t("7. Hashing", "৭. হ্যাশিং"),
    "8. Trees": t("8. Trees", "৮. ট্রি"),
    "9. Graphs": t("9. Graphs", "৯. গ্রাফ"),
    "10. Dynamic Programming": t("10. Dynamic Programming", "১০. ডাইনামিক প্রোগ্রামিং"),
    "11. Greedy": t("11. Greedy", "১১. গ্রিডি"),
    "12. Divide & Conquer": t("12. Divide & Conquer", "১২. ডিভাইড ও কনকার"),
    "13. Backtracking": t("13. Backtracking", "১৩. ব্যাকট্র্যাকিং"),
    "14. Math & Number Theory": t("14. Math & Number Theory", "১৪. গণিত ও সংখ্যাতত্ত্ব"),
    "15. Advanced": t("15. Advanced", "১৫. অ্যাডভান্সড"),
  } as Record<string, Text>,
  home: {
    overline: t("Interactive data structures & algorithms", "ইন্টারঅ্যাক্টিভ ডেটা স্ট্রাকচার ও অ্যালগরিদম"),
    titleA: t("See how", "দেখো কীভাবে"),
    titleB: t("algorithms think.", "অ্যালগরিদম ভাবে।"),
    subA: t(
      "Step-through execution, pseudocode tracking, and custom inputs. ",
      "ধাপে ধাপে এক্সিকিউশন, সিউডোকোড ট্র্যাকিং আর নিজের ইনপুট। "
    ),
    subB: t(" topics indexed, ", "টি টপিকের মধ্যে "),
    subC: t(" interactive.", "টি ইন্টারঅ্যাক্টিভ।"),
    cta1: t("Open Sorting visualizer →", "সর্টিং ভিজ্যুয়ালাইজার খোলো →"),
    cta2: t("Browse the index", "সূচি দেখো"),
    mvpH: t("Phase 1 — MVP", "প্রথম ধাপ — MVP"),
    liveOf: t("live", "লাইভ"),
    soon: t("soon", "শীঘ্রই"),
    roadH: t("Roadmap", "রোডম্যাপ"),
    phases: [
      { name: t("P1 · MVP — done", "P1 · MVP — শেষ"), items: t("Sorting, Searching, Stack/Queue, Linked List, BST, BFS/DFS — all live.", "সর্টিং, সার্চিং, স্ট্যাক/কিউ, লিংকড লিস্ট, BST, BFS/DFS — সব লাইভ।") },
      { name: t("P2 — done", "P2 — শেষ"), items: t("Heap, Trie, Dijkstra, MST, Union-Find, Recursion, Sliding Window — all live.", "হিপ, ট্রাই, ডাইকস্ট্রা, MST, ইউনিয়ন-ফাইন্ড, রিকার্শন, স্লাইডিং উইন্ডো — সব লাইভ।") },
      { name: t("P3 — in progress", "P3 — চলছে"), items: t("Backtracking basics + string matching live. DP, Greedy, Hashing next.", "ব্যাকট্র্যাকিং বেসিক + স্ট্রিং ম্যাচিং লাইভ। DP, গ্রিডি, হ্যাশিং পরের।") },
      { name: t("P4 — in progress", "P4 — চলছে"), items: t("AVL, Segment/Fenwick tree, SCC live. Flow, Math next.", "AVL, সেগমেন্ট/ফেনউইক ট্রি, SCC লাইভ। ফ্লো, গণিত পরের।") },
    ],
    how: [
      { t: t("Pick a topic", "টপিক বাছো"), d: t("Filter the index, open a visualizer.", "সূচি থেকে খুঁজে ভিজ্যুয়ালাইজার খোলো।") },
      { t: t("Step it", "ধাপে ধাপে চালাও"), d: t("Space to play, ←/→ to step, drag speed & size.", "স্পেস = প্লে, ←/→ = ধাপ, স্পিড ও সাইজ টানো।") },
      { t: t("Break it", "ভেঙে দেখো"), d: t("Feed your own input, watch edge cases.", "নিজের ইনপুট দাও, এজ কেস দেখো।") },
    ],
    rows: [
      { desc: t("Bubble → Quick + 7 more. Bar-level steps with pseudocode tracking.", "বাবল → কুইক + আরও ৭। বার-লেভেল ধাপ ও সিউডোকোড ট্র্যাকিং।"), meta: t("12 algorithms · live", "১২ অ্যালগরিদম · লাইভ") },
      { desc: t("Linear scan to ternary on sorted ranges.", "সাজানো রেঞ্জে লিনিয়ার থেকে টারনারি।"), meta: t("6 algorithms · live", "৬ অ্যালগরিদম · লাইভ") },
      { desc: t("Push/pop, enqueue/dequeue, parentheses.", "পুশ/পপ, এনকিউ/ডিকিউ, বন্ধনী।"), meta: t("live", "লাইভ") },
      { desc: t("Nodes, reverse, cycle, merge, middle.", "নোড, রিভার্স, সাইকেল, মার্জ, মাঝ।"), meta: t("6 topics · live", "৬ টপিক · লাইভ") },
      { desc: t("Insert, delete, search + traversals, AVL.", "ইনসার্ট, ডিলিট, সার্চ + ট্রাভার্সাল, AVL।"), meta: t("9 topics · live", "৯ টপিক · লাইভ") },
      { desc: t("Grid BFS/DFS + 13 weighted graph algorithms.", "গ্রিড BFS/DFS + ১৩ ওয়েটেড গ্রাফ অ্যালগরিদম।"), meta: t("16 topics · live", "১৬ টপিক · লাইভ") },
    ],
  },
  pages: {
    sorting: {
      overline: t("4 · Sorting — MVP", "৪ · সর্টিং — MVP"),
      title: "Sorting",
      meta: t("O(n²) → O(n log n) · 5 algorithms", "O(n²) → O(n log n) · ৫ অ্যালগরিদম"),
      intro: t(
        "Pick an algorithm, hit Play, and follow along with the highlighted pseudocode.",
        "অ্যালগরিদম বাছো, Play চাপো, হাইলাইট হওয়া সিউডোকোড মিলিয়ে দেখো।"
      ),
    },
    "bubble-sort": {
      overline: t("4 · Sorting — MVP", "৪ · সর্টিং — MVP"),
      title: "Bubble Sort",
      meta: t("O(n²) · adjacent swaps", "O(n²) · পাশাপাশি অদলবদল"),
      intro: t(
        "Big values bubble to the end, one adjacent swap at a time. Simple — and slow.",
        "বড় মান একটা একটা করে পাশেরটার সাথে বদলে শেষে ভাসে। সহজ — কিন্তু ধীর।"
      ),
    },
    "selection-sort": {
      overline: t("4 · Sorting — MVP", "৪ · সর্টিং — MVP"),
      title: "Selection Sort",
      meta: t("O(n²) · pick the minimum", "O(n²) · ক্ষুদ্রতম বাছো"),
      intro: t(
        "Each pass finds the minimum of the rest and plants it at the frontier.",
        "প্রতি পাসে বাকিদের ক্ষুদ্রতমটা খুঁজে সীমানায় বসায়।"
      ),
    },
    "insertion-sort": {
      overline: t("4 · Sorting — MVP", "৪ · সর্টিং — MVP"),
      title: "Insertion Sort",
      meta: t("O(n²) · O(n) best", "O(n²) · সেরা O(n)"),
      intro: t(
        "Take the next key and slide it left into the sorted prefix — great when nearly sorted.",
        "পরের key নিয়ে সাজানো অংশে বামে ঢুকাও — প্রায় সাজানো ডেটায় দারুণ।"
      ),
    },
    "merge-sort": {
      overline: t("4 · Sorting — MVP", "৪ · সর্টিং — MVP"),
      title: "Merge Sort",
      meta: t("O(n log n) · divide & conquer", "O(n log n) · ভাগ করে জোড়া"),
      intro: t(
        "Split in half, sort each half, merge the runs. Guaranteed O(n log n) for O(n) space.",
        "অর্ধেক ভাগ করো, দুই অর্ধেক সাজাও, জোড়া দাও। O(n) জায়গায় নিশ্চিত O(n log n)।"
      ),
    },
    "quick-sort": {
      overline: t("4 · Sorting — MVP", "৪ · সর্টিং — MVP"),
      title: "Quick Sort",
      meta: t("O(n log n) avg · pivot partition", "গড়ে O(n log n) · pivot ভাগ"),
      intro: t(
        "Pick a pivot, park smaller left and larger right, recurse. Fast on average, O(n²) unlucky.",
        "pivot বাছো, ছোট বামে বড় ডানে, recurse করো। গড়ে দ্রুত, কপাল খারাপে O(n²)।"
      ),
    },
    "heap-sort": {
      overline: t("4 · Sorting — Phase 2", "৪ · সর্টিং — ফেজ ২"),
      title: "Heap Sort",
      meta: t("O(n log n) · max-heap extract", "O(n log n) · ম্যাক্স-হিপ"),
      intro: t(
        "Build a max-heap, then pluck the root home one by one. Guaranteed O(n log n), no extra array.",
        "ম্যাক্স-হিপ বানাও, তারপর রুট একটা একটা করে ঘরে পাঠাও। নিশ্চিত O(n log n), বাড়তি অ্যারে ছাড়া।"
      ),
    },
    "counting-sort": {
      overline: t("4 · Sorting — Phase 2", "৪ · সর্টিং — ফেজ ২"),
      title: "Counting Sort",
      meta: t("O(n+k) · frequency write-back", "O(n+k) · ফ্রিকোয়েন্সি"),
      intro: t(
        "Count each value, then write them back in order. No comparisons — blazing when k is small.",
        "প্রতিটা মান গুনো, তারপর ক্রমে লিখে দাও। তুলনা নেই — k ছোট হলে বিদ্যুৎগতি।"
      ),
    },
    "radix-sort": {
      overline: t("4 · Sorting — Phase 3", "৪ · সর্টিং — ফেজ ৩"),
      title: "Radix Sort",
      meta: t("O(nk) · digit by digit", "O(nk) · অঙ্ক ধরে ধরে"),
      intro: t(
        "Sort by ones, then tens, then hundreds — stable passes stack into a full sort.",
        "একক, তারপর দশক, তারপর শতক ধরে সাজাও — স্থিতিশীল পাস জমে পূর্ণ সর্ট হয়।"
      ),
    },
    "bucket-sort": {
      overline: t("4 · Sorting — Phase 3", "৪ · সর্টিং — ফেজ ৩"),
      title: "Bucket Sort",
      meta: t("O(n+k) · scatter & gather", "O(n+k) · ছড়াও ও জড়ো করো"),
      intro: t(
        "Scatter values into buckets, sort each small pile, gather in order. Lovely on uniform data.",
        "মানগুলো বালতিতে ছড়াও, ছোট স্তূপ সাজাও, ক্রমে জড়ো করো। সুষম ডেটায় দারুণ।"
      ),
    },
    "shell-sort": {
      overline: t("4 · Sorting — Phase 4", "৪ · সর্টিং — ফেজ ৪"),
      title: "Shell Sort",
      meta: t("gapped insertion · shrinking gap", "ফাঁকা insertion · কমতে থাকা gap"),
      intro: t(
        "Insertion sort with a long reach: compare far-apart pairs first, then tighten the gap to 1.",
        "লম্বা হাতের insertion sort: আগে দূরের জোড়া মিলাও, তারপর gap ১-এ নামাও।"
      ),
    },
    "sorting-race": {
      overline: t("4 · Sorting — Phase 3", "৪ · সর্টিং — ফেজ ৩"),
      title: "Sorting Race",
      meta: t("10 algorithms · same array", "১০ অ্যালগরিদম · একই অ্যারে"),
      intro: t(
        "All ten sorters, one array, one clock. Watch who finishes first — and who was built for speed.",
        "দশ সর্টার, এক অ্যারে, এক ঘড়ি। দেখো কে আগে শেষ করে — আর কে গতির জন্য তৈরি।"
      ),
    },
    complexity: {
      overline: t("1 · Basics — Foundations", "১ · বেসিক — ভিত্তি"),
      title: "Complexity",
      meta: t("time vs space · Big-O growth", "টাইম বনাম স্পেস · Big-O গ্রোথ"),
      intro: t(
        "Big-O describes how operations grow as the input grows. Drag the slider — by n=30, O(2ⁿ) passes a billion while O(n!) heads toward infinity. Check complexity before picking an algorithm.",
        "ইনপুট বাড়লে অপারেশন কীভাবে বাড়ে, Big-O সেটাই বলে। স্লাইডার টানো — n=30 এই O(2ⁿ) এক বিলিয়ন ছাড়ায়, O(n!) অসীমের দিকে। অ্যালগরিদম বাছার আগে কমপ্লেক্সিটি দেখো।"
      ),
    },
    recursion: {
      overline: t("1 · Basics — Foundations", "১ · বেসিক — ভিত্তি"),
      title: "Recursion",
      meta: t("call stack · base case · n ≤ 10", "কল স্ট্যাক · বেস কেস · n ≤ 10"),
      intro: t(
        "Every call waits for its children to return. Step through and watch frames push and pop — that is the entire trick behind recursion.",
        "প্রতিটা কল তার চাইল্ডদের জন্য অপেক্ষা করে। ধাপে ধাপে দেখো ফ্রেম কীভাবে push-pop হয় — এটাই রিকার্শনের পুরো কৌশল।"
      ),
    },
    "backtracking-basics": {
      overline: t("1 · Basics — Foundations", "১ · বেসিক — ভিত্তি"),
      title: "Backtracking",
      meta: t("N-Queens · try / conflict / undo", "N-Queens · চেষ্টা / সংঘাত / undo"),
      intro: t(
        "Try a move. If it breaks a rule, undo it and try the next one. That loop — choose, explore, unchoose — solves N-Queens, Sudoku, and mazes.",
        "একটা চাল দাও। নিয়ম ভাঙলে undo করে পরেরটা চেষ্টা করো। এই লুপ — choose, explore, unchoose — N-Queens, Sudoku, গোলকধাঁধা সব সমাধান করে।"
      ),
    },
    "bit-manipulation": {
      overline: t("1 · Basics — Foundations", "১ · বেসিক — ভিত্তি"),
      title: "Bit Manipulation",
      meta: t("8-bit · MSB first", "৮-বিট · MSB আগে"),
      intro: t(
        "Every number is 8 switches. Flip them, combine them, slide them — one bit at a time.",
        "প্রতিটা সংখ্যা ৮টা সুইচ। ওগুলো উল্টাও, জোড়া দাও, সরাও — একবারে এক বিট।"
      ),
    },
    "linear-search": {
      overline: t("3 · Searching — MVP", "৩ · সার্চিং — MVP"),
      title: "Searching",
      meta: t("O(n) vs O(log n) · target hunt", "O(n) বনাম O(log n) · টার্গেট শিকার"),
      intro: t(
        "Set a target and watch linear scan check every cell — then flip to Binary and see halving kill the range in a few steps.",
        "টার্গেট দাও, লিনিয়ার স্ক্যান প্রতিটা সেল দেখবে — তারপর Binary তে গিয়ে দেখো কীভাবে range কয়েক ধাপে শেষ।"
      ),
    },
    "binary-search": {
      overline: t("3 · Searching — MVP", "৩ · সার্চিং — MVP"),
      title: "Searching",
      meta: t("O(n) vs O(log n) · target hunt", "O(n) বনাম O(log n) · টার্গেট শিকার"),
      intro: t(
        "Binary search throws away half the array per check. Compare it with linear scan on the same target.",
        "বাইনারি সার্চ প্রতি চেকে অর্ধেক অ্যারে ফেলে দেয়। একই টার্গেটে লিনিয়ার স্ক্যানের সাথে তুলনা করো।"
      ),
    },
    "jump-search": {
      overline: t("3 · Searching — MVP", "৩ · সার্চিং — MVP"),
      title: "Searching",
      meta: t("O(√n) jumps · then linear scan", "O(√n) জাম্প · তারপর লিনিয়ার স্ক্যান"),
      intro: t(
        "Jump search leaps forward in √n blocks to find the right neighborhood, then walks the last block on foot.",
        "জাম্প সার্চ √n ব্লকে লাফিয়ে সঠিক এলাকা খুঁজে, শেষ ব্লকটা হেঁটে দেখে।"
      ),
    },
    "interpolation-search": {
      overline: t("3 · Searching — MVP", "৩ · সার্চিং — MVP"),
      title: "Searching",
      meta: t("O(log log n) probes · uniform data", "O(log log n) প্রোব · সুষম ডেটা"),
      intro: t(
        "Instead of the middle, interpolation guesses the position from the value gap — like finding a word in a dictionary by its first letter.",
        "মাঝখানের বদলে মানের ব্যবধান দেখে অবস্থান আন্দাজ করে — যেন প্রথম অক্ষর দেখে অভিধানে শব্দ খোঁজা।"
      ),
    },
    "exponential-search": {
      overline: t("3 · Searching — MVP", "৩ · সার্চিং — MVP"),
      title: "Searching",
      meta: t("doubling range · then binary", "রেঞ্জ দ্বিগুণ · তারপর বাইনারি"),
      intro: t(
        "No idea how big the array is? Double the bound until you overshoot, then binary search the trapped range.",
        "অ্যারে কত বড় জানো না? সীমা দ্বিগুণ করতে থাকো, ছাড়িয়ে গেলে আটকা রেঞ্জে বাইনারি সার্চ।"
      ),
    },
    "ternary-search": {
      overline: t("3 · Searching — MVP", "৩ · সার্চিং — MVP"),
      title: "Searching",
      meta: t("O(log₃ n) · two mids", "O(log₃ n) · দুই mid"),
      intro: t(
        "Binary search with two midpoints: discard two thirds of the range per round instead of one half.",
        "দুই mid-ওয়ালা বাইনারি সার্চ: প্রতি রাউন্ডে অর্ধেকের বদলে দুই-তৃতীয়াংশ বাদ।"
      ),
    },
    "array-ops": {
      overline: t("2 · Arrays & Strings — MVP", "২ · অ্যারে ও স্ট্রিং — MVP"),
      title: "Array Operations",
      meta: t("insert · delete · rotate · reverse", "ইনসার্ট · ডিলিট · রোটেট · রিভার্স"),
      intro: t(
        "Arrays cannot grow in the middle for free — every insert and delete shifts its neighbors. Run an op and count the moves.",
        "অ্যারের মাঝে বিনামূল্যে জায়গা হয় না — প্রতিটা ইনসার্ট-ডিলিট প্রতিবেশীদের সরায়। op চালিয়ে move গুনো।"
      ),
    },
    "two-pointers": {
      overline: t("2 · Arrays & Strings — MVP", "২ · অ্যারে ও স্ট্রিং — MVP"),
      title: "Two Pointers",
      meta: t("opposite ends · slow + fast", "দুই প্রান্ত · slow + fast"),
      intro: t(
        "Two indices, one pass. Squeeze from both ends for pair sums and containers — or let a slow pointer trail a fast scanner.",
        "দুই ইনডেক্স, এক পাস। দুই প্রান্ত থেকে চাপ দাও — নয়তো slow পয়েন্টার fast স্ক্যানারকে অনুসরণ করুক।"
      ),
    },
    "prefix-sum": {
      overline: t("2 · Arrays & Strings — Phase 2", "২ · অ্যারে ও স্ট্রিং — ফেজ ২"),
      title: "Prefix Sum",
      meta: t("build once · query O(1)", "একবার বানাও · O(1) প্রশ্ন"),
      intro: t(
        "Running totals turn any range sum into one subtraction. Build P once, answer every query instantly.",
        "চলমান যোগফল যেকোনো রেঞ্জ-সামকে এক বিয়োগে নামায়। P একবার বানাও, সব প্রশ্নের উত্তর মুহূর্তে।"
      ),
    },
    kadane: {
      overline: t("2 · Arrays & Strings — Phase 2", "২ · অ্যারে ও স্ট্রিং — ফেজ ২"),
      title: "Kadane's Algorithm",
      meta: t("max subarray · O(n)", "সর্বোচ্চ সাবঅ্যারে · O(n)"),
      intro: t(
        "Walk once, carrying the best subarray ending here. Restart whenever the running sum goes negative.",
        "একবার হাঁটো, এখানে শেষ হওয়া সেরা সাবঅ্যারে হাতে রাখো। চলমান যোগফল ঋণাত্মক হলেই নতুন করে শুরু।"
      ),
    },
    "dutch-flag": {
      overline: t("2 · Arrays & Strings — Phase 3", "২ · অ্যারে ও স্ট্রিং — ফেজ ৩"),
      title: "Dutch Flag",
      meta: t("0 · 1 · 2 three-way partition", "০ · ১ · ২ তিন ভাগ"),
      intro: t(
        "Three pointers sort 0s, 1s and 2s in one pass. Zeros sink left, twos float right, ones stay.",
        "তিন পয়েন্টার ০, ১, ২ এক পাসে সাজায়। শূন্য বামে ডোবে, দুই ডানে ভাসে, এক থাকে।"
      ),
    },
    kmp: {
      overline: t("2 · Arrays & Strings — Phase 4", "২ · অ্যারে ও স্ট্রিং — ফেজ ৪"),
      title: "KMP",
      meta: t("LPS table · never rewind text", "LPS টেবিল · টেক্সট পেছনে নয়"),
      intro: t(
        "A prefix table teaches the pattern to skip itself. Mismatch? Fall back inside the pattern — the text never moves back.",
        "প্রিফিক্স টেবিল প্যাটার্নকে নিজেকে এড়াতে শেখায়। অমিল? প্যাটার্নের ভেতরে ফিরে যাও — টেক্সট কখনো পেছায় না।"
      ),
    },
    "rabin-karp": {
      overline: t("2 · Arrays & Strings — Phase 4", "২ · অ্যারে ও স্ট্রিং — ফেজ ৪"),
      title: "Rabin-Karp",
      meta: t("rolling hash · verify hits", "রোলিং হ্যাশ · হিট যাচাই"),
      intro: t(
        "Hash every window, roll it forward in O(1). Equal hashes get a char-by-char trial — hashes can lie.",
        "প্রতিটা উইন্ডোর হ্যাশ করো, O(1)-এ গড়িয়ে নাও। সমান হ্যাশ পেলে অক্ষরে অক্ষরে বিচার — হ্যাশ মিথ্যা বলতে পারে।"
      ),
    },
    "z-algorithm": {
      overline: t("2 · Arrays & Strings — Phase 4", "২ · অ্যারে ও স্ট্রিং — ফেজ ৪"),
      title: "Z-Algorithm",
      meta: t("Z-box [l, r] · copy or extend", "Z-বক্স [l, r] · কপি বা বাড়াও"),
      intro: t(
        "Z[i] counts matches with the prefix. A remembered [l, r] box lets you copy old answers instead of recomparing.",
        "Z[i] প্রিফিক্সের সাথে মিল গুনে। মনে রাখা [l, r] বক্স পুরনো উত্তর কপি করতে দেয় — আবার তুলনার দরকার নেই।"
      ),
    },
    "palindrome-anagram": {
      overline: t("2 · Arrays & Strings — Phase 2", "২ · অ্যারে ও স্ট্রিং — ফেজ ২"),
      title: "Palindrome & Anagram",
      meta: t("two ends · letter counts", "দুই প্রান্ত · অক্ষর গণনা"),
      intro: t(
        "Mirror test from both ends, frequency test letter by letter. Two string classics, one page.",
        "দুই প্রান্ত থেকে আয়না পরীক্ষা, অক্ষরে অক্ষরে ফ্রিকোয়েন্সি পরীক্ষা। দুই স্ট্রিং ক্লাসিক, এক পেজ।"
      ),
    },
    "singly-linked-list": {
      overline: t("5 · Linked Lists — MVP", "৫ · লিংকড লিস্ট — MVP"),
      title: "Linked List",
      meta: t("nodes · links · O(1) ends", "নোড · লিংক · O(1) প্রান্ত"),
      intro: t(
        "No shifting: insert and delete by rewiring arrows. Then flip them all, then hunt cycles with two runners.",
        "শিফট নেই: তীর বদলে ইনসার্ট-ডিলিট। তারপর সব উল্টাও, দুই দৌড়বিদে সাইকেল খুঁজো।"
      ),
    },
    "reverse-linked-list": {
      overline: t("5 · Linked Lists — MVP", "৫ · লিংকড লিস্ট — MVP"),
      title: "Linked List",
      meta: t("flip every arrow · O(n)", "প্রতিটা তীর উল্টাও · O(n)"),
      intro: t(
        "Walk once with prev, curr and next. Each link turns around as you pass.",
        "prev, curr, next নিয়ে একবার হাঁটো। যাওয়ার পথে প্রতিটা লিংক ঘুরে যায়।"
      ),
    },
    "cycle-detection": {
      overline: t("5 · Linked Lists — MVP", "৫ · লিংকড লিস্ট — MVP"),
      title: "Linked List",
      meta: t("tortoise & hare · O(n)", "কচ্ছপ ও খরগোশ · O(n)"),
      intro: t(
        "Wire a tail back into the chain and race slow against fast. A meeting proves the loop.",
        "লেজ শেকলে বেঁধে slow বনাম fast দৌড়াও। দেখা হলেই লুপ প্রমাণ।"
      ),
    },
    "doubly-linked-list": {
      overline: t("5 · Linked Lists — Phase 2", "৫ · লিংকড লিস্ট — ফেজ ২"),
      title: "Linked List",
      meta: t("prev + next · circular", "prev + next · গোলাকার"),
      intro: t(
        "Links run both ways, and the tail can shake the head's hand. Toggle circular and watch the arcs close.",
        "লিংক দুই দিকে চলে, লেজ মাথার সাথে হাত মেলাতে পারে। circular চালু করে বৃত্ত বন্ধ হতে দেখো।"
      ),
    },
    "merge-sorted-lists": {
      overline: t("5 · Linked Lists — Phase 2", "৫ · লিংকড লিস্ট — ফেজ ২"),
      title: "Linked List",
      meta: t("two heads · one result", "দুই মাথা · এক ফল"),
      intro: t(
        "Compare the heads, take the smaller, repeat. Leftovers drain in at the end.",
        "মাথা তুলনা করো, ছোটটা নাও, আবার। শেষে বাকিটা ঢেলে দাও।"
      ),
    },
    "linked-list-middle": {
      overline: t("5 · Linked Lists — Phase 2", "৫ · লিংকড লিস্ট — ফেজ ২"),
      title: "Linked List",
      meta: t("S/F runners · lead gap", "S/F দৌড়বিদ · lead ফাঁক"),
      intro: t(
        "No length? No problem. A 2× runner finds the middle; a head start finds Nth-from-end.",
        "দৈর্ঘ্য নেই? সমস্যা নেই। ২× দৌড়বিদ মাঝখানা বের করে; head start শেষ-থেকে-nতম।"
      ),
    },
    bfs: {
      overline: t("9 · Graphs — MVP", "৯ · গ্রাফ — MVP"),
      title: "BFS & DFS",
      meta: t("queue vs stack · vertices", "queue বনাম stack · শীর্ষ"),
      intro: t(
        "Start at a vertex, visit its neighbors, repeat. Watch the queue enforce level order.",
        "একটা শীর্ষ থেকে শুরু, প্রতিবেশীদের দেখো, আবার। queue কীভাবে স্তর-ক্রম বাধ্য করে দেখো।"
      ),
    },
    dfs: {
      overline: t("9 · Graphs — MVP", "৯ · গ্রাফ — MVP"),
      title: "BFS & DFS",
      meta: t("queue vs stack · vertices", "queue বনাম stack · শীর্ষ"),
      intro: t(
        "Dive down one path with a stack, backtrack when stuck. Same graph, deeper personality.",
        "stack নিয়ে এক পথে গভীরে যাও, আটকে গেলে ফিরে এসো। একই গ্রাফ, গভীর চরিত্র।"
      ),
    },
    "sliding-window": {
      overline: t("2 · Arrays & Strings — Phase 2", "২ · অ্যারে ও স্ট্রিং — ফেজ ২"),
      title: "Sliding Window",
      meta: t("fixed k · variable ≤ K", "ফিক্সড k · ভেরিয়েবল ≤ K"),
      intro: t(
        "A window glides over the array — add the newcomer, drop the leaver. O(n) instead of recomputing every subarray.",
        "অ্যারের উপর দিয়ে উইন্ডো গড়ায় — নতুনটা যোগ করো, পুরনোটা বাদ দাও। প্রতিটা সাবঅ্যারে নতুন করে না গুনে O(n)।"
      ),
    },
    stack: {
      overline: t("6 · Stack & Queue — MVP", "৬ · স্ট্যাক ও কিউ — MVP"),
      title: "Stack & Queue",
      meta: t("LIFO · FIFO · balanced brackets", "LIFO · FIFO · ব্যালান্সড ব্র্যাকেট"),
      intro: t(
        "Stack piles up, queue lines up. Push, pop, enqueue, dequeue — then watch a stack validate brackets.",
        "স্ট্যাক স্তূপ করে, কিউ লাইন ধরায়। পুশ, পপ, এনকিউ, ডিকিউ — তারপর দেখো স্ট্যাক কীভাবে ব্র্যাকেট যাচাই করে।"
      ),
    },
    queue: {
      overline: t("6 · Stack & Queue — MVP", "৬ · স্ট্যাক ও কিউ — MVP"),
      title: "Stack & Queue",
      meta: t("LIFO · FIFO · balanced brackets", "LIFO · FIFO · ব্যালান্সড ব্র্যাকেট"),
      intro: t(
        "First in, first out. Enqueue at the rear, dequeue from the front — fair like a real line.",
        "আগে এলে আগে পাবে। পেছনে এনকিউ, সামনে থেকে ডিকিউ — আসল লাইনের মতো ন্যায্য।"
      ),
    },
    "graph-representation": {
      overline: t("9 · Graphs — MVP", "৯ · গ্রাফ — MVP"),
      title: "Graphs",
      meta: t("matrix vs list", "ম্যাট্রিক্স বনাম লিস্ট"),
      intro: t(
        "Two ways to store the same graph. Click rows and vertices to see how they mirror each other.",
        "একই গ্রাফ রাখার দুই উপায়। সারি আর শীর্ষে ক্লিক করে দেখো কীভাবে আয়না হয়।"
      ),
    },
    dijkstra: {
      overline: t("9 · Graphs — Phase 2", "৯ · গ্রাফ — ফেজ ২"),
      title: "Graphs",
      meta: t("greedy shortest path · O(E log V)", "গ্রিডি শর্টেস্ট পাথ · O(E log V)"),
      intro: t(
        "Always expand the nearest unknown vertex. The first time you pop one, its distance is final.",
        "সবসময় নিকটতম অজানা শীর্ষ বাড়াও। প্রথমবার তুললেই দূরত্ব চূড়ান্ত।"
      ),
    },
    "bellman-ford": {
      overline: t("9 · Graphs — Phase 3", "৯ · গ্রাফ — ফেজ ৩"),
      title: "Graphs",
      meta: t("V−1 passes · negative edges OK", "V−১ পাস · ঋণাত্মক এজ চলে"),
      intro: t(
        "Relax every edge, V−1 times. One more relaxing pass exposes a negative cycle.",
        "প্রতিটা এজ V−১ বার শিথিল করো। আরেক পাসে শিথিল হলে ঋণাত্মক চক্র আছে।"
      ),
    },
    "floyd-warshall": {
      overline: t("9 · Graphs — Phase 4", "৯ · গ্রাফ — ফেজ ৪"),
      title: "Graphs",
      meta: t("all pairs · k layers", "সব জোড়া · k স্তর"),
      intro: t(
        "Let paths go via k, for every k. The matrix converges to all-pairs shortest.",
        "প্রতি k হয়ে পথ যেতে দাও। ম্যাট্রিক্স সব-জোড়া ক্ষুদ্রতমে পৌঁছায়।"
      ),
    },
    "topological-sort": {
      overline: t("9 · Graphs — Phase 2", "৯ · গ্রাফ — ফেজ ২"),
      title: "Graphs",
      meta: t("Kahn · indegree zero first", "Kahn · indegree শূন্য আগে"),
      intro: t(
        "Order tasks so dependencies come first. Zero indegree goes next; a leftover cycle breaks it.",
        "নির্ভরতা আগে রেখে কাজ সাজাও। indegree শূন্য এগিয়ে যায়; বাকি চক্র ভাঙে।"
      ),
    },
    prims: {
      overline: t("9 · Graphs — Phase 2", "৯ · গ্রাফ — ফেজ ২"),
      title: "Graphs",
      meta: t("grow cheapest tree", "সস্তা গাছ বাড়াও"),
      intro: t(
        "Grow one tree, always adding its cheapest escaping edge. Cut property guarantees optimal.",
        "একটা গাছ বাড়াও, সবসময় সস্তা বেরোনো এজ নিয়ে। কাট প্রপার্টি অপ্টিমাল নিশ্চিত করে।"
      ),
    },
    kruskals: {
      overline: t("9 · Graphs — Phase 2", "৯ · গ্রাফ — ফেজ ২"),
      title: "Graphs",
      meta: t("cheapest edge · skip cycles", "সস্তা এজ · চক্র বাদ"),
      intro: t(
        "Sort all edges, take the cheapest that joins two sets. Union-Find says no to cycles.",
        "সব এজ সাজাও, দুই সেট জোড়া সস্তাটা নাও। Union-Find চক্রে না বলে।"
      ),
    },
    "union-find": {
      overline: t("9 · Graphs — Phase 2", "৯ · গ্রাফ — ফেজ ২"),
      title: "Graphs",
      meta: t("rank + path compression", "rank + পথ সংকোচন"),
      intro: t(
        "Everyone points up until one root. Union by rank, find with compression — nearly constant time.",
        "সবাই উপরে তাকায় এক রুট পর্যন্ত। rank দিয়ে union, সংকোচনে find — প্রায় ধ্রুবক সময়।"
      ),
    },
    "cycle-detection-graph": {
      overline: t("9 · Graphs — Phase 3", "৯ · গ্রাফ — ফেজ ৩"),
      title: "Graphs",
      meta: t("gray-to-gray = cycle", "ধূসর-থেকে-ধূসর = চক্র"),
      intro: t(
        "Gray means on the stack. An edge back to gray closes a directed cycle.",
        "ধূসর মানে স্ট্যাকে। ধূসরে ফেরা এজ directed চক্র বন্ধ করে।"
      ),
    },
    kosaraju: {
      overline: t("9 · Graphs — Phase 4", "৯ · গ্রাফ — ফেজ ৪"),
      title: "Graphs",
      meta: t("two passes · SCCs", "দুই পাস · SCC"),
      intro: t(
        "Finish order first, then conquer the reversed graph. Each tree is one strongly connected component.",
        "আগে finish ক্রম, তারপর উল্টো গ্রাফ জয়। প্রতিটা গাছ এক strong component।"
      ),
    },
    "bipartite-check": {
      overline: t("9 · Graphs — Phase 3", "৯ · গ্রাফ — ফেজ ৩"),
      title: "Graphs",
      meta: t("2-color test", "২-রং পরীক্ষা"),
      intro: t(
        "Paint neighbors the opposite color. One same-color edge fails the whole graph.",
        "প্রতিবেশী উল্টো রঙে রাঙাও। একটা একরঙা এজ পুরো গ্রাফ ফেল করায়।"
      ),
    },
    astar: {
      overline: t("9 · Graphs — Phase 3", "৯ · গ্রাফ — ফেজ ৩"),
      title: "Graphs",
      meta: t("f = g + h guided", "f = g + h নির্দেশিত"),
      intro: t(
        "Dijkstra with a sense of direction. The heuristic guesses remaining cost — expand smallest f first.",
        "দিশা-সহ Dijkstra। heuristic বাকি খরচ আন্দাজ করে — সবচেয়ে ছোট f আগে বাড়াও।"
      ),
    },
    "flood-fill": {
      overline: t("9 · Graphs — Phase 2", "৯ · গ্রাফ — ফেজ ২"),
      title: "Graphs",
      meta: t("paint bucket BFS", "রং বালতি BFS"),
      intro: t(
        "Pour paint on a cell and watch it spread to 4-neighbors. Walls block, visited skips.",
        "সেলে রং ঢালো, ৪-প্রতিবেশীতে ছড়াতে দেখো। দেয়াল আটকায়, দেখা বাদ যায়।"
      ),
    },
    "tree-traversals": {
      overline: t("8 · Trees — MVP", "৮ · ট্রি — MVP"),
      title: "Trees",
      meta: t("in · pre · post · level", "ইন · প্রি · পোস্ট · লেভেল"),
      intro: t(
        "Same tree, four walk orders. Inorder sorts a BST; preorder copies structure; postorder deletes safely.",
        "এক গাছ, চার হাঁটার ক্রম। ইনঅর্ডার BST সাজায়; প্রিঅর্ডার গঠন নকল করে; পোস্টঅর্ডারে নিরাপদে মুছে।"
      ),
    },
    bst: {
      overline: t("8 · Trees — MVP", "৮ · ট্রি — MVP"),
      title: "Trees",
      meta: t("left < node < right", "বাম < নোড < ডান"),
      intro: t(
        "Search by halving: go left if smaller, right if bigger. Delete has three cases — leaf, one child, successor.",
        "অর্ধেক করে খুঁজো: ছোট হলে বামে, বড় হলে ডানে। মুছতে তিন কেস — পাতা, এক সন্তান, উত্তরসূরি।"
      ),
    },
    "avl-tree": {
      overline: t("8 · Trees — Phase 4", "৮ · ট্রি — ফেজ ৪"),
      title: "Trees",
      meta: t("balance −1..1 · rotations", "ভারসাম্য −১..১ · ঘূর্ণন"),
      intro: t(
        "A BST that rebalances itself. Balance factor out of ±1 triggers LL, RR, LR or RL rotations.",
        "নিজে ভারসাম্য রাখা BST। ব্যালান্স ±১-এর বাইরে গেলে LL, RR, LR বা RL ঘূর্ণন।"
      ),
    },
    "heap-ds": {
      overline: t("8 · Trees — Phase 2", "৮ · ট্রি — ফেজ ২"),
      title: "Trees",
      meta: t("max-heap · bubble & sift", "ম্যাক্স-হিপ · বাবল ও সিফট"),
      intro: t(
        "Parent always wins. Insert bubbles up, extract swaps the root down — both O(log n).",
        "বাবা সবসময় জেতে। ইনসার্ট উপরে বাবল করে, extract মূল নিচে নামায় — দুটোই O(log n)।"
      ),
    },
    trie: {
      overline: t("8 · Trees — Phase 2", "৮ · ট্রি — ফেজ ২"),
      title: "Trees",
      meta: t("prefix tree · per char", "প্রিফিক্স গাছ · প্রতি অক্ষর"),
      intro: t(
        "Words sharing prefixes share nodes. Search costs word length, not dictionary size.",
        "একই প্রিফিক্সের শব্দ নোড ভাগ করে। খোঁজার খরচ শব্দের দৈর্ঘ্য, অভিধানের আকার নয়।"
      ),
    },
    "segment-tree": {
      overline: t("8 · Trees — Phase 4", "৮ · ট্রি — ফেজ ৪"),
      title: "Trees",
      meta: t("range sum · O(log n)", "রেঞ্জ যোগ · O(log n)"),
      intro: t(
        "Each node owns an interval. Query takes fully-inside nodes, skips outsiders, splits the rest.",
        "প্রতিটা নোড এক ব্যবধির মালিক। ভেতরের নোড নাও, বাইরের বাদ, বাকি ভাঙো।"
      ),
    },
    "fenwick-tree": {
      overline: t("8 · Trees — Phase 4", "৮ · ট্রি — ফেজ ৪"),
      title: "Trees",
      meta: t("BIT · lowbit jumps", "BIT · lowbit লাফ"),
      intro: t(
        "Prefix sums with tabular superpowers. Update climbs with += lowbit, query slides down with −= lowbit.",
        "টেবিল-শক্তিতে প্রিফিক্স যোগ। আপডেট += lowbit দিয়ে ওঠে, জিজ্ঞাসা −= lowbit দিয়ে নামে।"
      ),
    },
    lca: {
      overline: t("8 · Trees — Phase 3", "৮ · ট্রি — ফেজ ৩"),
      title: "Trees",
      meta: t("last common on root paths", "মূল-পথে শেষ মিল"),
      intro: t(
        "Trace both root-to-node paths. The last shared node is the lowest common ancestor.",
        "দুটো মূল-থেকে-নোড পথ আঁকো। শেষ ভাগ করা নোডই lowest common ancestor।"
      ),
    },
    "tree-diameter": {
      overline: t("8 · Trees — Phase 3", "৮ · ট্রি — ফেজ ৩"),
      title: "Trees",
      meta: t("double BFS · 4 views", "ডাবল BFS · ৪ ভিউ"),
      intro: t(
        "BFS from anywhere finds one end; BFS from there finds the diameter. Views read the tree from four sides.",
        "যেকোনোখান থেকে BFS এক প্রান্ত দেয়; সেখান থেকে BFS ব্যাস দেয়। ভিউ চার দিক থেকে গাছ পড়ে।"
      ),
    },
  } as Record<string, { overline: Text; title: string; meta: Text; intro: Text }>,
  common: {
    play: t("▶ Play", "▶ প্লে"),
    pause: t("❚❚ Pause", "❚❚ থামো"),
    replay: t("↺ Replay", "↺ আবার"),
    cont: t("▶ Continue", "▶ চালিয়ে যাও"),
    reset: t("Reset", "রিসেট"),
    shuffle: t("Shuffle", "এলোমেলো"),
    clear: t("Clear", "মুছো"),
    run: t("Run", "চালাও"),
    find: t("Find", "খুঁজো"),
    set: t("Set", "বসাও"),
    visualize: t("Visualize", "দেখাও"),
    speed: t("Speed", "গতি"),
    size: t("Size", "সাইজ"),
    target: t("Target", "টার্গেট"),
    array: t("Array", "অ্যারে"),
    customInput: t("Custom input", "নিজের ইনপুট"),
    pseudocode: t("Pseudocode", "সিউডোকোড"),
    code: t("Code", "কোড"),
    theoryWord: t("Theory", "তত্ত্ব"),
    callstack: t("Call stack", "কল স্ট্যাক"),
    comparisons: t("Comparisons", "তুলনা"),
    swapsWrites: t("Swaps / Writes", "অদলবদল"),
    totalSteps: t("Total steps", "মোট ধাপ"),
    steps: t("steps", "ধাপ"),
    result: t("result", "ফল"),
    calls: t("calls", "কল"),
    maxDepth: t("max depth", "সর্বোচ্চ গভীরতা"),
    tries: t("tries", "চেষ্টা"),
    backtracks: t("backtracks", "ব্যাকট্র্যাক"),
    solutions: t("solutions", "সমাধান"),
    sizeN: t("size", "সাইজ"),
    writes: t("writes", "লেখা"),
    spaceHint: t("space play · ←/→ step", "স্পেস প্লে · ←/→ ধাপ"),
    loading: t("loading…", "লোড হচ্ছে…"),
    stepBack: t("Step back", "পেছনে"),
    stepFwd: t("Step forward", "সামনে"),
    toLight: t("Light mode", "লাইট মোড"),
    toDark: t("Dark mode", "ডার্ক মোড"),
    openTopics: t("= Index", "= সূচি"),
    closeTopics: t("Close topics index", "সূচি বন্ধ করো"),
    openTopicsLabel: t("Open topics index", "টপিক সূচি খোলো"),
    allTopics: t("All topics", "সব টপিক"),
    errTarget: t("Target must be an integer 1–99.", "টার্গেট ১–৯৯ পূর্ণসংখ্যা হতে হবে।"),
    errTarget198: t("Target must be an integer 2–198.", "টার্গেট ২–১৯৮ পূর্ণসংখ্যা হতে হবে।"),
    errArray: t("3–30 unique integers, each 1–99.", "৩–৩০টি আলাদা পূর্ণসংখ্যা, প্রতিটি ১–৯৯।"),
    errNumbers: t("3–50 numbers, each 1–200.", "৩–৫০টি সংখ্যা, প্রতিটি ১–২০০।"),
    errArr2: t("2–16 unique integers, each 1–99.", "২–১৬টি আলাদা পূর্ণসংখ্যা, প্রতিটি ১–৯৯।"),
    errArrTP: t("3–24 integers, each 1–99.", "৩–২৪টি পূর্ণসংখ্যা, প্রতিটি ১–৯৯।"),
    errIdx: t("Index out of range.", "ইনডেক্স সীমার বাইরে।"),
    errVal: t("Value must be an integer 1–99.", "মান ১–৯৯ পূর্ণসংখ্যা হতে হবে।"),
    errFull: t("Array full (max 16) — delete something first.", "অ্যারে ভর্তি (সর্বোচ্চ ১৬) — আগে কিছু মুছো।"),
    errEmpty: t("Array is empty.", "অ্যারে খালি।"),
    errRev: t("Need at least 2 elements.", "কমপক্ষে ২টা উপাদান লাগে।"),
    errK: t("k must be an integer 0–50.", "k ০–৫০ পূর্ণসংখ্যা হতে হবে।"),
    lgCompare: t("compare", "তুলনা"),
    lgSwap: t("swap / write", "অদলবদল"),
    lgSorted: t("sorted", "সাজানো"),
    lgIdle: t("idle", "স্থির"),
    lgChecking: t("checking", "পরীক্ষা"),
    lgFound: t("found", "মিলেছে"),
    lgElim: t("eliminated", "বাদ"),
    lgTrying: t("trying", "চেষ্টা"),
    lgAttacked: t("attacked", "আক্রান্ত"),
    lgSolution: t("solution", "সমাধান"),
    lgOnStack: t("on stack", "স্ট্যাকে"),
    lgReturned: t("returned", "ফিরেছে"),
    lgWaiting: t("waiting", "অপেক্ষা"),
    lgPointers: t("pointers", "পয়েন্টার"),
    lgKept: t("found/kept", "মিলেছে"),
    lgShifting: t("shifting", "সরানো"),
    lgMoving: t("moving", "নড়ছে"),
    lgPlaced: t("placed", "বসানো"),
    lgWindow: t("window", "উইন্ডো"),
    lgBest: t("best", "সেরা"),
    swFixed: t("Fixed", "ফিক্সড"),
    swVar: t("Variable", "ভেরিয়েবল"),
    winW: t("window", "উইন্ডো"),
    opsW: t("ops", "অপারেশন"),
    queryW: t("Query", "প্রশ্ন"),
    rangeW: t("range", "রেঞ্জ"),
    textW: t("text", "টেক্সট"),
    patW: t("pattern", "প্যাটার্ন"),
    phaseW: t("phase", "পর্ব"),
    absentW: t("absent", "নেই"),
    hashHits: t("hash hits", "হ্যাশ হিট"),
    spurW: t("spurious", "ভুয়া"),
    sumW: t("sum", "যোগফল"),
    areaW: t("area", "ক্ষেত্রফল"),
    bestW: t("best", "সেরা"),
    autoSort: t("array auto-sorted (needs sorted input)", "অ্যারে auto-sorted (সাজানো লাগে)"),
    legendNote: t("L = low, H = high, M = mid/probe — greyed cells are eliminated", "L = low, H = high, M = mid/probe — ধূসর সেল বাদ"),
    depthW: t("depth", "গভীরতা"),
    emptyStack: t("stack empty — all calls returned", "স্ট্যাক খালি — সব কল ফিরেছে"),
    running: t("running", "চলছে"),
    waiting: t("waiting", "অপেক্ষা"),
    foundSol: t("Found solutions", "পাওয়া সমাধান"),
    tricks: t("Classic tricks", "পরিচিত কৌশল"),
    tipBits: t("tip: click any A/B bit to flip it", "টিপ: A/B বিটে ক্লিক করে উল্টাও"),
    chainNote: t("Set parameters and hit Run — ops chain on the result.", "প্যারামিটার দিয়ে Run চাপো — op গুলো ফলাফলের উপর চলবে।"),
    emptyArr: t("empty array — insert something", "খালি অ্যারে — কিছু বসাও"),
    pow2: t("power of two?", "পাওয়ার অফ টু?"),
    yesW: t("yes", "হ্যাঁ"),
    noW: t("no", "না"),
    setBits: t("set bits", "সেট বিট"),
    lowBit: t("lowest set bit", "সর্বনিম্ন সেট বিট"),
    clearLowBit: t("clear lowest bit", "সর্বনিম্ন বিট মুছো"),
    indexW: t("index", "ইনডেক্স"),
    valueW: t("value", "মান"),
    opAppend: t("Append", "শেষে বসাও"),
    opPrepend: t("Prepend", "শুরুতে বসাও"),
    opInsert: t("Insert", "ঢুকাও"),
    opDelete: t("Delete", "মুছো"),
    opReverse: t("Reverse", "উল্টাও"),
    opDetect: t("Detect", "শনাক্ত করো"),
    headW: t("head", "হেড"),
    cycAt: t("cycle at", "সাইকেল"),
    tabMiddle: t("Middle", "মাঝখান"),
    tabNth: t("Nth from end", "শেষ থেকে nতম"),
    lgRelaxed: t("relaxed", "শিথিল"),
    relaxW: t("relaxations", "শিথিলকরণ"),
    mstEdges: t("MST edges", "MST এজ"),
    costW: t("cost", "খরচ"),
    lgOpen: t("open", "খোলা"),
    lgClosed: t("closed", "বন্ধ"),
    pass1: t("pass 1 · finish order", "পাস ১ · ফিনিশ ক্রম"),
    pass2: t("pass 2 · reversed", "পাস ২ · উল্টো"),
    sccsW: t("SCCs", "SCC"),
    lgGray: t("gray = on stack", "ধূসর = স্ট্যাকে"),
    lgBlack: t("black = done", "কালো = শেষ"),
    lgBack: t("back edge", "ব্যাক এজ"),
    cycYes: t("cycle!", "চক্র!"),
    cycNo: t("acyclic", "চক্রহীন"),
    lgCol0: t("color 0", "রং ০"),
    lgCol1: t("color 1", "রং ১"),
    lgConflict: t("conflict", "সংঘাত"),
    lgRoot: t("root", "রুট"),
    lgChild: t("child", "সন্তান"),
    lgFindPath: t("find path", "খোঁজার পথ"),
    setsW: t("sets", "সেট"),
    fwVia: t("via k", "k হয়ে"),
    negCyc: t("negative cycle", "ঋণাত্মক চক্র"),
    bipYes: t("bipartite ✓", "bipartite ✓"),
    bipNo: t("not bipartite ✗", "bipartite নয় ✗"),
    repMH: t("adjacency matrix — click a row", "অ্যাডজাসেন্সি ম্যাট্রিক্স — সারিতে ক্লিক করো"),
    repLH: t("adjacency list", "অ্যাডজাসেন্সি লিস্ট"),
    picW: t("picture", "ছবি"),
    repM: t("answers “edge?” in O(1) but costs O(V²) space.", "O(1)-এ “এজ?” বলে, কিন্তু O(V²) জায়গা নেয়।"),
    repL: t("walks neighbors in O(degree) and sips space: O(V + E).", "প্রতিবেশী ঘোরে O(degree)-তে, জায়গা O(V + E)।"),
    practiceH: t("Classic problems", "ক্লাসিক সমস্যা"),
    lvlEasy: t("Easy", "সহজ"),
    lvlMedium: t("Medium", "মাঝারি"),
    lvlHard: t("Hard", "কঠিন"),
    firstIter: t("First iteration? Skip Hard — master Easy, then return.", "প্রথমবার? Hard বাদ দাও — Easy পোক্ত করো, তারপর ফিরে এসো।"),
    editEdges: t("Edit edges", "এজ বদলাও"),
    editHint: t("Click a vertex, then another, to toggle the edge. Click empty space to add one. Select + delete removes.", "একটা শীর্ষে, তারপর আরেকটায় ক্লিক — এজ বদলাবে। খালি জায়গায় ক্লিকে নতুন শীর্ষ।"),
    viewGrid: t("Grid", "গ্রিড"),
    viewTree: t("Tree", "ট্রি"),
    viewGraph: t("Graph", "গ্রাফ"),
    resetGraph: t("Reset graph", "গ্রাফ রিসেট"),
    delNode: t("Delete node", "নোড মুছো"),
    wallW: t("wall", "দেয়াল"),
    eraseW: t("erase", "মুছো"),
    startW: t("start", "শুরু"),
    endW: t("end", "শেষ"),
    wallsW: t("walls", "দেয়াল"),
    mazeW: t("Maze", "গোলকধাঁধা"),
    visitedW: t("visited", "দেখা"),
    pathW: t("path", "পথ"),
    lgWall: t("wall", "দেয়াল"),
    lgFrontier: t("frontier", "সীমানা"),
    lgVisited: t("visited", "দেখা"),
    lgPath: t("path", "পথ"),
    circOff: t("linear", "সরল"),
    circOn: t("circular", "গোলাকার"),
    opPush: t("Push", "পুশ"),
    opPop: t("Pop", "পপ"),
    opPeek: t("Peek", "পিক"),
    opEnq: t("Enqueue", "এনকিউ"),
    opDeq: t("Dequeue", "ডিকিউ"),
    opFront: t("Front", "ফ্রন্ট"),
    topW: t("top", "টপ"),
    frontW: t("front", "ফ্রন্ট"),
    tabStack: t("Stack", "স্ট্যাক"),
    tabQueue: t("Queue", "কিউ"),
    tabParen: t("Brackets", "ব্র্যাকেট"),
    exprW: t("expression", "এক্সপ্রেশন"),
    balW: t("balanced", "ভারসাম্যপূর্ণ"),
    unbalW: t("unbalanced", "ভারসাম্যহীন"),
    errStackEmpty: t("Stack is empty.", "স্ট্যাক খালি।"),
    errQueueEmpty: t("Queue is empty.", "কিউ খালি।"),
    errVal099: t("Value must be an integer 0–99.", "মান ০–৯৯ পূর্ণসংখ্যা হতে হবে।"),
    errFull10: t("Max 10 items — remove something first.", "সর্বোচ্চ ১০টা — আগে কিছু সরাও।"),
    errParen: t("Use brackets ()[]{} only, max 24 chars.", "শুধু ()[]{} ব্র্যাকেট, সর্বোচ্চ ২৪ অক্ষর।"),
    chartH: t("Operations vs input size", "অপারেশন বনাম ইনপুট সাইজ"),
    logAxis: t("(log y-axis)", "(লগ y-অক্ষ)"),
  },
  complexity: {
    cheatH: t("Cheat sheet", "চিট শিট"),
    thC: t("Complexity", "কমপ্লেক্সিটি"),
    thEx: t("Example", "উদাহরণ"),
    thV: t("Verdict", "রায়"),
    thName: t("Name", "নাম"),
    opsAt: t("Ops at n=", "n= এ অপস"),
    vsN: t("× vs O(n)", "× বনাম O(n)"),
    verdicts: {
      excellent: t("excellent", "চমৎকার"),
      good: t("good", "ভালো"),
      fair: t("fair", "মোটামুটি"),
      bad: t("bad", "খারাপ"),
      horrible: t("horrible", "ভয়াবহ"),
    } as Record<string, Text>,
    examples: [
      t("HashMap lookup, array index", "HashMap লুকআপ, অ্যারে ইনডেক্স"),
      t("Binary search, heap ops", "বাইনারি সার্চ, হিপ অপারেশন"),
      t("Single scan, linear search", "একবার স্ক্যান, লিনিয়ার সার্চ"),
      t("Merge / quick sort", "মার্জ / কুইক সর্ট"),
      t("Nested loops, bubble sort", "নেস্টেড লুপ, বাবল সর্ট"),
      t("Naive recursion (fib)", "সরল রিকার্শন (fib)"),
      t("Brute-force permutations", "ব্রুট-ফোর্স পারমুটেশন"),
    ],
    cards: [
      { t: t("Best / Avg / Worst", "বেস্ট / গড় / ওয়ার্স্ট"), d: t("Binary search is O(1) best-case, O(log n) worst-case. Quicksort degrades to O(n²) — always check the worst case.", "বাইনারি সার্চ বেস্ট-কেসে O(1), ওয়ার্স্ট-কেসে O(log n)। কুইকসর্ট O(n²) হতে পারে — সবসময় ওয়ার্স্ট কেস দেখো।") },
      { t: t("Time vs Space", "টাইম বনাম স্পেস"), d: t("Memoization trades memory for speed. Make that trade-off a conscious choice.", "মেমোইজেশন মেমরি দিয়ে গতি কেনে। এই লেনদেন সচেতনভাবে করো।") },
      { t: t("Drop constants", "ধ্রুবক বাদ দাও"), d: t("O(2n) = O(n). As n grows, constants stop mattering — only the growth shape counts.", "O(2n) = O(n)। n বড় হলে ধ্রুবক অপ্রাসঙ্গিক — গ্রোথের আকারই আসল।") },
    ],
  },
  recursion: {
    cards: [
      { t: t("Base case", "বেস কেস"), d: t("The exit door. Without it, calls pile up until the stack overflows.", "বেরোনোর দরজা। এটা না থাকলে কল জমতে জমতে স্ট্যাক ওভারফ্লো।") },
      { t: t("Recursive case", "রিকার্সিভ কেস"), d: t("Solve a smaller copy of the same problem, then combine.", "একই সমস্যার ছোট কপি সমাধান করো, তারপর জোড়া দাও।") },
      { t: t("Stack depth", "স্ট্যাক গভীরতা"), d: t("Factorial(10) nests 10 deep. Fibonacci branches — count how fast calls multiply.", "Factorial(10) ১০ গভীরে বাসা বাঁধে। Fibonacci ডালপালা ছড়ায় — কল কত দ্রুত বাড়ে গুনো।") },
    ],
  },
  backtrack: {
    cards: [
      { t: t("Choose", "বাছো"), d: t("Place a queen where no other queen attacks. One per row keeps it simple.", "যেখানে অন্য কুইন আক্রমণ করে না সেখানে কুইন বসাও। প্রতি সারিতে একটা — সহজ।") },
      { t: t("Explore", "ঘুরে দেখো"), d: t("Recurse to the next row. The future decides if this choice survives.", "পরের সারিতে recurse করো। ভবিষ্যৎ ঠিক করবে এই পছন্দ টিকবে কিনা।") },
      { t: t("Unchoose", "ফিরিয়ে নাও"), d: t("Dead end? Remove the queen and try the next column. That undo is backtracking.", "dead end? কুইন সরিয়ে পরের কলাম চেষ্টা করো। এই undo-ই ব্যাকট্র্যাকিং।") },
    ],
  },
  bit: {
    cards: [
      { t: t("Masks", "মাস্ক"), d: t("AND with 1 isolates a bit; OR with 1 sets it; XOR with 1 flips it.", "1 দিয়ে AND করলে বিট আলাদা হয়; OR দিলে সেট হয়; XOR দিলে উল্টায়।") },
      { t: t("Shifts", "শিফট"), d: t("<< k multiplies by 2^k. >> k divides. Bits that fall off are gone.", "<< k মানে 2^k দিয়ে গুণ। >> k মানে ভাগ। পড়ে যাওয়া বিট হারিয়ে যায়।") },
      { t: t("Two's complement", "টু'স কমপ্লিমেন্ট"), d: t("Negative numbers flip all bits and add 1 — that is why x & −x finds the lowest set bit.", "ঋণাত্মক সংখ্যা সব বিট উল্টে ১ যোগ করে — তাই x & −x সর্বনিম্ন সেট বিট খুঁজে পায়।") },
    ],
  },
  placeholder: {
    badge: t("spec locked — visualization in build queue", "স্পেক তৈরি — ভিজ্যুয়ালাইজেশন লাইনে আছে"),
    whatH: t("This page will have:", "এই পেজে থাকবে:"),
    items: [
      t("Interactive animation with Play / Pause / Speed", "Play / Pause / Speed সহ ইন্টারঅ্যাক্টিভ অ্যানিমেশন"),
      t("Step-by-step pseudocode highlight", "ধাপে ধাপে সিউডোকোড হাইলাইট"),
      t("Custom input to test your own example", "নিজের উদাহরণ পরীক্ষার জন্য কাস্টম ইনপুট"),
      t("Bangla + English explanation", "বাংলা + English ব্যাখ্যা"),
    ],
    cta1: t("Open Sorting visualizer →", "সর্টিং ভিজ্যুয়ালাইজার খোলো →"),
    cta2: t("Back home", "হোমে ফিরো"),
  },
  dsIndex: {
    overline: t("Data Structures — MVP", "ডেটা স্ট্রাকচার — MVP"),
    title: "Structures",
    intro: t(
      "How data is organized — and what each layout costs. Pick a structure to step through it.",
      "ডেটা কীভাবে সাজানো থাকে — আর প্রতিটা সাজানোর খরচ কত। স্ট্রাকচার বেছে ধাপে ধাপে দেখো।"
    ),
    live: t("live", "লাইভ"),
  },
  graphIndex: {
    overline: t("Graphs — MVP → P4", "গ্রাফ — MVP → P4"),
    title: "Graphs",
    intro: t(
      "Traversal, shortest paths, spanning trees — on grids you can watch. BFS/DFS first, rest in phase order.",
      "ট্রাভার্সাল, শর্টেস্ট পাথ, স্প্যানিং ট্রি — গ্রিডে দেখো। আগে BFS/DFS, বাকিগুলো ধাপে ধাপে।"
    ),
    live: t("live", "লাইভ"),
  },
};
