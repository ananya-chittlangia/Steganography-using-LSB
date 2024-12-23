// Function to handle image encoding
document.getElementById('encodeButton').addEventListener('click', async function() {
    const fileInput = document.getElementById('uploadImage');
    const message = document.getElementById('message').value;

    if (fileInput.files.length === 0) {
        alert('Please upload an image.');
        return;
    }

    if (!message) {
        alert('Please enter a message to encode.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = async function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            encodeMessage(data, message);
            ctx.putImageData(imageData, 0, 0);

            // Create a link to download the encoded image
            const link = document.getElementById('downloadLink');
            link.href = canvas.toDataURL('image/png');
            link.download = 'encoded_image.png';
            link.style.display = 'block';
            link.textContent = 'Download Encoded Image';

            // Prepare to send the encoded image and message to the backend
            const encodedImage = canvas.toDataURL('image/png');
            await saveEncodedImage(encodedImage, message);
        };
    };

    reader.readAsDataURL(file);
});

// Function to encode the message into image data
function encodeMessage(data, message) {
    const messageBits = [];
    const lengthBits = message.length.toString(2).padStart(8, '0');

    // Push length of the message in bits
    for (let i = 0; i < lengthBits.length; i++) {
        messageBits.push(lengthBits[i]);
    }

    // Push the message bits
    for (let i = 0; i < message.length; i++) {
        const charBits = message.charCodeAt(i).toString(2).padStart(8, '0');
        for (let j = 0; j < charBits.length; j++) {
            messageBits.push(charBits[j]);
        }
    }

    // Encode the message bits into the image data
    for (let i = 0; i < messageBits.length; i++) {
        const index = i * 4; // 4 values for each pixel (RGBA)
        if (index < data.length) {
            data[index] = (data[index] & 0xFE) | parseInt(messageBits[i]); // Modify the least significant bit
        }
    }
}

// Function to save the encoded image and message to the backend
async function saveEncodedImage(encodedImage, message) {
    const formData = new FormData();
    formData.append('image', dataURLtoBlob(encodedImage)); // Convert data URL to Blob
    formData.append('message', message);
    formData.append('isEncoded', true);

    try {
        const response = await fetch('/save', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
}

// Function to handle image decoding
document.getElementById('decodeButton').addEventListener('click', function() {
    const fileInput = document.getElementById('decodeImage');

    if (fileInput.files.length === 0) {
        alert('Please upload an encoded image.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const decodedMessage = decodeMessage(data);
            const decodedMessageParagraph = document.getElementById('decodedMessage');
            decodedMessageParagraph.textContent = `Decoded Message: ${decodedMessage}`;
            decodedMessageParagraph.style.display = 'block';
        };
    };

    reader.readAsDataURL(file);
});

// Function to decode the message from the image data
function decodeMessage(data) {
    let messageLength = 0;
    let messageBits = [];

    // Read the length of the message (first 8 bits)
    for (let i = 0; i < 8; i++) {
        const index = i * 4; // 4 values for each pixel (RGBA)
        if (index < data.length) {
            const bit = data[index] & 1; // Get the least significant bit
            messageBits.push(bit);
        }
    }
    messageLength = parseInt(messageBits.join(''), 2); // Convert to decimal

    // Read the message bits
    messageBits = [];
    for (let i = 0; i < messageLength * 8; i++) {
        const index = (i + 8) * 4; // Skip first 8 bits for length
        if (index < data.length) {
            const bit = data[index] & 1; // Get the least significant bit
            messageBits.push(bit);
        }
    }

    // Convert bits to characters
    let message = '';
    for (let i = 0; i < messageBits.length; i += 8) {
        const byte = messageBits.slice(i, i + 8).join('');
        const charCode = parseInt(byte, 2);
        message += String.fromCharCode(charCode);
    }

    return message;
}
