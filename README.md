# ChainID - Blockchain-Based Biometric Authentication

![ChainID Logo](/images/chainid-logo.png)

A cutting-edge authentication platform that combines biometric recognition with blockchain technology for secure, passwordless digital identity verification.

## 🌟 Features

### 🔒 **Military-Grade Security**
- Advanced biometric algorithms with enterprise-level encryption
- Blockchain-based verification for tamper-proof authentication
- Zero-knowledge architecture ensuring biometric data never leaves your device

### 📱 **Universal Compatibility**
- **Desktop**: Face recognition using webcam
- **Mobile**: Face ID using front camera or Fingerprint scanning using back camera
- Cross-platform browser support - no extensions required

### ⛓️ **Blockchain Integrity**
- Every authentication event permanently recorded on blockchain
- Complete audit trails for compliance and security
- Immutable activity logs for organizational transparency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Modern web browser with camera access
- Backend API running (see Backend Setup below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chainid
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure the backend API**
   ```bash
   # Update lib/api.js with your backend URL
   const API_BASE_URL = 'https://your-backend-url.com'
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Backend Setup

ChainID requires a Flask backend API for biometric processing. The backend should provide the following endpoints:

- `POST /signup/face` - Face registration
- `POST /signup/fingerprint` - Fingerprint registration  
- `POST /signin/face` - Face authentication
- `POST /signin/fingerprint` - Fingerprint authentication
- `GET /logs` - Activity logs retrieval
- `GET /health` - Health check

### Backend Configuration
Update `lib/api.js` with your deployed backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com'
```

## 📱 Device Support

### Desktop Users
- ✅ Face recognition using webcam
- ❌ Fingerprint authentication (mobile only)

### Mobile Users  
- ✅ Face recognition using front camera
- ✅ Fingerprint scanning using back camera with flash
- 📱 Smart camera guidance for optimal capture

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Biometric camera capture + blockchain verification
- **State Management**: SWR for data fetching
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **Backend Integration**: RESTful API with Flask

## 📁 Project Structure

```
chainid/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Protected dashboard
│   ├── signin/           # Authentication flow
│   ├── signup/           # Registration flow
│   └── layout.jsx        # Root layout
├── components/            # Reusable components
│   ├── camera-capture.jsx # Biometric capture component
│   ├── site-header.jsx   # Navigation header
│   └── ui/               # UI component library
├── lib/                  # Utilities and API
│   ├── api.js           # Backend API integration
│   └── utils.js         # Helper functions
└── public/              # Static assets
    └── images/          # Logo and illustrations
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **CameraCapture**: Handles biometric image capture with device-specific guidance
- **SiteHeader**: Responsive navigation with mobile menu overlay
- **ToastProvider**: Non-blocking notification system
- **Device Detection**: Automatic mobile/desktop detection

## 🔐 Security Features

- **Biometric Data**: Never stored or transmitted in raw form
- **Session Management**: Secure localStorage-based user sessions
- **Route Protection**: Automatic redirect for unauthenticated users
- **Camera Cleanup**: Automatic webcam stream termination
- **Audit Logging**: All authentication events logged to blockchain

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop and mobile
- **Dark/Light Mode**: Automatic theme detection
- **Smooth Animations**: Tailwind CSS animations and transitions
- **Loading States**: Comprehensive loading indicators
- **Toast Notifications**: Non-intrusive user feedback
- **Mobile-First**: Touch-optimized mobile interface

## 📊 Monitoring & Analytics

- **Activity Dashboard**: Real-time authentication logs
- **Health Monitoring**: Backend API status tracking
- **User Analytics**: Authentication success/failure rates
- **Performance Metrics**: Response time monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Deploy your own instance]
- **Documentation**: [Link to detailed docs]
- **API Reference**: [Backend API documentation]

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ by Team B16**