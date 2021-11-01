<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Login</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form @submit.prevent="signInWithEmailAndPassword(email, password)">
              <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input
                  type="email"
                  v-model="email"
                  @input="email = $event.target.value"
                ></ion-input>
              </ion-item>
              <ion-item v-if="errorMsg.email">
                <ion-label class="error-text">{{ errorMsg.email.toString() }}</ion-label>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Password</ion-label>
                <ion-input
                  type="password"
                  v-model="password"
                  @input="password = $event.target.value"
                ></ion-input>
              </ion-item>
              <ion-item v-if="errorMsg.password">
                <ion-label class="error-text">{{ errorMsg.password.toString() }}</ion-label>
              </ion-item>
              <ion-button type="submit" expand="block">Login</ion-button>
            </form>
            <ion-button
              color="medium"
              expand="block"
              @click="() => router.push('/signup')"
              >Sign Up</ion-button
            >
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content v-if="errorMsg && (!errorMsg.email && !errorMsg.password)" class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { login } from "@/services/user.service"
import { Storage } from '@ionic/storage';

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const store = new Storage();
    const state = reactive({
      email: "",
      password: "",
      errorMsg: "",
    });
    const signInWithEmailAndPassword = async (email: string, password: string) => {
      await store.create()
      state.errorMsg = '';
      if (!email || !password) {
        state.errorMsg = "Email and Password is Required";
        return;
      }
      login(email, password).then(async (res: any)=>{
        const data = res.data;
        console.log({data}, data.user, data.token)
        if(!data.user || !data.token){
          state.errorMsg = "Error please try again";
          return;
        }
        await store.set('user',JSON.stringify(data.user));
        await store.set('token',data.token);
        location.href = "/";
      }).catch(err=>{
        console.log(err);
        if(!err.response || !err.response.data){
          state.errorMsg = "Error please try again";
          return
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
      signInWithEmailAndPassword,
      router,
    };
  },
  components: {
    IonContent,
    IonPage,
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 100px;
  flex-direction: column;
  align-items: center;
}
#container ion-card {
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
