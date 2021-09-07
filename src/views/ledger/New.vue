<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>New Entry</ion-title>
      </ion-toolbar>
      <ion-segment @ionChange="typeChanged($event)" value="product">
        <ion-segment-button value="product" :layout="iconTop" selected>
          <ion-icon :icon="cube"></ion-icon>
          <ion-label>Products</ion-label>
        </ion-segment-button>
        <ion-segment-button value="cash" :layout="iconTop">
          <ion-icon :icon="cash"></ion-icon>
          <ion-label>Cash</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content v-if="errorMsg" class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { auth, db } from "@/main";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const state = reactive({
      name: "",
      contactNumber: "",
      email: "",
      errorMsg: "",
    });
    const createNewCustomer = async (
      name: string,
      contactNumber: string,
      email: string
    ) => {
      try {
        await db
          .collection("shops")
          .doc(localStorage.selectedShop)
          .collection("customers")
          .add({
            createdAt: new Date().getTime(),
            lastUpdatedAt: new Date().getTime(),
            name: name,
            contactNumber: contactNumber,
            email: email,
          });
        router.back();
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    const typeChanged = ($even: Event) => {
      console.log($even.returnValue);
    };
    return { ...toRefs(state), createNewCustomer, typeChanged };
  },
};
</script>

<style scoped>
ion-slides {
  min-height: 100vh;
  width: auto;
}

ion-slide {
  min-height: 100vh;
  width: auto;
}
</style>
