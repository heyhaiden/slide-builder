let boxCounter = 0;
let slideCounter = 0;
let currentSlideIndex = -1;
let slides = [];

function parseTextFormatting(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Bold **text**
        .replace(/\*(.*?)\*/g, '<i>$1</i>');     // Italic *text*
}

// Slide object constructor
function Slide() {
    this.bannerTitle = '';
    this.mainHeading = '';
    this.description = '';
    this.boxes = [];
}

// Function to generate the slide's HTML
function generateCard() {
    if (currentSlideIndex === -1) return;
    const slide = slides[currentSlideIndex];

    const bannerTitle = document.getElementById("bannerTitle").value;
    const mainHeading = document.getElementById("mainHeading").value;
    const description = parseTextFormatting(document.getElementById("description").value);

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
            // ... existing code for description boxes ...
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
                heading: heading,
                content: content,
                imageURL: imageURL
            });
        }
    });

    document.getElementById("cardPreview").innerHTML = `<div class="card">${cardHTML}</div>`;

}

// Function to add a new box to the form
function addBox(type) {
    boxCounter++;
    let formHTML = '';
    if (type === 'description') {
        formHTML = `
            <div class="box-group" data-type="description" id="box-${boxCounter}">
                <h3>Description Box</h3>
                <div class="form-group">
                    <label>Heading:</label>
                    <input type="text" class="description-heading" oninput="generateCard()">
                </div>
                <div class="form-group">
                    <label>Content:</label>
                    <textarea class="description-content" oninput="generateCard()"></textarea>
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
                    <input type="text" class="character-heading" oninput="generateCard()">
                </div>
                <div class="form-group">
                    <label>Content:</label>
                    <textarea class="character-content" oninput="generateCard()"></textarea>
                </div>
                <div class="form-group">
                    <label>Image URL:</label>
                    <input type="text" class="character-image" oninput="generateCard()" placeholder="Enter image URL">
                </div>
                <button class="delete-button" onclick="deleteBox(${boxCounter})">Delete Box</button>
            </div>
        `;
    }

    document.getElementById('boxFormContainer').insertAdjacentHTML('beforeend', formHTML);
}

// Function to delete a box from the form
function deleteBox(boxId) {
    const box = document.getElementById(`box-${boxId}`);
    box.remove();
    generateCard();
}

// Function to add a new slide
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

// Function to select a slide for editing
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

// Function to load slide data into the form
function loadSlideData(slide) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <div class="form-group">
            <label>Banner Title:</label>
            <input type="text" id="bannerTitle" oninput="generateCard()" placeholder="Enter Banner Title" value="${slide.bannerTitle}">
        </div>
        <div class="form-group">
            <label>Main Heading:</label>
            <input type="text" id="mainHeading" oninput="generateCard()" placeholder="Enter Main Heading" value="${slide.mainHeading}">
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea id="description" oninput="generateCard()" placeholder="Enter Description">${slide.description}</textarea>
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
                        <input type="text" class="description-heading" oninput="generateCard()" value="${boxData.heading}">
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
                        <input type="text" class="character-heading" oninput="generateCard()" value="${boxData.heading}">
                    </div>
                    <div class="form-group">
                        <label>Content:</label>
                        <textarea class="character-content" oninput="generateCard()">${boxData.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Image URL:</label>
                        <input type="text" class="character-image" oninput="generateCard()" placeholder="Enter image URL" value="${boxData.imageURL}">
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
        const temp = slides[draggedIndex];
        slides.splice(draggedIndex, 1);
        slides.splice(targetIndex, 0, temp);

        // Update slide numbers
        updateSlideNumbers();
    }
}

function dragEnd() {
    draggedItem = null;
}

// Function to update slide numbers
function updateSlideNumbers() {
    const slideItems = document.querySelectorAll('.slide-item');
    slideItems.forEach((item, index) => {
        item.innerText = index + 1;
        item.id = `slide-${index}`;
    });
}

// Function to export current slide
function exportCard() {
    if (currentSlideIndex === -1) return;
    const cardHTMLContent = document.getElementById("cardPreview").innerHTML;
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
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `slide${currentSlideIndex + 1}.html`;
    link.click();
}

// Function to export all slides
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
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `slide${index + 1}.html`;
        link.click();
    });
}

// Function to generate slide HTML from slide data
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


// Function to get slide styles for export
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
            width: 40%;
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
