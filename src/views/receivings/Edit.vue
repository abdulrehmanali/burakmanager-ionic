<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Receiving</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <ion-list>
              <ion-item lines="none">
                <ion-label position="stacked">Customer / Seller: </ion-label>
                <ion-select v-model="customerId" :value="customerId" :compare-with="compareWithCustomer" :interface-options="customers">
                  <ion-select-option
                    v-for="customer in customers"
                    :key="customer.email"
                    :value="customer.id"
                    :selected="customer.id === customerId"
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

        <ion-card v-if="entries.length">
          <ion-card-header>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-card-title>Ledger Entries</ion-card-title>
                  <ion-card-subtitle>Below table contains the ledger entries form which this receiving can be deducted</ion-card-subtitle>
                </ion-col>
                <ion-col style="display: flex;justify-content: end;">
                  <ion-button v-if="entries && status == 'received'" v-on:click="deductFromReceiving">Deduct</ion-button>
                </ion-col>
              </ion-row>
            </ion-grid> 
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="2">
                  <ion-item>
                    <ion-label>#</ion-label>
                  </ion-item>
                </ion-col>
                <ion-col size="3">
                  <ion-item>
                    <ion-label>Total Pending</ion-label>
                  </ion-item>
                </ion-col>
                <ion-col size="3">
                  <ion-item>
                    <ion-label>Deducted</ion-label>
                  </ion-item>
                </ion-col>
                <ion-col size="4">
                  <ion-item>
                    <ion-label>Remaining</ion-label>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row v-for="entry in entries" :key="entry.id">
                <ion-col size="2">
                  <ion-item>
                    <ion-label>{{ entry.id }}</ion-label>
                  </ion-item>
                </ion-col>
                <ion-col size="3">
                  <ion-item>
                    <ion-label>{{ entry.total - entry.amount_received }}</ion-label>
                  </ion-item>
                </ion-col>
                <ion-col size="3">
                  <ion-item>
                    <ion-label>{{ entry.totalDeductedAmount }}</ion-label>
                  </ion-item>
                </ion-col>
                <ion-col size="4">
                  <ion-item>
                    <ion-label>{{ entry.totalDeducted }}</ion-label>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
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
  IonCard,
  IonSelectOption,
  IonItem,
  IonLabel,
  loadingController
} from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import { trash, pencil, arrowDown, arrowUp } from "ionicons/icons";
import { allCustomers } from "@/services/customers.services";
import { createReceiving, deductEntriesFromReceiving, getReceiving, updateReceiving } from "@/services/receivings.services";
import { useRoute } from 'vue-router';
import router from "@/router";

export default {
  name: "EditReceivings",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      errorMsg: "" as any,
      customerId: "",
      customers: [] as any,
      loadingProducts: false,
      loadingCustomers: false,
      method: "cash",
      status: "pending",
      amount: 0 as any,
      'bank_name': "",
      'transaction_id': "",
      'cheque_number': "",
      selectProductModelVue: "" as any,
      selectCustomerModelVue: "" as any,
      entries: [] as any,
      deductibleEntries: [] as any,
      alreadyUsedAmount: 0 as any,
      afterDeductUsedAmount: 0,
      usedIn: [] as any,
      disableSave: false,
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
    const updateReceivingOnServer = () => {
      state.disableSave = true
      updateReceiving(
        id,
        state.method,
        state.status,
        state.amount,
        state.bank_name,
        state.transaction_id,
        state.cheque_number,
        state.customerId).then(res=>{
          state.disableSave = false
          router.push('/receivings')
          console.log(res.data)
      })
    };
    const getReceivingFromServer = ()=>{
      getReceiving(id).then(res=>{
        if (!res.data || !res.data.receiving){
          alert('Unable to find data')
          return
        }
        state.entries = res.data.entries
        state.alreadyUsedAmount = parseFloat(res.data.alreadyUsedAmount)
        state.usedIn = res.data.usedIn
        const receiving = res.data.receiving
        state.method = receiving.method
        state.status = receiving.status
        state.amount = parseFloat(receiving.amount)
        state['bank_name'] = receiving.bank_name
        state['transaction_id'] = receiving.transaction_id
        state['cheque_number'] = receiving.cheque_number
        state.customerId = receiving.customer_id
        // let totalAvailable = (state.amount - state.alreadyUsedAmount)
        state.entries.forEach((entry: any, index: any) => {
          let totalDeductedAmount = ((entry.total - entry.amount_received) - entry.totalDeducted)
          if (totalDeductedAmount == 0) {
            totalDeductedAmount = entry.totalDeducted
          }
          state.entries[index].totalDeductedAmount = totalDeductedAmount
        });
        // state.afterDeductUsedAmount = totalAvailable
        getCustomers()
      })
    }
    const deductFromReceiving = async ()=>{
      const loading = await loadingController.create({
        message: 'Deducting...',
      });
      loading.present()
      deductEntriesFromReceiving(id).then(res=>{
        loading.dismiss()
        console.log(res)
        state.entries = []
      }).catch(err=>{
        loading.dismiss()
      })
    }
    onIonViewWillLeave(() => {
      (state.errorMsg = ""),
        (state.customerId = {} as any),
        (state.customers = [] as any),
        (state.loadingProducts = false),
        (state.loadingCustomers = false),
        (state.selectProductModelVue = "" as any),
        (state.selectCustomerModelVue = "" as any);
    });
    getReceivingFromServer()
    const compareWithCustomer = (o1: any, o2: any) => {
      return o1 == state.customerId
    }
    const onEntrySelect = (e: any)=>{
      console.log(e.checked)
    }
    return {
      ...toRefs(state),
      IonCard,
      IonSelect,
      IonSelectOption,
      trash,
      pencil,
      getCustomers,
      // onCustomerClick,
      arrowDown,
      arrowUp,
      updateReceivingOnServer,
      compareWithCustomer,
      onEntrySelect,
      deductFromReceiving
    };
  },
};
</script>
