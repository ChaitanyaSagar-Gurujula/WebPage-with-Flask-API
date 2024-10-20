document.addEventListener('DOMContentLoaded', () => {
    const animalRadios = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animalImage');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const uploadButton = document.getElementById('uploadButton');
    const progressBar = document.getElementById('progressBar');

    animalRadios.forEach(radio => {
        radio.addEventListener('change', async () => {
            const animal = radio.value;
            const response = await fetch(`/get_animal_image/${animal}`);
            const result = await response.json();
            if (result.image) {
                animalImage.src = `/static/images/${result.image}`;
                animalImage.style.display = 'block';
                animalImage.classList.add('fade-in');
            }
        });
    });

    uploadButton.addEventListener('click', async () => {
        if (!fileInput.files[0]) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        progressBar.style.width = '0%';
        progressBar.style.display = 'block';

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressBar.style.width = `${percentCompleted}%`;
            }
        });

        progressBar.style.display = 'none';

        const result = await response.json();
        fileInfo.innerHTML = `
            <p><strong>File Name:</strong> ${result.filename}</p>
            <p><strong>File Size:</strong> ${(result.filesize / 1024).toFixed(2)} KB</p>
            <p><strong>File Type:</strong> ${result.filetype}</p>
        `;
        fileInfo.style.display = 'block';
        fileInfo.classList.add('fade-in');
    });
});
