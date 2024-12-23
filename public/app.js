document.getElementById('encodeButton').onclick = async function() {
  const imageFile = document.getElementById('imageUpload').files[0];
  const message = document.getElementById('messageInput').value;

  if (!imageFile || !message) {
      alert('Please upload an image and enter a message.');
      return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('message', message);

  const response = await fetch('/encode', {
      method: 'POST',
      body: formData,
  });

  const result = await response.json();
  document.getElementById('output').innerText = result.message || 'Encoding failed.';
};

document.getElementById('decodeButton').onclick = async function() {
  const imageFile = document.getElementById('imageUpload').files[0];

  if (!imageFile) {
      alert('Please upload an image to decode.');
      return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/decode', {
      method: 'POST',
      body: formData,
  });

  const result = await response.json();
  document.getElementById('output').innerText = result.message || 'Decoding failed.';
};

document.getElementById('saveButton').onclick = async function() {
  const imageFile = document.getElementById('imageUpload').files[0];
  
  if (!imageFile) {
      alert('Please upload an image to save.');
      return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/save', {
      method: 'POST',
      body: formData,
  });

  const result = await response.json();
  document.getElementById('output').innerText = result.message || 'Save failed.';
};
