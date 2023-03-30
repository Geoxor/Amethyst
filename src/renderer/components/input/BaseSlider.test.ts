import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Slider from "./BaseSlider.vue";

describe.concurrent("Slider.vue", () => {
  it("should render", () => {
    const mounted = mount(Slider, { props: { modelValue: 50 } });
    expect(mounted.isVisible()).toBeTruthy();
  });

  it("should have a value of 50", () => {
    const mounted = mount(Slider, { props: { modelValue: 50 } });
    expect(((mounted.element as HTMLInputElement).value)).toEqual("50");
  });

  it("should emit v-model update when changing value", () => {
    const mounted = mount(Slider, { props: { modelValue: 50 } });
    expect(((mounted.element as HTMLInputElement).value)).toEqual("50");
    mounted.setValue(25);
    expect(mounted.emitted()["update:modelValue"]).toBeTruthy();
  });
});