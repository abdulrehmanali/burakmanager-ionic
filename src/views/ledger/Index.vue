<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Ledger</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size-md="4">
                <ion-item>
                  <ion-label position="stacked">From</ion-label>
                  <ion-input placeholder="Enter text" type="date" v-model="searchState.from" v-on:change="searchState.from = $event.target.value"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size-md="4">
                <ion-item>
                  <ion-label position="stacked">To</ion-label>
                  <ion-input placeholder="Enter text" type="date" v-model="searchState.to" v-on:change="searchState.to = $event.target.value"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col
              size-md="2"
                style="display: flex; justify-content: center; align-items: center"
              >
                <ion-button v-on:click="openAdvanceSearchModal">
                  Advance
                </ion-button>
              </ion-col>
              <ion-col
              size-md="2"
                style="display: flex;justify-content: center;align-items: center;">
                <ion-button v-on:click="getLedger()">
                  <ion-icon :icon="search"></ion-icon>
                </ion-button>
                <ion-button v-on:click="printResults()">
                  <ion-icon :icon="print"></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
      <ion-spinner v-if="loading" class="loader" />
      <ion-note v-if="!loading" class="ion-text-center status-text"
        >{{ entries.length }} Entries Found</ion-note
      >
      <ion-grid v-if="entries.length && currentWidth > 768" class="table">
        <ion-row>
          <ion-col size="1">#</ion-col>
          <ion-col>Date</ion-col>
          <ion-col>Customer Name</ion-col>
          <ion-col>Type</ion-col>
          <ion-col>Payment Method</ion-col>
          <ion-col>Total</ion-col>
          <ion-col>Pending Payment</ion-col>
          <ion-col>Action</ion-col>
        </ion-row>
        <ion-row v-for="entry in entries" :key="entry.id">
          <ion-col size="1">{{entry.id}}</ion-col>
          <ion-col>{{new Date(entry.created_at).toLocaleDateString()}}</ion-col>
          <ion-col>{{
            entry.customer_name ? entry.customer_name : "N/A"
          }}</ion-col>
          <ion-col>
            {{ entry.type }}
          </ion-col>
          <ion-col>
            <span
            v-for="payment in entry.payments"
            :key="payment.id"
            :class="
                'badge ' +
                (payment.status === 'received'
                  ? 'green-badge'
                  : 'warning-badge')
              "
            >{{ payment.method }}</span>
          </ion-col>
          <ion-col>{{ entry.total }}</ion-col>
          <ion-col>
              {{ (entry.total > entry.amount_received ? entry.total - entry.amount_received : 0.00) }}
          </ion-col>
          <ion-col>
            <router-link
                :to="'/ledger/' + entry.id"
                class="no-underline"
              >
            <ion-button>View</ion-button>
            </router-link>
            <router-link
                :to="'/ledger/' + entry.id + '/invoice'"
                class="no-underline"
              >
            <ion-button>Invoice</ion-button>
            </router-link>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-list v-if="entries.length && currentWidth < 768">
        <router-link
          v-for="entry in entries"
          :key="entry.id"
          :value="entry.id"
          :to="'/ledger/' + entry.id"
          class="no-underline"
        >
          <ion-item>
            <ion-label class="ion-text-capitalize">
              <h1>{{ entry.customer_name ? entry.customer_name : "N/A" }}</h1>
              <span class="badge blue-badge">{{ entry.payment_method }}</span>
              <span
                :class="
                  'badge ' +
                  (entry.payment_status === 'received'
                    ? 'green-badge'
                    : 'warning-badge')
                "
                >{{ entry.payment_status }}</span
              >
            </ion-label>
            <ion-label class="ion-text-end ion-text-capitalize">
              <h1>
                {{ entry.total }}
                {{ entry.type }}
              </h1>
              <h2 v-if="entry.total > entry.amount_received">
                Pending Payment: {{ entry.total - entry.amount_received }}
              </h2>
              <h2 v-if="entry.total < entry.amount_received">
                Additional Amount: {{ entry.amount_received - entry.total }}
              </h2>
            </ion-label>
          </ion-item>
        </router-link>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <router-link to="/ledger/new">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </router-link>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonFab,
  IonFabButton,
  onIonViewWillEnter,
  isPlatform,
  modalController
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { add, search, print } from "ionicons/icons";
import { reactive, toRefs } from "@vue/reactivity";
import {
  allLedgerEntries,
  getReciptHtml,
  getReciptUrl,
} from "@/services/ledger.services";
import { Browser } from "@capacitor/browser";
import { Printer } from "@awesome-cordova-plugins/printer";
import SearchLedgerModelVue from "../components/models/SearchLedgerModelVue.vue";
import { emitter } from "@/services/emitter";
let searchLedgerModelVue: any = null;

export default {
  name: "LedgerIndex",
  setup() {
    const router = useRouter();
    const state = reactive({
      entries: [] as any,
      errorMsg: "",
      currentWidth: window. innerWidth,
      loading: true,
      searchState: {
        from:'' as any,
        to: '' as any,
        customer: "",
        customerId: "",
        paymentStatus: ""
      }
    });
    emitter.on("select_ledger_advance_event", async (ob: any) => {
      state.searchState.customerId = ob.customerId
      state.searchState.customer = ob.customer
      state.searchState.paymentStatus = ob.paymentStatus
    });
    emitter.on("close_ledger_advance_event", async () => {
      if (searchLedgerModelVue) {
        await searchLedgerModelVue.dismiss();
      }
    });
    
    const openAdvanceSearchModal = async () => {
      searchLedgerModelVue = await modalController.create({
        component: SearchLedgerModelVue,
      });
      return searchLedgerModelVue.present();
    };
    const getLedger = () => {
      allLedgerEntries(state.searchState)
        .then((res) => {
          state.entries = res.data.entries;
          state.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const openPdf = async (id: any) => {
      try {
        if (isPlatform("cordova")) {
          const html = await getReciptHtml(id);
          await Printer.print(html.data, {
            name: "Recipt #" + id + ".pdf",
          });
        } else {
          const url = await getReciptUrl(id);
          await Browser.open({ url });
        }
      } catch (e) {
        alert(e);
        console.log(e);
      }
    };
    const printResults = ()=>{
      allLedgerEntries(state.searchState, true)
        .then((res) => {
          state.loading = false;
          const blob = new Blob([res.data], { type: 'application/pdf' })
          const url = window.URL.createObjectURL(blob)
          window.open(url)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    onIonViewWillEnter(() => {
      getLedger();
    });
    return { ...toRefs(state), openPdf, router, add, search, print, openAdvanceSearchModal, getLedger, printResults};
  },
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
  },
};
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 3px 6px;
  margin: 5px 5px 0 0;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
}
.green-badge {
  background-color: #42d77d;
  color: #ffffff;
}
.warning-badge {
  background-color: #ffc408;
  color: #000;
}
.blue-badge {
  background-color: #438cff;
  color: #ffffff;
}
.status-text {
  width: 100%;
  display: block;
  margin: 5px 0;
}
.no-underline {
  text-decoration: none;
}
ion-grid.table ion-col{
  border: 0.5px solid var(--ion-color-dark);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
