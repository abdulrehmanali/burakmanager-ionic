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
      <ion-note v-if="!loading" class="ion-text-center status-text">{{products.length}} Products Found</ion-note>
      <ion-list v-if="products.length">
        <ion-item
          v-for="(product, key) in products"
          :key="key"
          :value="key"
          v-on:click="router.push('/products/' + product.id)"
        >
          <ion-label>
            <h2>{{ product.name }}</h2>
            <p>{{ (product.batches?product.batches.length:0) }} Batche(s), {{ (product.batches && product.batches.length)?(product.batches.map(e=>{return e.quantity;}).reduce((total, num)=>{return total + Math.round(num)})):"" }} Item(s)</p>
          </ion-label>
          <ion-note slot="end">
            <h4>{{product.sku}}</h4>
            <!-- <h4>{{ product.batches?(product.batches.map(e=>{return e.purchasePrice;}).reduce((total, num)=>{return total + Math.round(num)})):"" }}</h4> -->
          </ion-note>
        </ion-item>
      </ion-list>
      <!-- <ion-infinite-scroll
        @ionInfinite="loadMore($event)" 
        threshold="100px" 
        id="infinite-scroll"
        :disabled="loadMoreDisabled || perPage > products.length"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll> -->
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
import { IonContent, IonPage, IonFab, IonFabButton, onIonViewWillEnter } from "@ionic/vue";
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { reactive, toRefs } from "@vue/reactivity";

export default {
  name: "Reciving",
  setup() {
    const router = useRouter();
    const state = reactive({
      products: [] as any,
      search:"",
      loadMoreDisabled: false,
      loading: true,
      lastDocument:{},
      perPage:10,
      errorMsg:""
    });

    return { ...toRefs(state), router, add};
  },
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton
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
