import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import BaseChip from "./BaseChip.vue";

test("BaseChip.vue", async () => {
  const result = render(BaseChip, {
    props: { icon: "line-md:loading-twotone-loop", color: "#ff00b6" },
    slots: {
      default: "chip content",
    },
  });
  await expect.element(result.getByText("chip content").element().parentElement).toBeInTheDocument();
});
