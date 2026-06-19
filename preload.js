const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sideBuddy', {
  getNotes: () => ipcRenderer.invoke('notes:get'),
  saveNote: (note) => ipcRenderer.invoke('notes:save', note),
  deleteNote: (id) => ipcRenderer.invoke('notes:delete', id),
  copyText: (text) => ipcRenderer.invoke('clipboard:copy', text)
});
