import { h } from 'vue';
import useThree from './useThree';

export default {
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    mouseMove: { type: [Boolean, String], default: false },
    mouseRaycast: { type: Boolean, default: false },
    mouseClick: { type: Boolean, default: false },
    orbitCtrl: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String, Element], default: 'window' },
    shadow: Boolean,
    width: String,
    height: String,
    xr: Boolean,
  },
  setup() {
    return {
      three: useThree(),
      raf: true,
      onMountedCallbacks: [],
    };
  },
  provide() {
    return {
      three: this.three,
      // renderer: this.three.renderer,
      rendererComponent: this,
    };
  },
  mounted() {
    const params = {
      canvas: this.$refs.canvas,
      antialias: this.antialias,
      alpha: this.alpha,
      autoClear: this.autoClear,
      orbit_ctrl: this.orbitCtrl,
      mouse_move: this.mouseMove,
      mouse_click: this.mouseClick,
      mouse_raycast: this.mouseRaycast,
      resize: this.resize,
      width: this.width,
      height: this.height,
      xr: this.xr,
    }

    if (this.three.init(params)) {
      this.three.renderer.shadowMap.enabled = this.shadow;
      if (params.xr) {
        this.three.renderer.xr.enabled = params.xr;
      }
      this.three.renderer.setAnimationLoop(this.animate)
    };

    this.onMountedCallbacks.forEach(c => c());
  },
  beforeUnmount() {
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    onMounted(callback) {
      this.onMountedCallbacks.push(callback);
    },
    onBeforeRender(callback) {
      this.three.onBeforeRender(callback);
    },
    onAfterResize(callback) {
      this.three.onAfterResize(callback);
    },
    animate() {
      if (this.raf) this.three[this.three.composer ? 'renderC' : 'render']();
    }
  },
  render() {
    return h(
      'canvas',
      { ref: 'canvas' },
      this.$slots.default()
    );
  },
};
