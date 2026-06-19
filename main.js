const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(app.getPath('userData'), 'SideBuddyData');
const dataFile = path.join(dataDir, 'notes.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    const starterNotes = [
      {
        id: crypto.randomUUID(),
        title: 'Start Side Buddy',
        category: 'Terminal',
        body: 'cd ~/Desktop/side-buddy-mac\nnpm start',
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Install Node with Homebrew',
        category: 'Mac Setup',
        body: 'brew install node',
        createdAt: new Date().toISOString()
      }
    ];

    fs.writeFileSync(dataFile, JSON.stringify(starterNotes, null, 2));
  }
}

function readNotes() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (error) {
    return [];
  }
}

function writeNotes(notes) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 720,
    minWidth: 760,
    minHeight: 560,
    title: 'Side Buddy',
    backgroundColor: '#101827',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  ensureDataFile();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('notes:get', () => {
  return readNotes();
});

ipcMain.handle('notes:save', (event, note) => {
  const notes = readNotes();
  const cleanNote = {
    id: note.id || crypto.randomUUID(),
    title: String(note.title || 'Untitled').trim(),
    category: String(note.category || 'General').trim(),
    body: String(note.body || '').trim(),
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const existingIndex = notes.findIndex(item => item.id === cleanNote.id);
  if (existingIndex >= 0) {
    notes[existingIndex] = cleanNote;
  } else {
    notes.unshift(cleanNote);
  }

  writeNotes(notes);
  return notes;
});

ipcMain.handle('notes:delete', (event, id) => {
  const notes = readNotes().filter(note => note.id !== id);
  writeNotes(notes);
  return notes;
});

ipcMain.handle('clipboard:copy', (event, text) => {
  clipboard.writeText(String(text || ''));
  return true;
});
