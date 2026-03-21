# 🧾 Product Requirements Document (PRD)
## Smart Expense Tracker (Assignment 1)

---

## 1. 📌 Overview

This project is a single-page web application (SPA) that allows users to track and manage their expenses efficiently.

The application focuses on simplicity, smooth interaction, and clear data visualization.

---

## 2. 🎯 Objectives

- Implement full CRUD operations on expense data
- Build a responsive and user-friendly interface
- Ensure smooth SPA behavior without page reload
- Provide basic data visualization (chart)

---

## 3. 👤 Target Users

- Students or individuals tracking daily expenses
- Users who want a simple and fast interface

---

## 4. ⚙️ Tech Stack

- Frontend: Next.js (App Router, JavaScript)
- UI: shadcn/ui + Tailwind CSS
- State/Data: React Query
- Forms: React Hook Form + Zod
- Data Storage: JSON file (file-based persistence via API routes)
- Chart: shadcn chart components

---

## 5. 🧩 Core Features

### 5.1 Expense Management (CRUD)

Users can:
- Create a new expense
- View all expenses
- Update an existing expense
- Delete an expense

Each expense contains:
- id
- title
- amount
- category
- date
- description (optional)

---

### 5.2 Single Page Application Behavior

- No full page reloads
- All updates happen dynamically
- Use client-side state and API calls

---

### 5.3 Data Visualization

- Display expense distribution by category using a chart
- Chart updates automatically when data changes

---

### 5.4 Responsive Design

- Mobile-first design
- Layout adapts to different screen sizes
- Use grid and flexbox

---

## 6. 🧱 System Architecture

Frontend (Next.js Client Components)
↓
API Routes (/api/expenses)
↓
JSON file (data/expenses.json)

---

## 7. 🔗 API Specification

### GET /api/expenses
- Returns all expenses

### POST /api/expenses
- Create new expense

### PUT /api/expenses
- Update existing expense

### DELETE /api/expenses
- Delete expense by id

---

## 8. 🎨 UI/UX Requirements

### Layout Structure

- Header (App title)
- Summary Card (Total spending)
- Chart Section
- Add Expense Button
- Expense List (table or cards)

---

### Interaction Design

- Add/Edit via modal dialog
- Instant UI updates after actions
- Loading and error states must be handled

---

### Design Style

- Clean and minimal
- Card-based layout
- Consistent spacing and typography

---

## 9. 📱 Responsive Requirements

### Desktop
- Multi-column layout
- Chart and list side-by-side

### Mobile
- Single column layout
- Stacked components

---

## 10. ⚠️ Constraints

- Must behave like SPA
- Must implement all CRUD operations
- Must not rely on page reload
- Must use API layer (no direct file access from frontend)

---

## 11. ✅ Success Criteria

- Users can perform CRUD without errors
- UI is responsive and intuitive
- Data persists in JSON file
- Chart reflects actual data
- Code is clean and well-structured

---

## 12. 📁 Suggested Folder Structure

/app
/page.js
/api/expenses/route.js

/components
ExpenseForm.jsx
ExpenseList.jsx
Chart.jsx

/data
expenses.json

/lib
utils.js

---

## 13. 🚧 Future Improvements (Optional)

- Category filtering
- Monthly summary
- Dark mode

---

## 14. 📣 Notes for Developer (Claude)

- Prioritize simplicity over complexity
- Ensure smooth UX and no page reload
- Keep components modular and reusable
- Use clean naming convention