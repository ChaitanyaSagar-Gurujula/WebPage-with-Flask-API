document.addEventListener('DOMContentLoaded', () => {
    const animalRadios = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animalImage');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const uploadButton = document.getElementById('uploadButton');
    const progressBar = document.getElementById('progressBar');
    const resetButton = document.getElementById('resetButton');

    animalRadios.forEach(radio => {
        radio.addEventListener('change', async () => {
            const animal = radio.value;
            const response = await fetch(`/get_animal_image/${animal}`);
            const result = await response.json();
            if (result.image) {
                animalImage.src = `/static/images/${result.image}`;
                animalImage.style.display = 'block';
                animalImage.classList.add('fade-in');
                resetButton.style.display = 'inline-block';
            }
        });
    });

    resetButton.addEventListener('click', () => {
        animalRadios.forEach(radio => radio.checked = false);
        animalImage.style.display = 'none';
        animalImage.src = '';
        resetButton.style.display = 'none';
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            fileInfo.innerHTML = `
                <p><strong>Selected File:</strong> ${file.name}</p>
                <p><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>File Type:</strong> ${file.type}</p>
            `;
            fileInfo.style.display = 'block';
            fileInfo.classList.add('fade-in');
        } else {
            fileInfo.style.display = 'none';
        }
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

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            fileInfo.innerHTML = `
                <p><strong>Uploaded File:</strong> ${result.filename}</p>
                <p><strong>File Size:</strong> ${(result.filesize / 1024).toFixed(2)} KB</p>
                <p><strong>File Type:</strong> ${result.filetype}</p>
            `;
            fileInfo.style.display = 'block';
            fileInfo.classList.add('fade-in');
        } catch (error) {
            console.error('Upload failed:', error);
            fileInfo.innerHTML = '<p>Upload failed. Please try again.</p>';
            fileInfo.style.display = 'block';
        }

        progressBar.style.display = 'none';
    });
});
