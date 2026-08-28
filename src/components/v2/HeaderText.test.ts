import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import HeaderText from "./HeaderText.vue";

test("HeaderText", async () => {
  const { getByText } = render(HeaderText, {
    props: { text: "heading text" },
  });
  await expect.element(getByText("heading text")).toBeInTheDocument();
});
