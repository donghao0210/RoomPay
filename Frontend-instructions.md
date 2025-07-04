# House Manager PWA (Frontend-First with Tailwind CSS)
Design and develop the frontend for a Progressive Web App (PWA) called ‘Room Pay’ to help a master tenant manage rent and utilities for a shared living space, with sub-tenants able to view their bills and payment statuses. The frontend should be built first, using mock data and a mock API to simulate backend interactions, ensuring seamless integration with a real backend later. The app should follow a mobile-first design, with a modern and elegant ‘liquid glass’ design language (combining glassmorphism and liquid-like animations) in a light theme. It should be intuitive, secure, optimized for both mobile and desktop devices, and use Tailwind CSS for styling. Break all UI elements into small, reusable React components to keep individual files concise and maintainable.

## Core Features

1. **User Roles**:
   - **Master Tenant**: Has admin access to configure rent, input utility bills, issue bills, and manage notification settings.
   - **Sub-Tenants**: Have read-only access to view their assigned rent, utility bills, total due, payment status, and due dates.
   - Simulate user authentication with mock data (e.g., a dropdown component to switch between master tenant and sub-tenant roles) for testing, preparing for real authentication (e.g., Firebase Authentication or Auth0) later.

2. **Dashboard**:
   - **Master Tenant Dashboard**:
     - Displays total rent, total utility bills (e.g., electricity, water, internet), issued bills, payments received, and overdue amounts.
     - Shows a summary of sub-tenant payment statuses (e.g., paid, pending, overdue) with visual indicators (e.g., green for paid, red for overdue).
     - Includes a button to input and issue new bills (simulated with mock data).
   - **Sub-Tenant Dashboard**:
     - Displays individual rent, share of utilities, total amount due, payment status, and due date.
     - Shows payment history for the past 6 months.
   - Use a responsive, mobile-first layout optimized for small screens, with smooth transitions to desktop layouts.
   - Break dashboards into components (e.g., `BillSummary`, `PaymentStatus`, `BillHistory`).

3. **Rent and Bill Settings**:
   - Allow the master tenant to set the total monthly rent and define sub-tenant shares (e.g., equal split or custom percentages) via a form component.
   - Enable input of utility bills (e.g., electricity: $100, water: $50, internet: $60) with a form component that calculates each sub-tenant’s share.
   - Allow setting a due date for bills (e.g., 10th of each month) via a settings component.
   - Use mock data to store and retrieve settings, simulating API calls (e.g., GET/POST for bills and settings).

4. **Notifications**:
   - **Reminder for Master Tenant**:
     - Display a simulated reminder to input utility bills on the 1st of each month (adjustable via a settings component).
   - **Bill Issuance Notifications**:
     - Simulate notifications for sub-tenants when bills are issued, showing their amounts and due dates, using a notification preview component.
   - **Notification Settings**:
     - Provide a settings page component where users can toggle notification preferences for Web Push, email, ntfy.sh, and Discord.
     - Simulate notification display (e.g., a toast component) for testing, with mock API calls to prepare for real integrations (e.g., Web Push API, Nodemailer, ntfy.sh REST API, Discord webhooks).
   - **Mock Notification API**:
     - Simulate sending notifications with mock API endpoints (e.g., `POST /api/notifications/send` with a JSON payload like `{ type: 'email', message: 'New bill: $150', recipient: 'subtenant1' }`).

5. **Reminders**:
   - Simulate reminders for the master tenant to input bills (e.g., a UI alert component on the 1st of each month).
   - Allow sub-tenants to opt into reminders 3 days before the bill due date, displayed as in-app alerts or toasts via a reminder component.
   - Use mock data to simulate scheduling (e.g., a mock API call like `GET /api/reminders`).

6. **PWA Features**:
   - Ensure the app is installable on mobile and desktop devices with a valid web app manifest.
   - Implement offline support using a service worker (e.g., Workbox) to cache dashboard data, bill history, and mock API responses for offline viewing.
   - Simulate data syncing when the connection is restored (e.g., show a ‘Syncing’ status in a sync status component).
   - Ensure HTTPS compatibility for secure communication (assume a local development server like Vite supports HTTPS).

## Design Requirements

- **Design Language**: Implement a ‘liquid glass’ design combining:
  - **Glassmorphism**: Semi-transparent backgrounds with blur effects (e.g., Tailwind classes like `bg-white/20 backdrop-blur-md`), subtle shadows, and rounded corners to mimic frosted glass.
  - **Liquid Animations**: Smooth, fluid transitions and micro-interactions (e.g., ripple effects on buttons, flowing animations for page transitions) using Tailwind’s transition utilities or Framer Motion.
- **Theme**: Use a light theme with a clean, modern palette (e.g., `bg-gray-100`, `text-gray-900`, soft accent colors like `bg-blue-200` or `bg-teal-200`, high contrast for readability).
- **Mobile-First**: Prioritize mobile layouts (e.g., single-column, touch-friendly buttons with `p-4`, `text-lg`) with responsive scaling for desktop (e.g., `md:grid md:grid-cols-2`).
- **Typography**: Use modern, sans-serif fonts (e.g., Inter or Poppins via Tailwind’s `font-sans`) with clear hierarchy (e.g., `font-bold text-2xl` for headings, `text-base` for body).
- **UI Components**: Use Tailwind CSS for styling, with small, reusable React components (e.g., `Button`, `Card`, `FormInput`, `NotificationToast`) to keep files concise (aim for <200 lines per file).

## Technical Requirements

- **Frontend**:
  - Use React.js with Vite for fast development and hot module reloading.
  - Implement a service worker with Workbox for offline caching and Web Push notification simulation.
  - Use Tailwind CSS for styling, customized for the liquid glass design (e.g., custom config for `backdrop-blur` via Tailwind plugins).
  - Break the UI into small, reusable components (e.g., `DashboardHeader`, `BillCard`, `SettingsForm`, `NotificationToggle`) organized in a `components/` directory.
  - Simulate backend interactions with a mock API (e.g., `mockApi.js` using `msw` or a JSON file) with endpoints like:
    - `GET /api/users`: Returns mock user data (e.g., master tenant and 5 sub-tenants).
    - `GET /api/bills`: Returns mock bill data.
    - `POST /api/bills`: Simulates creating a bill.
    - `GET /api/settings`: Returns rent and utility split settings.
    - `POST /api/notifications/send`: Simulates sending a notification.
  - Store mock data in a JSON file or JavaScript object, e.g.:
    ```json
    {
      "users": [
        { "id": "1", "name": "Master Tenant", "role": "master", "email": "master@example.com" },
        { "id": "2", "name": "Sub-Tenant 1", "role": "subtenant", "email": "sub1@example.com" }
      ],
      "bills": [
        { "id": "b1", "type": "rent", "amount": 500, "dueDate": "2025-07-10", "status": "pending" }
      ],
      "settings": {
        "totalRent": 1500,
        "utilitySplit": { "electricity": "equal", "water": "equal", "internet": "equal" },
        "reminderDay": 1
      }
    }
    ```

- **Security**:
  - Ensure mock API calls use HTTPS-compatible URLs (e.g., `https://localhost:3000/api/...`).
  - Structure components to integrate with Firebase Authentication or Auth0 later.

- **Testing**:
  - Use Jest for unit tests of individual components (e.g., `BillCard.test.tsx`).
  - Use Cypress for end-to-end tests of key flows (e.g., viewing dashboard, issuing bills, toggling notification settings).

## Deliverables

- Provide a complete React.js frontend codebase with:
  - A Vite-based project setup.
  - A mock API implementation (e.g., using `msw` or a JSON file in `src/data/`).
  - A web app manifest (`manifest.json`) for PWA installation.
  - A service worker (`service-worker.js`) with Workbox for offline support and notification simulation.
  - A modular component structure (e.g., `src/components/Dashboard/`, `src/components/Forms/`, `src/components/Notifications/`).
- Include a sample JSON payload for mock API requests, e.g.:
  ```json
  {
    "endpoint": "POST /api/bills",
    "payload": {
      "type": "utility",
      "amount": 100,
      "dueDate": "2025-07-10",
      "issuedBy": "master1",
      "issuedTo": "subtenant1",
      "status": "pending",
      "month": "July 2025"
    }
  }
  ```
- Provide a README with:
  - Instructions to set up and run the frontend locally (e.g., `npm install`, `npm run dev`).
  - Steps to test the PWA installation on mobile and desktop.
  - Guidance on replacing the mock API with a real backend (e.g., Node.js/Express with Firebase or MongoDB).
  - Notes on integrating real notification services (Web Push, Nodemailer, ntfy.sh, Discord webhooks) later.
  - Instructions for configuring Tailwind CSS and adding custom `backdrop-blur` utilities.

## Additional Notes

- Assume a simple setup with 1 master tenant and up to 5 sub-tenants, with equal utility splits unless specified.
- Ensure the ‘liquid glass’ design is consistent across all components using Tailwind classes (e.g., `bg-white/20 backdrop-blur-md rounded-lg shadow-sm`).
- Simulate notifications with a `NotificationToast` component to mimic Web Push, email, ntfy.sh, and Discord notifications.
- Ensure compatibility with modern browsers (Chrome, Firefox, Safari) for PWA installation and mock notifications.
- Include error handling for failed mock API calls (e.g., display a fallback `ErrorMessage` component).
- Optimize for mobile performance (e.g., lazy-load components with `React.lazy`, minimize bundle size with Vite).
- Keep component files concise (<200 lines) by breaking down complex UI into smaller components (e.g., `BillForm`, `BillList`, `UserSelector`).