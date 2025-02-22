# Task Management Application

## Live Demo
[Task Management App](https://task-management-db2f8.web.app/)

## Description
This Task Management Application allows users to efficiently manage their tasks by adding, editing, deleting, and reordering them via a drag-and-drop interface. The app supports three categories: **To-Do, In Progress, and Done**, ensuring smooth task organization. Changes are instantly saved to the database for real-time synchronization.

## Features
- **Authentication**: Google sign-in using Firebase Authentication.
- **Task Management**:
  - Add, edit, delete, and reorder tasks.
  - Drag and drop tasks between categories.
  - Tasks persist in the database.
- **Database & Real-time Sync**:
  - Uses MongoDB and Express.js for backend storage.
  - Real-time updates using WebSockets & Optimistic UI updates.
- **Frontend UI**:
  - Built with Vite.js + React.
  - Drag-and-drop functionality using `@hello-pangea/dnd`.
  - Clean, minimalistic design with a maximum of four colors.
- **Responsiveness**:
  - Fully responsive for both desktop and mobile.
- **Bonus Features**:
  - Dark mode toggle.
  - Task due dates with color indicators.
  - Activity log to track task movements.

## Technologies Used
- **Frontend**: React, Vite.js, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Firebase
- **Real-time Updates**: WebSockets (socket.io-client), Optimistic UI
- **UI Libraries**: Framer Motion, React Icons, SweetAlert2

## Dependencies
```json
"dependencies": {
    "@hello-pangea/dnd": "^18.0.1",
    "@tanstack/react-query": "^5.66.7",
    "axios": "^1.7.9",
    "firebase": "^11.3.1",
    "framer-motion": "^12.4.5",
    "localforage": "^1.10.0",
    "match-sorter": "^8.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.2.0",
    "socket.io-client": "^4.8.1",
    "sort-by": "^1.2.0",
    "sweetalert2": "^11.17.2"
}
```

## Installation Steps
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/SudiptaRoy05/task-management-client.git
   ```

2. **Frontend Setup:**
   ```sh
   cd task-management-client
   npm install
   npm run dev
   ```
3. **Environment Variables:**
   - Configure Firebase API keys.
   - Set up MongoDB connection URI.
   - Define WebSocket server settings.


## Contributing
Feel free to fork and contribute! Open a pull request with your improvements.

