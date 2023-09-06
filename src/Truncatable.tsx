import "./index.css";

import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";

import {
  clamp,
  getElementComputedStyles,
  stripEscapedCharacters,
} from "./utils";

export interface ToggleProps {
  showAll: boolean;
  toggle: () => void;
  togglerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

/**
 * Truncatable component props.
 *
 * @template T - React element type.
 * @property {string} content - The content to be truncated.
 * @property {number} [charsLimit] - The maximum number of characters to show.
 * @property {number} [offset] - Remove some extra characters
 * @property {T} [as] - The HTML element  to render as the parent.
 *                      Default value: "p"
 * @property {({ showAll, toggle, togglerRef }: ToggleProps) => React.ReactNode} [renderToggleButton]
 *   - A function that renders a custom toggle button for showing/hiding the truncated content.
 *   - The function receives an object with properties `showAll` (boolean) and `toggle` (function).
 *   - `showAll` is a boolean indicating whether all content is currently shown.
 *   - `toggle` is a function that can be called to toggle between showing all content and truncating it.
 *   - `togglerRef` is a ref to the rendered toggler
 *   - It should return the React node representing the custom toggle button.
 */
interface Props<T extends React.ElementType> {
  content: string;
  charsLimit?: number;
  offset?: number;
  as?: T;
  renderToggleButton?: ({ showAll, toggle }: ToggleProps) => React.ReactNode;
}

/**
 * Props type for the Truncatable component.
 */
export type TruncatableProps<T extends React.ElementType> = Props<T> &
  Omit<ComponentPropsWithoutRef<T>, "children" & keyof Props<T>>;

/**
 * Custom hook that uses `useLayoutEffect` on the client and `useEffect` on the server.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Truncate text based on the available space.
 * @template T - React element type.
 * @param {TruncatableProps<T>} props - The component props.
 * @returns {JSX.Element} The html element with the truncated content.
 */
const Truncatable = <T extends React.ElementType = "p">({
  as,
  content = "",
  charsLimit,
  className,
  renderToggleButton,
  offset = 0,
  ...rest
}: TruncatableProps<T>) => {
  const pRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const measureRef2 = useRef<HTMLSpanElement | null>(null);
  const togglerRef = useRef<HTMLButtonElement | null>(null);

  const [truncatedContent, setTruncatedContent] = useState("");
  const [showAll, setShowAll] = useState(false);

  const toggle = () => setShowAll((s) => !s);

  const handleResize = useCallback(() => {
    if (showAll) {
      return;
    }

    if (measureRef.current && pRef.current && measureRef2.current) {
      const { width, height } = pRef.current.getBoundingClientRect();

      const paddingLeft = getElementComputedStyles(pRef, "paddingLeft");

      const paddingRight = getElementComputedStyles(pRef, "paddingRight");

      const paddingTop = getElementComputedStyles(pRef, "paddingTop");

      const paddingBottom = getElementComputedStyles(pRef, "paddingBottom");

      const borderLeft = getElementComputedStyles(pRef, "borderLeft");

      const borderRight = getElementComputedStyles(pRef, "borderRight");

      const borderTop = getElementComputedStyles(pRef, "borderTop");

      const borderBottom = getElementComputedStyles(pRef, "borderBottom");

      const innerWidth =
        width - paddingLeft - paddingRight - borderLeft - borderRight;
      const innerHeight =
        height - paddingTop - paddingBottom - borderTop - borderBottom;

      let toggleElArea = 0;

      if (togglerRef.current) {
        const { width: tW, height: tH } =
          togglerRef.current.getBoundingClientRect();

        toggleElArea =
          (tW +
            getElementComputedStyles(togglerRef, "borderLeft") +
            getElementComputedStyles(togglerRef, "borderRight")) *
          (tH +
            getElementComputedStyles(togglerRef, "borderTop") +
            getElementComputedStyles(togglerRef, "borderBottom"));
      }

      const contentArea = innerWidth * innerHeight - toggleElArea;

      const { width: span1Width, height: span1Height } =
        measureRef.current.getBoundingClientRect();
      const { width: span2Width, height: span2Height } =
        measureRef2.current.getBoundingClientRect();
      const span1Area = span1Width * span1Height;
      const span2Area = span2Width * span2Height;
      const avgAreaOfOneChar = (span1Area + span2Area) / 2;

      const maxNumOfChars =
        (charsLimit
          ? Math.min(charsLimit, Math.floor(contentArea / avgAreaOfOneChar))
          : Math.floor(contentArea / avgAreaOfOneChar)) -
        clamp(offset, 0, Number.MAX_SAFE_INTEGER);

      if (content.length <= maxNumOfChars) {
        setTruncatedContent(stripEscapedCharacters(content));
      } else {
        setTruncatedContent(
          `${stripEscapedCharacters(content).slice(
            0,
            clamp(maxNumOfChars - 3, 0, Number.MAX_SAFE_INTEGER)
          )}...`
        );
      }
    }
  }, [content, charsLimit, showAll, offset]);

  useIsomorphicLayoutEffect(() => {
    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      if (pRef.current) {
        resizeObserver.observe(pRef.current);
      }
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const ParentTag = as || "p";

  return (
    <ParentTag
      className={`relative ${(className as string) || ""}`}
      ref={pRef}
      {...(rest as ComponentPropsWithoutRef<T>)}
    >
      {showAll ? content : truncatedContent}
      {renderToggleButton ? (
        renderToggleButton({ showAll, toggle, togglerRef })
      ) : (
        <></>
      )}
      <span
        ref={measureRef}
        className="absolute top-0 left-0 invisible inline-block w-auto h-auto  pointer-events-none -z-[1000000]"
      >
        W
      </span>
      <span
        ref={measureRef2}
        className="absolute top-0 left-0 invisible inline-block w-auto h-auto  pointer-events-none -z-[1000000]"
      >
        j
      </span>
    </ParentTag>
  );
};

export default Truncatable;
