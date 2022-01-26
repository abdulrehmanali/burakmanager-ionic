<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card v-if="invitations">
        <ion-card-header>
          <ion-card-subtitle>Invites to Shops</ion-card-subtitle>
          <ion-card-title>Invitations</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="i in invitations" :key="i.id">
              <IonLabel>{{ i.shop.name }}</IonLabel>
              <IonButton
                slot="end"
                :disabled="i.disableAccept"
                v-if="!i.accepted_at"
                v-on:click="acceptInvitationClick(i.id)"
              >
                Accept
              </IonButton>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <ion-card v-if="selectedShop">
        <ion-card-header>
          <ion-row class="ion-align-items-start">
            <ion-col>
              <ion-card-title style="margin: 10px 0px">Products</ion-card-title>
            </ion-col>
            <ion-col>
              <router-link to="/ledger/new">
                <ion-button class="ion-float-end">New</ion-button>
              </router-link>
            </ion-col>
          </ion-row>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-sm>
                <h2>Number Of Products</h2>
                <h1>{{ numberOfProducts }}</h1>
              </ion-col>
              <ion-col size="12" size-sm>
                <h2>Number Of Items</h2>
                <h1>{{ numberOfItems }}</h1>
              </ion-col>
              <ion-col size="12" size-sm>
                <h2>EST Capital</h2>
                <h1>Rs {{ totalCapital }}</h1>
              </ion-col>
              <ion-col size="12" size-sm>
                <h2>EST Profit</h2>
                <h1>Rs {{ totalProfit }}</h1>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
import { getHome } from "@/services/home.services";
import { reactive, toRefs } from "@vue/reactivity";
import { acceptInvitation } from "@/services/invitations.services";
import { emitter } from "@/services/emitter";
import { Storage } from '@ionic/storage';
const store = new Storage();

export default {
  name: "Home",
  setup() {
    const router = useRouter();
    const state = reactive({
      invitations: [] as any,
      numberOfItems: 0,
      numberOfProducts: 0,
      totalCapital: 0,
      totalProfit: 0,
      selectedShop : ""
    });
    getHome().then(async (res) => {
      await store.create();
      state.invitations = res.data.invitations;
      state.numberOfItems = res.data.numberOfItems;
      state.numberOfProducts = res.data.numberOfProducts;
      state.totalCapital = res.data.totalCapital;
      state.totalProfit = res.data.totalProfit;
      state.selectedShop = await store.get('selectedShop')
    });
    const acceptInvitationClick = (id: any) => {
      state.invitations.forEach((invitation: any, k: any) => {
        if (invitation.id == id) {
          state.invitations[k]["disableAccept"] = true;
        }
      });
      acceptInvitation(id)
        .then((res) => {
          if (res.data.success) {
            state.invitations.forEach((invitation: any, k: any) => {
              if (invitation.id == id) {
                state.invitations[k]["accepted_at"] = new Date().getDate();
              }
            });
            emitter.emit("sidebar_load_shops", "");
          }
        })
        .catch(() => {
          state.invitations.forEach((invitation: any, k: any) => {
            if (invitation.id == id) {
              state.invitations[k].disableAccept = false;
            }
          });
        });
    };
    return { ...toRefs(state), router, acceptInvitationClick };
  },
  components: {
    IonContent,
    IonPage,
    IonButton,
  },
};
</script>

<style scoped></style>