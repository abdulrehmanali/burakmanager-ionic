<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Receivings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- <ion-searchbar @input="onSearch($event.target.value)" show-cancel-button="focus" animated v-on:ionCancel="onSearch('')"/> -->
      <ion-spinner v-if="loading" class="loader" />
      <ion-note v-if="!loading" class="ion-text-center status-text">{{receivings.length}} receivings Found</ion-note>
      <ion-grid v-if="receivings.length" class="table">
        <ion-row>
          <ion-col size="1">#</ion-col>
          <ion-col>Date</ion-col>
          <ion-col>Customer Name</ion-col>
          <ion-col>Method</ion-col>
          <ion-col>Status</ion-col>
          <ion-col>Amount</ion-col>
          <ion-col>Action</ion-col>
        </ion-row>
        <ion-row v-for="receiving in receivings" :key="receiving.id">
          <ion-col size="1">{{receiving.id}}</ion-col>
          <ion-col>{{new Date(receiving.created_at).toLocaleDateString()}}</ion-col>
          <ion-col>{{ receiving.customer.name }}</ion-col>
          <ion-col>
            {{ receiving.method }}
          </ion-col>
          <ion-col>
            <span
            :class="
                'badge ' +
                (receiving.status === 'received'
                  ? 'green-badge'
                  : 'warning-badge')
              "
            >{{ receiving.status }}</span>
          </ion-col>
          <ion-col>
              {{ receiving.amount }}
          </ion-col>
          <ion-col>
            <router-link
                :to="'/receivings/' + receiving.id"
                class="no-underline"
              >
            <ion-button>View</ion-button>
            </router-link>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- <ion-list v-if="receivings.length">
        <ion-item
          v-for="(receiving, key) in receivings"
          :key="key"
          :value="key"
          v-on:click="router.push('/receivings/' + receiving.id)"
          lines="none"
        >
          <ion-label>
            <h2>{{ receiving.method }}</h2>
            <h3>{{ receiving.customer.name }}</h3>
          </ion-label>
        </ion-item>
      </ion-list> -->
      <!-- <ion-infinite-scroll
        @ionInfinite="loadMore($event)" 
        threshold="100px" 
        id="infinite-scroll"
        :disabled="loadMoreDisabled || perPage > receivings.length"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll> -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <router-link to="/receivings/new">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </router-link>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonFab, IonFabButton, onIonViewWillEnter } from "@ionic/vue";
import { useRouter } from "vue-router";
import { add } from "ionicons/icons";
import { reactive, toRefs } from "@vue/reactivity";
import { allReceivings } from "@/services/receivings.services";

export default {
  name: "Receivings",
  setup() {
    const router = useRouter();
    const state = reactive({
      receivings: [] as any,
      search:"",
      loadMoreDisabled: false,
      loading: true,
      lastDocument:{},
      perPage:10,
      errorMsg:""
    });
    allReceivings().then(res=>{
      state.loading = false
      state.receivings = res.data.receivings
    }).catch(err=>{
      console.error(err)
    })

    return { ...toRefs(state), router, add};
  },
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton
  },
};
</script>

<style scoped>
.status-text {
  width:100%;
  display:block;
  margin:5px 0;
}
.badge {
  display: inline-block;
  padding: 3px 6px;
  margin: 5px 5px 0 0;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
}
.green-badge {
  background-color: #42d77d;
  color: #ffffff;
}
.warning-badge {
  background-color: #ffc408;
  color: #000;
}
.blue-badge {
  background-color: #438cff;
  color: #ffffff;
}
ion-grid.table ion-col{
  border: 0.5px solid var(--ion-color-dark);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
