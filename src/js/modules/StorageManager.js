/**
 * Manages saving and loading slide projects
 */
export class StorageManager {
    constructor(slideManager) {
        this.slideManager = slideManager;
        
        // Autosave timer
        this.autosaveTimer = null;
        this.startAutosave();
        
        // Listen for slide changes to trigger autosave
        document.addEventListener('slideUpdated', () => {
            this.resetAutosaveTimer();
        });
        
        document.addEventListener('slideSelected', () => {
            this.resetAutosaveTimer();
        });
        
        document.addEventListener('slideDeleted', () => {
            this.resetAutosaveTimer();
        });
        
        document.addEventListener('slidesReordered', () => {
            this.resetAutosaveTimer();
        });
    }

    /**
     * Saves the current project to a JSON file
     */
    saveProject() {
        const slides = this.slideManager.getAllSlides();
        if (!slides || slides.length === 0) return;
        
        // Create project data object
        const projectData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            slides: slides
        };
        
        // Convert to JSON
        const jsonData = JSON.stringify(projectData, null, 2);
        
        // Create file name with timestamp
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10);
        const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '-');
        const fileName = `slide-project-${dateStr}-${timeStr}.json`;
        
        // Download file
        this.downloadJsonFile(fileName, jsonData);
        
        // Save to localStorage as well
        localStorage.setItem('slideBuilder_project', jsonData);
    }

    /**
     * Loads a project from a JSON file
     * @param {File} file - The file to load
     * @param {Function} callback - Callback function after loading
     */
    loadProject(file, callback) {
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const jsonData = event.target.result;
                this.loadProjectFromJson(jsonData, callback);
            } catch (error) {
                console.error('Error loading project:', error);
                alert('Error loading project: Invalid file format');
            }
        };
        
        reader.readAsText(file);
    }

    /**
     * Loads a project from a JSON string
     * @param {string} jsonData - The JSON data to load
     * @param {Function} callback - Callback function after loading
     */
    loadProjectFromJson(jsonData, callback) {
        try {
            const projectData = JSON.parse(jsonData);
            
            // Check if the data is valid
            if (!projectData.slides || !Array.isArray(projectData.slides)) {
                throw new Error('Invalid project data: slides not found');
            }
            
            // Load the slides
            this.slideManager.setSlides(projectData.slides);
            
            // Save to localStorage
            localStorage.setItem('slideBuilder_project', jsonData);
            
            // Call the callback function
            if (typeof callback === 'function') {
                callback();
            }
        } catch (error) {
            console.error('Error parsing project data:', error);
            alert('Error loading project: ' + error.message);
        }
    }

    /**
     * Downloads a JSON file
     * @param {string} fileName - The name of the file
     * @param {string} jsonData - The JSON data
     */
    downloadJsonFile(fileName, jsonData) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const link = document.createElement('a');
        
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
    }

    /**
     * Starts the autosave timer
     */
    startAutosave() {
        this.autosaveTimer = setTimeout(() => {
            this.autosave();
        }, 30000); // Autosave every 30 seconds of inactivity
    }

    /**
     * Resets the autosave timer
     */
    resetAutosaveTimer() {
        clearTimeout(this.autosaveTimer);
        this.startAutosave();
    }

    /**
     * Performs an autosave
     */
    autosave() {
        const slides = this.slideManager.getAllSlides();
        if (!slides || slides.length === 0) return;
        
        // Create project data object
        const projectData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            slides: slides
        };
        
        // Convert to JSON
        const jsonData = JSON.stringify(projectData);
        
        // Save to localStorage
        localStorage.setItem('slideBuilder_project', jsonData);
        
        // Restart the timer
        this.startAutosave();
    }
}