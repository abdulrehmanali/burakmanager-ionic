<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>New Receiving</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <ion-list>
              <ion-item lines="none">
                <ion-label position="floating">Customer / Seller: </ion-label>
                <ion-select v-model="customerId" :value="customerId">
                  <ion-select-option
                    v-for="customer in customers"
                    :key="customer.email"
                    :value="customer.id"
                  >
                    {{ customer.name }}
                  </ion-select-option>
                </ion-select>
                <ion-spinner v-if="loadingCustomers"></ion-spinner>
              </ion-item>
              <ion-item lines="none">
                <ion-label position="floating">Payment Method: </ion-label>
                <ion-select
                  v-model="method"
                  @change="method = $event.target.value"
                  ok-text="Okay"
                  cancel-text="Dismiss"
                >
                  <ion-select-option value="cash" :selected="method == 'cash'"
                    >Cash</ion-select-option
                  >
                  <ion-select-option
                    value="cheque"
                    :selected="method == 'cheque'"
                    >Cheque</ion-select-option
                  >
                  <ion-select-option
                    value="bankTransfer"
                    :selected="method == 'bankTransfer'"
                    >Bank Transfer</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item lines="none">
                <ion-label position="floating">Payment Status: </ion-label>
                <ion-select
                  v-model="status"
                  @change="status = $event.target.value"
                  ok-text="Okay"
                  cancel-text="Dismiss"
                >
                  <ion-select-option
                    :value="'received'"
                    :selected="status == 'received'"
                    >Received</ion-select-option
                  >
                  <ion-select-option
                    value="pending"
                    :selected="status == 'pending'"
                    >Pending</ion-select-option
                  >
                  <ion-select-option
                    value="on-hold"
                    :selected="status == 'on-hold'"
                    >On Hold</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Amount: </ion-label>
                <ion-input
                  type="number"
                  @keyup="amount = $event.target.value"
                  :value="amount"
                  class="ion-text-right"
                ></ion-input>
                <ion-label slot="end">Rs</ion-label>
              </ion-item>
              <ion-item
                lines="none"
                v-if="method == 'cheque' || method == 'bankTransfer'"
              >
                <ion-label position="floating">Bank Name: </ion-label>
                <ion-input
                  type="text"
                  @keyup="bank_name = $event.target.value"
                  :value="bank_name"
                ></ion-input>
              </ion-item>
              <ion-item lines="none" v-if="method == 'cheque'">
                <ion-label position="floating">Cheque Number: </ion-label>
                <ion-input
                  type="text"
                  @keyup="cheque_number = $event.target.value"
                  :value="cheque_number"
                ></ion-input>
              </ion-item>
              <ion-item lines="floating" v-if="method == 'bankTransfer'">
                <ion-label position="stacked">Transaction Id: </ion-label>
                <ion-input
                  type="text"
                  @keyup="transaction_id = $event.target.value"
                  :value="transaction_id"
                ></ion-input>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card v-if="errorMsg && errorMsg instanceof String">
          <ion-card-content class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>

        <ion-card v-if="errorMsg && typeof errorMsg === 'object'">
          <ion-card-content
            class="error-message"
            v-for="msg in errorMsg"
            :key="msg[0]"
          >
            {{ msg[0] }}
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <ion-button @click="addNewReceiving" :disabled="disableSave">Save</ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonBackButton,
  IonInput,
  IonSelect,
  onIonViewWillLeave,
  IonCard
} from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import { trash, pencil, arrowDown, arrowUp } from "ionicons/icons";
import { allCustomers } from "@/services/customers.services";
import { createReceiving } from "@/services/receivings.services";
import router from "@/router";

export default {
  name: "NewReceivings",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonInput,
    IonSelect,
  },
  setup() {
    const state = reactive({
      errorMsg: "" as any,
      customerId: "",
      customers: [] as any,
      loadingProducts: false,
      loadingCustomers: false,
      method: "cash",
      status: "pending",
      amount: 0.0,
      'bank_name': "",
      'transaction_id': "",
      'cheque_number': "",
      selectProductModelVue: "" as any,
      selectCustomerModelVue: "" as any,
      disableSave:false
    });

    const getCustomers = () => {
      state.customers = [];
      allCustomers()
        .then(async (res) => {
          state.customers = res.data.customers;
          state.loadingCustomers = false;
        })
        .catch((err) => {
          alert("Please Check your internet");
        });
    };
    const addNewReceiving = () => {
      state.disableSave = true
      createReceiving(
        state.method,
        state.status,
        state.amount,
        state.bank_name,
        state.transaction_id,
        state.cheque_number,
        state.customerId).then(res=>{
          state.disableSave = false
          router.push('/receivings')
      }).catch(err=>{
        console.log(err)
        alert("Error Please Try Again");
      })
    };
    onIonViewWillLeave(() => {
      (state.errorMsg = ""),
        (state.customerId = {} as any),
        (state.customers = [] as any),
        (state.loadingProducts = false),
        (state.loadingCustomers = false),
        (state.selectProductModelVue = "" as any),
        (state.selectCustomerModelVue = "" as any);
    });
    getCustomers()
    return {
      ...toRefs(state),
      IonCard,
      trash,
      pencil,
      getCustomers,
      // onCustomerClick,
      arrowDown,
      arrowUp,
      addNewReceiving,
    };
  },
};
</script>
