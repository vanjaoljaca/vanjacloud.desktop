import {Backend} from "./Backend";

const {
  contextBridge,
  ipcRenderer
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("electron");

/**
 * This backend api is exposed to the frontend
 * The render thread calls this to send messages to backend
 */
const backendIpcProxy: Backend = {
  send: (channel: string, data: any) => {
    console.log('IpcRendererBackend.send', channel, data)
    ipcRenderer.send(channel, data);
  },

  receive: (channel: string, func: any) => {
    console.log('IpcRendererBackend.receive', channel, func)
    ipcRenderer.on(channel, (event: any, ...args: any) => func(...args));
  },

  request: (channel: string, data: any) => {
    console.log('IpcRendererBackend.request', channel, data)
    return ipcRenderer.invoke(channel, data);
  },
}


contextBridge.exposeInMainWorld('backend', backendIpcProxy);