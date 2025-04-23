import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import CoverArt from "./CoverArt.vue";

test("CoverArt.vue", async () => {
  const result = render(CoverArt, {
    props: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1024px-Cat_August_2010-4.jpg" },
  });
  await expect.element(result.getByAltText("Cover Art").element().parentElement).toBeInTheDocument();
});
