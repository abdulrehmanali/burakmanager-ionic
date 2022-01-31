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
      <ion-spinner v-if="loading" class="loader" />
      <ion-note v-if="!loading" class="ion-text-center status-text"
        >{{ entries.length }} Entries Found</ion-note
      >
      <ion-list v-if="entries.length">
        <ion-item
          v-for="entry in entries"
          :key="entry.id"
          :value="entry.id"
          v-on:click="openPdf(entry.id)"
        >
          <ion-label class="ion-text-capitalize">
            <h1>{{ (entry.customer_name?entry.customer_name:'N/A') }}</h1>
            <span class="badge blue-badge">{{ entry.payment_method }}</span>
            <span :class="'badge '+((entry.payment_status === 'received')?'green-badge':'warning-badge')">{{ entry.payment_status }}</span>
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
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { reactive, toRefs } from "@vue/reactivity";
import {
  allLedgerEntries,
  getReciptHtml,
  getReciptUrl,
} from "@/services/ledger.services";
import { Browser } from "@capacitor/browser";
import { Printer } from "@awesome-cordova-plugins/printer";

export default {
  name: "LedgerIndex",
  setup() {
    const router = useRouter();
    const state = reactive({
      entries: [] as any,
      errorMsg: "",
      loading: true,
    });
    const getLedger = () => {
      allLedgerEntries()
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
    onIonViewWillEnter(() => {
      getLedger();
    });
    return { ...toRefs(state), openPdf, router, add };
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
</style>
