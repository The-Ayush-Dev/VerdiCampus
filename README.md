# VerdiCampus 🌿

**VerdiCampus** is a centralized green campus digital ecosystem platform designed to minimize environmental impact and streamline academic life. It features a zero-paper academic portal, smart notice systems, and sustainability analytics.

---

## 🚀 Key Features

- **EcoBot 🤖**: A Gemini AI-powered assistant to help students and staff with sustainability inquiries and campus navigation.
- **Sustainability Analytics 📊**: Real-time tracking of resource usage and environmental impact across the campus.
- **Zero-Paper Portal 📄**: Digital management of academic resources, reducing the need for physical paperwork.
- **Smart Notice System 🔔**: Centralized digital bulletin board for campus-wide announcements and updates.
- **Integrated Community Hub 🤝**: A space for collaboration and discussion on green initiatives and academic projects.

---

## 📸 Media Gallery

### Screenshots
<p align="center">
  <img src="docs/assets/Screenshot 2026-03-03 103456.png" width="45%" Alt="Dashboard Overview" />
  <img src="docs/assets/Screenshot 2026-03-03 103522.png" width="45%" Alt="Sustainability Analytics" />
</p>
<p align="center">
  <img src="docs/assets/Screenshot 2026-03-03 103540.png" width="45%" Alt="Community Hub" />
  <img src="docs/assets/Screenshot 2026-03-03 103553.png" width="45%" Alt="EcoBot AI Chat" />
</p>

### Demo Video
https://github.com/user-attachments/assets/ (Note: Please upload the video `docs/assets/A video.mp4` to GitHub for embedding)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **UI Components**: Material UI (MUI)
- **State Management/Routing**: React Router DOM 7
- **API Client**: Axios

### Backend
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Security**: Spring Security + JJWT
- **Database**: 
  - **Local**: H2 (In-memory/File-based)
  - **Production**: PostgreSQL
- **AI Integration**: Google Gemini AI (Vertex AI/Generative Language API)

---

## ⚙️ Local Setup

### Prerequisites
- Java 17+
- Node.js (Latest LTS recommended)
- Maven

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd verdicampus-backend
   ```
2. Create a `.env` file or set environment variables:
   ```properties
   GEMINI_API_KEY=your_api_key_here
   SPRING_DATASOURCE_URL=jdbc:h2:file:./verdicampus_db
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd verdicampus_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
VerdiCampus/
├── verdicampus-backend/    # Spring Boot Backend
├── verdicampus_frontend/   # React Frontend
├── communityhub/           # Community related assets/logic
├── docs/                   # Documentation and media assets
└── README.md               # Project overview
```

---

## 🌿 Contributing
We welcome contributions to make VerdiCampus even greener! Please feel free to open issues or submit pull requests.

## 📄 License
TBD
