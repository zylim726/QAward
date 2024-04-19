import Modal from "@/components/Pop-Up-Modal/Modal.vue";

const ModalPlugin = {
  install(Vue) {
    Vue.component("modal", Modal);
  },
};

export default ModalPlugin;
