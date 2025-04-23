import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import BaseToolbar from "./BaseToolbar.vue";

test("BaseToolbar.vue", async () => {
  const result = render(BaseToolbar, {
    props: { open: true },
    slots: {
      default: "Toolbar content",
    },
  });
  await expect.element(result.getByText("Toolbar content").element().parentElement).toBeInTheDocument();
});
