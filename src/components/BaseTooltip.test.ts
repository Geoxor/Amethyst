import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import BaseTooltip from "./BaseTooltip.vue";

test("BaseTooltip.vue", async () => {
  const result = render(BaseTooltip, {
    props: { text: "tooltip text" },
    slots: {
      default: "tooltip content",
    },
  });
  await expect.element(result.getByText("tooltip text").element().parentElement).toBeInTheDocument();
});
