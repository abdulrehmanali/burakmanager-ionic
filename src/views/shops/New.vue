<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/shops"/>
        </ion-buttons>
        <ion-title>New Shop</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>New Shop</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label position="floating">Name</ion-label>
                <ion-input v-model="name" @input="name = $event.target.value"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Address</ion-label>
                <ion-textarea
                  clear-on-edit="true"
                  v-model="address"
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
          <ion-card-content v-if="invitations.length">
            <ion-grid v-for="(invitation, key) in invitations" :key="key">
              <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-label position="stacked">Email</ion-label>
                    <ion-input v-model="invitation.email" @keyup="invitation.email = $event.target.value" :value="invitation.email"></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Entries In Ledger</ion-label>
                    <ion-toggle
                      v-model="invitation.can_create_entries_in_ledger"
                      @ionChange="invitation.can_create_entries_in_ledger = $event.target.checked"
                      :checked="invitation.can_create_entries_in_ledger">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Entries In Ledger</ion-label>
                    <ion-toggle
                      v-model="invitation.can_edit_entries_in_ledger"
                      @ionChange="invitation.can_edit_entries_in_ledger = $event.target.checked"
                      :checked="invitation.can_edit_entries_in_ledger">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Customers</ion-label>
                    <ion-toggle
                      v-model="invitation.can_create_customers"
                      @ionChange="invitation.can_create_customers = $event.target.checked"
                      :checked="invitation.can_create_customers">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Customers</ion-label>
                    <ion-toggle
                      v-model="invitation.can_edit_customers"
                      @ionChange="invitation.can_edit_customers = $event.target.checked"
                      :checked="invitation.can_edit_customers">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                </ion-row>
              <ion-row>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Create Products</ion-label>
                    <ion-toggle
                      v-model="invitation.can_create_products"
                      @ionChange="invitation.can_create_products = $event.target.checked"
                      :checked="invitation.can_create_products">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
                <ion-col size-md="6" size-sm="12">
                  <ion-item>
                    <ion-label>Edit Products</ion-label>
                    <ion-toggle
                      v-model="invitation.can_edit_products"
                      @ionChange="invitation.can_edit_products = $event.target.checked"
                      :checked="invitation.can_edit_products">
                    </ion-toggle>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content v-if="errorMsg" class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Actions</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-button expand="block" v-on:click="createNewShop()" :disabled="disabledCreateButton || !name || !address">Save</ion-button>
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
import { useRouter } from "vue-router";
import { emitter } from "@/services/emitter";
import { create } from "@/services/shops.services";
import currencyOptions from "@/data/currency-details.json";

export default {
  name: "NewShop",
  setup() {
    let shopInvitationsModelVue: any;
    const router = useRouter();
    const state = reactive({
      name: "",
      address: "",
      invitations:[] as any,
      disabledCreateButton:false,
      errorMsg: "",
      currency:"PKR",
      currencyOptions
    });
    state.name = "";
    state.address = "";
    state.errorMsg = "";
    emitter.on("add_new_invitation_model", async (invitation: any) => {
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
    const createNewShop = async () => {
      state.errorMsg = "";
      state.disabledCreateButton = true;
      if(!state.name || !state.address){
        state.errorMsg = "Please make sure you enter name and address";
        return;
      }
      create(state.name,state.address,state.currency,state.invitations).then(res=>{
        state.disabledCreateButton = false;
        router.push("/shops");
      }).catch(err=>{
        state.disabledCreateButton = false;
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

    return {
      ...toRefs(state),
      createNewShop,
      router,
      openShopInvitationsModal
    };
  },
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
}
#container ion-card {
  max-width: 720px;
  width: 100%;
}
.card-title {
  margin: 10px 0px;
  text-align: left;
}
</style>
