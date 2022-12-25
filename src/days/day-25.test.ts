import { describe, expect, it } from '@jest/globals';
import Day, { decimalToSnafu, snafuToDecimal } from './day-25';
import { dayRunner } from './test-util';

const example = `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`.trim();

/*
 SNAFU  Decimal
1=-0-2     1747
 12111      906
  2=0=      198
    21       11
  2=01      201
   111       31
 20012     1257
   112       32
 1=-1=      353
  1-12      107
    12        7
    1=        3
   122       37
   */

describe.each([
  ['1=-0-2', 1747],
  ['12111', 906],
  ['2=0=', 198],
  ['21', 11],
  ['2=01', 201],
  ['111', 31],
  ['20012', 1257],
  ['112', 32],
  ['1=-1=', 353],
  ['1-12', 107],
  ['12', 7],
  ['1=', 3],
  ['122', 37],
])('%s <> %i', (snafu, decimal) => {
  it('snafuToDecimal', () => {
    expect(snafuToDecimal(snafu)).toStrictEqual(decimal);
  });

  it('decimalToSnafu', () => {
    expect(decimalToSnafu(decimal)).toStrictEqual(snafu);
  });
});

dayRunner(Day, example, '2=-1=0');
