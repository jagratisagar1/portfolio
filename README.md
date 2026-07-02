# Jagrati | Full-Stack & AI Agentic Portfolio Documentation

Welcome to the documentation page for your professional portfolio website. This document provides a complete guide to the architecture, design systems, key features, and instructions on running and deploying this portfolio.

---

## 🏗️ Project Architecture & File Structure

The project is structured as a clean, modular static website with a helper script for local development:

```
E:/New folder/
├── assets/                  # Project images (avatars, screenshots, icons)
├── index.html               # Main page layout and structural content
├── style.css                # Custom styling, typography, variables, responsive design
├── script.js                # Core interactive logic (particles, theme, form logic)
├── server.py                # Custom local python web server (serves site + logs contact forms)
├── contact_messages.json    # JSON database storing locally submitted contact messages
└── README.md                # Documentation file
```

---

## 🛠️ Technology Stack & Styling

- **Markup:** HTML5 (Semantic elements like `<header>`, `<main>`, `<section>`, `<footer>`).
- **Styling:** Custom Vanilla CSS (No framework dependencies, designed with performance and styling flexibilities).
- **Interactions:** Vanilla JavaScript (ES6+).
- **Fonts:** Google Fonts (Outfit for headings, Inter for body).
- **Icons:** FontAwesome v6.4 (social profiles, service cards, contact methods).

---

## ✨ Premium Features

### 1. Animated Particle Background
The hero section uses a custom HTML5 canvas background. JavaScript creates dynamically floating particles that:
* Boundary bounce within the viewport.
* Connect visually via distance-based alpha lines.
* Repel interactively from the cursor using vector mathematics.

### 2. Custom Cursor
A two-part mouse follower (a precise inner dot and a smooth trailing outer outline). The outline transitions and scales on elements marked with `.hover-target`, `a`, `button`, `input`, and `textarea`.

### 3. Glassmorphic Cards & Theme Toggle
The styling matches modern visual trends utilizing:
* **Glassmorphism:** Frosted borders and translucent card backings (`backdrop-filter: blur()`).
* **Dark / Light Mode Toggle:** Leverages HTML document data attributes (`data-theme`) and custom CSS variables to shift seamlessly between vibrant dark mode and clean light mode.

### 4. Dynamic Project Filtering
Allows visitors to filter projects based on tags (e.g., *Frontend*, *AI / RAG*, *Backend*) in real-time with smooth CSS transforms and scaling transitions.

---

## 📬 Contact Form Flow

The contact form is optimized for both **local development** and **production environments**:

1. **Local Testing:**
   * The website submits to `http://localhost:8000/api/contact`.
   * Submissions are processed by `server.py`, logged in the terminal, and saved to `contact_messages.json`.

2. **Production:**
   * Submissions route to `https://formsubmit.co/ajax/jagrati892@gmail.com`.
   * *Note: When deploying to a new domain or submitting the first message, check your inbox/spam for a validation email from FormSubmit.co and click the confirmation link to activate forwardings.*

---

## 🚀 Running Locally

To run the portfolio locally on port `8000`:

1. Run the custom server using python in your terminal:
   ```bash
   python server.py
   ```
2. Open your browser and navigate to:
   [http://localhost:8000/](http://localhost:8000/)

---

## 🌐 Production Deployment

Since the codebase is standard client-side code (`index.html`, `style.css`, `script.js`), it can be hosted on any static hosting provider:

### 1. GitHub Pages
1. Push your folder files to a GitHub repository (e.g., `jagratisagar1/portfolio`).
2. Go to **Settings** -> **Pages**.
3. Under *Build and deployment*, set the source to **Deploy from a branch** and select `main` (or `master`).
4. Click **Save**. Your site will be live at `https://jagratisagar1.github.io/portfolio/`.

### 2. Vercel / Netlify
1. Connect your GitHub repository to Vercel/Netlify.
2. Select the repository and click **Deploy**. (No build command or output directory configuration is needed).
