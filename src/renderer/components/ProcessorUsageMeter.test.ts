import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProcessorUsageMeter from "./ProcessorUsageMeter.vue";

describe.concurrent("ProcessorUsageMeter.vue", () => {
  it("should render", () => {
    const mounted = mount(ProcessorUsageMeter, { props: { value: 50 } });
    expect(mounted.isVisible()).toBeTruthy();
  });

  it("should display 50% with value 50", () => {
    const mounted = mount(ProcessorUsageMeter, { props: { value: 50 } });
    expect(((mounted.element as HTMLInputElement).innerText.trim())).toEqual("50%");
  });

  it("should have 50% filled background", () => {
    const mounted = mount(ProcessorUsageMeter, { props: { value: 50 } });
    const bg = mounted.element.getElementsByClassName("background")[0] as HTMLDivElement;
    expect(bg.style.width).toEqual("50%");
  });
});