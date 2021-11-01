<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Select Product</ion-title>
      <ion-icon slot="end" :icon="closeOutline" class="close-model" v-on:click="closeModel()"></ion-icon>
    </ion-toolbar>
  </ion-header>
    <ion-content class="ion-padding">
      <ion-searchbar @input="onSearch($event.target.value)" show-cancel-button="focus" animated v-on:ionCancel="onSearch('')"/>
      <ion-spinner v-if="loading" class="loader" />
      <ion-list>
        <ion-item
          v-for="(product, key) in products"
          :key="key"
          :value="key"
          class="product-row"
        >
        <ion-grid>
          <ion-row>
            <ion-col size="12">
              <ion-label>
                <h2>{{ product.name }}</h2>
                <p>{{ (product.batches?product.batches.length:0) }} Batches</p>
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row  v-for="(batch,k) in product.batches" :key="k" class="product-batches" v-on:click="onProductClick(product,k)">
            <ion-col size="12">
              <b>Selling Price: {{ batch.sellingPrice }}</b>
              <p>{{ batch.stockQuantity }} {{ batch.measurementUnit }} in stock</p>
            </ion-col>
          </ion-row>
        </ion-grid>
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
    </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { db } from "@/main";
import { defineComponent, reactive, toRefs } from 'vue';
import { emitter } from "../../../services/emitter";
import { Storage } from '@ionic/storage';
import { closeOutline } from "ionicons/icons";
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SelectProductModel',
  props: {
  },
  setup() {
    let query;
    const store = new Storage();
    const router = useRouter();
    const state = reactive({
      products: [],
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
        query.onSnapshot((doc) => {
          doc.docs.map((e) => {
            state.products.push(e.data());
          });
          if(doc.docs && doc.docs.length){
            state.lastDocument = doc.docs[doc.docs.length-1]
          }
          state.loading = false
        });
    }
    getProducts();
    const loadMore = (ev)=>{
      query.startAfter(state.lastDocument).onSnapshot((doc) => {
        doc.docs.map((e) => {
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
    const onSearch = (toSearch)=>{
      state.search = toSearch;
      setTimeout( function() {
        getProducts(); 
      }, 600);
    }
    const onProductClick = (product,batchId) => {
      emitter.emit('select_product_event',JSON.parse(JSON.stringify({product,batchId})))
    }
    const closeModel = () =>{
      emitter.emit('close_product_model','');
    }
    return { ...toRefs(state), router, closeOutline, loadMore, onSearch, onProductClick, closeModel};
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar }
});
</script>
<style scoped>
.close-model {
  font-size: 40px;
}
.product-row {
  padding:6px 0;
}
.product-batches {
  padding:6px;
  background-color: #121212;
}

.product-batches p{
  margin:0;
}

.text-right {
  text-align: end;
}
</style>    