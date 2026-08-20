// Custom Global Alert Override for Premium UI Modal Popups
const originalAlert = window.alert;

window.alert = (message) => {
  // Create container if not exists
  let container = document.getElementById('custom-alert-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'custom-alert-container';
    
    // Inject styles for the container and alert dialog
    const style = document.createElement('style');
    style.textContent = `
      #custom-alert-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
      }
      
      .custom-alert-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
      }
      
      .custom-alert-backdrop.show {
        opacity: 1;
      }
      
      .custom-alert-box {
        position: relative;
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f8fafc;
        border-radius: 16px;
        padding: 28px 24px;
        width: 90%;
        max-width: 440px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        transform: scale(0.9) translateY(20px);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .custom-alert-box.show {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      
      .custom-alert-icon-container {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        border: 1px solid rgba(245, 158, 11, 0.2);
      }

      .custom-alert-icon-container.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border-color: rgba(16, 185, 129, 0.2);
      }

      .custom-alert-icon-container.error {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.2);
      }
      
      .custom-alert-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 10px 0;
        color: #f8fafc;
        letter-spacing: -0.01em;
      }
      
      .custom-alert-message {
        font-size: 14px;
        color: #94a3b8;
        margin: 0 0 24px 0;
        line-height: 1.6;
        word-break: break-word;
      }
      
      .custom-alert-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 10px 28px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        outline: none;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
      
      .custom-alert-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
      }
      
      .custom-alert-btn:active {
        transform: translateY(1px);
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(container);
  }

  // Clear existing content inside container
  container.innerHTML = '';

  // Determine type of alert based on message content
  let type = 'info'; // default
  let title = 'Notification';
  const msgLower = (message || '').toLowerCase();
  
  if (msgLower.includes('already approved') || msgLower.includes("can't edit") || msgLower.includes('cannot edit')) {
    type = 'info';
    title = 'Info';
  } else if (msgLower.includes('success') || msgLower.includes('approve') || msgLower.includes('submit')) {
    type = 'success';
    title = 'Success';
  } else if (msgLower.includes('fail') || msgLower.includes('error') || msgLower.includes('invalid') || msgLower.includes('please')) {
    type = 'error';
    title = 'Alert';
  }

  // Define icon SVG based on type
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'custom-alert-backdrop';
  
  // Create box
  const box = document.createElement('div');
  box.className = 'custom-alert-box';
  
  box.innerHTML = `
    <div class="custom-alert-icon-container ${type}">
      ${iconSvg}
    </div>
    <h3 class="custom-alert-title">${title}</h3>
    <p class="custom-alert-message">${message}</p>
    <button class="custom-alert-btn">Done</button>
  `;

  container.appendChild(backdrop);
  container.appendChild(box);

  // Close helper
  const closeAlert = () => {
    box.classList.remove('show');
    backdrop.classList.remove('show');
    setTimeout(() => {
      if (container.contains(backdrop)) container.removeChild(backdrop);
      if (container.contains(box)) container.removeChild(box);
    }, 300);
  };

  // Bind close events
  const btn = box.querySelector('.custom-alert-btn');
  btn.addEventListener('click', closeAlert);
  backdrop.addEventListener('click', closeAlert);

  // Trigger intro animations
  requestAnimationFrame(() => {
    backdrop.classList.add('show');
    box.classList.add('show');
    btn.focus();
  });
};

// Custom Global Confirm Override for Premium UI Modal Popups
const originalConfirm = window.confirm;

window.confirm = (message) => {
  return new Promise((resolve) => {
    // Create container if not exists
    let container = document.getElementById('custom-confirm-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'custom-confirm-container';
      
      // Inject styles for the container and confirm dialog
      const style = document.createElement('style');
      style.textContent = `
        #custom-confirm-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }
        
        .custom-confirm-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
        }
        
        .custom-confirm-backdrop.show {
          opacity: 1;
        }
        
        .custom-confirm-box {
          position: relative;
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border-radius: 16px;
          padding: 28px 24px;
          width: 90%;
          max-width: 440px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          transform: scale(0.9) translateY(20px);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .custom-confirm-box.show {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        
        .custom-confirm-icon-container {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .custom-confirm-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: #f8fafc;
          letter-spacing: -0.01em;
        }
        
        .custom-confirm-message {
          font-size: 14px;
          color: #94a3b8;
          margin: 0 0 24px 0;
          line-height: 1.6;
          word-break: break-word;
        }
        
        .custom-confirm-buttons {
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: center;
        }
        
        .custom-confirm-btn {
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          flex: 1;
        }
        
        .custom-confirm-btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }
        
        .custom-confirm-btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
        }
        
        .custom-confirm-btn-confirm {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .custom-confirm-btn-confirm:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        
        .custom-confirm-btn-confirm:active {
          transform: translateY(1px);
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(container);
    }
  
    // Clear container
    container.innerHTML = '';
  
    const backdrop = document.createElement('div');
    backdrop.className = 'custom-confirm-backdrop';
    
    const box = document.createElement('div');
    box.className = 'custom-confirm-box';
    
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  
    box.innerHTML = `
      <div class="custom-confirm-icon-container">
        ${iconSvg}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${message}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `;
  
    container.appendChild(backdrop);
    container.appendChild(box);
  
    const closeConfirm = (result) => {
      box.classList.remove('show');
      backdrop.classList.remove('show');
      setTimeout(() => {
        if (container.contains(backdrop)) container.removeChild(backdrop);
        if (container.contains(box)) container.removeChild(box);
        resolve(result);
      }, 300);
    };
  
    const cancelBtn = box.querySelector('.custom-confirm-btn-cancel');
    const confirmBtn = box.querySelector('.custom-confirm-btn-confirm');
  
    cancelBtn.addEventListener('click', () => closeConfirm(false));
    confirmBtn.addEventListener('click', () => closeConfirm(true));
    backdrop.addEventListener('click', () => closeConfirm(false));
  
    requestAnimationFrame(() => {
      backdrop.classList.add('show');
      box.classList.add('show');
      confirmBtn.focus();
    });
  });
};

// Suppress harmless browser extension message channel closed warnings
if (typeof window !== 'undefined') {
  const isExtensionMsgError = (errStr) => {
    if (!errStr || typeof errStr !== 'string') return false;
    const lower = errStr.toLowerCase();
    return lower.includes('message channel closed') || 
           lower.includes('asynchronous response') || 
           lower.includes('listener indicated');
  };

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason || '');
    if (isExtensionMsgError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || String(event.error?.message || '');
    if (isExtensionMsgError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}
