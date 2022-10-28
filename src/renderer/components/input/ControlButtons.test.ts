import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ControlButtons from "./ControlButtons.vue";

describe("ControlButtons.vue", () => {
  const mounted = mount(ControlButtons, { props: { isMaximized: false } });

  it("should render", () => {
    expect(mounted.isVisible()).toBeTruthy()
  });

  it("should have svg icons in every button", () => {
    Array.from(mounted.element.children).forEach(button => {
      expect(button.children[0] instanceof SVGElement).toEqual(true);
    });
  });
});