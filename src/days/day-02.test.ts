import { describe, expect, it } from '@jest/globals';
import Day, { Play, Result, result } from './day-02';
import { dayRunner } from './test-runner';

const example = `A Y
  B X
  C Z`;

dayRunner(Day, example, 15, 12);

describe('result', () => {
  Object.entries(Play).forEach(([name, p]) => {
    const play = p as Play;
    if (!isNaN(Number(name))) {
      return;
    }

    describe(name, () => {
      it('draw', () => {
        expect(result(play as Play, play as Play)).toBe(Result.Draw);
      });

      it('win', () => {
        let other;
        switch (play) {
          case Play.Paper:
            other = Play.Rock;
            break;
          case Play.Rock:
            other = Play.Scissor;
            break;
          case Play.Scissor:
            other = Play.Paper;
            break;
        }

        expect(result(play, other)).toBe(Result.Win);
      });

      it('loss', () => {
        let other;
        switch (play) {
          case Play.Paper:
            other = Play.Scissor;
            break;
          case Play.Rock:
            other = Play.Paper;
            break;
          case Play.Scissor:
            other = Play.Rock;
            break;
        }

        expect(result(play, other)).toBe(Result.Loss);
      });
    });
  });
});
