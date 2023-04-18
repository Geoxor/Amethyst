import { MagnetIcon } from "@/icons/material";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { markRaw } from "vue";
import BaseToolbarButton from "./BaseToolbarButton.vue";

describe.concurrent("BaseToolbarButton.vue", () => {
  it("should render", () => {
    const mounted = mount(BaseToolbarButton, { props: { active: false } });
    expect(mounted.isVisible()).toBeTruthy();
  });

  //  TODO: somehow needs to access the button within the tooltip to test for these
  // it("should render with an icon if given one", () => {
  //   const mounted = mount(BaseToolbarButton, { props: { icon: markRaw(MagnetIcon), active: false } });
  //   expect(mounted.element.children[0] instanceof SVGElement).toBeTruthy();
  // });

  // it("should not have active class if not active", () => {
  //   const mounted = mount(BaseToolbarButton, { props: { active: false } });
  //   expect(mounted.element.classList.contains("active")).to.not.toBeTruthy();
  // });

  // it("should have active class if active", () => {
  //   const mounted = mount(BaseToolbarButton, { props: { active: true } });
  //   expect(mounted.element.classList.contains("active")).toBeTruthy();
  // });
});