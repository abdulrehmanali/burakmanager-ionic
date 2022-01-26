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
      <ion-note v-if="!loading" class="ion-text-center status-text">{{products.length}} Products Found</ion-note>
      <ion-list v-if="products.length">
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
            <ion-col size="12" v-if="batch.quantity > 0">
              <b>Selling Price: {{ batch.selling_price }}</b>
              <p>{{ batch.quantity }} {{ batch.measurement_unit }} in stock</p>
            </ion-col>
          </ion-row>
        </ion-grid>
        </ion-item>
      </ion-list>
      <!-- <ion-infinite-scroll
        @ionInfinite="loadMore($event)" 
        threshold="100px" 
        id="infinite-scroll"
        :disabled="loadMoreDisabled"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll> -->
    </ion-content>
</template>

<script>
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { defineComponent, reactive, toRefs } from "vue";
import { allProducts } from "@/services/products.services";
import { emitter } from "@/services/emitter";
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  name: 'SelectProductModel',
  props: {
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      products: [],
      search:"",
      loadMoreDisabled: false,
      loading: true,
      lastDocument:{},
      perPage:10,
      errorMsg:""
    });
    const getProducts = ()=>{
      state.products = [];
      allProducts(state.search).then((res)=>{
        if(res.data.error){
          state.errorMsg = res.error;
          return;
        }
        state.products = res.data.products;
        state.loading = false
      }).catch((err)=>{
        state.loading = false
        if(err.response || err.response.data){
          state.errorMsg = err.response.data.error;
          return;
        }
        state.errorMsg = "Please check your internet and try again";
      })
    }
    getProducts();
    const loadMore = (ev)=>{
      console.log(ev)
    }
    const onSearch = (toSearch)=>{
      state.search = toSearch;
      setTimeout( function() {
        getProducts(); 
      }, 600);
    }
    const onProductClick = (product,k) => {
      product.batchId = k;
      emitter.emit('select_product_event',JSON.parse(JSON.stringify(product)))
    }
    const closeModel = () =>{
      emitter.emit('close_product_model','');
    }
    return { ...toRefs(state), router, add, closeOutline, loadMore, onSearch, onProductClick, closeModel};
  }
});
</script>
<style scoped>
.close-model {
  font-size: 40px;
}
.product-row {
  padding:6px 0;
}
@media (prefers-color-scheme: dark) {
  .product-batches {
    padding:6px;
    background-color: #121212;
  }
}

.product-batches p {
  margin:0;
}

.text-right {
  text-align: end;
}
</style>    