<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Advance Search</ion-title>
      <ion-icon slot="end" :icon="closeOutline" class="close-model" v-on:click="closeModel()"></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
  <ion-list>
    <ion-item>
      <ion-label>Customer / Seller: </ion-label>
      <ion-input v-model="search.customer" v-on:keyup="getCustomers($event.target.value)" :value="search.customer"></ion-input>
      <ion-spinner v-if="loadingCustomers"></ion-spinner>
    </ion-item>
    <ion-item lines="none" v-if="customers.length && !loadingCustomers">
      <ion-list class="customer-list">
        <ion-item
          v-for="customer in customers"
          :key="customer.email"
          v-on:click="()=>{onCustomerClick(customer)}"
          style="width:100%"
          class="customer-list-item"
        >
        <ion-label color="primary">
          <h2>{{ customer.name }}</h2>
          <h4>{{ customer.contact_number }}</h4>
        </ion-label>
        </ion-item>
      </ion-list>
    </ion-item>
    <ion-item>
      <ion-label>Payment Status: </ion-label>
      <ion-select
        v-model="search.paymentStatus"
        @ionChange = "onPaymentSelect($event.target.value)"
        ok-text="Okay"
        cancel-text="Dismiss"
      >
      <ion-select-option
          value="on-hold"
          :selected="search.paymentStatus == ''"
          >All</ion-select-option
        >
        <ion-select-option
          :value="((type == 'credit')?'received':'sended')"
          :selected="search.paymentStatus == ((type == 'credit')?'received':'sended')"
          >{{ ((type == 'credit')?'Received':'Sended') }}</ion-select-option
        >
        <ion-select-option
          value="pending"
          :selected="search.paymentStatus == 'pending'"
          >Pending</ion-select-option
        >
        <ion-select-option
          value="on-hold"
          :selected="search.paymentStatus == 'on-hold'"
          >On Hold</ion-select-option
        >
      </ion-select>
    </ion-item>
  </ion-list>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect } from '@ionic/vue';
import { defineComponent, reactive, toRefs } from 'vue';
import { emitter } from "@/services//emitter";
import { allCustomers } from "@/services/customers.services";
import { closeOutline } from "ionicons/icons";

let globalTimeout = null;
export default defineComponent({
  name: 'SearchLedgerModelVue',
  setup() {
    const state = reactive({
      loading: true,
      customer: {},
      customers: [],
      search: {
        customer: "",
        paymentStatus: ""
      }
    });
    const onCustomerClick = (customer) => {
      state.search.customer = customer.name
      state.search.customerId = customer.id
      state.customers = [];
      emitter.emit('select_ledger_advance_event',JSON.parse(JSON.stringify(state.search)))
    }
    const onPaymentSelect= (payment) => {
      state.search.paymentStatus = payment
      emitter.emit('select_ledger_advance_event',JSON.parse(JSON.stringify(state.search)))
    }
    const closeModel = () =>{
      emitter.emit('close_ledger_advance_event','');
    }
    const getCustomers = (search = '') =>{
      state.search.customer = search
      emitter.emit('select_ledger_advance_event',JSON.parse(JSON.stringify(state.search)))
      state.customers = [];
      if (globalTimeout != null) {
        clearTimeout(globalTimeout);
        globalTimeout = null;
      }
      if (!search) {
        return;
      }
      state.loading = true;
      globalTimeout = setTimeout(function() {
        globalTimeout = null;
        allCustomers(search).then(async(res)=>{
          state.customers = res.data.customers;
          state.loading = false
        })
      }, 200);
    }
    return { ...toRefs(state), onCustomerClick, closeModel, closeOutline, getCustomers, onPaymentSelect};
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect },
  props: [
    'batchId'
  ]
});
</script>
<style scoped>
.close-model {
  font-size: 40px;
}
</style>