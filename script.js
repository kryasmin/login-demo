// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const responseConsole = document.getElementById('responseConsole');
const clearConsole = document.getElementById('clearConsole');

// API Endpoint
const API_ENDPOINT = 'http://localhost/login-project/backend/api/login.php';

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    strengthFill.style.width = strength + '%';
    
    if (strength < 50) {
        strengthFill.style.backgroundColor = '#e74c3c';
        feedback = 'Weak';
    } else if (strength < 75) {
        strengthFill.style.backgroundColor = '#f39c12';
        feedback = 'Moderate';
    } else {
        strengthFill.style.backgroundColor = '#2ecc71';
        feedback = 'Strong';
    }
    
    strengthText.textContent = feedback;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Console logging function
function logToConsole(message, type = 'info') {
    const now = new Date();
    const timestamp = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    
    const consoleMessage = document.createElement('div');
    consoleMessage.className = `console-message ${type}`;
    consoleMessage.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;
    
    responseConsole.appendChild(consoleMessage);
    responseConsole.scrollTop = responseConsole.scrollHeight;
}

// Clear console
clearConsole.addEventListener('click', () => {
    responseConsole.innerHTML = '';
    logToConsole('Console cleared', 'info');
});

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Real-time validation
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        emailError.textContent = '';
        return;
    }
    
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address';
    } else {
        emailError.textContent = '';
    }
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    if (!password) {
        passwordError.textContent = '';
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Password strength';
        return;
    }
    
    const validation = validatePassword(password);
    if (!validation.isValid) {
        passwordError.textContent = validation.errors[0];
    } else {
        passwordError.textContent = '';
    }
    
    checkPasswordStrength(password);
});

// Form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate form
    let isValid = true;
    
    if (!email) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        passwordError.textContent = passwordValidation.errors[0];
        isValid = false;
    }
    
    if (!isValid) {
        logToConsole('Form validation failed. Please check errors above.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Authenticating...';
    spinner.classList.remove('hidden');
    
    logToConsole(`Sending login request for: ${email}`, 'info');
    logToConsole(`API Endpoint: ${API_ENDPOINT}`, 'info');
    logToConsole(`Request Payload: {email: "${email}", password: "***"}`, 'info');
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember_me: rememberMe
            })
        });
        
        const data = await response.json();
        
        // Log response
        logToConsole(`Response Status: ${response.status}`, 'info');
        logToConsole(`Response Data: ${JSON.stringify(data)}`, 'info');
        
        if (data.success) {
            logToConsole(`Login successful! Welcome ${data.user.name}`, 'success');
            
            // Simulate redirect
            setTimeout(() => {
                logToConsole('Redirecting to dashboard...', 'info');
            }, 1500);
        } else {
            logToConsole(`Login failed: ${data.message}`, 'error');
        }
        
    } catch (error) {
        logToConsole(`Network error: ${error.message}`, 'error');
        console.log('API Error:', error);
    } finally {
        // Reset button state
        setTimeout(() => {
            submitBtn.disabled = false;
            btnText.textContent = 'Sign In';
            spinner.classList.add('hidden');
        }, 1000);
    }
});

// Initialize
logToConsole('Login system initialized successfully!', 'success');
logToConsole(`Try test credentials: test@example.com / Password123!`, 'info');