
    
const avatarBtn = document.getElementById('avatarBtn');
const profilePanel = document.getElementById('profilePanel'); 
const settingsBtn = document.querySelector('.settings-btn');
const dropdown = document.querySelector('.setting-option');
const darkModeBtn = document.getElementById('darkModeBtn');
const logoutBtn = document.getElementById('logoutBtn');

const chatmessages = document.getElementById('chatMessages');
const chatinput = document.querySelector('#chatinput1');
const sendBtn = document.getElementById('send-btn');
const chatWindow = document.querySelector('#chat-window');



// window.addEventListener('DOMContentLoaded', () => {
//     fetch('/socket-io', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//     }).then(res => res.json())
//     .then(data => {
//         console.log('Socket.IO connection established:', data);
//     }).catch(err => {
//         console.error('Error connecting to Socket.IO:', err);
//     });
// });
function send(e){
 
    const message = chatinput.value;
    if (!message.trim()) return; 
    const msgDiv = document.createElement('div');
    
    msgDiv.classList.add('chat-message', 'sent');
    msgDiv.innerText = message;
    chatmessages.appendChild(msgDiv);
    chatinput.value = '';

    fetch(`/send-message/${nid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, receiver: rname })
    }).then(res => res.json())
    .then(data => {
        if (data.success) {
          //sucess
          console.log('Message sent successfully');
        }
    }).catch(err => {
        console.error('Error sending message:', err);
    });
  };
sendBtn.addEventListener('click', send);
sendBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    send();
  }
});


    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePanel.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      profilePanel.classList.remove('open');
    });

    profilePanel.addEventListener('click', e => e.stopPropagation());

    // ── Contact search filter ──
    document.getElementById('searchInput').addEventListener('input', function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.contact-item').forEach(item => {
        const name = item.dataset.name.toLowerCase();
        item.style.display = name.includes(q) ? '' : 'none';
      });
    });

    function showSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.remove('hidden');
  sidebar.style.zIndex = 10;
  document.querySelector('.chat-area').style.zIndex = 5;
}
let nid;
let rname;
    // ── Open chat ──
   async function openChat(id, name, status) {
    nid = id;
    rname = name;
      document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
      document.querySelector(`.contact-item[data-id="${id}"]`).classList.add('active');
        if (window.innerWidth <= 575) {
    document.querySelector('.sidebar').classList.add('hidden');
     const sidebar = document.querySelector('.sidebar');
    const chatArea = document.querySelector('.chat-area');

    sidebar.classList.add('hidden');
    sidebar.style.zIndex = 5;

    chatArea.style.zIndex = 10;
    chatArea.style.display = 'flex';     
    chatArea.style.flexDirection = 'column';
  }
  
  const response = await fetch(`/display/${id}`, {
    method: 'POST',
    body: JSON.stringify({ id , name }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  const messages = data.messages;

   document.getElementById('chatMessages').innerHTML = messages.map(m => {
        const sideClass = m.sender === rname ? 'received' : 'sent';
        return `
          <div class="chat-message ${sideClass}">
            <p class="message-content">${m.message}</p>
            <sub class="message-time">${new Date(m.Date).toLocaleTimeString()}</sub>
          </div>
        `;
      }).join('');
      document.getElementById('chatEmpty').style.display = 'none';
      document.getElementById('chatWindow').style.display = 'flex';

      const initials = name.split(' ').map(n => n[0]).join('');
      document.getElementById('chatHeaderAvatar').textContent = initials;
      document.getElementById('chatHeaderName').textContent = name;
      document.getElementById('chatHeaderStatus').textContent = status.charAt(0).toUpperCase() + status.slice(1);
      document.getElementById('chatHeaderStatus').className = 'chat-header-status ' + status;
     
      }
    

async function view(id,name){
  const response = await fetch(`/display/${id}`, {
    method: 'POST',
    body: JSON.stringify({ id , name }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  const messages = data.messages;

   document.getElementById('chatMessages').innerHTML = messages.map(m => {
        const sideClass = m.sender === rname ? 'received' : 'sent';
        return `
          <div class="chat-message ${sideClass}">
            <p class="message-content">${m.message}</p>
            <sub class="message-time">${new Date(m.Date).toLocaleTimeString()}</sub>
          </div>
        `;
      }).join('');

}
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = dropdown.classList.toggle('show');
  settingsBtn.classList.toggle('open', isOpen);
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !settingsBtn.contains(e.target)) {
    dropdown.classList.remove('show');
    settingsBtn.classList.remove('open');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dropdown.classList.remove('show');
    settingsBtn.classList.remove('open');
  }
});

// --- Dark mode toggle ---
const DARK_MODE_KEY = 'darkMode';

if (localStorage.getItem(DARK_MODE_KEY) === 'true') {
  document.body.classList.add('dark-mode');
  darkModeBtn.classList.add('active');
}

darkModeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  darkModeBtn.classList.toggle('active', isDark);
  localStorage.setItem(DARK_MODE_KEY, isDark);
});

  