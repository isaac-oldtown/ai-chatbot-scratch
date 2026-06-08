document.addEventListener('DOMContentLoaded', function() {
    // =============== VARIABLES =============== //
    const API_URL = "http://localhost:8000/api";

    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const tutorialPanel = document.getElementById('tutorialPanel');
    const togglePanel = document.getElementById('togglePanel');
    const closePanel = document.getElementById('closePanel');
    const uploadButton = document.getElementById('uploadButton');
    const documentInput = document.getElementById('documentInput');


    // =============== FUNCTIONS =============== //
    // Function to add a message to the chat
    function addMessage(text, isAI = false) {
        const messageDiv = document.createElement('div');

        messageDiv.classList.add('message');
        messageDiv.classList.add(isAI ? 'ai-message' : 'user-message');

        // Convert Markdown → HTML
        const html = marked.parse(text || "");

        // Sanitize HTML (prevents XSS attacks)
        messageDiv.innerHTML = DOMPurify.sanitize(html);

        chatHistory.appendChild(messageDiv);

        // Optional: auto-scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Function to handle sending a message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, false);
            userInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'ai-message');
            typingIndicator.textContent = 'AI is typing...';
            typingIndicator.id = 'typingIndicator';
            chatHistory.appendChild(typingIndicator);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            
            try {
                // Send to cloud API using async/await
                const response = await fetch(`${API_URL}/chat/send`, {
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
                    addMessage(data.reply, true);
                } else {
                    // Fallback for different response structures
                    const responseText = data.reply || data.response || data.message || data.text || JSON.stringify(data);
                    addMessage(responseText, true);
                }
            } catch (error) {
                chatHistory.removeChild(typingIndicator);
                addMessage("Sorry, I encountered an error. Please try again.", true);
                console.error('Error:', error);
            }
        }
    }

    // =============== EVENT LISTENERS =============== //
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    clearButton.addEventListener('click', async function () {
        chatHistory.innerHTML = '';

        try {
            await fetch(`${API_URL}/chat/reset`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            await loadChatHistory();

        } catch (error) {
            console.error('Failed to reset chat:', error);
            addMessage('Failed to reset chat.', true);
        }
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

    // File picker
    uploadButton.addEventListener('click', () => {
        documentInput.click();
    });

    documentInput.addEventListener('change', async function () {
        const file = this.files[0];

        if (!file) return;

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'ai-message');
        typingIndicator.textContent = 'Uploading document...';
        chatHistory.appendChild(typingIndicator);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/documents/upload`, {
                method: 'POST',
                body: formData
            });

            const body = await response.json();

            chatHistory.removeChild(typingIndicator);

            if (body.error === 1) {
                addMessage(body.text, true); // backend error
            } else if (body.error === 0) {
                addMessage(
                    body.message || `📄 Uploaded: ${file.name}`,
                    false
                );
            } else {
                addMessage("Unexpected server response.", true);
                console.log(body.text);
            }

        } catch (error) {
            chatHistory.removeChild(typingIndicator);

            addMessage(
                `Failed to upload document "${file.name}".`,
                true
            );

            console.error(error);
        }

        documentInput.value = '';
    });

    // Show all messages
    async function loadChatHistory() {
        try {
            const response = await fetch(`${API_URL}/chat`);
            const messages = await response.json();

            if (!Array.isArray(messages)) return;

            messages.forEach(msg => {
                // skip system messages
                if (msg.role === "system") return;

                const isAI = msg.role === "assistant";
                addMessage(msg.content, isAI);
            });

        } catch (error) {
            console.error("Failed to load chat history:", error);
            addMessage("Failed to load chat history.", true);
        }
    }

    // call it on page load
    loadChatHistory();
});
