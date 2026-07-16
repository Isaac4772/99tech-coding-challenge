import { expect, test, describe } from "bun:test";
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum_to_n";

describe("sum_to_n", () => {
   describe("sum_to_n_a", () => {
      test("should return the correct sum for a positive integer", () => {
         expect(sum_to_n_a(5)).toBe(15);
         expect(sum_to_n_a(10)).toBe(55);
      });

      test("should return 0 for n = 0", () => {
         expect(sum_to_n_a(0)).toBe(0);
      });

      test("should return 0 for negative integers", () => {
         expect(sum_to_n_a(-5)).toBe(0);
         expect(sum_to_n_a(-10)).toBe(0);
      });

      test("should return the correct sum for large integers", () => {
         expect(sum_to_n_a(1000)).toBe(500500);
         expect(sum_to_n_a(10000)).toBe(50005000);
      });
   });
   
   describe("sum_to_n_b", () => {
      test("should return the correct sum for a positive integer", () => {
         expect(sum_to_n_b(5)).toBe(15);
         expect(sum_to_n_b(10)).toBe(55);
      });

      test("should return 0 for n = 0", () => {
         expect(sum_to_n_b(0)).toBe(0);
      });

      test("should return 0 for negative integers", () => {
         expect(sum_to_n_b(-5)).toBe(0);
         expect(sum_to_n_b(-10)).toBe(0);
      });

      test("should return the correct sum for large integers", () => {
         expect(sum_to_n_b(1000)).toBe(500500);
         expect(sum_to_n_b(10000)).toBe(50005000);
      });
   });

   describe("sum_to_n_c", () => {
      test("should return the correct sum for a positive integer", () => {
         expect(sum_to_n_c(5)).toBe(15);
         expect(sum_to_n_c(10)).toBe(55);
      });

      test("should return 0 for n = 0", () => {
         expect(sum_to_n_c(0)).toBe(0);
      });

      test("should return 0 for negative integers", () => {
         expect(sum_to_n_c(-5)).toBe(0);
         expect(sum_to_n_c(-10)).toBe(0);
      });

      test("should return the correct sum for large integers", () => {
         expect(sum_to_n_c(1000)).toBe(500500);
         expect(sum_to_n_c(10000)).toBe(50005000);
      });
   });
});
