
let password = document.getElementById('password');
let email = document.getElementById('email');
let message = document.getElementById('message');
let verbtn = document.getElementById('verbtn');
let warn = document.getElementById('warn');
  
function startCountdown(unlockTime) {
     verbtn.disabled = true;

    const timer = setInterval(() => {
        const now = Date.now();
        const distance = unlockTime - now;
        const seconds = Math.ceil(distance / 1000);

        if (distance <= 0) {
           
            clearInterval(timer);
            verbtn.disabled = false;
             message.innerText = '';
             warn.innerText= message.innerText;
            localStorage.removeItem('resendUnlock');
        } else {
           
            message.innerText = `Please wait ${seconds} seconds before trying again.`; ;
        }
    }, 1000);
}

 verbtn.addEventListener('click', async (event) => {
  event.preventDefault();  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, email: email.value })
    });
       if(response.status===429){
        const data = await response.json();
        message.innerText = data.message;
        warn.innerText = message.innerText;
        warn.style.display= 'block';
         setTimeout(()=>{
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
        const unlockTime = Date.now() + 5000; 
       localStorage.setItem('resendUnlockTime', unlockTime);
        startCountdown(unlockTime);
        return;
    }
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
         warn.innerText= message.innerText;
         warn.style.display='block';
         setTimeout(()=>{
    message.innerText='';
     warn.innerText= message.innerText;
     warn.style.display='none';
    },4000);
        return;
    }
    const data = await response.json();
    message.innerText = data.message;
     warn.innerText= message.innerText;
     warn.style.display='block';
    setTimeout(()=>{
    message.innerText='';
     warn.innerText= message.innerText;
     warn.style.display='none';
    },4000);
    if (data.success) {
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

   
  } catch (err) {
    message.innerText='Unable to connect to server';
     warn.style.display='block';
     warn.innerText= message.innerText;
     setTimeout(()=>{
    message.innerText='';
     warn.innerText= message.innerText;
     warn.style.display='none';
    },4000);
  }
});
