<script setup lang="ts">
import { ref, defineEmits } from "vue";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import BaseInput from "./BaseInput.vue";
import { onKeyStroke } from "@vueuse/core";
import BaseOverlay from "./BaseOverlay.vue";

export type FieldType = "text" | "password" | "url" | "number";

export type FormField = {
  name: string;
  value: string;
  placeholder?: string;
  type?: FieldType;
};

const props = defineProps<{
  formData: Record<string, FormField>;
}>();

const emits = defineEmits({
  submit: (_formData: typeof props.formData) => (true),
  cancel: () => (true),
});

const modelValue = ref(props.formData);

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

const handleSubmit = () => {
  modelValue.value = clone(props.formData);
  emits("submit", modelValue.value);
  emits("cancel");
};

onKeyStroke("Escape", () => emits("cancel"));
</script>

<template>
  <base-overlay @close="emits('cancel')">
    <form
      class="bg-surface-800 rounded-16px border-solid border-1px border-surface-500 flex flex-col p-2 gap-4 min-w-[400px]"
      @submit.prevent="handleSubmit"
    >
      <div
        v-for="(field, key) in formData"
        :key="key"
        class="flex-col flex gap-2 w-full"
      >
        <label for="fname">{{ field.name }}</label>
        <base-input
          v-model="field.value"
          :type="field.type"
          :name="key"
          class="max-w-full"
          :placeholder="field.placeholder || field.name"
        />
      </div>

      <div class="flex gap-2 w-full">
        <button-input
          class="w-full"
          :text="$t('form.cancel')"
          icon="ic:twotone-close"
          @click="emits('cancel')"
        />

        <button-input
          class="w-full"
          type="submit"
          :text="$t('form.submit')"
          icon="ic:twotone-check"
        />
      </div>
    </form>
  </base-overlay>
</template>

<style scoped lang="postcss">

</style>
