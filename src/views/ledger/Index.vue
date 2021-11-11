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
      <ion-note v-if="!loading" class="ion-text-center status-text">{{entries.length}} Entries Found</ion-note>
      <ion-list v-if="entries.length">
        <ion-item
          v-for="(entry) in entries"
          :key="entry.id"
          :value="entry.id"
        >
          <ion-label class="ion-text-capitalize">
            <h2>{{ entry.customer.name }}</h2>
            <p>{{ entry.customer.email }}</p>
            <span class="badge green-badge">{{ entry.payment_method }}</span>
            <span class="badge blue-badge">{{ entry.payment_status }}</span>
          </ion-label>
          <ion-label class="ion-text-end ion-text-capitalize">
          <h1>{{ entry.total >= entry.amount_received ? entry.total : entry.amount_received }} {{ entry.type }}</h1>
          <h2 v-if="entry.total < entry.amount_received">Pending Payment: {{entry.amount_received - entry.total}} </h2>
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
import { reactive, toRefs } from "@vue/reactivity";
import { allLedgerEntries } from "@/services/ledger.services";

export default {
  name: "LedgerIndex",
  setup() {
    const router = useRouter();
    const state = reactive({
      entries: [] as any,
      errorMsg:"",
      loading: true
    });
    const getLedger = async()=>{
      allLedgerEntries().then(res=>{
        state.entries = res.data.entries
        state.loading = false
      }).catch(err=>{
        console.log(err);
      })
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
.status-text {
  width:100%;
  display:block;
  margin:5px 0;
}
</style>
