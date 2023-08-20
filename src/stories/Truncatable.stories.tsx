import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import Truncatable from "../Truncatable";

const textString = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quae quas fugit repudiandae. A cumque dicta expedita, omnis ex voluptatibus eum quaerat ipsum molestiae id qui cum saepe labore inventore voluptas ipsam necessitatibus mollitia. Libero eum aliquam officiis sit reiciendis nihil hic suscipit delectus doloremque doloribus magnam, eligendi sequi!`;

const meta: Meta<typeof Truncatable> = {
  component: Truncatable,
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: "text",
      description: "The string to be truncated (and escaped)",
      type: { required: true, name: "string" },
      table: {
        defaultValue: {
          summary: textString,
        },
      },
    },
    as: {
      description:
        "HTML Element that will render the truncated (and escaped) string. When this is set, you can pass other props that are native to the element. For inline elements, you may need to add additional styling eg making them block, adding width/height etc",

      table: {
        defaultValue: { summary: "p" },
      },
    },
    className: {
      description:
        "CSS class for styling.",
      table: {
        defaultValue: { summary: "relative" },
      },
    },
    style: {
      description: "Style object.",
    },
    charsLimit: {
      description:
        "The maximum number of charcaters allowed. It included the ellipsis(...)",
    },
    offset: {
      description: "Number of extra characters to remove",
    },
    renderToggleButton: {
      description:
        "A function that returns a ReactNode. The rendered element hass access to 'showAll': a boolean that indicates if all the content is showing, 'toggle': a function to toggle show state,  'togglerRef': a ref to help calculate the truncation ",
    },
    ["...o"]
  },
};

export default meta;
type Story = StoryObj<typeof Truncatable>;

export const Basic: Story = {
  args: {
    content: textString,
  },
};

export const WithCustomTogglerButton: Story = {
  render: () => (
    <Truncatable
      content={textString}
      renderToggleButton={({ showAll, toggle, togglerRef }) => (
        <button
          className="p-1 px-2 ml-1 bg-rose-500 rounded-md text-white text-sm"
          onClick={toggle}
          ref={togglerRef}
        >
          {showAll ? "Hide" : "Show all"}
        </button>
      )}
    />
  ),
};

export const LimitCharacterCount: Story = {
  args: {
    content: textString,
    charsLimit: 10,
  },
};

export const RemoveMoreCharacters: Story = {
  args: {
    content: textString,
    offset: 10,
  },
};

export const WithCustomClassNameAndStyle: Story = {
  args: {
    content: textString,
    className: "w-1/3 h-[90px] rounded-md p-3",
    style: {
      backgroundColor: "coral",
      color: "black",
    },
  },
};

export const AsALink: Story = {
  args: {
    content: textString,
    as: "a",
    href: "https://en.wikipedia.org/wiki/Lorem_ipsum",
    target: "_blank",
    className: "inline-block w-[70px]",
  },
};
