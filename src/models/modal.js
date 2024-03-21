import Modal from "../components/Modal/Modal.vue"; 

const ModalPlugin = {
  install(Vue) {
    Vue.component("modal", Modal);
  },
};

export default ModalPlugin;
