<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>Invoice</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container" class="container">
        <ion-row>
          <ion-col>
            <div class="ion-text-start">
              <p>{{ selectedShop.shop.name }}</p>
              <p>{{ selectedShop.shop.address }}</p>
            </div>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <h3>Invoice</h3>
              <p><span>#</span>{{ entry.id }}</p>
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <div class="ion-text-start">
              <h4>Bill To</h4>
              <p>{{ entry.customer.company_name }}</p>
              <p>{{ entry.customer.address }}</p>
            </div>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <p>
                <b>Created At:</b> 
                {{ entry.created_at }}
              </p>
              <p>
                <b>Printed At:</b> 
                {{ entry.printedAt }}
              </p>
            </div>
          </ion-col>
        </ion-row>
        <ion-grid class="products-table">
          <ion-row>
            <ion-col>
              <p>Item Name</p>
            </ion-col>
            <ion-col>
              <p>Quantity</p>
            </ion-col>
            <ion-col>
              <p>Price</p>
            </ion-col>
            <ion-col>
              <p>Total</p>
            </ion-col>
          </ion-row>
          <ion-row v-for="(item, index) in entry.products" :key="index">
            <ion-col>
              <p>{{ item.product_name }}</p>
            </ion-col>
            <ion-col>
              <p>{{ item.quantity }}</p>
            </ion-col>
            <ion-col>
              <p>{{ item.rate }}</p>
            </ion-col>
            <ion-col>
              <p>{{ (item.quantity * item.rate) }}</p>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-start">
            </div>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <p>
                <strong>Total: </strong>
                {{ selectedShop.shop.currency }} {{ entry.total }}
              </p>
              <p>
                <strong>Amount Paid: </strong>
                {{ selectedShop.shop.currency }} {{ entry.amount_received }}
              </p>
              <p>
                <strong>Balance Due: </strong>
                {{ selectedShop.shop.currency }} {{ entry.amountDue }}
              </p>
            </div>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button @click.prevent="print">
        <ion-icon :icon="printOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
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
  onIonViewWillEnter,
  loadingController,
} from "@ionic/vue";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { trash, pencil, arrowDown, arrowUp, printOutline } from "ionicons/icons";
import { getLedgerEntry } from "@/services/ledger.services";
import { useRoute } from "vue-router";
import { Storage } from "@ionic/storage";
import html2pdf from 'html2pdf.js'


export default {
  name: "Invoice",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      errorMsg: "",
      entry: {
        customer: {},
        amountDue: 0.00 as number
      } as any,
      products: [] as any,
      selectedShop: {
        shop: {}
      } as any,
    });
    const store = new Storage();
    const getEntry = () => {
      getLedgerEntry(id)
        .then(async (res) => {
          await store.create();

          state.products = res.data.products;
          const entry = res.data.entry;
          entry["created_at"] = new Date(entry.created_at);
          entry["created_at"] =
            entry.created_at.getDate() +
            "/" +
            ("0" + entry.created_at.getMonth()).slice(-2) +
            "/" +
            entry.created_at.getFullYear();
          state.entry = entry;
          state.entry.amountDue = parseFloat(state.entry.total) - parseFloat(state.entry.amount_received)
          const today = new Date();
          state.entry.printedAt = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear()
          const selectedShop = await store.get("selectedShop");
          state.selectedShop = JSON.parse(selectedShop);
        })
        .catch((err) => {
          if (err.response.data.errors) {
            state.errorMsg = err.response.data.errors;
            return;
          }
          state.errorMsg = "Error Please try again";
        });
    };
    onIonViewWillEnter(() => {
      getEntry();
    });

    const print = () => {
      html2pdf(document.getElementById('container'),{
					margin: 1,
					filename: `invoice #`+state.entry.id+`.pdf`,
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { dpi: 192, letterRendering: true },
					jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
				});
    }

    onIonViewWillLeave(() => {
      (state.errorMsg = ""), (state.entry = {});
      state.products = [];
    });
    return {
      ...toRefs(state),
      trash,
      pencil,
      arrowDown,
      arrowUp,
      printOutline,
      print
    };
  },
};
</script>

<style>
.container {
  max-width: 768px;
  margin: 0 auto;
  display: block;
}
.products-table ion-col{
    border: 1px solid black;
}
@media (prefers-color-scheme: dark) {
  .container {
    background-color: white;
    color: black;
  }
  /* .products-table ion-col{
    border: 1px solid white;
  } */
}
</style>