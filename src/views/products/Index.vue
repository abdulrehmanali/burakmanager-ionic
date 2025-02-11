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
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-input @input="search = $event.target.value; performSearch()" show-cancel-button="focus" animated v-on:ionCancel="onSearch('')" placeholder="Search" :value="search"></ion-input>
            <!-- <ion-searchbar @input="onSearch($event.target.value)" show-cancel-button="focus" animated v-on:ionCancel="onSearch('')"/> -->
          </ion-col>
          <ion-col>
            <ion-select @ionChange="searchEqualsTo = $event.target.value; performSearch()" label="Equals To" placeholder="Equals To" :value="searchEqualsTo">
              <ion-select-option value="equals_to" selected> Equals To </ion-select-option>
              <ion-select-option value="equals_to_more_then"> More then Equals To </ion-select-option>
              <ion-select-option value="less_then_equals_to"> Less Then Equals To </ion-select-option>
            </ion-select>
          </ion-col>
          <ion-col>
            <ion-select @ionChange="console.log($event.target.value);searchField = $event.target.value; performSearch()" label="Field" placeholder="Field" :value="searchField">
              <ion-select-option value="name"> Name </ion-select-option>
              <ion-select-option value="quantity"> SKU </ion-select-option>
              <ion-select-option value="quantity"> Quantity </ion-select-option>
            </ion-select>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-spinner v-if="loading" class="loader" />
      <ion-note v-if="!loading" class="ion-text-center status-text">{{products.length}} Products Found</ion-note>
      <ion-grid v-if="products.length && currentWidth > 768" class="table">
        <ion-row>
          <ion-col size="1">#</ion-col>
          <ion-col>Name</ion-col>
          <ion-col>SKU</ion-col>
          <ion-col>Batches</ion-col>
          <ion-col>Items</ion-col>
          <ion-col>Created At</ion-col>
          <ion-col>Updated At</ion-col>
          <ion-col>Action</ion-col>
        </ion-row>
        <ion-row v-for="product in products" :key="product.id">
          <ion-col size="1">{{product.id}}</ion-col>
          <ion-col>{{product.name}}</ion-col>
          <ion-col>{{product.sku}}</ion-col>
          <ion-col>
            {{ (product.batches?product.batches.length:0) }}
          </ion-col>
          <ion-col>
            {{ (product.total_items?product.total_items:0) }}
          </ion-col>
          <ion-col>{{new Date(product.created_at).toLocaleDateString()}}</ion-col>
          <ion-col>
            {{new Date(product.updated_at).toLocaleDateString()}}
          </ion-col>
          <ion-col>
            <router-link
                :to="'/products/' + product.id"
                class="no-underline"
              >
            <ion-button>View</ion-button>
            </router-link>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-list v-if="products.length && currentWidth < 768">
        <ion-item
          v-for="(product, key) in products"
          :key="key"
          :value="key"
          v-on:click="router.push('/products/' + product.id)"
        >
          <ion-label>
            <h2>{{ product.name }}</h2>
            <p>{{ (product.batches?product.batches.length:0) }} Batche(s), {{ (product.batches && product.batches.length)?(product.batches.map(e=>{return e.quantity;}).reduce((total, num)=>{return parseInt(total) + Math.round(parseInt(num))})):"" }} Item(s)</p>
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
import { IonContent, IonPage, IonFab, IonFabButton, onIonViewWillEnter, IonSelect, IonInput } from "@ionic/vue";
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { reactive, toRefs } from "@vue/reactivity";
import { allProducts } from "@/services/products.services";

export default {
  name: "Products",
  setup() {
    const router = useRouter();
    const state = reactive({
      products: [] as any,
      search:"",
      loadMoreDisabled: false,
      loading: true,
      lastDocument:{},
      perPage:10,
      errorMsg:"",
      currentWidth: window. innerWidth,
      searchEqualsTo: "equals_to",
      searchField: "name"
    });
    let searchTimeOut: any = null
    const getProducts = ()=>{
      console.log('getProducts')
      state.products = [];
      allProducts(state.search, state.searchEqualsTo, state.searchField).then((res: any)=>{
        if(res.data.error){
          state.errorMsg = res.error;
          return;
        }
        const products = res.data.products
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          if (product.batches && product.batches.length) {
            products[i]['total_items'] = product.batches.map((e: any)=>{
              return e.quantity;
            }).reduce((total: any, num: any)=>{
              return parseInt(total) + Math.round(parseInt(num))
            })
          }
        }
        state.products = products;
        state.loading = false
      }).catch((err: any)=>{
        state.loading = false
        if(err.response || err.response.data){
          state.errorMsg = err.response.data.error;
          return;
        }
        state.errorMsg = "Please check your internet and try again";
      })
    }
    onIonViewWillEnter(() => {
      getProducts();
    });
    const loadMore = (ev: any)=>{
      console.log(ev)
    }
    const performSearch = ()=>{
      console.log('performSearch');
      if (searchTimeOut) {
        clearTimeout(searchTimeOut);
      }
      searchTimeOut = setTimeout( function() {
        getProducts(); 
      }, 600);
    }
    return { ...toRefs(state), router, add, loadMore, performSearch};
  },
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
    IonSelect,
    IonInput
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
.warning-badge {
  background-color: #ffc408;
  color: #000;
}
.blue-badge {
  background-color: #438cff;
  color: #ffffff;
}
.status-text {
  width: 100%;
  display: block;
  margin: 5px 0;
}
.no-underline {
  text-decoration: none;
}
ion-grid.table ion-col{
  border: 0.5px solid var(--ion-color-dark);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
