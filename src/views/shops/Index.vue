<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Shops</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-spinner v-if="loading" class="loader" />
      <ion-card v-for="(shop, id) in shops" v-bind:key="id">
        <ion-card-header>
          <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title>{{ shop.shop.name }}</ion-card-title>
                <ion-card-subtitle>{{ shop.shop.address }}</ion-card-subtitle>
              </ion-col>
              <ion-col>
                <ion-button @click="router.push('/shops/'+shop.shop.id)" v-if="shop.shop.admin_id == user.id" class="ion-float-end"
                  >Edit</ion-button
                >
              </ion-col>
            </ion-row>
        </ion-card-header>
      </ion-card>
      <ion-card>
        <ion-card-content v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </ion-card-content>
      </ion-card>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <router-link to="/shops/new">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </router-link>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { reactive, toRefs } from "@vue/reactivity";
import { add } from "ionicons/icons";
import { all } from "@/services/shops.services";
import { Storage } from "@ionic/storage";

export default {
  name: "Shops",
  setup() {
    const router = useRouter();
    const store = new Storage();
    const state = reactive({
      shops: [],
      loading: true,
      user: {}
    });
    state.shops = [];
    all().then(async(res)=>{
        await store.create();
        state.user = await store.get("user");
        state.shops = res.data.shops;
        state.loading = false
    }).catch(err=>{
      alert("Please Check your internet")
    });
    return { router,add, ...toRefs(state) };
  },
  components: {
    IonContent,
    IonPage,
  },
};
</script>

<style scoped></style>
