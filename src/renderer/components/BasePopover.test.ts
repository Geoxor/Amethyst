import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import BasePopover from "./BasePopover.vue";

test("BasePopover.vue", async () => {
  const result = render(BasePopover, {
    props: { open: true },
    slots: {
      default: "This is a popover",
    },
  });
  await expect.element(result.getByText("This is a popover").element().parentElement).toBeInTheDocument();
});
