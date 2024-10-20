document.addEventListener('DOMContentLoaded', () => {
    const animalRadios = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animalImage');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    const fileInfo = document.getElementById('fileInfo');
    const uploadButton = document.getElementById('uploadButton');
    const progressBar = document.getElementById('progressBar');
    const resetButton = document.getElementById('resetButton');

    let currentFile = null;

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
        animalRadios.forEach(radio => {
            radio.checked = false;
            radio.parentElement.classList.remove('selected');
        });
        animalImage.style.display = 'none';
        animalImage.src = '';
        resetButton.style.display = 'none';
    });

    const dropZone = document.getElementById('dropZone');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('dragover');
    }

    function unhighlight() {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            currentFile = files[0];
            fileName.textContent = currentFile.name;
            if (currentFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    filePreview.src = e.target.result;
                    filePreview.style.display = 'block';
                };
                reader.readAsDataURL(currentFile);
            } else {
                filePreview.style.display = 'none';
            }
        } else {
            currentFile = null;
            fileName.textContent = 'No file chosen';
            filePreview.style.display = 'none';
        }
    }

    const progressBarContainer = document.querySelector('.progress-bar');

    uploadButton.addEventListener('click', async () => {
        if (!currentFile) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', currentFile);

        // Show and reset the progress bar
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';
        fileInfo.innerHTML = '';
        fileInfo.style.display = 'block';

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            progressBar.style.width = '100%';
            fileInfo.innerHTML = `
                <p><strong>Uploaded File:</strong> ${result.filename}</p>
                <p><strong>File Size:</strong> ${(result.filesize / 1024).toFixed(2)} KB</p>
                <p><strong>File Type:</strong> ${result.filetype}</p>
            `;

            // Scroll to the file info
            fileInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Reset the file input to allow new file selection
            fileInput.value = '';
            currentFile = null;
            fileName.textContent = 'No file chosen';
            filePreview.style.display = 'none';

            // Hide progress bar after 2 seconds
            setTimeout(() => {
                progressBarContainer.classList.add('fade-out');
                setTimeout(() => {
                    progressBarContainer.style.display = 'none';
                    progressBarContainer.classList.remove('fade-out');
                    progressBar.style.width = '0%';
                }, 500); // This should match your transition duration
            }, 2000);

            // Fade out the file info after 5 seconds
            setTimeout(() => {
                fileInfo.classList.add('fade-out');
                setTimeout(() => {
                    fileInfo.style.display = 'none';
                    fileInfo.classList.remove('fade-out');
                }, 500); // This should match your transition duration
            }, 3500);

        } catch (error) {
            console.error('Upload failed:', error);
            fileInfo.innerHTML = '<p>Upload failed. Please try again.</p>';
            progressBarContainer.style.display = 'none';

            // Scroll to the error message
            fileInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
