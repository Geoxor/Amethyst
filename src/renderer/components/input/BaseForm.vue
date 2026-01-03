<script setup lang="ts">
import { ref } from "vue";

interface UserForm {
  name: string;
  email: string;
  age: number | null;
}

const modelValue = defineModel<UserForm>();

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

const form = ref<UserForm>(clone(modelValue.value) || {
  name: "",
  email: "",
  age: null,
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label for="fname">First name:</label><br>
    <input
      id="fname"
      type="text"
      name="fname"
      value="John"
    ><br>
    <label for="lname">Last name:</label><br>
    <input
      id="lname"
      type="text"
      name="lname"
      value="Doe"
    ><br><br>
    <input type="submit" value="Submit">
  </form>
</template>

<style scoped lang="postcss">

</style>
