<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
            <ion-card-header>
                <ion-card-title>Sign Up</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <form @submit.prevent="signUpWithEmailAndPassword(name, email, password, phoneNumber)">
                  <ion-item>
                      <ion-label position="floating">Name*</ion-label>
                      <ion-input v-model="name" @input="name = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item v-if="errorMsg.name">
                    <ion-label class="error-text">{{ errorMsg.name.toString() }}</ion-label>
                  </ion-item>
                  <ion-item>
                      <ion-label position="floating">Email*</ion-label>
                      <ion-input v-model="email" type="email" @input="email = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item v-if="errorMsg.email">
                    <ion-label class="error-text">{{ errorMsg.email.toString() }}</ion-label>
                  </ion-item>
                  <ion-item>
                      <ion-label position="floating">Phone Number*</ion-label>
                      <ion-input v-model="phoneNumber" @input="phoneNumber = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item v-if="errorMsg.phone_number">
                    <ion-label class="error-text">{{ errorMsg.phone_number.toString() }}</ion-label>
                  </ion-item>
                  <ion-item>
                      <ion-label position="floating">Password*</ion-label>
                      <ion-input v-model="password" type="password" @input="password = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item v-if="errorMsg.password">
                    <ion-label class="error-text">{{ errorMsg.password.toString() }}</ion-label>
                  </ion-item>
                  <ion-item> 
                      <ion-label position="floating">Confirm Password*</ion-label>
                      <ion-input v-model="confirmPassword" type="password" @input="confirmPassword = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-button expand="block" type="submit">Sign Up</ion-button>
                  <ion-button
                    color="medium"
                    expand="block"
                    @click="() => router.push('/login')"
                    >Login</ion-button
                  >
                </form>
            </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content v-if="errorMsg && (!errorMsg.email && !errorMsg.password && !errorMsg.name && !errorMsg.phone_number)"  class="error-message">
          {{ errorMsg }}
        </ion-card-content>
      </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {reactive, toRefs} from "vue";
import { IonContent, IonPage } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { signup } from "@/services/user.service"
import { Storage } from '@ionic/storage';

export default {
  name: 'Signup',
  components: {
    IonContent,
    IonPage
  },
    setup() {
    const router = useRouter();
    const store = new Storage();
    const state = reactive({
      name: "",
      email: "",
      password: "",
      phoneNumber:"",
      errorMsg: "",
    });
    const signUpWithEmailAndPassword = async (
      name: string,
      email: string,
      password: string,
      phoneNumber: string
    ) => {
      await store.create()
      state.errorMsg = '';
      if (!name || !email || !password || !phoneNumber) {
        state.errorMsg = "Name, Email,Phone Number, and Password Required";
        return;
      }
      if (!email || !password) {
      state.errorMsg = "Email and Password is Required";
      return;
    }
    signup(name, phoneNumber, email, password).then(async (res: any)=>{
      if(!res.data || !res.data.user || !res.data.token){
        state.errorMsg = "Error please try again";
        return;
      }
      await store.set('user',res.data.user);
      await store.set('token',res.data.token);
      location.href = "/";
    }).catch(err=>{
      console.log({err});
      if(!err.response || !err.response.data){
        state.errorMsg = "Error please try again";
      }
      if(err.response.data.error) {
        state.errorMsg = err.response.data.error
      }else if (err.response.data.errors){
        state.errorMsg = err.response.data.errors
      }
    })
    };
    return {
      ...toRefs(state),
      signUpWithEmailAndPassword,
      router
    };
  },
}
</script>

<style scoped>
#container {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top:50px;
  flex-direction: column;
  align-items: center;
}
#container ion-card{
  max-width: 720px;
  width: 100%;
}
.error-message {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
  text-align: center;
}

.error-text {
  color: #842029;
}
</style>