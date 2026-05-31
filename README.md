# ExamEdge

A progressive web application (PWA) for managing and practicing medical exam questions, with support for Computer-Based Testing (CBT) and question import functionality.

## Features

- 📱 **Progressive Web App**: Works offline with service worker support
- 🧪 **CBT Interface**: Computer-based testing mode for exam preparation
- 📚 **Question Management**: Import and organize medical exam questions
- 👥 **User Authentication**: User registration and login system
- 🔧 **Admin Panel**: Manage questions and user data
- 💾 **Local Database**: Store questions and progress locally using IndexedDB

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js with Express (via database.js)
- **Database**: IndexedDB (client-side), with Python import tools
- **Other**: Service Worker, Web Manifest for PWA capabilities

## Project Structure

```
examedge/
├── index.html              # Main landing page
├── landing.html            # Landing/home page
├── cbt.html                # Computer-Based Testing interface
├── admin.html              # Admin dashboard
├── register.html           # User registration page
├── app.js                  # Main application logic
├── questions.js            # Question management functions
├── database.js             # Database operations
├── index.css               # Styling
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── import_aloc_questions.py # Python script for importing ALOC questions
├── aloc_raw_questions.json  # Raw ALOC question data
└── aloc_mapped_questions.json # Processed ALOC questions
```

## Getting Started

### Prerequisites
- Node.js and npm (for server)
- Python 3 (for question import script)
- Modern web browser with service worker support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lilly787/examedge.git
cd examedge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Importing Questions

To import ALOC questions:

```bash
python import_aloc_questions.py
```

This will process the raw questions and prepare them for use in the application.

## Usage

### For Students
1. **Register**: Create a new account on the registration page
2. **Login**: Access your account
3. **Practice**: Use the CBT interface to practice exam questions
4. **Track Progress**: Monitor your performance over time

### For Administrators
1. **Access Admin Panel**: Navigate to `/admin.html`
2. **Manage Questions**: Add, edit, or delete exam questions
3. **User Management**: View and manage user accounts
4. **Import Questions**: Use the Python script to bulk import questions

## Offline Support

The app includes a service worker that enables offline functionality. Once visited, the app will cache essential resources and continue to work even without an internet connection.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**ExamEdge** - Making exam preparation accessible and effective for everyone.
