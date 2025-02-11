<template>
  <ion-row>
    <ion-col size="12" size-sm="3">
      <ion-input label="Outline input" labelPlacement="floating" fill="outline" placeholder="Platform Name"></ion-input>
    </ion-col>
    <ion-col size="12" size-sm="4">
      <ion-input label="Outline input" labelPlacement="floating" fill="outline" placeholder="Receiving Store URL"></ion-input>
    </ion-col>
    <ion-col size="12" size-sm="3">
      <ion-input label="Outline input" labelPlacement="floating" fill="outline" placeholder="Auth Key"></ion-input>
    </ion-col>
    <ion-col size="12" size-sm="2">
      <ion-button class="ion-float-end">
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
    </ion-col>
  </ion-row>
</template>

<script>
import { pencil, save } from 'ionicons/icons';
import { reactive, toRefs } from '@vue/reactivity';
export default {
  name: 'WebhookItem',
  props: {
    platformName: String,
    receivingStoreUrl: String,
    authKey: String,
    isNew: Boolean
  },
  setup() {
    const state = reactive({
      isSaving: false,
      isEditing: false,
      errorMsg:""
    });
    return { ...toRefs(state), pencil, save };
  },
}
</script>

<style>

</style>