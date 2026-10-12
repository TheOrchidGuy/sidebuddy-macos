# Side Buddy for macOS

A work-in-progress local Electron app for saving snippets, terminal commands,
setup notes, and copy/paste reminders. The current application version is 0.3.0.

## What it does

- Save notes and terminal commands
- Categorize notes
- Search saved notes
- Copy a note body to clipboard
- Edit notes
- Delete notes
- Stores data locally on your Mac in Electron's app user data folder

## How to run it

Clone the repository, install the dependencies, and start the app:

```bash
git clone https://github.com/TheOrchidGuy/sidebuddy-macos.git
cd sidebuddy-macos
npm install
npm start
```

If you already have Node and npm installed, this should launch the app.

## Notes

Project archives, packaged applications, build output, and `node_modules` are not
stored in Git. Run `npm install` after cloning the repository.

## Project status

Side Buddy is under active design and development. The current repository is a
working baseline; interface and interaction refinements will be recorded as
subsequent commits.
