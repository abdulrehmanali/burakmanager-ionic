<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Customers</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar></ion-searchbar>
      <ion-spinner v-if="loading" class="loader" />
      <ion-list>
        <ion-item
          v-for="(customer, key) in customers"
          :key="key"
          :value="key"
          v-on:click="router.push('/customers/' + customer.id)"
        >
          <ion-label>
            <h2>{{ customer.name }}</h2>
            <h4>{{ customer.contactNumber }}</h4>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <router-link to="/customers/new">
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
  name: "Customers",
  setup() {
    const store = new Storage();
    const router = useRouter();
    const state = reactive({
      customers: [] as any,
      loading:true
    });
    const getCustomers = async ()=>{
      await store.create();
      const selectedShop = await store.get('selectedShop');
      db.collection("shops")
      .doc(selectedShop)
      .collection("customers")
      .onSnapshot((doc) => {
        doc.docs.map((e) => {
          const c = e.data();
          c.id = e.id;
          state.customers.push(c);
        });
        state.loading = false
      });
    }
    getCustomers();
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

<style scoped></style>
