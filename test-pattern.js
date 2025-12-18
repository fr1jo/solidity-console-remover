// Quick test of the pattern matching
const pattern = /console\.log[A-Za-z]*\s*\(/;

const testLines = [
  'console.log("simple");',
  '    console.log("indented");',
  'console.log("final vault: ", IERC20(WETH).balanceOf(BEANSTALK));',
  'console.logInt(123);',
  'console.logUint(value);',
  '// console.log("commented");',
  'const x = 5; // no console here'
];

console.log('Testing pattern:', pattern.toString());
console.log('---');

testLines.forEach((line, i) => {
  const matches = pattern.test(line);
  console.log(`Line ${i}: ${matches ? '✓ MATCH' : '✗ NO MATCH'}`);
  console.log(`  "${line}"`);
});
