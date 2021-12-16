import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import firebase from 'firebase'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './registerServiceWorker'

const firebaseConfig = {  
  apiKey: "AIzaSyC8DbsUxHvzGccLVO1WSP9PqgCR7l19lic",
  authDomain: "burakmanager.firebaseapp.com",
  databaseURL: "https://burakmanager-default-rtdb.firebaseio.com",
  projectId: "burakmanager",
  storageBucket: "burakmanager.appspot.com",
  messagingSenderId: "365604377376",
  appId: "1:365604377376:web:b54f5759b392578f873d45",
  measurementId: "G-JMDTK00VM9"
};
firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics()
export const db = firebase.firestore();
export const auth = firebase.auth();
export const getCurrentUser = new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
      }, reject);
  });

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});