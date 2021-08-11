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

        <ion-card>
            <ion-card-header>
                <ion-card-title>Test Shop</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-list>
                    <ion-item>
                            <ion-label>No of Products</ion-label>
                            <ion-note slot="end">100</ion-note>
                    </ion-item>
                    <ion-item>
                            <ion-label>No of Users</ion-label>
                            <ion-note slot="end">2</ion-note>
                    </ion-item>
                </ion-list>
            </ion-card-content>
        </ion-card>
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button>
                <ion-icon name="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Shops',
  setup() {
      const router = useRouter();
      return { router };
  },
  components: {
    IonContent,
    IonPage
  }
}
</script>

<style scoped>
</style>