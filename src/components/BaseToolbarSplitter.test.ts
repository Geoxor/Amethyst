import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import BaseToolbarSplitter from "./BaseToolbarSplitter.vue";

test("BaseToolbarSplitter.vue", async () => {
  const result = render(BaseToolbarSplitter);
  await expect.element(result.baseElement).toBeInTheDocument();
});
