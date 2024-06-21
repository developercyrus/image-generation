export default {
  async fetch(request, env) {
    if (request.method === 'POST' && request.url.endsWith('/generate')) {
      const { prompt } = await request.json();
      
      const inputs = { prompt };

      const response = await env.AI.run(
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        inputs
      );

      return new Response(response, {
        headers: {
          'content-type': 'image/png',
        },
      });
    }

    return new Response(entryPageHTML, {
      headers: { 'content-type': 'text/html' },
    });
  },
};

const entryPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Image Generator</title>
  <style>
    #prompt {
      width: 100%;
      height: 100px;
      font-size: 16px;
    }
    #loading-spinner {
      display: none;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>AI Image Generator</h1>
  <form id="prompt-form" method="post">
    <label for="prompt">Enter your prompt:</label>
    <textarea id="prompt" name="prompt" required></textarea>
    <button type="submit">Generate Image</button>
  </form>

  <div id="loading-spinner">
    <p>Generating image, please wait...</p>
    <div class="spinner"></div>
  </div>

  <div id="result" style="margin-top: 20px;">
    <img id="generated-image" style="display: none; max-width: 100%;" />
  </div>

  <script>
    document.getElementById('prompt-form').onsubmit = async (event) => {
      event.preventDefault();
      const prompt = document.getElementById('prompt').value;
      document.getElementById('loading-spinner').style.display = 'block';
    
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
    
      document.getElementById('loading-spinner').style.display = 'none';
    
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const img = document.getElementById('generated-image');
        img.src = imageUrl;
        img.style.display = 'block';
      } else {
        alert('Failed to generate image. Please try again.');
      }
    };
  </script>
    
  <style>
    .spinner {
      border: 16px solid #f3f3f3; /* Light grey */
      border-top: 16px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
    </body>
    </html>
    `;
