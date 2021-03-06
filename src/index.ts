import {
  activate as activateBackend,
  createBridge as createBackendBridge,
  initialize as initializeBackend,
  //@ts-ignore
} from "react-devtools-inline/backend";
import {
  createBridge as createFrontendBridge,
  createStore,
  initialize as createDevTools,
  //@ts-ignore
} from "react-devtools-inline/frontend";
import { Store } from "./bridgeOperations";

// import { showDevtoolsWarning } from "./warning";
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

// if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers.size === 0) {
//   console.log("delete devtools", window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
//   delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
// } else if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers.size > 0) {
//   console.log("show warning devtools", window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
//   showDevtoolsWarning();
// }

const wall = {
  //@ts-ignore
  listen(listener) {
    window.addEventListener("message", (event) => {
      listener(event.data);
    });
  },
  //@ts-ignore
  send(event, payload) {
    window.parent.postMessage({ event, payload }, "*");
  },
};

const frontBridge = createFrontendBridge(window, wall);
// const store = new Store()
const store: Store = createStore(frontBridge);
//@ts-ignore
wall.listen((data) => {
  if (data.event === "operations") {
    // store.onBridgeOperations(data.payload);
    const devtoolsTree = store._idToElement;
    //@ts-ignore
    window.devtoolsTree = devtoolsTree;
  }
});

//@ts-ignore
window.frontendDevTools = createDevTools(window, {
  bridge: frontBridge,
  store,
});

initializeBackend(window);
activateBackend(window, {
  bridge: createBackendBridge(window, wall),
});
