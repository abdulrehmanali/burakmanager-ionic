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
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Invites to Shops</ion-card-subtitle>
          <ion-card-title>Invitations</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="i in invitations" :key="i.id">
              <IonLabel>{{ i.shop.name }}</IonLabel>
              <IonButton slot="end" :disabled="i.disableAccept" v-if="!i.accepted_at" v-on:click="acceptInvitationClick(i.id)">
                Accept
              </IonButton>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { getHome } from '@/services/home.services';
import { reactive, toRefs } from '@vue/reactivity';
import { acceptInvitation } from '@/services/invitations.services'; 
import { emitter } from "@/services/emitter";

export default {
  name: 'Home',
  setup() {
      const router = useRouter();
      const state = reactive({
        invitations:[] as any
      });
      getHome().then(res=>{
        state.invitations = res.data.invitations
      })
      const acceptInvitationClick = (id: any)=>{
        state.invitations.forEach((invitation: any,k: any) => {
          if(invitation.id == id) {
            state.invitations[k]['disableAccept'] = true;
          }
        });
        acceptInvitation(id).then(res=>{
          if(res.data.success){
            state.invitations.forEach((invitation: any,k: any) => {
              if(invitation.id == id) {
                state.invitations[k]['accepted_at'] = new Date().getDate();
              }
            });
            emitter.emit('sidebar_load_shops','');
          }
        }).catch(()=>{
        state.invitations.forEach((invitation: any,k: any) => {
          if(invitation.id == id) {
            state.invitations[k].disableAccept = false;
          }
        });
        });
      }
      return { ...toRefs(state), router, acceptInvitationClick };
  },
  components: {
    IonContent,
    IonPage,
    IonButton
  }
}
</script>

<style scoped></style>