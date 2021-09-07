<template>
  <ion-page>
    <h1>Select Type</h1>
    <br />
    <ion-tabs @ionTabsWillChange="beforeTabChange" @ionTabsDidChange="afterTabChange">
      <ion-tab-bar slot="top">
        <ion-tab-button tab="products" v-on:click="changeType('products')">
          <ion-icon :icon="calendar"></ion-icon>
          <ion-label>Products</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="cash" v-on:click="changeType('cash')">
          <ion-icon :icon="personCircle"></ion-icon>
          <ion-label>Cash</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs } from "@ionic/vue";
import { calendar, personCircle } from "ionicons/icons";

export default {
  name: "SelectType",
  components: { IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs },
  setup() {
    const beforeTabChange = () => {
      // do something before tab change
    };
    const afterTabChange = () => {
      // do something after tab change
    };
    const changeType = (type) => {
      console.log(type);
    };
    return {
      calendar,
      personCircle,
      beforeTabChange,
      afterTabChange,
      changeType,
    };
  },
};
</script>
<style>
ion-tabs {
  margin-top: 80px;
}
</style>
