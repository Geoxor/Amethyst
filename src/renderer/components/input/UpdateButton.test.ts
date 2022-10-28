import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import UpdateButton from "./UpdateButton.vue";

describe.concurrent("UpdateButton.vue", () => {
  it("should render", () => {
    const mounted = mount(UpdateButton);
    expect(mounted.isVisible()).toBeTruthy();
  });

  it("should say 'install update'", () => {
    const mounted = mount(UpdateButton);
    expect(((mounted.element as HTMLInputElement).innerText.trim())).toEqual("Install Update");
  });
});