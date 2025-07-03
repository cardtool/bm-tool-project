(function() {
    /**********************************************
     * SCRIPT CODE
     **********************************************/
    const CLICK_DELAY = 2500;
    const ACTION_DELAY = 1500;

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');
        #bm-tool-container {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%); z-index: 99999;
            font-family: 'Orbitron', sans-serif; background: #ffffff; color: #333;
            border-radius: 15px; box-shadow: 0 0 25px rgba(0, 180, 255, 0.5);
            padding: 30px; text-align: center; width: 400px;
            animation: bm-fadeInUp 0.6s ease-out; border: 2px solid #cceeff;
        }
        #bm-tool-container h1 { color: #0c8bd9; font-size: 20px; margin-bottom: 5px; }
        #bm-tool-container h2 { color: #333; font-size: 16px; margin-bottom: 20px; }
        #bm-tool-container a.telegram {
            background: #00acee; color: #fff; padding: 10px 15px; border-radius: 5px;
            display: block; text-decoration: none; margin-bottom: 20px; transition: background 0.3s;
            box-sizing: border-box;
        }
        #bm-tool-container a.telegram:hover { background: #0089be; }
        #bm-tool-container input {
            background: #f0f8ff; border: 1px solid #add8e6; color: #333; padding: 12px;
            width: 100%; margin-bottom: 20px; border-radius: 5px; font-family: 'Orbitron', sans-serif;
            text-align: center; font-size: 14px; box-sizing: border-box;
        }
        #bm-tool-container input:focus { outline: none; border-color: #0c8bd9; }
        #bm-tool-container .bm-button-group { display: flex; gap: 15px; }
        #bm-tool-container button {
            flex: 1; color: #fff; padding: 12px 15px; border: none; border-radius: 5px;
            font-weight: bold; cursor: pointer; transition: background 0.3s;
            font-family: 'Orbitron', sans-serif; text-transform: uppercase;
        }
        #bm-initiate-btn { background: #0c8bd9; width: 100%; }
        #bm-initiate-btn:hover { background: #096bab; }
        #bm-cancel-btn { background-color: #e74c3c; display: none; }
        #bm-cancel-btn:hover { background-color: #c0392b; }
        #bm-status { font-size: 14px; margin-top: 20px; color: #444; }
        @keyframes bm-fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `;
    const toolHTML = `
        <h1>// BM TRANSFER TOOL //</h1>
        <h2>Developer: Sk Shakil</h2>
        <a href="https://t.me/+e5s3ZYw1kqxhMjA1" class="telegram" target="_blank">>> TELEGRAM <<</a>
        <input type="email" id="bm-email-input" placeholder="Enter target email...">
        <div class="bm-button-group">
            <button id="bm-initiate-btn">INITIATE_INVITE</button>
            <button id="bm-cancel-btn">CANCEL</button>
        </div>
        <p id="bm-status">STATUS: Ready</p>
    `;

    if (document.getElementById('bm-tool-container')) { document.getElementById('bm-tool-container').remove(); }
    if (!document.querySelector('link[href*="Orbitron"]')) {
        const font = document.createElement('link');
        font.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap';
        font.rel = 'stylesheet';
        document.head.appendChild(font);
    }
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = styles;
    document.head.appendChild(styleSheet);
    const container = document.createElement('div');
    container.id = 'bm-tool-container';
    container.innerHTML = toolHTML;
    document.body.appendChild(container);

    let isCancelled = false;
    const initiateBtn = document.getElementById('bm-initiate-btn');
    const cancelBtn = document.getElementById('bm-cancel-btn');
    const statusEl = document.getElementById('bm-status');

    function cleanup(message) {
        statusEl.textContent = `STATUS: ${message}`;
        setTimeout(() => {
            if (document.body.contains(container)) document.body.removeChild(container);
            if (document.head.contains(styleSheet)) document.head.removeChild(styleSheet);
        }, 2000);
    }

    cancelBtn.addEventListener('click', () => { isCancelled = true; statusEl.textContent = 'STATUS: CANCELLING...'; });
    initiateBtn.addEventListener('click', runAutomation);

    async function checkCancellation() {
        if (isCancelled) throw new Error('Operation cancelled by user.');
    }

    async function runAutomation() {
        const email = document.getElementById('bm-email-input').value;
        if (!email || !email.includes('@')) {
            statusEl.textContent = 'Error: Please enter a valid email.';
            return;
        }
        isCancelled = false;
        initiateBtn.style.display = 'none';
        cancelBtn.style.display = 'block';
        statusEl.textContent = 'STATUS: Automation is running...';
        await new Promise(r => setTimeout(r, 500));

        async function findAndClick(selector, text) {
            await checkCancellation();
            statusEl.textContent = `Finding: ${text}...`;
            const el = await findElement(selector, text);
            statusEl.textContent = `Clicking: ${text}...`;
            el.click();
            await new Promise(r => setTimeout(r, CLICK_DELAY));
        }

        async function findElement(selector, text, timeout = 7000) {
            await checkCancellation();
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    if (isCancelled) {
                        clearInterval(interval);
                        reject(new Error('Operation cancelled by user.'));
                        return;
                    }
                    const elements = Array.from(document.querySelectorAll(selector));
                    const foundEl = text ? elements.find(el => el.offsetWidth > 0 && el.textContent.trim().includes(text)) : elements.find(el => el.offsetWidth > 0);
                    if (foundEl) {
                        clearInterval(interval);
                        resolve(foundEl);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        reject(new Error(`Element not found: "${text || selector}"`));
                    }
                }, 300);
            });
        }

        async function typeAndTabOut(selector, value) {
            await checkCancellation();
            statusEl.textContent = 'Finding input box...';
            const el = await findElement(selector);
            statusEl.textContent = 'Typing email...';
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            await checkCancellation();
            statusEl.textContent = 'Validating email (Tabbing out)...';
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, bubbles: true }));
            await new Promise(r => setTimeout(r, ACTION_DELAY));
        }
        
        async function clickFullControlSwitch() {
            await checkCancellation();
            statusEl.textContent = 'Finding all "Manage" switches...';
            await new Promise(r => setTimeout(r, 500));
            const allManageSwitches = document.querySelectorAll('input[role="switch"][aria-label="Manage"]');
            if (allManageSwitches.length < 2) {
                throw new Error('Could not find the second "Manage" switch for Full control.');
            }
            const fullControlSwitch = allManageSwitches[1];
            statusEl.textContent = 'Clicking "Full control" switch...';
            fullControlSwitch.click();
            await new Promise(r => setTimeout(r, ACTION_DELAY));
        }

        try {
            const dialogButtonSelector = 'div[role="dialog"] div[role="button"]';
            await findAndClick('div[role="button"]', 'Invite people');
            await typeAndTabOut('div[role="dialog"] input', email);
            await findAndClick(dialogButtonSelector, 'Next');
            await clickFullControlSwitch();
            await findAndClick(dialogButtonSelector, 'Next');
            await findAndClick(dialogButtonSelector, 'Next');
            await findAndClick(dialogButtonSelector, 'Send invitation');
            await findAndClick(dialogButtonSelector, 'OK');
            cleanup('✅ INVITATION SENT SUCCESSFULLY!');
        } catch (error) {
            console.error('Automation Error:', error);
            if (isCancelled) {
                cleanup('🛑 MISSION CANCELLED BY USER.');
            } else {
                cleanup(`❌ ERROR: ${error.message}`);
            }
        }
    }
})();