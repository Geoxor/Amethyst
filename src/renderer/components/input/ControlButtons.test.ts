import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ControlButtons from "./ControlButtons.vue";

describe.concurrent("ControlButtons.vue", () => {
  const mounted = mount(ControlButtons, { props: { isMaximized: false } });

  it("should render", () => {
    expect(mounted.isVisible()).toBeTruthy();
  });

  it("should have svg icons in every button", () => {
    Array.from(mounted.element.children).forEach(button => {
      expect(button.children[0] instanceof SVGElement).toEqual(true);
    });
  });

  it("should emit close when close button clicked", () => {
    const mounted = mount(ControlButtons, { props: { isMaximized: false } });
    const button = mounted.element.getElementsByClassName("close")[0] as HTMLButtonElement;
    button.click();
    expect(mounted.emitted()["close"]).toBeTruthy();
  });

  it("should emit minimize when minimize button clicked when maximized", () => {
    const mounted = mount(ControlButtons, { props: { isMaximized: true } });
    const button = mounted.element.children[0] as HTMLButtonElement;
    button.click();
    expect(mounted.emitted()["minimize"]).toBeTruthy();
  });

  it("should emit maximize when maximize button clicked and not maximized", () => {
    const mounted = mount(ControlButtons, { props: { isMaximized: false } });
    const button = mounted.element.children[1] as HTMLButtonElement;
    button.click();
    expect(mounted.emitted()["maximize"]).toBeTruthy();
  });

  it("should emit unmaximize when unmaximize button clicked when maximized", () => {
    const mounted = mount(ControlButtons, { props: { isMaximized: true } });
    const button = mounted.element.children[1] as HTMLButtonElement;
    button.click();
    expect(mounted.emitted()["unmaximize"]).toBeTruthy();
  });

  it("should not render maximize button when maximized", () => {
    const mounted = mount(ControlButtons, { props: { isMaximized: true } });
    const button = mounted.element.getElementsByClassName("maximize");
    expect(button[0]).toBeFalsy();
  });

  it("should not render unmaximize button when unmaximized", () => {
    const mounted = mount(ControlButtons, { props: { isMaximized: false } });
    const button = mounted.element.getElementsByClassName("unmaximize");
    expect(button[0]).toBeFalsy();
  });

});