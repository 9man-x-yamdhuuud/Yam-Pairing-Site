// yamdhud.js – Single file solution
const express = require('express');
const fs = require('fs');
const pino = require('pino');
const {
    default: Mbuvi_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// यहाँ makeid फंक्शन (पहले id.js में था)
function makeid() {
    return Math.random().toString(36).substring(2, 10);
}

// ------------------------------------------------------
// टेम्प फ़ोल्डर हटाने का फंक्शन
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

// ------------------------------------------------------
// पेयरिंग रूट
app.get('/pair', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    if (!num) {
        return res.status(400).send({ error: 'number query parameter is required' });
    }

    async function Mbuvi_MD_PAIR_CODE() {
        // सुनिश्चित करें कि temp फ़ोल्डर मौजूद है
        if (!fs.existsSync('./temp')) {
            fs.mkdirSync('./temp');
        }

        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Mbuvi_Tech = Mbuvi_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });

            if (!Pair_Code_By_Mbuvi_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Mbuvi_Tech.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Mbuvi_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Mbuvi_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    try {
                        await delay(5000);

                        // --- पहला मैसेज (सेशन base64) ---
                        const data = fs.readFileSync(`./temp/${id}/creds.json`);
                        const b64data = Buffer.from(data).toString('base64');
                        await Pair_Code_By_Mbuvi_Tech.sendMessage(
                            Pair_Code_By_Mbuvi_Tech.user.id,
                            { text: 'ARSLAN-MD~' + b64data }
                        );

                        // --- दूसरा मैसेज (नोटिफिकेशन) ---
                        const Mbuvi_MD_TEXT = `
        
╔════════════════════◇
║『 SESSION CONNECTED』
║ ✨𝟗𝐌𝐀𝐍-𝐗-𝐘𝐀𝐌𝐃𝐇𝐔𝐃💚💫
║ ✨ 𝟗𝐌𝐀𝐌-𝐗-𝐘𝐀𝐌𝐃𝐇𝐔𝐃 __𝐂𝐇𝐔𝐓 𝐊𝐀 𝐏𝐈𝐘𝐀𝐒𝐀
╚════════════════════╝


---

╔════════════════════◇
║『 YOU'VE CHOSEN 𝟗𝐦𝐚𝐧-𝐱-𝐲𝐚𝐦𝐝𝐡𝐮𝐝 』
║ -Set the session ID in Heroku:
║ - SESSION_ID: 
╚════════════════════╝
╔════════════════════◇
║ 『••• _V𝗶𝘀𝗶𝘁 𝗙𝗼𝗿_H𝗲𝗹𝗽 •••』
║❍ 𝐎𝐰𝐧𝐞𝐫: 918075498750
║❍ 𝐭𝐞𝐥𝐞𝐠𝐫𝐚𝐦 𝐜𝐡𝐚𝐭 𝐠𝐜: https://t.me/+ZGkt2oRV4oFmYjRl
║❍ 𝐭𝐞𝐥𝐞𝐠𝐫𝐚𝐦 𝐜𝐡𝐚𝐧𝐧𝐞𝐥: https://t.me/noman_3020
║❍ 𝐖𝐩 𝐜𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲: https://chat.whatsapp.com/DRCi30XrXKs84G519JYcSI
║
║ ☬ ☬ ☬ ☬
╚═════════════════════╝
𒂀 Enjoy 𝟗𝐦𝐚𝐧-𝐱-𝐘𝐀𝐌𝐃𝐇𝐔𝐃


---

Don't Forget To Give Star⭐ To My Repo
______________________________`;

                        // मैसेज भेजें (अब Toxic_MD_TEXT नहीं, बल्कि Mbuvi_MD_TEXT)
                        await Pair_Code_By_Mbuvi_Tech.sendMessage(
                            Pair_Code_By_Mbuvi_Tech.user.id,
                            { text: Mbuvi_MD_TEXT }
                        );

                        await delay(100);
                        await Pair_Code_By_Mbuvi_Tech.ws.close();
                        await removeFile('./temp/' + id);
                    } catch (msgErr) {
                        console.error('❌ मैसेज भेजने में एरर:', msgErr);
                        try { await Pair_Code_By_Mbuvi_Tech.ws.close(); } catch (e) {}
                        await removeFile('./temp/' + id);
                    }
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    Mbuvi_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log('⚠️ सर्विस रीस्टार्ट:', err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }

    return await Mbuvi_MD_PAIR_CODE();
});

// ------------------------------------------------------
// होम पेज
app.get('/', (req, res) => {
    res.send('✅ Pairing server is running. Use /pair?number=91xxxxxxxxxx');
});

// ------------------------------------------------------
// सर्वर चलाएँ
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
