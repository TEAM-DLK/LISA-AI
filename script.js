const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const newChatBtn = document.getElementById('new-chat-btn');
const newChatMobileBtn = document.getElementById('new-chat-mobile');

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
}

openSidebarBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

function startNewChat() {
    chatContainer.innerHTML = ''; 
    closeSidebar();
}

newChatBtn.addEventListener('click', startNewChat);
newChatMobileBtn.addEventListener('click', startNewChat);

messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    sendBtn.disabled = this.value.trim() === '';
});

sendBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (message === '') return;

    addMessage(message, true);

    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;

    try {
        const aiResponse = await generateAIResponse(message);
        addMessage(aiResponse, false);
    } catch (error) {
        console.error('Error generating response:', error);
        addMessage('Sorry, I couldn\'t process that message.', false);
    }
});

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'ai-message');
    messageDiv.textContent = text;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function generateAIResponse(userMessage) {
    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        return data.response || "Sorry, I couldn't process that message.";
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return "Error communicating with the server.";
    }
}
