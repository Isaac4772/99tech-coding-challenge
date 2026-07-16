/**
 * Approach A: Iterative Loop
 * 
 * Computes the sum by linearly iterating from 1 to n.
 * 
 * @param n - The target positive integer.
 * @returns The sum of numbers from 1 to n.
 * 
 * @time $O(n)$ - Runtime scales linearly with the input size.
 * @space $O(1)$ - Uses a constant amount of extra memory.
 */
export const sum_to_n_a = (n: number): number => {
    if (n <= 0) {
        return 0;
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};


/**
 * Approach B: Recursive
 * 
 * Computes the sum using a recursive approach.
 * 
 * @param n - The target positive integer.
 * @returns The sum of numbers from 1 to n.
 * 
 * @time $O(n)$ - Runtime scales linearly with the input size.
 * @space $O(n)$ - Uses a linear amount of extra memory due to the call stack.
 */
export const sum_to_n_b = (n: number): number => {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_b(n - 1);
};

/**
 * Approach C: Mathematical Formula
 * 
 * Computes the sum using the formula n * (n + 1) / 2.
 * 
 * @param n - The target positive integer.
 * @returns The sum of numbers from 1 to n.
 * 
 * @time $O(1)$ - Constant time complexity regardless of input size.
 * @space $O(1)$ - Uses a constant amount of extra memory.
 */
export const sum_to_n_c = (n: number): number => {
    if (n <= 0) {
        return 0;
    }
    return (n * (n + 1)) / 2;
};
