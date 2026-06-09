# 🌐 OSI Chat Simulator Pro

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Security](https://img.shields.io/badge/Security-XSS%20Protected-brightgreen.svg)

**An interactive educational web application that visualizes the OSI model layers through real-time chat simulation**

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [📖 Usage Guide](#-usage-guide) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [🎯 About](#-about)
- [💡 Why This Project?](#-why-this-project)
- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🔄 How It Works](#-how-it-works)
- [📥 Installation](#-installation)
- [📖 Usage Guide](#-usage-guide)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technologies](#️-technologies)
- [🔒 Security](#-security)
- [🌐 Browser Support](#-browser-support)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## 🎯 About

**OSI Chat Simulator Pro** is a comprehensive educational tool designed to make learning the OSI (Open Systems Interconnection) model intuitive and engaging. Through an interactive chat interface, students can visualize how data travels through all seven OSI layers in real-time.

### What Makes It Special?

- 🎓 **Educational Focus**: Built specifically for learning networking concepts
- 🎨 **Visual Learning**: Watch data transform through each layer
- 🔄 **Interactive**: Send messages and see immediate results
- 🛡️ **Secure**: XSS protection and input validation built-in
- 📦 **Zero Dependencies**: Pure vanilla JavaScript
- 🌍 **Persian Support**: RTL interface with Persian language

---

## 💡 Why This Project?

Learning networking can be abstract and difficult to grasp. This simulator bridges that gap by:

1. **Visualizing Abstract Concepts**: See the OSI layers in action, not just in diagrams
2. **Hands-On Learning**: Experiment with different protocols, encryption, and error scenarios
3. **Immediate Feedback**: Real-time console logs explain what's happening at each step
4. **Safe Environment**: Practice without affecting real networks
5. **Free & Open Source**: Available to everyone, everywhere

---

## 🚀 Quick Start

Get up and running in **60 seconds**:

### Option 1: Direct Open (Simple)
```bash
# Clone the repository
git clone https://github.com/Mr-shiravani/osi-chat-simulator.git

# Open index.html in your browser
cd osi-chat-simulator
# Double-click index.html or open it with your browser
```

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
cd osi-chat-simulator
python -m http.server 8000

# Using Node.js
npx http-server

# Using npm (if package.json exists)
npm start
```

Then open: **http://localhost:8000**

### First Message
1. Type a message in **Host A** input box
2. Click **"📤 ارسال"** or press **Enter**
3. Watch the magic happen! ✨

---

## ✨ Features

### 🎮 Core Functionality

| Feature | Description |
|---------|-------------|
| **Interactive Chat** | Two-way chat interface between Host A and Host B |
| **OSI Visualization** | Real-time animation of all 7 OSI layers |
| **Packet Animation** | Animated packets moving through network channel |
| **Console Logging** | Detailed step-by-step logs of layer operations |

### ⚙️ Network Configuration

- **Protocol Selection**
  - TCP (Reliable with retransmission)
  - UDP (Fast without error recovery)
  
- **Security Options**
  - AES-256-GCM Encryption
  - AES-128-CBC Encryption
  - GZIP Compression
  
- **Simulation Controls**
  - Animation speed: 200ms - 2000ms
  - Error simulation: 15% packet loss
  - Binary data display
  - Protocol headers view

### 📊 Advanced Features

- **Statistics Dashboard**
  - Total messages sent
  - Success/failure rate
  - Average latency
  - Packet loss percentage
  
- **Interactive Elements**
  - Click layers to view details
  - Export console logs
  - Auto-reply mode
  - Sound effects
  
- **Educational Tools**
  - Layer-by-layer explanation
  - Protocol header visualization
  - Encryption/decryption demo
  - TCP vs UDP comparison

---

## 🔄 How It Works

### The Complete Journey of a Message

```
┌─────────────────────────────────────────────────────────┐
│                    USER TYPES MESSAGE                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   Host A (Sender Side)       │
        ├──────────────────────────────┤
        │ Layer 7 → Application        │ ← Message received
        │ Layer 6 → Presentation       │ ← Encrypt & Compress
        │ Layer 5 → Session            │ ← Session management
        │ Layer 4 → Transport          │ ← TCP/UDP + Port
        │ Layer 3 → Network            │ ← IP addressing
        │ Layer 2 → Data Link          │ ← MAC + Checksum
        │ Layer 1 → Physical           │ ← Convert to bits
        └──────────┬───────────────────┘
                   │
                   ▼
        ╔══════════════════════════════╗
        ║   📦 PACKET TRANSMISSION     ║
        ║   Network Channel Animation  ║
        ╚══════════╦═══════════════════╝
                   │
                   ▼
        ┌──────────────────────────────┐
        │   Host B (Receiver Side)     │
        ├──────────────────────────────┤
        │ Layer 1 → Physical           │ ← Receive bits
        │ Layer 2 → Data Link          │ ← Verify checksum
        │ Layer 3 → Network            │ ← Check IP
        │ Layer 4 → Transport          │ ← Reassemble
        │ Layer 5 → Session            │ ← Verify session
        │ Layer 6 → Presentation       │ ← Decrypt & Decompress
        │ Layer 7 → Application        │ ← Deliver message
        └──────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │   MESSAGE DISPLAYED TO USER  │
        └──────────────────────────────┘
```

### OSI Layers Explained

#### Layer 7 - Application Layer
- **What it does**: Interface with user applications
- **Protocols**: HTTP/1.1
- **In simulator**: Receives and delivers messages

#### Layer 6 - Presentation Layer
- **What it does**: Data format conversion, encryption, compression
- **Features**: AES encryption, GZIP compression
- **In simulator**: Encrypts/decrypts and compresses/decompresses data

#### Layer 5 - Session Layer
- **What it does**: Establishes, manages, and terminates connections
- **Features**: Session ID, handshake
- **In simulator**: Creates and maintains session between hosts

#### Layer 4 - Transport Layer
- **What it does**: End-to-end communication, reliability
- **Protocols**: TCP (reliable), UDP (fast)
- **In simulator**: Segments data, adds sequence numbers, handles retransmission

#### Layer 3 - Network Layer
- **What it does**: Logical addressing and routing
- **Protocols**: IPv4
- **In simulator**: Adds source/destination IP addresses

#### Layer 2 - Data Link Layer
- **What it does**: Physical addressing, error detection
- **Protocols**: Ethernet
- **In simulator**: Adds MAC addresses and checksum (FCS)

#### Layer 1 - Physical Layer
- **What it does**: Transmit raw bits
- **Features**: Manchester encoding
- **In simulator**: Converts data to binary signals

---

## 📥 Installation

### Prerequisites

- ✅ Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- ✅ JavaScript enabled
- ✅ No additional dependencies required!

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mr-shiravani/osi-chat-simulator.git
   cd osi-chat-simulator
   ```

2. **Choose Your Method**

   **Method A: Direct Open (Easiest)**
   - Simply open `index.html` in your browser
   - Perfect for quick tests

   **Method B: Local Server (Recommended)**
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - Or simply open `index.html` if using direct method

4. **Start Learning!** 🎉

---

## 📖 Usage Guide

### Basic Usage

#### Sending Your First Message

1. **Type a message** in the Host A or Host B input box
2. **Click "📤 ارسال"** button or press **Enter**
3. **Watch the visualization**:
   - Sender layers light up (7→1)
   - Packet animates through network
   - Receiver layers light up (1→7)
   - Message appears in receiver chat

#### Understanding the Interface

```
┌─────────────────────────────────────────────────┐
│  [Sidebar]    [Chat A] [OSI] [Chat B]  [Panel] │
│   Settings     └── Visualization ──┘    Logs   │
└─────────────────────────────────────────────────┘
```

- **Sidebar (Left)**: Configure network settings
- **Chat Windows**: Send and receive messages
- **OSI Visualization (Center)**: Watch layer processing
- **Details Panel (Bottom)**: View logs and statistics

### Configuration Options

#### Protocol Selection

**TCP (Transmission Control Protocol)**
- ✅ Reliable delivery
- ✅ Automatic retransmission on error
- ✅ Order guaranteed
- ⚠️ Slower due to overhead

**UDP (User Datagram Protocol)**
- ✅ Fast transmission
- ✅ No connection overhead
- ❌ No retransmission
- ❌ Packets may be lost

#### Encryption Options

| Option | Security | Speed | Use Case |
|--------|----------|-------|----------|
| AES-256-GCM | High | Medium | Secure communications |
| AES-128-CBC | Medium | Fast | Standard encryption |
| None | None | Fastest | Learning/testing |

#### Animation Speed

- **200ms**: Fast (for experienced users)
- **600ms**: Default (balanced)
- **1500ms**: Slow (ideal for learning)
- **2000ms**: Very slow (detailed observation)

### Advanced Features

#### Error Simulation

Enable to simulate real-world network conditions:
- 15% packet loss rate
- TCP: automatic retransmission
- UDP: packet dropped

#### Layer Details

1. Click on any OSI layer box
2. View detailed information:
   - Protocol used
   - Headers added
   - Data transformation
   - Processing details

#### Log Export

1. Navigate to Console tab
2. Click 💾 (save) button
3. Log saved as `.txt` file

### Tips for Learning

1. **Start Slow**: Use 1500-2000ms animation speed
2. **Read Console**: Follow the step-by-step logs
3. **Compare Protocols**: Send messages with TCP, then UDP
4. **Enable Errors**: See how protocols handle failures
5. **Click Layers**: Explore what each layer does

---

## 📁 Project Structure

```
osi-chat-simulator/
│
├── 📄 index.html              # Main HTML file
│   └── Structure, UI elements, and semantic markup
│
├── 📂 css/
│   └── 📄 style.css           # Complete styling (800+ lines)
│       ├── CSS Grid & Flexbox layouts
│       ├── Responsive design
│       ├── Animations & transitions
│       └── Dark theme with CSS variables
│
├── 📂 js/
│   └── � script.js           # All functionality (900+ lines)
│       ├── Configuration & State management
│       ├── Security functions (XSS protection)
│       ├── OSI layer processing
│       ├── Chat functionality
│       ├── Packet animation
│       ├── Network canvas
│       ├── Event listeners
│       └── Initialization
│
├── � README.md               # This file
├── 📄 LICENSE                 # MIT License
├── 📄 package.json            # Project metadata
└── 📄 .gitignore             # Git ignore rules

Total: ~2,000 lines of code
```

### Code Organization

The single `script.js` file is organized into logical sections:

```javascript
// 1. Configuration
const CONFIG = { ... };

// 2. State Management
const state = { ... };

// 3. Security Functions
function escapeHTML() { ... }
function sanitizeMessage() { ... }

// 4. Core Functions
function log() { ... }
function activateLayer() { ... }
function sendMessage() { ... }

// 5. OSI Processing
function processSenderLayers() { ... }
function processReceiverLayers() { ... }

// 6. UI Functions
function addMessage() { ... }
function updateStats() { ... }

// 7. Animations
function animatePacket() { ... }
function initNetworkCanvas() { ... }

// 8. Event Listeners
elements.sendA.addEventListener('click', ...);

// 9. Initialization
function init() { ... }
```

---

## 🛠️ Technologies

### Frontend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure & Semantics | Standard |
| **CSS3** | Styling & Animations | Standard |
| **JavaScript** | Logic & Interactivity | ES5+ (Vanilla) |

### Key Features

- ✅ **No Framework**: Pure vanilla JavaScript for transparency
- ✅ **No Dependencies**: Zero npm packages required
- ✅ **Modern APIs**: Canvas, Web Audio, Async/Await
- ✅ **Responsive**: CSS Grid & Flexbox
- ✅ **Accessible**: Semantic HTML

### Browser APIs Used

- **Canvas API**: Network channel animation
- **Web Audio API**: Sound effects
- **Blob API**: Log file export
- **LocalStorage**: (Future feature)

---

## 🔒 Security

Security is a **top priority** in this educational tool.

### Implemented Security Measures

#### 1. XSS Protection
```javascript
// All user inputs are sanitized
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;  // Safe method
    return div.innerHTML;
}
```

#### 2. Input Validation
```javascript
// Message length limit
const maxLength = 500;

// Type checking
if (typeof message !== 'string') return;

// Content validation
const trimmed = message.trim();
if (!trimmed) return error;
```

#### 3. Memory Management
```javascript
// Limit console entries
const maxEntries = 100;
while (entries.length > maxEntries) {
    entries.pop();
}
```

#### 4. Safe DOM Manipulation
- ✅ No `innerHTML` with user data
- ✅ Use `textContent` for user input
- ✅ Sanitize before rendering
- ✅ Escape HTML special characters

### Security Best Practices

1. **Input Sanitization**: All user inputs are escaped
2. **Length Limits**: 500 character maximum per message
3. **No Eval**: No use of `eval()` or similar functions
4. **Memory Limits**: Prevent memory leaks with entry limits
5. **CSP Ready**: Compatible with Content Security Policy

### Encryption Note

⚠️ **Important**: The encryption features are **simulations for educational purposes**. They demonstrate concepts but are not cryptographically secure. Do not use for actual security requirements.

---

## 🌐 Browser Support

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

### Required Browser Features
- ✅ JavaScript ES5+
- ✅ CSS Grid & Flexbox
- ✅ Canvas API
- ✅ Web Audio API
- ✅ Async/Await support

### Mobile Support
- ✅ Responsive design
- ✅ Touch-friendly interface
- ⚠️ Limited on small screens (OSI visualization hidden)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

1. 🐛 **Report Bugs**: Open an issue with details
2. 💡 **Suggest Features**: Share your ideas
3. 📝 **Improve Documentation**: Fix typos, add examples
4. 🔧 **Submit Code**: Create pull requests

### Development Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/osi-chat-simulator.git
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

4. **Commit**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Coding Guidelines

- Use meaningful variable names
- Add comments for complex sections
- Keep functions small and focused
- Follow existing code patterns
- Sanitize all user inputs

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~2,000 |
| JavaScript | ~900 lines |
| CSS | ~800 lines |
| HTML | ~300 lines |
| Documentation | 1,500+ lines |
| Dependencies | 0 |
| File Size | < 1 MB |
| Load Time | < 100ms |

---

## 🗺️ Roadmap

### Version 3.1 (Planned)
- [ ] Multi-language support (English,)
- [ ] Dark/Light theme toggle
- [ ] More protocol options (HTTP/2, WebSocket)
- [ ] Save/Load session state

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Mr-shiravani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

**TL;DR**: Free to use, modify, and distribute. Just keep the copyright notice.

---

## 👤 Author

**Mr-shiravani**

- 🌐 GitHub: [@Mr-shiravani](https://github.com/Mr-shiravani)
- 📧 Email: [Create an issue](https://github.com/Mr-shiravani/osi-chat-simulator/issues)
- 💼 Project: [OSI Chat Simulator](https://github.com/Mr-shiravani/osi-chat-simulator)

---

## 🙏 Acknowledgments

- Inspired by the need for better OSI model visualization
- Built with modern web technologies
- Designed for students and educators
- Made with ❤️ for the learning community

---

## 📞 Support

### Getting Help

- 📖 Read the [Quick Start](#quick-start) guide
- 💬 Check [existing issues](https://github.com/Mr-shiravani/osi-chat-simulator/issues)

### Reporting Bugs

Please include:
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## ⭐ Show Your Support

If this project helped you learn about networking:

- ⭐ **Star this repository**
- 🔄 **Share with others**
- 🐛 **Report bugs**
- 💡 **Suggest improvements**

---

## 📈 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/Mr-shiravani/osi-chat-simulator)
![GitHub issues](https://img.shields.io/github/issues/Mr-shiravani/osi-chat-simulator)
![GitHub stars](https://img.shields.io/github/stars/Mr-shiravani/osi-chat-simulator?style=social)

**Status**: ✅ Active Development | Version 3.0.0 | Production Ready

---

<div align="center">

### Made with ❤️ for Learning

**Happy Networking!** 🌐

[⬆ Back to Top](#-osi-chat-simulator-pro)

</div>
