# Room Pay PWA
## !! WIP project, Vibe Coding, Tesing out AI capabilities while solving real world problems
A comprehensive Progressive Web App for managing rent, utilities, and tenant operations in shared living spaces. Built with React, TypeScript, Tailwind CSS, and featuring a modern mobile-first design with advanced form components.

## ✨ Features Overview

### 🏠 **Multi-Role Dashboard System**
- **Master Tenant Dashboard**: Complete property management with financial overview
- **Subtenant Dashboard**: Personal bill tracking and payment management
- **Role-based Navigation**: Seamless switching between master and tenant views
- **Property Information**: Unit details, WiFi credentials, and tenant management

### 💰 **Advanced Bill Management**
- **Smart Bill Generation**: Automated monthly bill creation with utility splitting
- **Bill Templates**: Customizable bill types (rent, electricity, water, internet)
- **Discount System**: Percentage and fixed-amount tenant discounts
- **Bill Status Tracking**: Pending, paid, and overdue status management
- **Bill History**: Complete chronological bill management with filtering
- **Due Date Management**: Automatic due date calculation and reminders

### 👥 **Comprehensive Tenant Management**
- **Tenant Profiles**: Full tenant information with email and join dates
- **Rent Allocation**: Flexible rent distribution across tenants
- **Utility Shares**: Percentage-based utility cost splitting
- **Discount Management**: Apply and manage tenant-specific discounts
- **Active/Inactive Status**: Manage tenant lifecycle and transitions

### 💳 **Payment System**
- **Payment Submissions**: Tenants can submit payment proof with receipts
- **Payment Review**: Master tenant approval/rejection workflow
- **Payment Proof**: Image upload and preview for payment verification
- **Payment History**: Complete payment tracking and status updates
- **Payment Notes**: Detailed notes for approvals and rejections

### 🧮 **Financial Management**
- **Multi-Currency Support**: 15+ currencies (MYR, USD, EUR, SGD, etc.)
- **Budget Tracking**: Available rent and utility share monitoring
- **Revenue Analytics**: Total revenue and payment status overview
- **Financial Summaries**: Bills by type, payment status, and amounts

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Touch-Friendly Interface**: Large buttons and proper touch targets
- **Mobile Modals**: Full-screen friendly modals with proper scrolling
- **Progressive Enhancement**: Desktop features enhance mobile experience

### 🎨 **Modern Form System**
- **Consistent Form Components**: Unified FormField, FormInput, FormSelect, FormTextarea
- **Mobile-Optimized Forms**: Properly sized inputs and touch-friendly design
- **Visual Feedback**: Error states, loading indicators, and success feedback
- **Smart Validation**: Real-time validation with helpful error messages
- **Icon Integration**: Contextual icons throughout form interfaces

### 📊 **Dashboard Analytics**
- **Payment Status Grid**: Visual payment completion tracking
- **Bill Summary Cards**: Quick overview of bill types and amounts
- **Tenant Overview**: Active tenant count and rent allocation
- **Quick Actions**: Fast access to common operations

### 🔔 **Notification System**
- **Web Push Notifications**: Browser-based notifications
- **Email Notifications**: Simulated email notification system
- **ntfy.sh Integration**: Push notification service integration
- **Discord Webhooks**: Discord notification support
- **In-App Notifications**: Real-time notification display

### ⚙️ **Settings & Configuration**
- **Property Settings**: Unit number, address, and property name
- **WiFi Management**: SSID and password storage
- **Currency Selection**: Global currency preference
- **Notification Preferences**: Customizable notification channels
- **Utility Split Configuration**: Configurable utility splitting methods

### 🚀 **PWA Features**
- **Installable App**: Install on iOS, Android, Windows, and macOS
- **Offline Support**: Service worker with offline functionality
- **App-like Experience**: Standalone mode with native feel
- **Background Sync**: Data synchronization when connection returns

## 📱 Enhanced Mobile Experience

### **Mobile-Optimized Forms**
- **Generate Bills Form**: Compact utility input with mobile-friendly spacing
- **Payment Submission Form**: Streamlined payment proof upload
- **Add Tenant Form**: Organized sections for personal and financial details
- **Payment Review Form**: Easy-to-use approval/rejection interface
- **Full-Screen Dialogs**: All modals automatically expand to full-screen on mobile devices

### **Mobile Navigation**
- **Touch-Friendly Buttons**: Minimum 44px touch targets
- **Swipe Gestures**: Natural mobile interaction patterns
- **Responsive Grids**: Adaptive layouts for different screen sizes
- **Full-Screen Modals**: All dialogs expand to full-screen on mobile with proper scrolling
- **Native-like Experience**: App-like modal behavior optimized for mobile devices

### **Visual Design**
- **Card-Based Layout**: Clean, organized information presentation
- **Status Indicators**: Color-coded status badges and icons
- **Typography Scale**: Responsive text sizing for readability
- **Spacing System**: Consistent spacing across all screen sizes

## 🛠 Technology Stack

### **Frontend Framework**
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast build tool with hot module replacement

### **Styling & Design**
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Form Components**: Reusable, consistent form elements
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Modern UI Patterns**: Card layouts, gradients, and shadows

### **State Management**
- **React Context**: Auth, Currency, and Notification contexts
- **Local State**: Component-level state with useState and useReducer
- **Mock Data**: In-memory data store ready for backend integration

### **Enhanced Features**
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Consistent icon system throughout the app
- **Date Handling**: Proper date formatting and manipulation
- **PWA Support**: Service worker and manifest configuration

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Modern browser with PWA support

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd house-manager-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Core UI components
│   │   ├── FormField.tsx   # Form field wrapper with labels/errors
│   │   ├── FormInput.tsx   # Consistent input component
│   │   ├── FormSelect.tsx  # Styled select dropdown
│   │   ├── FormTextarea.tsx # Textarea component
│   │   ├── FormContainer.tsx # Form layout container
│   │   ├── Modal.tsx       # Full-screen mobile modals
│   │   ├── Button.tsx      # Button component
│   │   └── Card.tsx        # Card component
│   ├── dashboard/          # Dashboard components
│   │   ├── MasterDashboard.tsx      # Master tenant dashboard
│   │   ├── SubtenantDashboard.tsx   # Subtenant dashboard
│   │   ├── BillManagement.tsx       # Bill generation & editing
│   │   ├── PaymentReviewPanel.tsx   # Payment approval interface
│   │   ├── PaymentSubmissionForm.tsx # Payment submission form
│   │   ├── AddTenantForm.tsx        # Add new tenant form
│   │   ├── TenantManagement.tsx     # Tenant management interface
│   │   ├── BillSummary.tsx          # Bill overview cards
│   │   └── PaymentStatusGrid.tsx    # Payment status display
│   └── layout/             # Layout components
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Authentication state
│   ├── CurrencyContext.tsx # Currency management
│   └── NotificationContext.tsx # Notification system
├── data/                   # Mock data and management
│   └── mockData.ts         # Data store with management functions
├── types/                  # TypeScript definitions
│   └── index.ts           # Application type definitions
├── pages/                  # Main page components
└── App.tsx                # Main application component
```

## 🎨 Form Design System

### **Component Architecture**
- **FormField**: Wrapper component with label, error, and hint support
- **FormInput**: Input with icon support and validation states
- **FormSelect**: Dropdown with consistent styling and options
- **FormTextarea**: Textarea with resize controls
- **FormContainer**: Layout container for consistent form presentation

### **Mobile Optimizations**
- **Responsive Spacing**: Adaptive spacing for mobile and desktop
- **Touch Targets**: Minimum 44px touch areas for mobile interaction
- **Visual Hierarchy**: Clear section grouping and information organization
- **Error Handling**: Contextual error messages with helpful hints

### **Form Patterns**
- **Section Grouping**: Logical grouping of related fields
- **Progressive Disclosure**: Show relevant information at the right time
- **Inline Validation**: Real-time feedback during form completion
- **Action Button Layout**: Consistent cancel/submit button placement

## 💾 Data Management

### **Mock Data Structure**
```typescript
// User and tenant management
mockUsers: User[]
tenantManagement: TenantManagement

// Bill and payment system
mockBills: Bill[]
billManagement: BillManagement
paymentSubmissionManagement: PaymentSubmissionManagement

// Settings and configuration
mockSettings: Settings
propertySettingsManagement: PropertySettingsManagement
```

### **Core Data Models**
- **User**: Tenant profiles with roles and share information
- **Bill**: Bill details with amounts, due dates, and status
- **PaymentSubmission**: Payment proof submissions with review workflow
- **TenantShare**: Rent and utility share configuration
- **Settings**: Application and property configuration

## 🔧 Backend Integration Ready

The application is designed for easy backend integration:

### **API Endpoints Structure**
```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

// Tenant Management
GET    /api/tenants
POST   /api/tenants
PUT    /api/tenants/:id
DELETE /api/tenants/:id

// Bill Management
GET    /api/bills
POST   /api/bills/generate
PUT    /api/bills/:id
DELETE /api/bills/:id

// Payment System
GET    /api/payments/submissions
POST   /api/payments/submit
PUT    /api/payments/:id/approve
PUT    /api/payments/:id/reject

// Settings
GET /api/settings
PUT /api/settings
```

### **Integration Steps**
1. Replace mock data functions with API calls
2. Add authentication middleware and tokens
3. Implement error handling and loading states
4. Configure environment variables for API endpoints
5. Add data validation and sanitization

## 🎯 Key Features in Detail

### **Bill Management Workflow**
1. **Master tenant generates bills** for selected month with utility amounts
2. **System calculates individual shares** based on rent allocation and utility percentages
3. **Bills are created automatically** for each tenant with proper due dates
4. **Tenants receive bills** and can submit payment proof
5. **Master tenant reviews submissions** and approves/rejects with notes

### **Payment Review Process**
1. **Tenants submit payment proof** with receipt images and notes
2. **Master tenant receives notification** of pending submissions
3. **Review interface shows** payment details, proof, and tenant information
4. **Master tenant can approve or reject** with review notes
5. **Status updates automatically** and notifications are sent

### **Tenant Management Features**
- **Add new tenants** with email, rent amount, and utility share
- **Manage rent allocation** ensuring total doesn't exceed property rent
- **Apply discounts** with percentage or fixed amounts
- **Track tenant status** and manage active/inactive states

## 🔒 Security Considerations

### **Data Protection**
- Input validation and sanitization
- XSS protection with proper escaping
- CSRF protection for form submissions
- Secure file upload handling

### **Authentication**
- Role-based access control
- Session management
- Password security best practices
- API authentication tokens

## 📱 PWA Implementation

### **Service Worker Features**
- App shell caching for offline use
- API response caching with cache-first strategy
- Background sync for offline actions
- Push notification support

### **Manifest Configuration**
- App icons for all device sizes
- Standalone display mode
- Theme and background colors
- Start URL and scope configuration

## 🎨 Design Philosophy

### **Mobile-First Approach**
- Start with mobile constraints and enhance for larger screens
- Touch-friendly interface with proper gesture support
- Readable typography at all screen sizes
- Efficient use of screen real estate

### **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast color combinations
- Focus management for modals and forms

### **Performance**
- Lazy loading for components and routes
- Optimized bundle splitting
- Efficient re-rendering with React optimization
- Fast initial load times

## 🚀 Deployment

### **Production Build**
```bash
npm run build
```

### **Deployment Platforms**
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **GitHub Pages**: Configure GitHub Actions for automatic deployment
- **AWS S3**: Static hosting with CloudFront CDN

### **PWA Deployment Checklist**
- ✅ HTTPS enabled
- ✅ Service worker registered
- ✅ Manifest file served with correct MIME type
- ✅ Icons available in all required sizes
- ✅ App installable on mobile devices

## 📈 Future Enhancements

### **Planned Features**
- Real-time notifications with WebSocket
- Advanced reporting and analytics
- Bulk operations for bill management
- Integration with payment gateways
- Multi-property management
- Automated recurring bill generation
- Email template customization

### **Technical Improvements**
- GraphQL API integration
- Real-time data synchronization
- Advanced caching strategies
- Performance monitoring
- Error tracking and logging
- Automated testing pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain mobile-first responsive design
- Write comprehensive tests for new features
- Update documentation for new components
- Follow the established form design patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, feature requests, or bug reports:
- Open an issue on GitHub
- Contact the development team
- Check the documentation for common solutions

---

Built with ❤️ using React, TypeScript, and Tailwind CSS - Optimized for mobile-first experiences