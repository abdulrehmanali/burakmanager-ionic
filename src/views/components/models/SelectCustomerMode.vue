<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Select Customer</ion-title>
      <ion-icon slot="end" :icon="closeOutline" class="close-model" v-on:click="closeModel()"></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
  <ion-spinner v-if="loading" class="loader" />
  <ion-note v-if="!loading" class="ion-text-center status-text">{{customers.length}} Customers Found</ion-note>
  <ion-list v-if="customers.length">
    <ion-item
      v-for="customer in customers"
      :key="customer.email"
      v-on:click="()=>{onCustomerClick(customer)}"
    >
    <ion-label>
      <h2>{{ customer.name }}</h2>
      <h4>{{ customer.contact_number }}</h4>
    </ion-label>
    </ion-item>
  </ion-list>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent, reactive, toRefs } from 'vue';
import { emitter } from "@/services//emitter";
import { allCustomers } from "@/services/customers.services";
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  name: 'SelectCustomerMode',
  setup() {
    const state = reactive({
      loading: true,
      customers: [],
    });
    const getShops = () =>{
      allCustomers().then(async(res)=>{
          state.customers = res.data.customers;
          state.loading = false
      }).catch(err=>{
        alert("Please Check your internet")
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