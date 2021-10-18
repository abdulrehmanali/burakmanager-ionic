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
      <ion-searchbar></ion-searchbar>

      <ion-card v-for="(name, id) in shops" v-bind:key="id">
        <ion-card-header>
          <ion-card-title>{{ name }}</ion-card-title>
        </ion-card-header>
      </ion-card>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button href="/shops/new">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { reactive, toRefs } from "@vue/reactivity";
import { auth, db } from "@/main";

export default {
  name: "Shops",
  setup() {
    const router = useRouter();
    const state = reactive({
      shops: [],
    });
    db.collection("users")
      .doc(auth.currentUser?.uid)
      .onSnapshot((doc) => {
        state.shops = doc.data()?.shops;
      });
    return { router, ...toRefs(state) };
  },
  components: {
    IonContent,
    IonPage,
  },
};
</script>

<style scoped></style>
