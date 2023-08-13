/**
 * Utility function to remove escaped characters from a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The stripped string without escaped characters.
 */
function stripEscapedCharacters(str: string): string {
  const escapedCharsRegex = /\r?\n|\r|\t/gim;
  const strippedString = str.replace(escapedCharsRegex, "").trim();
  return strippedString;
}

/**
 * Clamp a number between a minimum and maximum value.
 *
 * @param {number} num - The number to be clamped.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The clamped number.
 */
const clamp = (num = 0, min = 0, max = 0) => Math.min(Math.max(num, min), max);

type Style = "border" | "padding";
type Pos = "top" | "left" | "right" | "bottom";

type CamelCase<K extends string> = K extends `${infer L}-${infer R}`
  ? `${Lowercase<L>}${Capitalize<R>}`
  : K;

type PosStyle = `${Style}-${Pos}`;

/**
 * Get the computed style of a specific CSS property for a given element.
 *
 * @param {React.MutableRefObject<HTMLElement | null>} elementRef - The React ref object that points to the target element.
 * @param {string} property - The CSS property to get the computed style for. Accepted values are: "borderTop" | "borderLeft" | "borderRight" | "borderBottom" | "paddingTop" | "paddingLeft" | "paddingRight" | "paddingBottom"
 * @returns {number} The computed style value as a number, or 0 if the element is not found or the property is not valid.
 */
const getElementComputedStyles = (
  elementRef: React.MutableRefObject<HTMLElement | null>,
  property: CamelCase<PosStyle>
) => {
  if (elementRef.current) {
    const computedStyle = window.getComputedStyle(elementRef.current);

    return parseFloat(computedStyle[property] || "0");
  }

  return 0;
};

export { stripEscapedCharacters, clamp, getElementComputedStyles };
