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
      <ion-note v-if="!loading" class="ion-text-center status-text">{{customers.length}} Customers Found</ion-note>
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
import { reactive, toRefs } from "@vue/reactivity";
import { allCustomers } from "@/services/customers.services";

export default {
  name: "Customers",
  setup() {
    const router = useRouter();
    const state = reactive({
      customers: [] as any,
      loading:true
    });
    const getCustomers = async ()=>{
      allCustomers().then(async(res)=>{
          state.customers = res.data.customers;
          state.loading = false
      }).catch(err=>{
        alert("Please Check your internet")
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

<style scoped>
.status-text {
  width:100%;
  display:block;
  margin:5px 0;
}
</style>
