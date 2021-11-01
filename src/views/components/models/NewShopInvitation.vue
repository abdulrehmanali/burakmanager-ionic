<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>New Shop Invitation</ion-title>
      <ion-icon slot="end" :icon="closeOutline" class="close-model" v-on:click="closeModel()"></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" @keyup="email = $event.target.value"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size-md="6" size-sm="12">
          <ion-item>
            <ion-label>Create Entries In Ledger</ion-label>
            <ion-toggle
              v-model="can_create_entries_in_ledger"
              @ionChange="can_create_entries_in_ledger = $event.target.checked">
            </ion-toggle>
          </ion-item>
        </ion-col>
        <ion-col size-md="6" size-sm="12">
          <ion-item>
            <ion-label>Edit Entries In Ledger</ion-label>
            <ion-toggle
              v-model="can_edit_entries_in_ledger"
              @ionChange="can_edit_entries_in_ledger = $event.target.checked">
            </ion-toggle>
          </ion-item>
        </ion-col>
        </ion-row>
      <ion-row>
        <ion-col size-md="6" size-sm="12">
          <ion-item>
            <ion-label>Create Customers</ion-label>
            <ion-toggle
              v-model="can_create_customers"
              @ionChange="can_create_customers = $event.target.checked">
            </ion-toggle>
          </ion-item>
        </ion-col>
        <ion-col size-md="6" size-sm="12">
          <ion-item>
            <ion-label>Edit Customers</ion-label>
            <ion-toggle
              v-model="can_edit_customers"
              @ionChange="can_edit_customers = $event.target.checked">
            </ion-toggle>
          </ion-item>
        </ion-col>
        </ion-row>
      <ion-row>
        <ion-col size-md="6" size-sm="12">
          <ion-item>
            <ion-label>Create Products</ion-label>
            <ion-toggle
              v-model="can_create_products"
              @ionChange="can_create_products = $event.target.checked">
            </ion-toggle>
          </ion-item>
        </ion-col>
        <ion-col size-md="6" size-sm="12">
          <ion-item>
            <ion-label>Edit Products</ion-label>
            <ion-toggle
              v-model="can_edit_products"
              @ionChange="can_edit_products = $event.target.checked">
            </ion-toggle>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-button expand="block" v-on:click="onSaveClick()">Save</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar, IonToggle } from '@ionic/vue';
import { defineComponent, reactive, toRefs } from 'vue';
import { emitter } from "@/services/emitter";
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  name: 'NewShopInvitation',
  setup() {
    const state = reactive({
      email: "",
      'can_create_entries_in_ledger': false,
      'can_create_customers': false,
      'can_create_products': false,
      'can_edit_entries_in_ledger': false,
      'can_edit_customers': false,
      'can_edit_products': false,
    });
    const onSaveClick = () => {
      emitter.emit('add_new_invitation_model',state);
    }
    const closeModel = () =>{
      emitter.emit('close_new_invitation_model','');
    }
    const eventChange = (toggleValue)=>{
      console.log(toggleValue)
    }
    return { ...toRefs(state), eventChange, onSaveClick, closeModel, closeOutline};
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonToggle }
});
</script>
<style scoped>
.close-model {
  font-size: 40px;
}
</style>