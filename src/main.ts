import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "./store/auth";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
const authStore = useAuthStore();

authStore.init();

app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.component("Toast", Toast);

app.mount("#app");
