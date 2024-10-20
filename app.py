from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import random

app = Flask(__name__)

# Define a dictionary of animal images
animal_images = {
    'cat': ['cat1.png', 'cat2.png', 'cat3.png'],
    'dog': ['dog1.png', 'dog2.png', 'dog3.png'],
    'elephant': ['elephant1.png', 'elephant2.png', 'elephant3.png']
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_animal_image/<animal>')
def get_animal_image(animal):
    if animal in animal_images:
        return jsonify({'image': random.choice(animal_images[animal])})
    return jsonify({'error': 'Animal not found'}), 404

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        filename = file.filename
        filesize = len(file.read())
        file.seek(0)  # Reset file pointer to the beginning
        filetype = file.content_type
        
        return jsonify({
            'filename': filename,
            'filesize': filesize,
            'filetype': filetype
        })

if __name__ == '__main__':
    app.run(debug=True)
