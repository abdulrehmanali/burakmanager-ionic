<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Production Products</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item
          v-for="(product, key) in productionProducts"
          :key="key"
          :value="key"
          v-on:click="router.push('/production-products/new')"
        >
          <ion-label>
            <h2>{{ product.name }}</h2>
            <p>{{ product.sku }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <router-link to="/production-products/new">
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
import { allProductionProducts } from "@/services/productionProducts.services";

export default {
  name: "ProductionProductsIndex",
  setup() {
    const router = useRouter();
    const state = reactive({
      productionProducts: [],
      errorMsg: "",
      loading: false,
    });
    allProductionProducts()
      .then((res) => {
        if (res.data.error) {
          state.errorMsg = res.data.error;
          return;
        }
        state.productionProducts = res.data.productionProducts;
        state.loading = false;
      })
      .catch((err: any) => {
        state.loading = false;
        if (err.response || err.response.data) {
          state.errorMsg = err.response.data.error;
          return;
        }
        state.errorMsg = "Please check your internet and try again";
      });
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
