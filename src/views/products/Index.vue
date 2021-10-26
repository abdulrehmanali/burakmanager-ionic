<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Products</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar></ion-searchbar>
      <ion-spinner v-if="loading" class="loader" />
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
      <ion-infinite-scroll
        @ionInfinite="loadMore($event)" 
        threshold="100px" 
        id="infinite-scroll"
        :disabled="loadMoreDisabled"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <router-link to="/products/new">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </router-link>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/vue";
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { db } from "@/main";
import { reactive, toRefs } from "@vue/reactivity";
import { Storage } from '@ionic/storage';

export default {
  name: "Products",
  setup() {
    const store = new Storage();
    const router = useRouter();
    const state = reactive({
      products: [] as any,
      loadMoreDisabled: true,
      loading: true
    });
    const getProducts = async()=>{
      await store.create();
      const selectedShop = await store.get('selectedShop');
      const query = db.collection("shops")
        .doc(selectedShop)
        .collection("products").limit(10);
        query.onSnapshot((doc) => {
          doc.docs.map((e) => {
            state.products.push(e.data());
          });
          state.loading = false
        });
    }
    getProducts();
    const loadMore = (ev: CustomEvent)=>{
      // query.onSnapshot((doc) => {
      // doc.docs.map((e) => {
      //   state.products.push(e.data());
      // });
      //});
      //ev.target.complete();
    }
    return { ...toRefs(state), router, add, loadMore};
  },
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  },
};
</script>

<style scoped></style>
