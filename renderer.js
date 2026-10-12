let notes = [];
let editingId = null;

const titleInput = document.getElementById('titleInput');
const categoryInput = document.getElementById('categoryInput');
const bodyInput = document.getElementById('bodyInput');
const saveButton = document.getElementById('saveButton');
const clearFormButton = document.getElementById('clearFormButton');
const searchInput = document.getElementById('searchInput');
const notesList = document.getElementById('notesList');
const statusMessage = document.getElementById('statusMessage');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setStatus(message) {
  statusMessage.textContent = message;
  if (message) {
    setTimeout(() => {
      statusMessage.textContent = '';
    }, 2200);
  }
}

function resetForm() {
  editingId = null;
  titleInput.value = '';
  categoryInput.value = 'Terminal';
  bodyInput.value = '';
  saveButton.textContent = 'Save note';
  titleInput.focus();
}

function renderNotes() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = notes.filter(note => {
    const searchable = `${note.title} ${note.category} ${note.body}`.toLowerCase();
    return searchable.includes(searchTerm);
  });

  if (filtered.length === 0) {
    notesList.innerHTML = `<div class="empty-state">No notes found. Add one on the left and make this tiny beast useful.</div>`;
    return;
  }

  notesList.innerHTML = filtered.map(note => `
    <article class="note-card">
      <div class="note-header">
        <div>
          <div class="note-title">${escapeHtml(note.title || 'Untitled')}</div>
          <div class="category-pill">${escapeHtml(note.category || 'General')}</div>
        </div>
      </div>
      <pre class="note-body">${escapeHtml(note.body || '')}</pre>
      <div class="note-actions">
        <button class="tiny-button" data-action="copy" data-id="${note.id}">Copy</button>
        <button class="tiny-button" data-action="edit" data-id="${note.id}">Edit</button>
        <button class="tiny-button danger" data-action="delete" data-id="${note.id}">Delete</button>
      </div>
    </article>
  `).join('');
}

async function loadNotes() {
  notes = await window.sideBuddy.getNotes();
  renderNotes();
}

async function saveCurrentNote() {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title && !body) {
    setStatus('Add a title or note first.');
    return;
  }

  notes = await window.sideBuddy.saveNote({
    id: editingId,
    title: title || 'Untitled',
    category: categoryInput.value,
    body
  });

  resetForm();
  renderNotes();
  setStatus('Saved.');
}

async function handleNoteAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  const note = notes.find(item => item.id === id);

  if (!note) return;

  if (action === 'copy') {
    await window.sideBuddy.copyText(note.body);
    setStatus('Copied to clipboard.');
  }

  if (action === 'edit') {
    editingId = note.id;
    titleInput.value = note.title;
    categoryInput.value = note.category;
    bodyInput.value = note.body;
    saveButton.textContent = 'Update note';
    titleInput.focus();
  }

  if (action === 'delete') {
    const confirmed = confirm(`Delete "${note.title}"?`);
    if (!confirmed) return;

    notes = await window.sideBuddy.deleteNote(id);
    renderNotes();
    setStatus('Deleted.');
  }
}

saveButton.addEventListener('click', saveCurrentNote);
clearFormButton.addEventListener('click', resetForm);
searchInput.addEventListener('input', renderNotes);
notesList.addEventListener('click', handleNoteAction);

loadNotes();
