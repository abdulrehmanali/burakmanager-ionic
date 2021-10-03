<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Select Product</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
  <ion-searchbar></ion-searchbar>
  <ion-item v-if="loading">
    <ion-label>Loading...</ion-label>
    <ion-spinner slot="end"></ion-spinner>
  </ion-item>
  <ion-list>
    <ion-item
      v-for="(product, key) in products"
      :key="key"
      :value="key"
      v-on:click="()=>{onProductClick(product)}"
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
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { db } from "@/main";
import { defineComponent, reactive, toRefs } from 'vue';
import { emitter } from "../../../services/emitter";


export default defineComponent({
  name: 'SelectProductModel',
  props: {
  },
  setup() {
    const state = reactive({
      products: [],
      loading: true
    });
    db.collection("shops")
      .doc(localStorage.selectedShop)
      .collection("products")
      .onSnapshot((doc) => {
        const result = [];
        doc.docs.map((e) => {
          result.push(e.data());
        });
        state.products = result;
        state.loading = false;
      });

    const onProductClick = (product) => {
      emitter.emit('select_product_event',JSON.parse(JSON.stringify(product)))
    }
    return { ...toRefs(state), onProductClick };
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar }
});
</script>