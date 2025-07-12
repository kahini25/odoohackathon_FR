# odoohackathon_FR

Team Name: Team 0484
Problem Statement: StackIt – A Minimal Q&A Forum Platform

# StackIt


A modern, Quora-style Q&A forum web app for sharing knowledge, asking questions, and engaging in threaded discussions. StackIt features a beautiful, responsive UI, social and guest login, and a dynamic Q&A experience.

---

## Features

- **Modern Quora-like UI**: Clean, responsive design with a focus on usability and aesthetics.
- **Authentication**:
  - Email/password login and registration
  - Social login (Google, Facebook)
  - Guest access (read-only, restricted actions)
- **Session Management**: User info stored in `localStorage` for persistent sessions.
- **Q&A Functionality**:
  - Ask questions with rich text and tags
  - Answer questions (with rich text)
  - Reddit-style threaded comments (demo)
  - Voting on questions and answers
  - Accept answers (by question owner)
  - Export answers as PDF
- **Notifications**: In-app notification dropdown for user actions
- **Dark Mode**: Toggleable dark/light theme
- **Community Stats & Popular Tags**: Sidebar widgets for engagement
- **Role-based UI**: Guest, User, and Admin roles with appropriate restrictions

---

## Tech Stack

- **Frontend**: HTML5, CSS3 (custom, no frameworks), JavaScript (ES6+)
- **No build tools required**: Pure static files, works in any modern browser

---

## File Structure

```
odoo/
├── odoo.html        # Main Q&A forum page
├── login.html       # Login & registration page
├── icon.jpg         # Site icon/logo
├── README.md        # Project documentation
```

---

## User Roles & Permissions

| Role   | Can Ask | Can Answer | Can Vote | Can Accept | Can Export | Can Read |
|--------|---------|-----------|----------|------------|------------|----------|
| Guest  | ❌      | ❌        | ❌       | ❌         | ✅         | ✅       |
| User   | ✅      | ✅        | ✅       | ✅ (own Q) | ✅         | ✅       |
| Admin  | (future)| (future)  | (future) | (future)   | ✅         | ✅       |

- **Guest**: Can browse, view, and export answers, but cannot post or vote.
- **User**: Full participation (ask, answer, vote, accept answers).
- **Admin**: Reserved for future moderation features.

---

## Setup & Usage

1. **Clone or Download** this repository.
2. **Open `login.html`** in your browser to start.
3. **Login/Register** with email, Google, Facebook, or continue as guest.
4. **Explore Q&A**: Ask, answer, vote, and interact on `odoo.html`.

> No server setup required. All data is in-memory (demo only). For production, connect to a backend (see below).

---

## Demo Credentials

- **Google/Facebook**: Simulated login (no real OAuth)
- **Email**: Any valid email/password (password: min 8 chars, 1 uppercase, 1 lowercase, 1 number)
- **Guest**: Click "Continue as guest"

---

## Customization & Extending

- **Backend Integration**: Replace in-memory arrays with API calls to connect to a real database (MongoDB, Firebase, etc.).
- **Add Features**: Moderation, reporting, user profiles, etc.
- **Styling**: Tweak CSS variables for custom themes.

---

## Screenshots

> Add screenshots of login and Q&A pages here for best effect.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

- UI inspired by Quora and Stack Overflow
- Icons: [Devicon](https://devicon.dev/)
- Built with ❤️ for Odoo Hackathon '25 
