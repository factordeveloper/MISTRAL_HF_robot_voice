// Referencias a los elementos de la interfaz
const recordButton = document.getElementById('hold-record-btn');
const recordedTextContainer = document.getElementById('recorded-text');
const responseContainer = document.getElementById('responseContainer');

// Configuración de Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.continuous = false;

recognition.onstart = function() {
    console.log('Voice recognition started. Speak into the microphone.');
};

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    console.log('Transcript:', transcript);
    recordedTextContainer.textContent = `You said: ${transcript}`;
    sendToAPI(transcript);  // Enviar el texto grabado a la API
};

recognition.onerror = function(event) {
    console.error('Speech recognition error detected:', event.error);
};

// Manejar el evento de mantener el botón presionado
recordButton.addEventListener('mousedown', () => {
    recognition.start();
    console.log('Recording started');
});

recordButton.addEventListener('mouseup', () => {
    recognition.stop();
    console.log('Recording stopped');
});

// Enviar el texto transcrito a la API de Mistral
function sendToAPI(prompt) {
    const apiKey = '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';  // Reemplaza con tu API key

    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407/v1/chat/completions';

    const requestBody = {
        model: 'mistralai/Mistral-Nemo-Instruct-2407',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        stream: false
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        const responseText = data.choices[0].message.content;
        responseContainer.textContent = `Response: ${responseText}`;
        speakResponse(responseText);  // Reproducir la respuesta con Text to Speech
    })
    .catch(error => {
        console.error('Error:', error);
        responseContainer.textContent = 'Error: ' + error;
    });
}

// Reproducir la respuesta utilizando Text to Speech
function speakResponse(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}
