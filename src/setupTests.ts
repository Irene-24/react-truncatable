import "@testing-library/jest-dom";

import * as globalStorybookConfig from "../.storybook/preview";

import { setProjectAnnotations } from "@storybook/react";

setProjectAnnotations(globalStorybookConfig as unknown as never);
