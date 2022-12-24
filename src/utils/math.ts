export function leastCommonMultiple(min: number, max: number) {
  function range(min: number, max: number) {
    const arr = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }

  function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a: number, b: number) {
    return (a * b) / gcd(a, b);
  }

  let multiple = min;
  range(min, max).forEach(function (n) {
    multiple = lcm(multiple, n);
  });

  return multiple;
}
