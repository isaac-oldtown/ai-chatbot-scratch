const API_URL = "http://127.0.0.1:8000/api";

document.addEventListener('DOMContentLoaded', function() {
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const tutorialPanel = document.getElementById('tutorialPanel');
    const togglePanel = document.getElementById('togglePanel');
    const closePanel = document.getElementById('closePanel');

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Function to handle sending a message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'ai-message');
            typingIndicator.textContent = 'AI is typing. ..';
            typingIndicator.id = 'typingIndicator';
            chatHistory.appendChild(typingIndicator);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            
            try {
                // Send to cloud API using async/await
                const response = await fetch(`${API_URL}/messages/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message })
                });
                
                const data = await response.json();
                chatHistory.removeChild(typingIndicator);
                
                // Fixed: use 'reply' instead of 'response' to match your working FastAPI code
                if (data && typeof data === 'object' && data.reply) {
                    addMessage(data.reply, false);
                } else {
                    // Fallback for different response structures
                    const responseText = data.reply || data.response || data.message || data.text || JSON.stringify(data);
                    addMessage(responseText, false);
                }
            } catch (error) {
                chatHistory.removeChild(typingIndicator);
                addMessage("Sorry, I encountered an error. Please try again.", false);
                console.error('Error:', error);
            }
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    clearButton.addEventListener('click', function() {
        chatHistory.innerHTML = '';
    });

    // Tutorial panel toggle functionality
    togglePanel.addEventListener('click', function() {
        tutorialPanel.classList.toggle('active');
        togglePanel.textContent = tutorialPanel.classList.contains('active') ? '×' : '?';
    });

    closePanel.addEventListener('click', function() {
        tutorialPanel.classList.remove('active');
        togglePanel.textContent = '?';
    });

    // Add initial welcome message
    setTimeout(() => {
        addMessage("Hello! I'm your AI assistant. How can I help you today?", false);
    }, 500);
});