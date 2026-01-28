const fs = require('fs');

async function testBackend() {
    console.log("Testing Backend connection...");

    // 1. Ping
    try {
        const res = await fetch('http://127.0.0.1:5002/api/ping');
        console.log(`PING Status: ${res.status}`);
        if (res.ok) console.log("PING Response:", await res.json());
        else console.log("PING Text:", await res.text());
    } catch (e) {
        console.error("PING Failed:", e.message);
    }

    // 2. Test Post (without file first to see if it reaches route or 404s)
    // We expect 400 or 500 or "Image required", NOT 404.
    try {
        const formData = new FormData();
        formData.append('caption', 'Test caption');

        const res = await fetch('http://127.0.0.1:5002/api/posts', {
            method: 'POST',
            body: formData
        });
        console.log(`POST Status: ${res.status}`);
        console.log("POST Text:", await res.text());
    } catch (e) {
        console.error("POST Failed:", e.message);
    }
}

testBackend();
