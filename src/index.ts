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

// import { showDevtoolsWarning } from "./warning";
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    __FRONTEND_DEVTOOLS__: any;
  }
}

// if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers.size === 0) {
//   console.log('delete devtools', window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
//   delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__
// } else if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers.size > 0) {
//   console.log('show warning devtools', window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
//   showDevtoolsWarning()
// }

// const store = new Store()
// window.addEventListener('message', ({ data }) => {
//   if (data.event === 'operations') {
//     store.onBridgeOperations(data.payload)
//     const devtoolsTree = store._idToElement
//     //@ts-ignore
//     window.devtoolsTree = devtoolsTree
//   }
// })

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

//@ts-ignore
wall.listen((data) => {
  console.log(data);
});

const rootElement = document.getElementById("root")!;
const frontBridge = createFrontendBridge(rootElement, wall);

const store = createStore(frontBridge);
window.__FRONTEND_DEVTOOLS__ = createDevTools(window, {
  bridge: frontBridge,
  store,
});
console.log("INITIALIZED FRONTEND");

// console.log(frontBridge);
// console.log(store);

initializeBackend(window);
console.log("INITIALIZED BACKEND");

activateBackend(window, {
  bridge: createBackendBridge(window, wall),
});
console.log("ACTIVATED BACKEND");
