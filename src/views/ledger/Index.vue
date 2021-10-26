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
      <ion-list>
        <ion-item
          v-for="(entry) in entries"
          :key="entry.id"
          :value="entry.id"
        >
          <ion-label class="ion-text-capitalize">
            <h2>{{ entry.customer.name }}</h2>
            <p>{{ entry.customer.email }}</p>
            <span class="badge green-badge">{{ entry.paymentMethod }}</span>
            <span class="badge blue-badge">{{ entry.paymentStatus }}</span>
          </ion-label>
          <ion-label class="ion-text-end ion-text-capitalize">
          <h1>{{ entry.total >= entry.amountReceived ? entry.total : entry.amountReceived }} {{ entry.type }}</h1>
          <h2 v-if="entry.total < entry.amountReceived">Pending Payment: {{entry.amountReceived - entry.total}} </h2>
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
import { IonContent, IonPage, IonFab, IonFabButton } from "@ionic/vue";
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { db } from "@/main";
import { reactive, toRefs } from "@vue/reactivity";
import { Storage } from '@ionic/storage';

export default {
  name: "LedgerIndex",
  setup() {
    const store = new Storage();
    const router = useRouter();
    const state = reactive({
      entries: [] as any,
      loading: true
    });
    const getLedger = async()=>{
      await store.create();
      const selectedShop = await store.get('selectedShop');
      db.collection("shops").doc(selectedShop).collection("ledger").onSnapshot((doc) => {
        doc.docs.map((e) => {
          const entry = e.data();
          entry.id = e.id;
          state.entries.push(entry);
        });
        state.loading = false
      });
    }
    getLedger();
    return { ...toRefs(state), router, add };
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
.blue-badge {
  background-color:#438cff;
  color: #ffffff;
}
</style>
