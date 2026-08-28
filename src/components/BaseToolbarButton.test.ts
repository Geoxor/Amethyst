import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import BaseToolbarButton from "./BaseToolbarButton.vue";

test("BaseToolbarButton.vue", async () => {
  const result = render(BaseToolbarButton, {
    props: {
      tooltipText: "tooltip text",
      active: true,
      icon: "line-md:loading-twotone-loop",
      text: "toolbar text",
    },
  });
  await expect.element(result.baseElement).toBeInTheDocument();
});
