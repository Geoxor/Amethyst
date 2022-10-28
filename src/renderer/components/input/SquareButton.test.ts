import MagnetIcon from '@/icons/plumpy/MagnetIcon.vue';
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { markRaw } from "vue";
import SquareButton from "./SquareButton.vue";

describe("SquareButton.vue", () => {
  it("should render", () => {
    const mounted = mount(SquareButton, { props: { active: false } });
    expect(mounted.isVisible()).toBeTruthy()
  });

  it("should render with an icon if given one", () => {
    const mounted = mount(SquareButton, { props: { icon: markRaw(MagnetIcon), active: false } });
    expect(mounted.element.children[0] instanceof SVGElement).toBeTruthy()
  });

  it("should not have active class if not active", () => {
    const mounted = mount(SquareButton, { props: { active: false } });
    expect(mounted.element.classList.contains('active')).to.not.toBeTruthy()
  });

  it("should have active class if active", () => {
    const mounted = mount(SquareButton, { props: { active: true } });
    expect(mounted.element.classList.contains('active')).toBeTruthy()
  });
});