// Variables
let boxCounter = 0;
let slideCounter = 0;
let currentSlideIndex = -1;
const slides = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addSlideButton').addEventListener('click', addSlide);
    document.getElementById('exportCardButton').addEventListener('click', exportCard);
    document.getElementById('exportAllSlidesButton').addEventListener('click', exportAllSlides);
});

// Helper Functions
function parseTextFormatting(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Bold **text**
        .replace(/\*(.*?)\*/g, '<i>$1</i>');     // Italic *text*
}

// Slide Class
class Slide {
    constructor() {
        this.bannerTitle = '';
        this.mainHeading = '';
        this.description = '';
        this.boxes = [];
    }
}

// Generate Slide HTML
function generateCard() {
    if (currentSlideIndex === -1) return;
    const slide = slides[currentSlideIndex];

    const bannerTitle = document.getElementById('bannerTitle').value;
    const mainHeading = document.getElementById('mainHeading').value;
    const description = parseTextFormatting(document.getElementById('description').value);

    slide.bannerTitle = bannerTitle;
    slide.mainHeading = mainHeading;
    slide.description = description;
    slide.boxes = [];

    // Start generating the card's HTML
    let cardHTML = `
        <div class="banner">${bannerTitle}</div>
        <div class="main-heading">${mainHeading}</div>
        <div class="description">${description}</div>
    `;

    // Add boxes dynamically
    const boxes = document.querySelectorAll('.box-group');
    boxes.forEach((box) => {
        const type = box.dataset.type;
        if (type === 'description') {
            const heading = box.querySelector('.description-heading').value;
            const content = parseTextFormatting(box.querySelector('.description-content').value);
            cardHTML += `
                <div class="description-box">
                    <div class="box-heading">${heading}</div>
                    <div class="box-content">${content}</div>
                </div>
            `;
            slide.boxes.push({
                type: 'description',
                heading,
                content
            });
        } else if (type === 'character') {
            const heading = box.querySelector('.character-heading').value;
            const content = parseTextFormatting(box.querySelector('.character-content').value);
            const imageURL = box.querySelector('.character-image').value || 'https://via.placeholder.com/150';
            cardHTML += `
                <div class="character-box flex-container">
                    <div class="card-image" style="background-image: url('${imageURL}');"></div>
                    <div class="content">
                        <div class="card-title">${heading}</div>
                        <div class="card-description">${content}</div>
                    </div>
                </div>
            `;
            slide.boxes.push({
                type: 'character',
                heading,
                content,
                imageURL
            });
        }
    });

    document.getElementById('cardPreview').innerHTML = `<div class="card">${cardHTML}</div>`;
}

// Add New Box
function addBox(type) {
    boxCounter++;
    let formHTML = '';
    if (type === 'description') {
        formHTML = `
            <div class="box-group" data-type="description" id="box-${boxCounter}">
                <h3>Description Box</h3>
                <div class="form-group">
                    <label>Heading:</label>
                    <input type="text" class="description-heading" placeholder="Enter heading" oninput="generateCard()">
                </div>
                <div class="form-group">
                    <label>Content:</label>
                    <textarea class="description-content" placeholder="Enter content" oninput="generateCard()"></textarea>
                </div>
                <button class="delete-button" onclick="deleteBox(${boxCounter})">Delete Box</button>
            </div>
        `;
    } else if (type === 'character') {
        formHTML = `
            <div class="box-group" data-type="character" id="box-${boxCounter}">
                <h3>Character Box</h3>
                <div class="form-group">
                    <label>Heading:</label>
                    <input type="text" class="character-heading" placeholder="Enter heading" oninput="generateCard()">
                </div>
                <div class="form-group">
                    <label>Content:</label>
                    <textarea class="character-content" placeholder="Enter content" oninput="generateCard()"></textarea>
                </div>
                <div class="form-group">
                    <label>Image URL:</label>
                    <input type="text" class="character-image" placeholder="Enter image URL" oninput="generateCard()">
                </div>
                <button class="delete-button" onclick="deleteBox(${boxCounter})">Delete Box</button>
            </div>
        `;
    }

    document.getElementById('boxFormContainer').insertAdjacentHTML('beforeend', formHTML);
}

// Delete Box
function deleteBox(boxId) {
    const box = document.getElementById(`box-${boxId}`);
    box.remove();
    generateCard();
}

// Add New Slide
function addSlide() {
    slideCounter++;
    const slide = new Slide();
    slides.push(slide);
    const slideIndex = slides.length - 1;

    const slideItem = document.createElement('div');
    slideItem.classList.add('slide-item');
    slideItem.id = `slide-${slideIndex}`;
    slideItem.innerText = slideCounter;
    slideItem.draggable = true;

    slideItem.addEventListener('click', () => selectSlide(slideIndex));
    slideItem.addEventListener('dragstart', dragStart);
    slideItem.addEventListener('dragover', dragOver);
    slideItem.addEventListener('drop', drop);
    slideItem.addEventListener('dragend', dragEnd);

    document.getElementById('slidesList').appendChild(slideItem);

    selectSlide(slideIndex);
}

// Select Slide for Editing
function selectSlide(index) {
    currentSlideIndex = index;
    const slide = slides[index];

    // Update active class
    document.querySelectorAll('.slide-item').forEach((item) => {
        item.classList.remove('active');
    });
    document.getElementById(`slide-${index}`).classList.add('active');

    // Load slide data into form
    loadSlideData(slide);
    generateCard();
}

// Load Slide Data into Form
function loadSlideData(slide) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <div class="form-group">
            <label>Banner Title:</label>
            <input type="text" id="bannerTitle" placeholder="Enter Banner Title" value="${slide.bannerTitle}" oninput="generateCard()">
        </div>
        <div class="form-group">
            <label>Main Heading:</label>
            <input type="text" id="mainHeading" placeholder="Enter Main Heading" value="${slide.mainHeading}" oninput="generateCard()">
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea id="description" placeholder="Enter Description" oninput="generateCard()">${slide.description}</textarea>
        </div>

        <!-- Add Box Buttons -->
        <div class="action-buttons">
            <button onclick="addBox('description')">Add Description Box</button>
            <button onclick="addBox('character')">Add Character Box</button>
        </div>

        <!-- Boxes Form Inputs -->
        <div id="boxFormContainer"></div>
    `;

    // Load boxes
    const boxFormContainer = document.getElementById('boxFormContainer');
    boxFormContainer.innerHTML = '';
    boxCounter = 0;

    slide.boxes.forEach((boxData) => {
        boxCounter++;
        if (boxData.type === 'description') {
            boxFormContainer.insertAdjacentHTML('beforeend', `
                <div class="box-group" data-type="description" id="box-${boxCounter}">
                    <h3>Description Box</h3>
                    <div class="form-group">
                        <label>Heading:</label>
                        <input type="text" class="description-heading" value="${boxData.heading}" oninput="generateCard()">
                    </div>
                    <div class="form-group">
                        <label>Content:</label>
                        <textarea class="description-content" oninput="generateCard()">${boxData.content}</textarea>
                    </div>
                    <button class="delete-button" onclick="deleteBox(${boxCounter})">Delete Box</button>
                </div>
            `);
        } else if (boxData.type === 'character') {
            boxFormContainer.insertAdjacentHTML('beforeend', `
                <div class="box-group" data-type="character" id="box-${boxCounter}">
                    <h3>Character Box</h3>
                    <div class="form-group">
                        <label>Heading:</label>
                        <input type="text" class="character-heading" value="${boxData.heading}" oninput="generateCard()">
                    </div>
                    <div class="form-group">
                        <label>Content:</label>
                        <textarea class="character-content" oninput="generateCard()">${boxData.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Image URL:</label>
                        <input type="text" class="character-image" value="${boxData.imageURL}" oninput="generateCard()">
                    </div>
                    <button class="delete-button" onclick="deleteBox(${boxCounter})">Delete Box</button>
                </div>
            `);
        }
    });
}

// Drag and Drop Functions
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    e.dataTransfer.setData('text/plain', '');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (draggedItem !== this) {
        const slidesList = document.getElementById('slidesList');
        const items = Array.from(slidesList.children);
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(this);

        if (draggedIndex > targetIndex) {
            slidesList.insertBefore(draggedItem, this);
        } else {
            slidesList.insertBefore(draggedItem, this.nextSibling);
        }

        // Update slides array
        const [removedSlide] = slides.splice(draggedIndex, 1);
        slides.splice(targetIndex, 0, removedSlide);

        // Update slide numbers
        updateSlideNumbers();
    }
}

function dragEnd() {
    draggedItem = null;
}

// Update Slide Numbers
function updateSlideNumbers() {
    const slideItems = document.querySelectorAll('.slide-item');
    slideItems.forEach((item, index) => {
        item.innerText = index + 1;
        item.id = `slide-${index}`;
    });
}

// Export Current Slide
function exportCard() {
    if (currentSlideIndex === -1) return;
    const cardHTMLContent = document.getElementById('cardPreview').innerHTML;
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Exported Slide</title>
    <style>
        ${getSlideStyles()}
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="card">
            ${cardHTMLContent}
        </div>
    </div>
</body>
</html>
    `;
    downloadFile(`slide${currentSlideIndex + 1}.html`, fullHTML);
}

// Export All Slides
function exportAllSlides() {
    slides.forEach((slide, index) => {
        const cardHTMLContent = generateSlideHTML(slide);
        const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Slide ${index + 1}</title>
    <style>
        ${getSlideStyles()}
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="card">
            ${cardHTMLContent}
        </div>
    </div>
</body>
</html>
        `;
        downloadFile(`slide${index + 1}.html`, fullHTML);
    });
}

// Generate Slide HTML from Data
function generateSlideHTML(slide) {
    let cardHTML = `
        <div class="banner">${slide.bannerTitle}</div>
        <div class="main-heading">${slide.mainHeading}</div>
        <div class="description">${slide.description}</div>
    `;

    slide.boxes.forEach((boxData) => {
        if (boxData.type === 'description') {
            cardHTML += `
                <div class="description-box">
                    <div class="box-heading">${boxData.heading}</div>
                    <div class="box-content">${boxData.content}</div>
                </div>
            `;
        } else if (boxData.type === 'character') {
            cardHTML += `
                <div class="character-box flex-container">
                    <div class="card-image" style="background-image: url('${boxData.imageURL}');"></div>
                    <div class="content">
                        <div class="card-title">${boxData.heading}</div>
                        <div class="card-description">${boxData.content}</div>
                    </div>
                </div>
            `;
        }
    });

    return cardHTML;
}

// Download File Helper Function
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Get Slide Styles for Export
function getSlideStyles() {
    return `
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: white;
        }
        .slide-container {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .card {
            max-width: 100%;
            max-height: 100%;
            aspect-ratio: 16 / 9;
            overflow-y: auto;
            padding: 20px;
            box-sizing: border-box;
        }
        .banner {
            background-color: #42b4ac;
            color: white;
            padding: 10px;
            font-size: 18px;
            font-weight: bold;
            width: fit-content;
            border-radius: 8px;
        }
        .main-heading {
            color: #2a579a;
            font-size: 28px;
            margin: 20px 0;
        }
        .description {
            font-size: 18px;
        }
        .description-box, .character-box {
            border: 2px solid #42b4ac;
            padding: 20px;
            margin-top: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .description-box .box-heading, .character-box .card-title {
            font-size: 20px;
            color: #42b4ac;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .description-box .box-content, .character-box .card-description {
            font-size: 18px;
            line-height: 1.5;
            margin-bottom: 10px;
        }
        .card-image {
            flex-shrink: 0;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            margin-right: 20px;
        }
        .character-box .content {
            flex: 1;
        }
        .flex-container {
            display: flex;
            align-items: center;
        }
    `;
}
