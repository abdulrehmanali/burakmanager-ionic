<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/customers"></ion-back-button>
        </ion-buttons>
        <ion-title>New Customer</ion-title>
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
                        v-model="name"
                        @input="name = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Contact Number</ion-label>
                      <ion-input
                        v-model="phoneNumber"
                        type="phonenumber"
                        @input="phoneNumber = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Email</ion-label>
                      <ion-input
                        v-model="email"
                        type="email"
                        @input="email = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Address</ion-label>
                      <ion-textarea
                        v-model="address"
                        type="text"
                        @input="address = $event.target.value"
                      ></ion-textarea>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">NTN</ion-label>
                      <ion-input
                        v-model="ntn"
                        type="text"
                        @input="ntn = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Company Name</ion-label>
                      <ion-input
                        v-model="companyName"
                        type="text"
                        @input="companyName = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-button expand="block" v-on:click="createNewCustomer()" :disabled="disableSave">Create</ion-button>
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
import { IonContent, IonPage, IonBackButton, onIonViewWillLeave } from "@ionic/vue";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { createCustomer } from "@/services/customers.services";

export default {
  name: "NewCustomer",
  components: {
    IonContent,
    IonPage,
    IonBackButton
  },
  setup() {
    const stateDefault = {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      ntn: "",
      companyName: "",
      errorMsg: "",
      disableSave:false
    }
    let state = reactive(stateDefault);
    const createNewCustomer = async () => {
      state.disableSave = true;
      createCustomer(state.name, state.email, state.phoneNumber, state.address, state.ntn, state.companyName).then(res=>{
        router.push('/customers');
      }).catch(error=>{
        state.disableSave = false;
        if(!error.response || !error.response.data){
          state.errorMsg = "Error please try again";
          return;
        }
        if(error.response.data.errors){
          state.errorMsg = error.response.data.errors;
          return
        }
        state.errorMsg = error.response.data.error;
      })
    };
    onIonViewWillLeave(() => {
      state = reactive(stateDefault)
    });
    return { ...toRefs(state), createNewCustomer };
  },
};
</script>

<style scoped></style>
