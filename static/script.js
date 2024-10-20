document.addEventListener('DOMContentLoaded', () => {
    const animalRadios = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animalImage');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');

    animalRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const animal = radio.value;
            animalImage.src = `/static/images/${animal}.png`;
            animalImage.style.display = 'block';
        });
    });

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            fileInfo.innerHTML = `
                <p>File Name: ${result.filename}</p>
                <p>File Size: ${result.filesize} bytes</p>
                <p>File Type: ${result.filetype}</p>
            `;
            fileInfo.style.display = 'block';
        }
    });
});
