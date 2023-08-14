import { clamp, stripEscapedCharacters } from "../utils";

import { expect, test } from "vitest";

test("A number [20] is clamped between 0 and 10 as 10", () => {
  expect(clamp(20, 0, 10)).toBe(10);
});

test("A number [-6] is clamped between 0 and 10 as 0", () => {
  expect(clamp(-6, 0, 10)).toBe(0);
});

test("That escaped characters are removed from a string", () => {
  expect(
    stripEscapedCharacters(
      `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quae quas fugit repudiandae. A\ncumque d\ticta expedita, omnis ex volup\rtatibus eum quaerat ipsum molestiae id qui`
    )
  ).toEqual(
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quae quas fugit repudiandae. Acumque dicta expedita, omnis ex voluptatibus eum quaerat ipsum molestiae id qui`
  );
});
