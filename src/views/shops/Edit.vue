<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/shops"/>
        </ion-buttons>
        <ion-title>Edit Shop</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label position="floating">Name</ion-label>
                <ion-input :value="name" @input="name = $event.target.value"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Address</ion-label>
                <ion-textarea
                  clear-on-edit="true"
                  :value="address"
                  @input="address = $event.target.value"
                ></ion-textarea>
              </ion-item>
              <ion-item>
                <ion-label>Currency</ion-label>
                <ion-select placeholder="Select Currency" v-on:change="currency = $event.target.value" :value="currency">
                  <ion-select-option v-for="(c,k) in currencyOptions" :key="k" :value="k">{{c.name}}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
            <ion-button expand="block" v-on:click="updateShop()" :disabled="disabledSaveButton || !name || !address">Save Shop</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title class="card-title">Users</ion-card-title>
          </ion-card-header>
          <ion-card-content v-if="users && users.length">
            <ion-grid v-for="(user, key) in users" :key="key">
              <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-label>{{user.user.email}}</ion-label>
                    <ion-button @click="deleteInvitation(user.user.id)" color="danger">Delete</ion-button>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Entries In Ledger</ion-label>
                    <ion-toggle
                      v-model="user.can_create_entries_in_ledger"
                      @ionChange="user.can_create_entries_in_ledger = $event.target.checked"
                      :checked="user.can_create_entries_in_ledger">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Entries In Ledger</ion-label>
                    <ion-toggle
                      v-model="user.can_edit_entries_in_ledger"
                      @ionChange="user.can_edit_entries_in_ledger = $event.target.checked"
                      :checked="user.can_edit_entries_in_ledger">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Customers</ion-label>
                    <ion-toggle
                      v-model="user.can_create_customers"
                      @ionChange="user.can_create_customers = $event.target.checked"
                      :checked="user.can_create_customers">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Customers</ion-label>
                    <ion-toggle
                      v-model="user.can_edit_customers"
                      @ionChange="user.can_edit_customers = $event.target.checked"
                      :checked="user.can_edit_customers">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Products</ion-label>
                    <ion-toggle
                      v-model="user.can_create_products"
                      @ionChange="user.can_create_products = $event.target.checked"
                      :checked="user.can_create_products">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Products</ion-label>
                    <ion-toggle
                      v-model="user.can_edit_products"
                      @ionChange="user.can_edit_products = $event.target.checked"
                      :checked="user.can_edit_products">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
          <ion-button expand="block" v-on:click="updateShop()">Save Invitations</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title class="card-title">Invitations</ion-card-title>
              </ion-col>
              <ion-col>
                <ion-button @click="openShopInvitationsModal" class="ion-float-end"
                  >New</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-card-header>
          <ion-card-content v-if="invitations && invitations.length">
            <ion-grid v-for="(invitation, key) in invitations" :key="key">
              <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-label>{{invitation.email}}</ion-label>
                    <ion-button @click="onClickDeleteInvitation(invitation)" color="danger" :disabled="invitation.disabledDeleteButton === true">Delete</ion-button>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Entries In Ledger</ion-label>
                    <ion-icon :icon="invitation.can_create_entries_in_ledger?checkmark:close"></ion-icon>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Entries In Ledger</ion-label>
                    <ion-icon :icon="invitation.can_edit_entries_in_ledger?checkmark:close"></ion-icon>
                  </ion-item>
                </ion-col>
                </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Customers</ion-label>
                    <ion-icon :icon="invitation.can_create_customers?checkmark:close"></ion-icon>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Customers</ion-label>
                    <ion-icon :icon="invitation.can_edit_customers?checkmark:close"></ion-icon>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Products</ion-label>
                    <ion-icon :icon="invitation.can_create_products?checkmark:close"></ion-icon>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Products</ion-label>
                    <ion-icon :icon="invitation.can_edit_products?checkmark:close"></ion-icon>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
        <webhook-container></webhook-container>
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
import { IonContent, IonPage, IonBackButton, modalController, IonSelect } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import NewShopInvitation from "@/views/components/models/NewShopInvitation.vue"
import { useRoute, useRouter } from "vue-router";
import { emitter } from "@/services/emitter";
import { update, get } from "@/services/shops.services";
import { deleteInvitation } from "@/services/invitations.services";
import currencyOptions from "@/data/currency-details.json";
import { checkmark, close } from "ionicons/icons";
import WebhookContainer from '../components/webhook/WebhookContainer.vue';

export default {
  name: "EditShop",
  setup() {
    let shopInvitationsModelVue: any;
    const router = useRouter();
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      name: "",
      address: "",
      invitations:[] as any,
      users:[] as any,
      disabledSaveButton:false,
      errorMsg: "",
      id: id as any,
      currency:"PKR",
      currencyOptions
    });
    emitter.on("add_new_invitation_model", async (invitation: any) => {
      invitation.disabledDeleteButton = false;
      state.invitations.push(invitation)
      if (shopInvitationsModelVue) {
        await shopInvitationsModelVue.dismiss();
      }
    });
    emitter.on("close_new_invitation_model", async () => {
      if (shopInvitationsModelVue) {
        await shopInvitationsModelVue.dismiss();
      }
    });
    get(state.id).then(res=>{
      const shop = res.data.shop;
      state.name = shop.name;
      state.address = shop.address;
      state.currency = shop.currency;
      state.users = shop.users;
      state.invitations = shop.invitations;
    })
    const updateShop = async () => {
      state.errorMsg = "";
      state.disabledSaveButton = true;
      if(!state.name || !state.address){
        state.errorMsg = "Please make sure you enter name and address";
        return;
      }
      update(state.id,state.name,state.address,state.currency,state.users,state.invitations).then(()=>{
        state.disabledSaveButton = false;
        router.push("/shops");
      }).catch(err=>{
        state.disabledSaveButton = false;
        if(!err.response || !err.response.data){
          state.errorMsg = "Error please try again";
          return;
        }
        state.errorMsg = err.response.data.error;
      })
    };
    const openShopInvitationsModal = async ()=>{
      shopInvitationsModelVue = await modalController.create({
        component: NewShopInvitation,
      });
      return shopInvitationsModelVue.present();
    }

    const deleteInvitationFromState = (invitation: any) => {
      for (let i = 0; i < state.invitations.length; i++) {
        if(state.invitations[i].id == invitation.id){
          state.invitations.splice(i, 1)
        }
      }
    }
    const manageDeleteInvitationState = (invitation: any, isDisabled: boolean) => {
      for (let i = 0; i < state.invitations.length; i++) {
        if(state.invitations[i].id == invitation.id){
          state.invitations[i].disabledDeleteButton = isDisabled
        }
      }
    }
    const onClickDeleteInvitation = (invitation: any)=>{
      if(!confirm('Are you sure you want to delete the invite?')){
        return;
      }
      if(!invitation.token){
        deleteInvitationFromState(invitation)
        return
      }
      manageDeleteInvitationState(invitation,true)
      deleteInvitation(invitation.id).then(res=>{
        if(res.data.success) {
          deleteInvitationFromState(invitation);
        }else{
           manageDeleteInvitationState(invitation,false)
        }
      }).catch(err=>{
        alert("Unable to delete invitaion. Please check your internet.");
        manageDeleteInvitationState(invitation,false)
      })
    }

    return {
      ...toRefs(state),
      updateShop,
      router,
      openShopInvitationsModal,
      checkmark,
      close,
      onClickDeleteInvitation
    };
  },
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect,
    WebhookContainer,
  },
};
</script>

<style scoped>
.card-title {
  margin: 10px 0px;
  text-align: left;
}
</style>
