/**
 * Manages the slides collection and slide operations
 */
export class SlideManager {
    constructor() {
        this.slides = [];
        this.slideCounter = 0;
        this.currentSlideIndex = -1;

        // Initialize the slides list container
        this.slidesList = document.getElementById('slidesList');
    }

    /**
     * Creates and adds a new slide
     * @returns {number} Index of the new slide
     */
    addSlide() {
        this.slideCounter++;
        
        // Create a new slide object
        const slide = {
            id: `slide_${Date.now()}`,
            number: this.slideCounter,
            bannerTitle: '',
            mainHeading: '',
            description: '',
            boxes: []
        };
        
        // Add slide to the collection
        this.slides.push(slide);
        const slideIndex = this.slides.length - 1;
        
        // Create and add the slide item to the UI
        this.createSlideItem(slide, slideIndex);
        
        // Select the new slide
        this.selectSlide(slideIndex);
        
        return slideIndex;
    }

    /**
     * Creates a slide item element in the slides list
     * @param {Object} slide - The slide data
     * @param {number} index - The slide index in the array
     */
    createSlideItem(slide, index) {
        const slideItem = document.createElement('div');
        slideItem.classList.add('slide-item');
        slideItem.id = `slide-${index}`;
        slideItem.innerText = slide.number;
        slideItem.draggable = true;
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-slide');
        deleteButton.innerHTML = '×';
        deleteButton.title = 'Delete slide';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteSlide(index);
        });
        
        slideItem.appendChild(deleteButton);
        
        // Add event listeners
        slideItem.addEventListener('click', () => this.selectSlide(index));
        slideItem.addEventListener('dragstart', this.dragStart.bind(this));
        slideItem.addEventListener('dragover', this.dragOver);
        slideItem.addEventListener('drop', this.drop.bind(this));
        slideItem.addEventListener('dragend', this.dragEnd);
        
        this.slidesList.appendChild(slideItem);
    }

    /**
     * Selects a slide for editing
     * @param {number} index - The index of the slide to select
     */
    selectSlide(index) {
        if (index >= this.slides.length) return;
        
        this.currentSlideIndex = index;
        
        // Update the active class
        document.querySelectorAll('.slide-item').forEach((item) => {
            item.classList.remove('active');
        });
        
        const slideItem = document.getElementById(`slide-${index}`);
        if (slideItem) {
            slideItem.classList.add('active');
        }
        
        // Dispatch a custom event to notify that a slide was selected
        const event = new CustomEvent('slideSelected', { 
            detail: { index, slide: this.slides[index] } 
        });
        document.dispatchEvent(event);
    }

    /**
     * Updates the current slide with new data
     * @param {Object} data - The slide data to update
     */
    updateCurrentSlide(data) {
        if (this.currentSlideIndex === -1) return;
        
        // Update the slide data
        Object.assign(this.slides[this.currentSlideIndex], data);
        
        // Dispatch a custom event to notify that a slide was updated
        const event = new CustomEvent('slideUpdated', {
            detail: { 
                index: this.currentSlideIndex, 
                slide: this.slides[this.currentSlideIndex] 
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Deletes a slide
     * @param {number} index - The index of the slide to delete
     */
    deleteSlide(index) {
        if (confirm('Are you sure you want to delete this slide?')) {
            // Remove the slide from the collection
            this.slides.splice(index, 1);
            
            // Remove the slide item from the UI
            document.getElementById(`slide-${index}`).remove();
            
            // Update the remaining slide IDs and numbers
            this.updateSlideItems();
            
            // Select another slide if available, or clear the form
            if (this.slides.length > 0) {
                const newIndex = Math.min(index, this.slides.length - 1);
                this.selectSlide(newIndex);
            } else {
                this.currentSlideIndex = -1;
                document.getElementById('formContainer').innerHTML = '';
                document.getElementById('cardPreview').innerHTML = '';
            }
            
            // Dispatch a custom event to notify that a slide was deleted
            const event = new CustomEvent('slideDeleted', { 
                detail: { index } 
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * Updates the UI slide items after changes
     */
    updateSlideItems() {
        const slideItems = document.querySelectorAll('.slide-item');
        slideItems.forEach((item, i) => {
            // Skip if we have fewer slides than items (when deleting)
            if (i >= this.slides.length) return;
            
            // Update the text content and ID
            item.textContent = this.slides[i].number;
            item.id = `slide-${i}`;
            
            // Recreate the delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-slide');
            deleteButton.innerHTML = '×';
            deleteButton.title = 'Delete slide';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSlide(i);
            });
            
            item.appendChild(deleteButton);
            
            // Update event listeners
            const newItem = item.cloneNode(true);
            newItem.addEventListener('click', () => this.selectSlide(i));
            newItem.addEventListener('dragstart', this.dragStart.bind(this));
            newItem.addEventListener('dragover', this.dragOver);
            newItem.addEventListener('drop', this.drop.bind(this));
            newItem.addEventListener('dragend', this.dragEnd);
            
            item.parentNode.replaceChild(newItem, item);
        });
    }

    /**
     * Gets the current slide index
     * @returns {number} The current slide index
     */
    getCurrentSlideIndex() {
        return this.currentSlideIndex;
    }

    /**
     * Gets the current slide
     * @returns {Object|null} The current slide or null if none is selected
     */
    getCurrentSlide() {
        if (this.currentSlideIndex === -1) return null;
        return this.slides[this.currentSlideIndex];
    }

    /**
     * Gets all slides
     * @returns {Array} The slides array
     */
    getAllSlides() {
        return this.slides;
    }

    /**
     * Gets the number of slides
     * @returns {number} The number of slides
     */
    getSlidesCount() {
        return this.slides.length;
    }

    /**
     * Sets the slides array from loaded data
     * @param {Array} slides - The slides array to set
     */
    setSlides(slides) {
        this.slides = slides;
        this.slideCounter = slides.length > 0 
            ? Math.max(...slides.map(slide => slide.number)) 
            : 0;
        
        // Clear the slides list
        this.slidesList.innerHTML = '';
        
        // Create the slide items
        slides.forEach((slide, index) => {
            this.createSlideItem(slide, index);
        });
    }

    // Drag and drop handlers
    dragStart(e) {
        this.draggedItem = e.target;
        e.dataTransfer.setData('text/plain', '');
    }

    dragOver(e) {
        e.preventDefault();
    }

    drop(e) {
        e.preventDefault();
        const target = e.target;
        
        if (this.draggedItem !== target && target.classList.contains('slide-item')) {
            const items = Array.from(this.slidesList.children);
            const draggedIndex = items.indexOf(this.draggedItem);
            const targetIndex = items.indexOf(target);
            
            // Reorder in the DOM
            if (draggedIndex > targetIndex) {
                this.slidesList.insertBefore(this.draggedItem, target);
            } else {
                this.slidesList.insertBefore(this.draggedItem, target.nextSibling);
            }
            
            // Reorder the slides array
            const [removedSlide] = this.slides.splice(draggedIndex, 1);
            this.slides.splice(targetIndex, 0, removedSlide);
            
            // Update slide items and indices
            this.updateSlideItems();
            
            // Dispatch a custom event to notify that slides were reordered
            const event = new CustomEvent('slidesReordered', {
                detail: { draggedIndex, targetIndex }
            });
            document.dispatchEvent(event);
        }
    }

    dragEnd() {
        this.draggedItem = null;
    }
}