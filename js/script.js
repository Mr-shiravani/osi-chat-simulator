// ==================== Configuration ====================
const CONFIG = {
    hostA: { ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:01', port: 8080 },
    hostB: { ip: '192.168.1.20', mac: 'AA:BB:CC:DD:EE:02', port: 80 }
};

// ==================== State ====================
const state = {
    isTransmitting: false,
    sessionId: null,
    sequenceNumber: 1000,
    stats: {
        total: 0,
        success: 0,
        failed: 0,
        latencies: []
    },
    layerData: {},
    packets: [],
    performanceData: []
};

// ==================== DOM Elements ====================
const elements = {
    // Inputs
    inputA: document.getElementById('inputA'),
    inputB: document.getElementById('inputB'),
    sendA: document.getElementById('sendA'),
    sendB: document.getElementById('sendB'),
    
    // Chats
    chatA: document.getElementById('chatA'),
    chatB: document.getElementById('chatB'),
    
    // Controls
    protocolSelect: document.getElementById('protocolSelect'),
    speedRange: document.getElementById('speedRange'),
    speedValue: document.getElementById('speedValue'),
    encryptionSelect: document.getElementById('encryptionSelect'),
    compressionSelect: document.getElementById('compressionSelect'),
    errorSimulation: document.getElementById('errorSimulation'),
    showBinary: document.getElementById('showBinary'),
    showHeaders: document.getElementById('showHeaders'),
    autoReply: document.getElementById('autoReply'),
    soundEffects: document.getElementById('soundEffects'),
    
    // Buttons
    resetBtn: document.getElementById('resetBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    clearConsole: document.getElementById('clearConsole'),
    exportLog: document.getElementById('exportLog'),
    
    // Visualization
    packetsFlow: document.getElementById('packetsFlow'),
    networkCanvas: document.getElementById('networkCanvas'),
    
    // Console
    consoleContent: document.getElementById('consoleContent'),
    layerDetailsContent: document.getElementById('layerDetailsContent'),
    packetsList: document.getElementById('packetsList'),
    
    // Stats
    totalMessages: document.getElementById('totalMessages'),
    successMessages: document.getElementById('successMessages'),
    failedMessages: document.getElementById('failedMessages'),
    avgLatency: document.getElementById('avgLatency')
};

// ==================== Utility Functions ====================
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString('fa-IR');
    const safeMessage = escapeHTML(message);
    entry.innerHTML = `<span class="log-timestamp">[${time}]</span> ${safeMessage}`;
    elements.consoleContent.insertBefore(entry, elements.consoleContent.firstChild);
    
    // Limit console entries to prevent memory issues
    const maxEntries = 100;
    while (elements.consoleContent.children.length > maxEntries) {
        elements.consoleContent.removeChild(elements.consoleContent.lastChild);
    }
}

function updateStats() {
    elements.totalMessages.textContent = state.stats.total;
    elements.successMessages.textContent = state.stats.success;
    elements.failedMessages.textContent = state.stats.failed;
    
    if (state.stats.latencies.length > 0) {
        const avg = state.stats.latencies.reduce((a, b) => a + b, 0) / state.stats.latencies.length;
        elements.avgLatency.textContent = Math.round(avg) + 'ms';
        document.getElementById('rttValue').textContent = Math.round(avg) + ' ms';
    }
    
    const successRate = state.stats.total > 0 ? 
        ((state.stats.success / state.stats.total) * 100).toFixed(1) : 0;
    document.getElementById('successRate').textContent = successRate + '%';
    
    const lossRate = state.stats.total > 0 ? 
        ((state.stats.failed / state.stats.total) * 100).toFixed(1) : 0;
    document.getElementById('packetLoss').textContent = lossRate + '%';
}

function playSound(type) {
    if (!elements.soundEffects.checked) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'send') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
    } else if (type === 'receive') {
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.1;
    } else if (type === 'error') {
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ==================== Layer Management ====================
function activateLayer(id, type = 'active') {
    const layer = document.getElementById(id);
    if (layer) {
        layer.classList.remove('active', 'success', 'error');
        layer.classList.add(type);
        
        // Update channel status
        const layerNum = id.match(/\d+/)[0];
        const layerNames = {
            '7': 'Application Layer',
            '6': 'Presentation Layer',
            '5': 'Session Layer',
            '4': 'Transport Layer',
            '3': 'Network Layer',
            '2': 'Data Link Layer',
            '1': 'Physical Layer'
        };
        
        const statusBox = document.getElementById('channelStatusBox');
        const statusText = statusBox.querySelector('.status-text');
        
        if (type === 'active') {
            statusBox.classList.add('active');
            statusText.textContent = `در حال پردازش: ${layerNames[layerNum]}`;
        }
    }
}

function deactivateLayer(id) {
    const layer = document.getElementById(id);
    if (layer) {
        layer.classList.remove('active', 'success', 'error');
    }
    
    // Reset channel status
    const statusBox = document.getElementById('channelStatusBox');
    const statusText = statusBox.querySelector('.status-text');
    statusBox.classList.remove('active');
    statusText.textContent = 'آماده انتقال';
}

function storeLayerData(layerId, data) {
    state.layerData[layerId] = {
        timestamp: Date.now(),
        ...data
    };
}

function showLayerDetails(layerId) {
    const data = state.layerData[layerId];
    if (!data) {
        elements.layerDetailsContent.innerHTML = '<p class="placeholder">داده‌ای موجود نیست</p>';
        return;
    }
    
    let html = '<div class="detail-section">';
    html += `<h4>Layer ${layerId.replace(/[srAB]/g, '')} Details</h4>`;
    html += '<div class="detail-grid">';
    
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'timestamp') {
            // Sanitize values
            const safeKey = escapeHTML(String(key));
            const safeValue = escapeHTML(String(value));
            html += `
                <div class="detail-item">
                    <span class="label">${safeKey}</span>
                    <span class="value">${safeValue}</span>
                </div>
            `;
        }
    }
    
    html += '</div></div>';
    elements.layerDetailsContent.innerHTML = html;
}

// ==================== Encryption & Compression ====================
function encrypt(data, algorithm) {
    if (algorithm === 'none') return data;
    const encrypted = btoa(unescape(encodeURIComponent(data)));
    return `[${algorithm}]${encrypted}`;
}

function decrypt(data, algorithm) {
    if (algorithm === 'none') return data;
    const match = data.match(/\[(.*?)\](.*)/);
    if (match) {
        return decodeURIComponent(escape(atob(match[2])));
    }
    return data;
}

function compress(data, algorithm) {
    if (algorithm === 'none') return data;
    return `[${algorithm}]${data}`;
}

function calculateChecksum(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data.charCodeAt(i);
    }
    return (sum % 65536).toString(16).toUpperCase().padStart(4, '0');
}

function toBinary(text) {
    return text.split('').slice(0, 3).map(c => 
        c.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ') + '...';
}

// ==================== Security Functions ====================
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function sanitizeMessage(message) {
    const maxLength = 500;
    const trimmed = message.trim();
    
    if (!trimmed) {
        return { valid: false, error: 'پیام نمی‌تواند خالی باشد' };
    }
    
    if (trimmed.length > maxLength) {
        return { valid: false, error: `پیام خیلی طولانی است (حداکثر ${maxLength} کاراکتر)` };
    }
    
    return { valid: true, message: trimmed };
}

// ==================== Chat Message ====================
function addMessage(chatId, text, type, status = 'sent') {
    const chat = document.getElementById(chatId);
    const message = document.createElement('div');
    message.className = `message ${type} ${status}`;
    
    const time = new Date().toLocaleTimeString('fa-IR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Sanitize text to prevent XSS
    const safeText = escapeHTML(text);
    
    message.innerHTML = `
        ${safeText}
        <span class="message-time">${time}</span>
        ${status === 'sending' ? '<span class="message-status">⏳</span>' : ''}
        ${status === 'sent' ? '<span class="message-status">✓</span>' : ''}
        ${status === 'error' ? '<span class="message-status">✗</span>' : ''}
    `;
    
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
    
    return message;
}

function updateMessageStatus(message, status) {
    message.className = message.className.replace(/sending|sent|error/g, status);
    const statusSpan = message.querySelector('.message-status');
    if (statusSpan) {
        if (status === 'sent') statusSpan.textContent = '✓✓';
        if (status === 'error') statusSpan.textContent = '✗';
    }
}

// ==================== Packet Animation ====================
async function animatePacket(direction, messageText) {
    const speed = parseInt(elements.speedRange.value);
    const packet = document.createElement('div');
    packet.className = 'packet-mini';
    packet.textContent = '📦';
    
    elements.packetsFlow.appendChild(packet);
    
    const channelHeight = 350; // باید با ارتفاع channel-line مطابقت داشته باشه
    const startY = direction === 'AtoB' ? -40 : channelHeight;
    const endY = direction === 'AtoB' ? channelHeight : -40;
    const duration = speed * 2;
    const steps = 80;
    
    packet.style.top = startY + 'px';
    
    // Simulate error
    const hasError = elements.errorSimulation.checked && Math.random() < 0.15;
    let errorOccurred = false;
    
    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const currentY = startY + (endY - startY) * progress;
        packet.style.top = currentY + 'px';
        
        if (hasError && !errorOccurred && progress > 0.4 && progress < 0.6) {
            packet.classList.add('error');
            playSound('error');
            log('⚠️ خطا در انتقال بسته!', 'error');
            errorOccurred = true;
            
            if (elements.protocolSelect.value === 'TCP') {
                log('🔄 بازارسال بسته (TCP)', 'warning');
                await wait(300);
                packet.classList.remove('error');
                i = 0;
                errorOccurred = false;
            } else {
                state.stats.failed++;
                updateStats();
                await wait(300);
                packet.remove();
                return false;
            }
        }
        
        await wait(duration / steps);
    }
    
    if (!errorOccurred) {
        packet.classList.add('success');
        state.stats.success++;
    }
    
    updateStats();
    await wait(200);
    packet.remove();
    
    return !errorOccurred;
}

// ==================== OSI Layer Processing ====================
async function processSenderLayers(message, sender) {
    const speed = parseInt(elements.speedRange.value);
    const prefix = sender === 'A' ? 'sA' : 'rB';
    let data = message;
    
    // Update labels
    document.getElementById('labelA').textContent = sender === 'A' ? 'Host A (Sender)' : 'Host A';
    document.getElementById('labelB').textContent = sender === 'B' ? 'Host B (Sender)' : 'Host B';
    
    // Layer 7: Application
    activateLayer(prefix + '7');
    log(`[${sender} L7 - Application] پیام از برنامه دریافت شد: "${data}"`, 'info');
    storeLayerData(prefix + '7', {
        'Protocol': 'HTTP/1.1',
        'Message': data,
        'Length': data.length + ' bytes'
    });
    await wait(speed);
    activateLayer(prefix + '7', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '7');
    
    // Layer 6: Presentation
    activateLayer(prefix + '6');
    const encAlgo = elements.encryptionSelect.value;
    const compAlgo = elements.compressionSelect.value;
    
    if (encAlgo !== 'none') {
        data = encrypt(data, encAlgo);
        log(`[${sender} L6 - Presentation] رمزنگاری ${encAlgo} انجام شد`, 'info');
    } else {
        log(`[${sender} L6 - Presentation] بدون رمزنگاری`, 'info');
    }
    
    if (compAlgo !== 'none') {
        data = compress(data, compAlgo);
        log(`[${sender} L6 - Presentation] فشرده‌سازی ${compAlgo} انجام شد`, 'info');
    }
    
    storeLayerData(prefix + '6', {
        'Encryption': encAlgo,
        'Compression': compAlgo,
        'Data': data.substring(0, 30) + '...'
    });
    await wait(speed);
    activateLayer(prefix + '6', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '6');
    
    // Layer 5: Session
    activateLayer(prefix + '5');
    if (!state.sessionId) {
        state.sessionId = 'SID-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        log(`[${sender} L5 - Session] نشست جدید ایجاد شد: ${state.sessionId}`, 'info');
    } else {
        log(`[${sender} L5 - Session] استفاده از نشست موجود: ${state.sessionId}`, 'info');
    }
    storeLayerData(prefix + '5', {
        'Session ID': state.sessionId,
        'State': 'ESTABLISHED',
        'Handshake': 'SYN → SYN-ACK → ACK'
    });
    await wait(speed);
    activateLayer(prefix + '5', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '5');
    
    // Layer 4: Transport
    activateLayer(prefix + '4');
    const protocol = elements.protocolSelect.value;
    const seq = state.sequenceNumber++;
    log(`[${sender} L4 - Transport] پروتکل ${protocol} | SEQ: ${seq}`, 'info');
    if (protocol === 'TCP') {
        log(`[${sender} L4 - Transport] Three-way handshake انجام شد`, 'info');
    }
    storeLayerData(prefix + '4', {
        'Protocol': protocol,
        'SEQ': seq,
        'Port': sender === 'A' ? '8080→80' : '80→8080',
        'Flags': protocol === 'TCP' ? 'SYN, ACK, PSH' : 'None'
    });
    await wait(speed);
    activateLayer(prefix + '4', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '4');
    
    // Layer 3: Network
    activateLayer(prefix + '3');
    const srcIP = sender === 'A' ? CONFIG.hostA.ip : CONFIG.hostB.ip;
    const dstIP = sender === 'A' ? CONFIG.hostB.ip : CONFIG.hostA.ip;
    log(`[${sender} L3 - Network] بسته IP ایجاد شد | SRC: ${srcIP} → DST: ${dstIP}`, 'info');
    storeLayerData(prefix + '3', {
        'Source IP': srcIP,
        'Dest IP': dstIP,
        'TTL': '64',
        'Protocol': 'IPv4'
    });
    await wait(speed);
    activateLayer(prefix + '3', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '3');
    
    // Layer 2: Data Link
    activateLayer(prefix + '2');
    const srcMAC = sender === 'A' ? CONFIG.hostA.mac : CONFIG.hostB.mac;
    const dstMAC = sender === 'A' ? CONFIG.hostB.mac : CONFIG.hostA.mac;
    const checksum = calculateChecksum(data);
    log(`[${sender} L2 - Data Link] فریم Ethernet ایجاد شد | FCS: ${checksum}`, 'info');
    storeLayerData(prefix + '2', {
        'Source MAC': srcMAC,
        'Dest MAC': dstMAC,
        'FCS': checksum,
        'Type': 'Ethernet II'
    });
    await wait(speed);
    activateLayer(prefix + '2', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '2');
    
    // Layer 1: Physical
    activateLayer(prefix + '1');
    if (elements.showBinary.checked) {
        const binary = toBinary(message);
        log(`[${sender} L1 - Physical] تبدیل به بیت: ${binary}`, 'info');
    } else {
        log(`[${sender} L1 - Physical] تبدیل به سیگنال الکتریکی (${data.length * 8} bits)`, 'info');
    }
    storeLayerData(prefix + '1', {
        'Encoding': 'Manchester',
        'Speed': '1 Gbps',
        'Bits': data.length * 8,
        'Medium': 'Ethernet Cable'
    });
    await wait(speed);
    activateLayer(prefix + '1', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '1');
    
    return data;
}

async function processReceiverLayers(message, receiver) {
    const speed = parseInt(elements.speedRange.value);
    const prefix = receiver === 'A' ? 'sA' : 'rB';
    
    // Update labels
    document.getElementById('labelA').textContent = receiver === 'A' ? 'Host A (Receiver)' : 'Host A';
    document.getElementById('labelB').textContent = receiver === 'B' ? 'Host B (Receiver)' : 'Host B';
    
    // Layer 1: Physical
    activateLayer(prefix + '1');
    log(`[${receiver} L1 - Physical] سیگنال الکتریکی دریافت شد`, 'info');
    await wait(speed);
    activateLayer(prefix + '1', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '1');
    
    // Layer 2: Data Link
    activateLayer(prefix + '2');
    log(`[${receiver} L2 - Data Link] بررسی FCS و MAC Address ✓`, 'info');
    await wait(speed);
    activateLayer(prefix + '2', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '2');
    
    // Layer 3: Network
    activateLayer(prefix + '3');
    const dstIP = receiver === 'A' ? CONFIG.hostA.ip : CONFIG.hostB.ip;
    log(`[${receiver} L3 - Network] بررسی IP مقصد: ${dstIP} ✓`, 'info');
    await wait(speed);
    activateLayer(prefix + '3', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '3');
    
    // Layer 4: Transport
    activateLayer(prefix + '4');
    const protocol = elements.protocolSelect.value;
    if (protocol === 'TCP') {
        log(`[${receiver} L4 - Transport] بخش‌ها ترکیب شدند | ارسال ACK`, 'info');
    } else {
        log(`[${receiver} L4 - Transport] دیتاگرام UDP دریافت شد`, 'info');
    }
    await wait(speed);
    activateLayer(prefix + '4', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '4');
    
    // Layer 5: Session
    activateLayer(prefix + '5');
    log(`[${receiver} L5 - Session] نشست ${state.sessionId} فعال است`, 'info');
    await wait(speed);
    activateLayer(prefix + '5', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '5');
    
    // Layer 6: Presentation
    activateLayer(prefix + '6');
    const encAlgo = elements.encryptionSelect.value;
    const compAlgo = elements.compressionSelect.value;
    
    if (compAlgo !== 'none') {
        log(`[${receiver} L6 - Presentation] از حالت فشرده خارج شد (${compAlgo})`, 'info');
    }
    
    if (encAlgo !== 'none') {
        log(`[${receiver} L6 - Presentation] رمزگشایی ${encAlgo} انجام شد`, 'info');
    }
    
    await wait(speed);
    activateLayer(prefix + '6', 'success');
    await wait(speed / 2);
    deactivateLayer(prefix + '6');
    
    // Layer 7: Application
    activateLayer(prefix + '7');
    log(`[${receiver} L7 - Application] پیام به برنامه تحویل داده شد: "${message}"`, 'success');
    await wait(speed);
    activateLayer(prefix + '7', 'success');
    await wait(speed);
    deactivateLayer(prefix + '7');
}

// ==================== Main Send Function ====================
async function sendMessage(from, to) {
    if (state.isTransmitting) return;
    
    const input = from === 'A' ? elements.inputA : elements.inputB;
    const messageText = input.value;
    
    // Validate and sanitize message
    const validation = sanitizeMessage(messageText);
    if (!validation.valid) {
        alert(validation.error);
        return;
    }
    
    const message = validation.message;
    
    state.isTransmitting = true;
    const startTime = Date.now();
    
    // Disable inputs
    elements.sendA.disabled = true;
    elements.sendB.disabled = true;
    
    // Add message to sender chat
    const senderChat = from === 'A' ? 'chatA' : 'chatB';
    const messageEl = addMessage(senderChat, message, 'sent', 'sending');
    
    playSound('send');
    log(`🚀 ارسال پیام از ${from} به ${to}`, 'info');
    log(`📝 پیام: "${message}"`, 'info');
    
    state.stats.total++;
    updateStats();
    
    try {
        // Process sender layers
        await processSenderLayers(message, from);
        
        // Animate packet
        const direction = from === 'A' ? 'AtoB' : 'BtoA';
        const success = await animatePacket(direction, message);
        
        if (!success) {
            updateMessageStatus(messageEl, 'error');
            log('❌ ارسال ناموفق', 'error');
            playSound('error');
            return;
        }
        
        // Process receiver layers
        await processReceiverLayers(message, to);
        
        // Add message to receiver chat
        const receiverChat = to === 'A' ? 'chatA' : 'chatB';
        addMessage(receiverChat, message, 'received', 'sent');
        
        updateMessageStatus(messageEl, 'sent');
        playSound('receive');
        
        // Calculate latency
        const latency = Date.now() - startTime;
        state.stats.latencies.push(latency);
        updateStats();
        
        log(`✅ پیام با موفقیت تحویل داده شد (${latency}ms)`, 'success');
        
        // Clear input
        input.value = '';
        
        // Auto reply
        if (elements.autoReply.checked) {
            await wait(1000);
            const replies = [
                'دریافت شد، ممنون!',
                'باشه، متوجه شدم',
                'عالیه!',
                'OK 👍',
                'دریافت کردم'
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            
            if (to === 'A') {
                elements.inputA.value = reply;
                await sendMessage('A', 'B');
            } else {
                elements.inputB.value = reply;
                await sendMessage('B', 'A');
            }
        }
        
    } catch (error) {
        log('❌ خطا: ' + error.message, 'error');
        updateMessageStatus(messageEl, 'error');
        state.stats.failed++;
        updateStats();
    } finally {
        state.isTransmitting = false;
        elements.sendA.disabled = false;
        elements.sendB.disabled = false;
    }
}

// ==================== Network Canvas Animation ====================
function initNetworkCanvas() {
    const canvas = elements.networkCanvas;
    const ctx = canvas.getContext('2d');
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 8; i++) {
            const y = (i / 8) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw particles
        const time = Date.now() / 1000;
        for (let i = 0; i < 3; i++) {
            const y = ((time * 40 + i * 130) % canvas.height);
            ctx.fillStyle = `rgba(99, 102, 241, ${0.2 + Math.sin(time + i) * 0.15})`;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==================== Performance Chart ====================
function updatePerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (state.stats.latencies.length === 0) return;
    
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    
    // Draw axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw data
    const maxLatency = Math.max(...state.stats.latencies);
    const samples = state.stats.latencies.slice(-20);
    
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    samples.forEach((latency, i) => {
        const x = padding + (i / (samples.length - 1)) * width;
        const y = canvas.height - padding - (latency / maxLatency) * height;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.stroke();
}

// ==================== Event Listeners ====================
elements.sendA.addEventListener('click', () => sendMessage('A', 'B'));
elements.sendB.addEventListener('click', () => sendMessage('B', 'A'));

elements.inputA.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage('A', 'B');
    }
});

elements.inputB.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage('B', 'A');
    }
});

elements.speedRange.addEventListener('input', (e) => {
    elements.speedValue.textContent = e.target.value + 'ms';
});

elements.resetBtn.addEventListener('click', () => {
    // Clear layers
    for (let i = 1; i <= 7; i++) {
        deactivateLayer('sA' + i);
        deactivateLayer('rB' + i);
        deactivateLayer('sB' + i);
        deactivateLayer('rA' + i);
    }
    
    // Reset state
    state.sessionId = null;
    state.sequenceNumber = 1000;
    state.stats = {
        total: 0,
        success: 0,
        failed: 0,
        latencies: []
    };
    state.layerData = {};
    
    updateStats();
    log('🔄 سیستم بازنشانی شد', 'info');
});

elements.clearAllBtn.addEventListener('click', () => {
    elements.chatA.innerHTML = '<div class="welcome-message"><p>💬 چت پاک شد</p></div>';
    elements.chatB.innerHTML = '<div class="welcome-message"><p>💬 چت پاک شد</p></div>';
    log('🗑️ چت‌ها پاک شدند', 'info');
});

elements.clearConsole.addEventListener('click', () => {
    elements.consoleContent.innerHTML = '';
});

elements.exportLog.addEventListener('click', () => {
    const logs = Array.from(elements.consoleContent.children)
        .map(entry => entry.textContent)
        .reverse()
        .join('\n');
    
    const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osi-chat-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    log('💾 لاگ ذخیره شد', 'success');
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        if (tabName === 'analysis') {
            updatePerformanceChart();
        }
    });
});

// Layer click handlers
document.querySelectorAll('.layer-mini').forEach(layer => {
    layer.addEventListener('click', () => {
        showLayerDetails(layer.id);
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector('[data-tab="layers"]').classList.add('active');
        document.getElementById('layers').classList.add('active');
    });
});

// ==================== Initialization ====================
function init() {
    initNetworkCanvas();
    log('✨ OSI Chat Simulator v3.0 Pro آماده است', 'success');
    log('💡 از هر دو طرف می‌توانید پیام ارسال کنید', 'info');
    log('🔍 روی لایه‌ها کلیک کنید تا جزئیات ببینید', 'info');
    updateStats();
}

init();
