/**
 * Builds and manages form elements for slide editing
 */
export class FormBuilder {
    constructor(slideManager) {
        this.slideManager = slideManager;
        this.formContainer = document.getElementById('formContainer');
        this.boxCounter = 0;
        
        // Listen for slide selection events
        document.addEventListener('slideSelected', (e) => {
            this.loadSlideForm(e.detail.index);
        });
    }

    /**
     * Loads the form for a specific slide
     * @param {number} slideIndex - The index of the slide to load
     */
    loadSlideForm(slideIndex) {
        const slide = this.slideManager.getAllSlides()[slideIndex];
        if (!slide) return;
        
        this.formContainer.innerHTML = `
            <div class="form-group">
                <label for="bannerTitle">Banner Title:</label>
                <input type="text" id="bannerTitle" placeholder="Enter Banner Title" value="${slide.bannerTitle || ''}" data-field="bannerTitle">
            </div>
            <div class="form-group">
                <label for="mainHeading">Main Heading:</label>
                <input type="text" id="mainHeading" placeholder="Enter Main Heading" value="${slide.mainHeading || ''}" data-field="mainHeading">
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" placeholder="Enter Description" data-field="description">${slide.description || ''}</textarea>
                <small class="form-helper">*Use <strong>**bold**</strong> and <em>*italic*</em> for formatting</small>
            </div>

            <!-- Add Box Buttons -->
            <div class="action-buttons">
                <button class="btn btn-secondary" id="addDescriptionBox">
                    <span class="icon">📝</span> Add Description Box
                </button>
                <button class="btn btn-secondary" id="addCharacterBox">
                    <span class="icon">👤</span> Add Character Box
                </button>
            </div>

            <!-- Boxes Form Inputs -->
            <div id="boxFormContainer"></div>
        `;
        
        // Add event listeners to the form fields
        this.addFormEventListeners();
        
        // Add event listeners to the add box buttons
        document.getElementById('addDescriptionBox').addEventListener('click', () => {
            this.addBox('description');
        });
        
        document.getElementById('addCharacterBox').addEventListener('click', () => {
            this.addBox('character');
        });
        
        // Load boxes
        this.loadBoxes(slide.boxes || []);
        
        // Trigger an update to show the slide preview
        this.generateCard();
    }

    /**
     * Adds input event listeners to all form fields
     */
    addFormEventListeners() {
        const formElements = this.formContainer.querySelectorAll('input, textarea');
        
        formElements.forEach(element => {
            element.addEventListener('input', () => {
                this.generateCard();
            });
        });
    }

    /**
     * Loads the box forms from slide data
     * @param {Array} boxes - The boxes data array
     */
    loadBoxes(boxes) {
        const boxFormContainer = document.getElementById('boxFormContainer');
        boxFormContainer.innerHTML = '';
        this.boxCounter = 0;
        
        boxes.forEach(boxData => {
            this.boxCounter++;
            
            if (boxData.type === 'description') {
                this.addDescriptionBox(boxData);
            } else if (boxData.type === 'character') {
                this.addCharacterBox(boxData);
            }
        });
    }

    /**
     * Adds a new box form
     * @param {string} type - The type of box to add ('description' or 'character')
     */
    addBox(type) {
        this.boxCounter++;
        
        if (type === 'description') {
            this.addDescriptionBox();
        } else if (type === 'character') {
            this.addCharacterBox();
        }
        
        // Trigger an update to show the slide preview
        this.generateCard();
    }

    /**
     * Adds a description box form
     * @param {Object} data - Optional data to populate the form
     */
    addDescriptionBox(data = {}) {
        const boxId = this.boxCounter;
        const boxFormContainer = document.getElementById('boxFormContainer');
        
        const boxHtml = `
            <div class="box-group" data-type="description" data-box-id="${boxId}" id="box-${boxId}">
                <h3>
                    Description Box
                    <button class="btn btn-danger delete-button" data-action="delete-box" data-box-id="${boxId}">
                        <span class="icon">🗑️</span>
                    </button>
                </h3>
                <div class="form-group">
                    <label for="description-heading-${boxId}">Heading:</label>
                    <input type="text" id="description-heading-${boxId}" class="description-heading" 
                           placeholder="Enter heading" value="${data.heading || ''}" data-field="heading">
                </div>
                <div class="form-group">
                    <label for="description-content-${boxId}">Content:</label>
                    <textarea id="description-content-${boxId}" class="description-content" 
                              placeholder="Enter content" data-field="content">${data.content || ''}</textarea>
                    <small class="form-helper">*Use <strong>**bold**</strong> and <em>*italic*</em> for formatting</small>
                </div>
            </div>
        `;
        
        boxFormContainer.insertAdjacentHTML('beforeend', boxHtml);
        
        // Add event listeners
        const boxElement = document.getElementById(`box-${boxId}`);
        
        // Input change event for form fields
        boxElement.querySelectorAll('input, textarea').forEach(element => {
            element.addEventListener('input', () => {
                this.generateCard();
            });
        });
        
        // Delete button click event
        boxElement.querySelector('[data-action="delete-box"]').addEventListener('click', () => {
            this.deleteBox(boxId);
        });
    }

    /**
     * Adds a character box form
     * @param {Object} data - Optional data to populate the form
     */
    addCharacterBox(data = {}) {
        const boxId = this.boxCounter;
        const boxFormContainer = document.getElementById('boxFormContainer');
        
        const boxHtml = `
            <div class="box-group" data-type="character" data-box-id="${boxId}" id="box-${boxId}">
                <h3>
                    Character Box
                    <button class="btn btn-danger delete-button" data-action="delete-box" data-box-id="${boxId}">
                        <span class="icon">🗑️</span>
                    </button>
                </h3>
                <div class="form-group">
                    <label for="character-heading-${boxId}">Name/Title:</label>
                    <input type="text" id="character-heading-${boxId}" class="character-heading" 
                           placeholder="Enter character name or title" value="${data.heading || ''}" data-field="heading">
                </div>
                <div class="form-group">
                    <label for="character-content-${boxId}">Description:</label>
                    <textarea id="character-content-${boxId}" class="character-content" 
                              placeholder="Enter character description" data-field="content">${data.content || ''}</textarea>
                    <small class="form-helper">*Use <strong>**bold**</strong> and <em>*italic*</em> for formatting</small>
                </div>
                <div class="form-group">
                    <label for="character-image-${boxId}">Image URL:</label>
                    <input type="text" id="character-image-${boxId}" class="character-image" 
                           placeholder="Enter image URL" value="${data.imageURL || ''}" data-field="imageURL">
                </div>
            </div>
        `;
        
        boxFormContainer.insertAdjacentHTML('beforeend', boxHtml);
        
        // Add event listeners
        const boxElement = document.getElementById(`box-${boxId}`);
        
        // Input change event for form fields
        boxElement.querySelectorAll('input, textarea').forEach(element => {
            element.addEventListener('input', () => {
                this.generateCard();
            });
        });
        
        // Delete button click event
        boxElement.querySelector('[data-action="delete-box"]').addEventListener('click', () => {
            this.deleteBox(boxId);
        });
    }

    /**
     * Deletes a box form
     * @param {number} boxId - The ID of the box to delete
     */
    deleteBox(boxId) {
        const box = document.getElementById(`box-${boxId}`);
        if (box) {
            box.remove();
            this.generateCard();
        }
    }

    /**
     * Generates the preview card from form data
     */
    generateCard() {
        const currentSlideIndex = this.slideManager.getCurrentSlideIndex();
        if (currentSlideIndex === -1) return;
        
        // Get the form values
        const bannerTitle = document.getElementById('bannerTitle').value;
        const mainHeading = document.getElementById('mainHeading').value;
        const description = this.parseTextFormatting(document.getElementById('description').value);
        
        // Update the slide data
        const slide = {
            bannerTitle,
            mainHeading,
            description,
            boxes: []
        };
        
        // Start generating the card's HTML
        let cardHTML = `
            <div class="banner">${bannerTitle}</div>
            <div class="main-heading">${mainHeading}</div>
            <div class="description">${description}</div>
        `;
        
        // Add boxes dynamically
        const boxes = document.querySelectorAll('.box-group');
        boxes.forEach(box => {
            const type = box.dataset.type;
            
            if (type === 'description') {
                const heading = box.querySelector('.description-heading').value;
                const content = this.parseTextFormatting(box.querySelector('.description-content').value);
                
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
                const content = this.parseTextFormatting(box.querySelector('.character-content').value);
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
        
        // Update the preview
        document.getElementById('cardPreview').innerHTML = `<div class="card">${cardHTML}</div>`;
        
        // Update the slide in the manager
        this.slideManager.updateCurrentSlide(slide);
    }

    /**
     * Parses text for bold and italic formatting
     * @param {string} text - The text to parse
     * @returns {string} Formatted HTML
     */
    parseTextFormatting(text) {
        if (!text) return '';
        
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold **text**
            .replace(/\*(.*?)\*/g, '<em>$1</em>');  // Italic *text*
    }
}