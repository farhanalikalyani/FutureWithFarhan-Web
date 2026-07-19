# 🎓 Future With Farhan (FWF)
### Pakistan's #1 Student Success Platform

<div align="center">

![FWF Banner](https://img.shields.io/badge/Future%20With%20Farhan-Student%20Success%20Platform-1A3C6E?style=for-the-badge)

[![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?style=flat-square&logo=react)](https://expo.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-green?style=flat-square)](https://expo.dev)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)](https://github.com/farhanalikalyani/FutureWithFarhan-Web)

*"Someone is guiding me toward my future."*

</div>

---

## 📱 About FWF

**Future With Farhan (FWF)** is a comprehensive educational platform built specifically for Pakistani students. It helps students prepare for competitive exams (MDCAT, ECAT, NTS, CSS), discover scholarships, explore universities, get AI-powered guidance, and build successful careers — all in one place.

### 🎯 Who Is This For?
- FSC / Pre-Medical / Pre-Engineering students
- MDCAT, ECAT, NTS, CSS, PPSC aspirants
- University admission seekers
- Students looking for scholarships
- Young Pakistanis building their careers

---

## ✨ Features

### 📚 Study & Exam Preparation
| Feature | Description |
|---------|-------------|
| 📝 Notes Library | Browse and download study notes by exam category |
| ❓ MCQ Practice | Thousands of MCQs with explanations and scoring |
| 📋 Mock Tests | Timed mock exams with detailed performance analysis |
| 📄 Past Papers | Previous years' exam papers organized by category |
| 🎬 Video Lectures | Expert video lessons linked by subject |
| 📊 Merit Calculator | University-specific aggregate calculators (NUST, FAST, MDCAT, ECAT, UET, LUMS, GIKI, IBA) |

### 🏛️ University Hub (11 Sections)
| Section | Description |
|---------|-------------|
| 🔍 Explorer | Browse and filter Pakistani universities |
| 📊 Merit Calculator | Calculate admission chances with real formulas |
| ⚖️ Comparison | Compare up to 3 universities side by side |
| 📅 Calendar | Important admission dates and deadlines |
| 🎯 Program Finder | Find universities by desired program |
| 📝 Merit Lists | 2023 & 2024 closing merit data |
| 🎓 Scholarships | Financial aid by university |
| 🏠 Hostel Info | On-campus accommodation details |
| 💰 Fee Calculator | Estimate total education cost |
| ⭐ Student Reviews | Real student experiences |
| 🤖 AI Counselor | AI-powered admission guidance |

### 🚀 Career Hub
- Career roadmaps for 8+ professions
- Internship opportunities
- Step-by-step freelancing guide
- Interview preparation tips
- Common interview questions

### 🤖 AI Mentor
Powered by Claude AI:
- Explain difficult topics
- Create personalized study plans
- Career guidance
- Scholarship advice
- CV review assistance

### 📅 Student Planner (6 Tools)
- ✅ Task Tracker with priorities
- 🍅 Pomodoro Timer (25/5/15 min)
- 📅 Exam Countdown
- 🎓 GPA Calculator
- 🔥 Study Streak tracker
- 📆 Weekly Timetable

### 🔐 Student Locker
Securely store important documents:
- Certificates & Result Cards
- CV / Resume
- CNIC & Fee Challans
- Other academic documents

### 👥 Community
- Student discussions by category
- Like and reply to posts
- Resource sharing
- Q&A platform

### 🌟 Opportunity Hub
- Competitions & Hackathons
- Conferences & Workshops
- Volunteer Programs
- Scholarship listings

### 🎓 Scholarships
- Government Scholarships
- Private Scholarships
- International Scholarships
- Deadline tracking

---

## 🛠️ Tech Stack

```
Frontend:     React Native (Expo SDK 54)
Navigation:   Expo Router (file-based routing)
Backend:      Firebase (Firestore, Auth, Storage)
AI:           Claude API (Anthropic)
Styling:      StyleSheet (Custom Design System)
Fonts:        Poppins (Regular, Medium, SemiBold, Bold)
Icons:        Expo Vector Icons (Ionicons)
Storage:      AsyncStorage (local), Firestore (cloud)
```

---

## 📁 Project Structure

```
FutureWithFarhan/
├── app/
│   ├── (auth)/
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   └── forgot-password.jsx
│   ├── (tabs)/
│   │   ├── index.jsx          # Home Dashboard
│   │   ├── notes.jsx          # Study Notes
│   │   ├── mcqs.jsx           # MCQ Practice
│   │   ├── mocktests.jsx      # Mock Tests
│   │   ├── papers.jsx         # Past Papers
│   │   ├── videos.jsx         # Video Lectures
│   │   ├── merit.jsx          # Merit Calculator
│   │   ├── universities.jsx   # University Hub
│   │   ├── scholarships.jsx   # Scholarships
│   │   ├── career.jsx         # Career Hub
│   │   ├── community.jsx      # Community
│   │   ├── opportunities.jsx  # Opportunity Hub
│   │   ├── locker.jsx         # Student Locker
│   │   ├── planner.jsx        # Student Planner
│   │   ├── mentor.jsx         # AI Mentor
│   │   ├── notifications.jsx  # Notifications
│   │   ├── results.jsx        # Test Results
│   │   ├── bookmarks.jsx      # Saved Items
│   │   └── profile.jsx        # User Profile
│   ├── admin/
│   │   ├── index.jsx          # Admin Dashboard
│   │   ├── notes.jsx          # Manage Notes
│   │   ├── papers.jsx         # Manage Papers
│   │   ├── mocktests.jsx      # Manage MCQs
│   │   ├── videos.jsx         # Manage Videos
│   │   ├── scholarships.jsx   # Manage Scholarships
│   │   ├── notifications.jsx  # Send Notifications
│   │   ├── universities.jsx   # Manage Universities
│   │   └── users.jsx          # Manage Users
│   ├── onboarding.jsx         # Onboarding Slides
│   ├── index.jsx              # Route Guard
│   └── _layout.jsx            # Root Layout
├── components/
│   ├── ErrorBoundary.jsx
│   └── ui/
│       ├── EmptyState.jsx
│       ├── SkeletonLoader.jsx
│       ├── Toast.jsx
│       └── PullToRefresh.jsx
├── constants/
│   ├── colors.js
│   └── fonts.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── firebase/
│   ├── config.js
│   ├── auth.js
│   ├── admin.js
│   ├── admin-check.js
│   └── bookmarks.js
├── hooks/
│   ├── useFirestore.js
│   └── useAdmin.js
├── utils/
│   ├── validation.js
│   └── formatting.js
├── app.json
├── eas.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Firebase account
- Anthropic API key (for AI Mentor)

### Installation

```bash
# Clone the repository
git clone https://github.com/farhanalikalyani/FutureWithFarhan-Web.git

# Navigate to project
cd FutureWithFarhan-Web

# Install dependencies
npm install
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create **Firestore Database**
4. Enable **Storage**
5. Copy your config to `firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Firestore Security Rules

Copy the secure rules from `firestore.rules` to your Firebase Console → Firestore → Rules.

### AI Mentor Setup

Add your Claude API key in `firebase/functions/index.js` (server-side only — never in client code):

```bash
firebase functions:config:set anthropic.key="YOUR_CLAUDE_API_KEY"
```

### Running the App

```bash
# Web
npx expo start --web

# Android (with Expo Go)
npx expo start
# Scan QR code with Expo Go app

# Build APK
eas build --platform android --profile preview
```

---

## 🔐 Security

- ✅ Firebase Security Rules protect all data
- ✅ Admin panel protected by server-side role check
- ✅ Claude API key stored in Firebase Functions (never in client)
- ✅ Email verification required for new accounts
- ✅ User data isolated — students can only access their own data
- ✅ Admin role stored in Firestore with write protection

---

## 🗄️ Firebase Collections

```
users/          — User profiles and roles
notes/          — Study notes metadata
pastPapers/     — Past exam papers
mcqs/           — MCQ questions and answers
videos/         — Video lecture links
scholarships/   — Scholarship listings
universities/   — University profiles
notifications/  — Admin announcements
community/      — Student discussion posts
locker/         — Student document storage
testResults/    — Mock test performance data
bookmarks/      — Saved items per user
```

---

## 📊 Merit Calculator Formulas

| University | Formula |
|-----------|---------|
| NUST | NET 80% + Matric 10% + Inter 10% |
| FAST-NUCES | Entry Test 50% + Inter 40% + Matric 10% |
| UET / ECAT Unis | ECAT 50% + Inter 40% + Matric 10% |
| MDCAT Unis | MDCAT 50% + Inter 40% + Matric 10% |
| GIKI | ECAT/SAT 50% + Inter 40% + Matric 10% |
| IBA Karachi | IBA Test 50% + Inter 40% + Matric 10% |
| AKU | AKU Test 50% + Inter 50% |
| LUMS | Holistic (SAT + Essays + Interview) |

---

## 👨‍💼 Admin Panel

The admin panel is accessible only to users with `isAdmin: true` in Firestore.

**To make a user admin:**
1. Go to Firebase Console → Firestore
2. Find user document in `users` collection
3. Add field: `isAdmin: true`

**Admin capabilities:**
- Add/Edit/Delete Notes, Papers, MCQs, Videos
- Manage Universities and Scholarships
- Send Notifications to all students
- View and manage user accounts
- View platform statistics

---

## 🗺️ Roadmap

### v1.0.0 (Current)
- [x] Complete authentication system
- [x] Notes, MCQs, Papers, Videos
- [x] Mock Tests with Firebase
- [x] University Hub (11 sections)
- [x] Merit Calculator
- [x] AI Mentor
- [x] Career Hub
- [x] Community
- [x] Student Planner
- [x] Student Locker
- [x] Admin Panel
- [x] Secure Firebase Rules

### v1.1.0 (Coming Soon)
- [ ] Google Authentication
- [ ] Push Notifications (FCM)
- [ ] Profile Photo Upload
- [ ] Resume Builder
- [ ] Global Search

### v2.0.0 (Future)
- [ ] Premium Subscription System
- [ ] Live Mock Tests (all students together)
- [ ] Leaderboards
- [ ] Offline Mode
- [ ] Google Play Store Launch
- [ ] iOS App Store Launch

---

## 💰 Monetization Plan

**Free Tier** — Core features always free

**Premium (Coming Soon)** — PKR 299/month or PKR 1,999/year
- Unlimited MCQs & Mock Tests
- AI Mentor unlimited messages
- Full Past Papers library
- Student Locker (50 documents)
- Offline access
- Priority support

---

## 🤝 Contributing

This is a private project. For collaboration requests, contact the developer.

---

## 📞 Contact

**Developer:** Farhan Ali
**Email:** farhanalikalyani@gmail.com
**GitHub:** [@farhanalikalyani](https://github.com/farhanalikalyani)

---

## 📄 License

This project is **private and proprietary**.
All rights reserved © 2025 Future With Farhan.

---

<div align="center">

**Built with ❤️ for Pakistani Students**

*"Bohat acha kaam kiya hai. Ab launch karo! 🚀"*

⭐ Star this repo if you find it useful!

</div>
