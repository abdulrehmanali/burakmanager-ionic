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
      <ion-searchbar @input="onSearch($event.target.value)" show-cancel-button="focus" animated v-on:ionCancel="onSearch('')"/>
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
            <p>{{ (product.batches?product.batches.length:0) }} Batches</p>
          </ion-label>
          <ion-note slot="end">
            <h4>{{product.sku}}</h4>
            <!-- <h4>{{ product.batches?(product.batches.map(e=>{return e.purchasePrice;}).reduce((total, num)=>{return total + Math.round(num)})):"" }}</h4> -->
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
    let query: any;
    const store = new Storage();
    const router = useRouter();
    const state = reactive({
      products: [] as any,
      search:"",
      loadMoreDisabled: false,
      loading: true,
      lastDocument:{}
    });
    const getProducts = async()=>{
      state.products = [];
      await store.create();
      const selectedShop = await store.get('selectedShop');
      query = db.collection("shops").doc(selectedShop)
        .collection("products");
        if(state.search){
          query = query.orderBy('name','asc').where('name','>=',state.search);
        }else{
          query = query.orderBy('createdAt','desc')
        }
        query = query.limit(10)
        query.onSnapshot((doc: any) => {
          doc.docs.map((e: any) => {
            state.products.push(e.data());
          });
          if(doc.docs && doc.docs.length){
            state.lastDocument = doc.docs[doc.docs.length-1]
          }
          state.loading = false
        });
    }
    getProducts();
    const loadMore = (ev: any)=>{
      query.startAfter(state.lastDocument).onSnapshot((doc: any) => {
        doc.docs.map((e: any) => {
          state.products.push(e.data());
          state.lastDocument = e.data();
        });
        if(doc.docs && doc.docs.length){
          state.lastDocument = doc.docs[doc.docs.length-1]
        }
        if(doc.docs.length < 10){
          state.loadMoreDisabled = true
        }
        ev.target?.complete()
      });
    }
    const onSearch = (toSearch: string)=>{
      state.search = toSearch;
      setTimeout( function() {
        getProducts(); 
      }, 600);
    }
    return { ...toRefs(state), router, add, loadMore, onSearch};
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
