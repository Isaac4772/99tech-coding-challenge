# Sum to N: Implementations & Complexity Analysis

3 unique implementations in TypeScript to calculate the sum of all integers from 1 to `n` by aumming the input always produces a result below `Number.MAX_SAFE_INTEGER`. 


Below is a detailed breakdown of each approach, comparing their efficiency, complexity, and real-world trade-offs.

---

## Performance Summary

| Implementation | Method | Time Complexity | Space Complexity | Practical Limits |
| :--- | :--- | :--- | :--- | :--- |
| `sum_to_n_a` | **Iterative Loop** | $O(n)$ | $O(1)$ | Safe for large $n$, but slower than formula |
| `sum_to_n_b` | **Recursion** | $O(n)$ | $O(n)$ | Can exceed the call stack on large $n$ in environments with limited recursion depth |
| `sum_to_n_c` | **Math Formula** | $O(1)$ | $O(1)$ | Optimal and fast; assumes the result stays below `Number.MAX_SAFE_INTEGER` |

---

## Detailed Breakdown

### 1. Approach A: Iterative Loop (`sum_to_n_a`)
This is the most straightforward, intuitive programming approach. It uses a simple `for` loop to accumulate the sum step-by-step.

* **Time Complexity:** $O(n)$: The loop executes exactly $n$ times, making the execution time grow linearly with the size of $n$.
* **Space Complexity:** $O(1)$: Only a single mutable variable (`sum`) is tracked in memory, regardless of how large $n$ gets.
* **Trade-offs:** Highly reliable and safe from memory-limit crashes, but computationally slow for exceptionally large numbers compared to a direct mathematical solution.

### 2. Approach B: Recursive Call Stack (`sum_to_n_b`)
This implementation breaks the problem down into smaller sub-problems recursively ($n + \text{sum}(n - 1)$) until it reaches the base case.

* **Time Complexity:** $O(n)$: The engine must execute $n$ recursive function calls to compute the final result.
* **Space Complexity:** $O(n)$: Every active function call must be preserved in the call stack. For a large value of $n$, this will exceed the engine's maximum call stack size limit and throw a `RangeError: Maximum call stack size exceeded`.
* **Trade-offs:** Elegant in terms of declarative code style, but highly impractical for production code due to the call stack overhead and risk of hitting recursion limits.

### 3. Approach C: Mathematical Formula (`sum_to_n_c`)
Utilizes the arithmetic progression formula established by Carl Friedrich Gauss:
$$\sum_{i=1}^{n} i = \frac{n(n + 1)}{2}$$

* **Time Complexity:** $O(1)$: The calculation completes in a fixed number of operations (one addition, one multiplication, one division) regardless of whether $n$ is $10$ or $10,000,000$.
* **Space Complexity:** $O(1)$: No extra memory allocations are made.
* **Trade-offs:** Extremely fast and highly optimal. Under the stated assumption that the result stays below `Number.MAX_SAFE_INTEGER`, this approach is effectively exact in JavaScript.