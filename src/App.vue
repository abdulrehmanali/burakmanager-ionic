<template>
  <IonApp>
    <IonSplitPane content-id="main-content">
      <ion-menu
        content-id="main-content"
        type="overlay"
        v-if="$route.meta.haveSideBar"
      >
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>{{ user.name }}</ion-list-header>
            <ion-note>{{ selectedShop && selectedShop.shop?.name }}</ion-note>

            <ion-menu-toggle
              auto-hide="false"
              v-for="(p, i) in appPages"
              :key="i"
            >
              <ion-item
                router-direction="root"
                :router-link="p.url"
                lines="none"
                detail="false"
                class="hydrated"
                :class="{ selected: p.url === router.fullPath }"
                v-if="selectedShop?.id != null && checkIfUserHavePermission(p)"
              >
                <ion-icon
                  slot="start"
                  :ios="p.iosIcon"
                  :md="p.mdIcon"
                ></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <ion-item
              v-on:click="logOut()"
              lines="none"
              detail="false"
              class="hydrated"
            >
              <ion-icon
                slot="start"
                :ios="logOutSharp"
                :md="logOutOutline"
              ></ion-icon>
              <ion-label>Log Out</ion-label>
            </ion-item>
          </ion-list>
          <ion-item>
            <ion-label>Selected Shop</ion-label>
            <ion-select
              :placeholder="
                selectedShop && (selectedShop.shop?.name ? selectedShop.shop?.name : 'Select One')
              "
              @ionChange="selectShop($event.target.value)"
              multiple="false"
              :value="selectedShop.shop?.id"
              :interface-options="userShops"
            >
              <ion-select-option
                v-for="shop in userShops"
                :key="shop.shop.id"
                :value="shop.shop.id"
                :selected="shop.shop.id == selectedShop.id"
                >{{ shop.shop.name }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </IonSplitPane>
  </IonApp>
</template>

<script lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
  IonSelect,
} from "@ionic/vue";
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import {
  cardOutline,
  cardSharp,
  readerOutline,
  cashSharp,
  cashOutline,
  readerSharp,
  homeOutline,
  homeSharp,
  cubeOutline,
  cubeSharp,
  storefrontOutline,
  storefrontSharp,
  personOutline,
  personSharp,
  calculatorOutline,
  calculatorSharp,
  logOutOutline,
  logOutSharp,
} from "ionicons/icons";
import { all } from "@/services/shops.services";
import { Storage } from "@ionic/storage";
import { emitter } from "@/services/emitter";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRouterOutlet,
    IonSplitPane,
    IonSelect,
  },
  setup() {
    const state = reactive({
      user: {},
      userShops: [],
      selectedShop: {
        id: null,
        name: null,
      } as any,
    });
    const appPages = [
      {
        title: "Home",
        url: "/",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
        permissions: [],
      },
      {
        title: "Shops",
        url: "/shops",
        iosIcon: storefrontOutline,
        mdIcon: storefrontSharp,
        permissions: [],
      },
      {
        title: "Products",
        url: "/products",
        iosIcon: cubeOutline,
        mdIcon: cubeSharp,
        permissions: ["can_create_products", "can_edit_products"],
      },
      {
        title: "Production Products",
        url: "/production-products",
        iosIcon: calculatorOutline,
        mdIcon: calculatorSharp,
        permissions: [],
      },
      {
        title: "Customers / Sellers",
        url: "/customers",
        iosIcon: personOutline,
        mdIcon: personSharp,
        permissions: ["can_create_customers", "can_edit_customers"],
      },
      {
        title: "Ledger",
        url: "/ledger",
        iosIcon: readerOutline,
        mdIcon: readerSharp,
        permissions: [
          "can_create_entries_in_ledger",
          "can_edit_entries_in_ledger",
        ],
      },
      {
        title: "Receivings",
        url: "/receivings",
        iosIcon: cashOutline,
        mdIcon: cashSharp,
        permissions: [
          "can_create_entries_in_ledger",
          "can_edit_entries_in_ledger",
        ],
      },
    ];
    const router = useRouter();
    const store = new Storage();
    const loadShops = () => {
      all()
        .then(async (res) => {
          state.userShops = res.data.shops;
          if (!state.userShops || state.userShops.length == 0) {
            router.push("/shops/new");
          } else if (!state.selectedShop || state.selectedShop.id === null) {
            state.selectedShop = state.userShops[0];
            await store.set("selectedShop", JSON.stringify(state.selectedShop));
          }
        })
        .catch(() => {
          alert("Please check your internet");
        });
    };
    const setupApp = async () => {
      await store.create();
      state.user = await store.get("user");
      if (!state.user) {
        return;
      }
      const selectedShop = await store.get('selectedShop')
      state.selectedShop = JSON.parse(selectedShop);
      loadShops();
    };
    
    const selectShop = async (e: any) => {
      state.userShops.forEach(async (shop: any) => {
        if (shop.shop.id == e) {
          state.selectedShop = shop;
          await store.set("selectedShop", JSON.stringify(shop));
          router.push("/");
        }
      });
    };
    const logOut = async () => {
      await store.clear();
      router.push("/login");
    };

    emitter.on("sidebar_load_shops", () => {
      loadShops();
    });

    const checkIfUserHavePermission = (p: any) => {
      if (p.permissions.length == 0) {
        return true
      }
      let havePermission = false;
      for (let index = 0; index < p.permissions.length; index++) {
        if (
          state.selectedShop[p.permissions[index]] !== null &&
          state.selectedShop[p.permissions[index]]
        ) {
          havePermission = true;
          break;
        }
      }
      return havePermission;
    };
    setupApp()
    return {
      ...toRefs(state),
      selectShop,
      appPages,
      cardOutline,
      cardSharp,
      readerOutline,
      readerSharp,
      homeOutline,
      homeSharp,
      cubeOutline,
      cubeSharp,
      storefrontOutline,
      storefrontSharp,
      personOutline,
      personSharp,
      calculatorOutline,
      calculatorSharp,
      logOutOutline,
      logOutSharp,
      logOut,
      router,
      checkIfUserHavePermission,
    };
  },
});
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;
  margin-bottom: 18px;
  color: #757575;
  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
