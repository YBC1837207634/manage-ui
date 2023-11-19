import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from '@/App.vue'
import VueRouter from 'vue-router'
import router from '@/router';
import store from '@/store'
import { 
  Button, 
  Select, 
  Form, 
  FormItem, 
  Input, 
  Header, 
  Aside, 
  Main, 
  Container ,
  Table,
  TableColumn,
  Col,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Pagination,
  PageHeader,
  Loading,
  Empty,
  MessageBox,
  Message,
  Dialog,
  Option,
  Divider,
  Badge,
  RadioGroup,
  RadioButton,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Tabs,
  TabPane,
  Radio,
  Popover,
  Tag,
  Switch,
  DatePicker,
  Tree,
  Calendar,
  Upload,
  Notification

} from 'element-ui';

import 'default-passive-events'
import Scrollbar from 'element-ui/packages/scrollbar'
import '@/assets/css/index.css'
import { hasPermi } from './utils/permissionUtils';
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import 'animate.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Loading.directive)  // v-loading
Vue.use(Scrollbar)

Vue.use(mavonEditor)  // 富文本
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.component(Container.name, Container);
Vue.component(Header.name, Header);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Col.name, Col);
Vue.component(Menu.name, Menu);
Vue.component(Submenu.name, Submenu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(MenuItemGroup.name, MenuItemGroup);
Vue.component(Pagination.name, Pagination);
Vue.component(PageHeader.name, PageHeader);
Vue.component(Empty.name, Empty);
Vue.component(Dialog.name, Dialog);
Vue.component(Option.name, Option);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(RadioButton.name, RadioButton);
Vue.component(Avatar.name, Avatar);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(Card.name, Card);
Vue.component(TabPane.name, TabPane);
Vue.component(Tabs.name, Tabs);
Vue.component(Radio.name, Radio);
Vue.component(Popover.name, Popover)
Vue.component(Tag.name, Tag)
Vue.component(Switch.name, Switch)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Tree.name, Tree)
Vue.component(Calendar.name, Calendar)
Vue.component(Upload.name, Upload)
Vue.component(Notification.name, Notification)

Vue.prototype.$hasPermi = hasPermi
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

new Vue({
  render: h => h(App),
  router, store,
}).$mount('#app')
