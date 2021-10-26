<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Products Capicity</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar></ion-searchbar>
      <ion-list>
        <ion-item
          v-for="(product, key) in products"
          :key="key"
          :value="key"
          v-on:click="router.push('/products/' + product.sku)"
        >
          <ion-label>
            <h2>{{ product.name }}</h2>
            <p>{{ product.stockQuantity }} items remaining</p>
          </ion-label>
          <ion-note slot="end">
            <h4>{{ product.price }} Rs</h4>
          </ion-note>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button href="/products/new">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
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
  name: "Products",
  async setup() {
const store = new Storage();
await store.create();
const selectedShop = await store.get('selectedShop');
    const router = useRouter();
    const state = reactive({
      products: [],
    });
    db.collection("shops")
      .doc(selectedShop)
      .collection("products")
      .onSnapshot((doc) => {
        const result = [] as any;
        doc.docs.map((e) => {
          result.push(e.data());
        });
        state.products = result;
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
