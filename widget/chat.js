const API_URL = "http://127.0.0.1:8000/api";

function addMessage(role, text, animate = false) {
    const area = document.getElementById("messagesArea");

    const msg = document.createElement("div");
    msg.classList.add("message", role);

    if (animate) {
        msg.classList.add("typing");
        msg.innerText = "Typing...";
        area.appendChild(msg);

        setTimeout(() => {
            msg.classList.remove("typing");
            msg.innerText = text;
        }, 600);
    } else {
        msg.innerText = text;
        area.appendChild(msg);
    }

    area.scrollTop = area.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();

    if (!text) return;

    // show user message immediately
    createMessage("user", text);
    input.value = "";

    // typing indicator
    const typing = document.createElement("div");
    typing.classList.add("message", "bot");
    typing.innerText = "Typing...";
    document.getElementById("messagesArea").appendChild(typing);

    try {
        const res = await fetch(`${API_URL}/messages/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();

        // remove typing indicator
        typing.remove();

        // show bot response
        createMessage("bot", data.reply);

    } catch (err) {
        typing.remove();
        createMessage("bot", "Error connecting to server ❌");
    }
}

async function clearChat() {
    await fetch(`${API_URL}/messages/reset`, {
        method: "DELETE"
    });

    loadMessages();
}

function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function createMessage(role, text) {
    const area = document.getElementById("messagesArea");

    const div = document.createElement("div");
    div.classList.add("message", role);
    div.innerText = text;

    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
}

async function loadMessages() {
    const res = await fetch(`${API_URL}/messages`);
    const data = await res.json();

    const area = document.getElementById("messagesArea");
    area.innerHTML = "";

    data.forEach(msg => {
        createMessage(msg.role, msg.text);
    });
}

