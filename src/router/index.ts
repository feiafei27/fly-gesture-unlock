import { createRouter, createWebHashHistory } from 'vue-router';

import InitialSetup from '../views/initial-setup.vue';
import Verification from '../views/verification.vue';
import Modify from '../views/modify.vue';
import ArbitraryNum from '../views/arbitrary-num.vue';
import ArbitraryLocationSize from '../views/arbitrary-location-size.vue';
import RepeatSelect from '../views/repeat-select.vue';
import ExtraStatus from '../views/extra-status.vue';
import CustomStyle from '../views/custom-style.vue';
import LineAutoSelect from '../views/line-auto-select.vue';

const routes = [
  { path: '/', component: InitialSetup },
  { path: '/verification', component: Verification },
  { path: '/modify', component: Modify },
  { path: '/arbitraryNum', component: ArbitraryNum },
  { path: '/arbitraryLocationSize', component: ArbitraryLocationSize },
  { path: '/repeatSelect', component: RepeatSelect },
  { path: '/extraStatus', component: ExtraStatus },
  { path: '/customStyle', component: CustomStyle },
  { path: '/lineAutoSelect', component: LineAutoSelect },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
