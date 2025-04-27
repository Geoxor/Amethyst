import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import ButtonInput from "./ButtonInput.vue";

test("ButtonInput", async () => {
  const { getByText } = render(ButtonInput, {
    props: { icon: "line-md:loading-twotone-loop", text: "press me!" },
  });
  await expect.element(getByText("press me!")).toBeInTheDocument();
});
