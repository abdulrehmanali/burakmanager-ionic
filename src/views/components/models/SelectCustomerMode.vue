<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Select Customer</ion-title>
      <ion-icon slot="end" :icon="closeOutline" class="close-model" v-on:click="closeModel()"></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
  <ion-searchbar></ion-searchbar>
  <ion-item v-if="loading">
    <ion-label>Loading...</ion-label>
    <ion-spinner slot="end"></ion-spinner>
  </ion-item>
  <ion-list>
    <ion-item
      v-for="customer in customers"
      :key="customer.email"
      v-on:click="()=>{onCustomerClick(customer)}"
    >
    <ion-label>
      <h2>{{ customer.name }}</h2>
      <h4>{{ customer.contactNumber }}</h4>
    </ion-label>
    </ion-item>
  </ion-list>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { db } from "@/main";
import { defineComponent, reactive, toRefs } from 'vue';
import { emitter } from "../../../services/emitter";
import { Storage } from '@ionic/storage';
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  name: 'SelectCustomerMode',
  setup() {
    const store = new Storage();
    const state = reactive({
      loading: true,
      customers: [],
    });
    const getShops = async () =>{
      await store.create();
      const selectedShop = await store.get('selectedShop');
      db.collection("shops")
        .doc(selectedShop)
        .collection("customers")
        .onSnapshot((doc) => {
          doc.docs.map((e) => {
            state.customers.push(e.data());
          });
          state.loading = false
        });
    }
    getShops();
    const onCustomerClick = (customer) => {
      emitter.emit('select_customer_event',JSON.parse(JSON.stringify(customer)))
    }
    const closeModel = () =>{
      emitter.emit('close_customer_model','');
    }
    return { ...toRefs(state), onCustomerClick, closeModel, closeOutline};
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar }
});
</script>
<style scoped>
.close-model {
  font-size: 40px;
}
</style>