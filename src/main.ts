import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


const pinia = createPinia();
const app = createApp(App);

app.component('Toast', Toast);

app.use(router);
app.use(pinia);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.mount('#app');