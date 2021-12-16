<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/customers"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Customer</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Name*</ion-label>
                      <ion-input
                        v-model="customer.name"
                        :value="customer.name"
                        @input="customer.name = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Contact Number</ion-label>
                      <ion-input
                        v-model="customer.contactNumber"
                        :value="customer.contactNumber"
                        @input="customer.contactNumber = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Email</ion-label>
                      <ion-input
                        v-model="customer.email"
                        :value="customer.email"
                        @input="customer.email = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-button expand="block" type="submit" :disabled="disableSave" @click="saveCustomer()">Save</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title>User Orders</ion-card-title>
          </ion-card-header>
          <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>Awesome Label</ion-label>
            </ion-item>
          </ion-list>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="errorMsg && (errorMsg instanceof String)">
          <ion-card-content class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>
        <ion-card v-if="errorMsg && (typeof errorMsg === 'object')">
          <ion-card-content class="error-message" v-for="msg in errorMsg" :key="msg[0]">
            {{ msg[0] }}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { updateCustomer, getCustomer } from "@/services/customers.services";
import { IonContent, IonPage, IonBackButton, IonButton } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import { useRoute } from "vue-router";
import router from "@/router";

export default {
  name: "EditCustomer",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonButton
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      customer: {} as any,
      id: id as string,
      errorMsg: "",
      disableSave:false
    });
    const getCustomerFromServer = async (id: string) => {
      try {
        state.disableSave = true;
        const customer = await getCustomer(id) as any;
        state.customer = customer.data.customer;
        state.disableSave = false;
      } catch (error) {
        state.disableSave = false;
        if(error.response.data.errors){
          state.errorMsg = error.response.data.errors;
          return
        }
        state.errorMsg = error.message;
      }
    };

    const saveCustomer = async () => {
      try {
        state.disableSave = true;
        updateCustomer(state.id, state.customer.name, state.customer.email, state.customer.phoneNumber)
        router.back();
        state.disableSave = false;
      } catch (error) {
        state.disableSave = false;
        if(error.response.data.errors){
          state.errorMsg = error.response.data.errors;
          return
        }
        state.errorMsg = error.message;
      }
    };
    getCustomerFromServer(id.toString());
    return { ...toRefs(state), saveCustomer, router };
  },
};
</script>

<style scoped></style>
