// Import styles
import '../css/styles.css';

// Import modules
import { SlideManager } from './modules/SlideManager';
import { FormBuilder } from './modules/FormBuilder';
import { PreviewRenderer } from './modules/PreviewRenderer';
import { ExportManager } from './modules/ExportManager';
import { StorageManager } from './modules/StorageManager';
import { Toast } from './modules/Toast';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Create instances of the modules
    const slideManager = new SlideManager();
    const formBuilder = new FormBuilder(slideManager);
    const previewRenderer = new PreviewRenderer();
    const exportManager = new ExportManager();
    const storageManager = new StorageManager(slideManager);
    
    // Initialize the application
    initializeApp(slideManager, formBuilder, previewRenderer, exportManager, storageManager);
});

function initializeApp(slideManager, formBuilder, previewRenderer, exportManager, storageManager) {
    // Add event listeners for the main buttons
    document.getElementById('addSlideButton').addEventListener('click', () => {
        const newSlideIndex = slideManager.addSlide();
        formBuilder.loadSlideForm(newSlideIndex);
    });

    document.getElementById('exportCardButton').addEventListener('click', () => {
        const currentSlideIndex = slideManager.getCurrentSlideIndex();
        if (currentSlideIndex !== -1) {
            exportManager.exportSingleSlide(currentSlideIndex);
            Toast.show('Slide exported successfully', 'success');
        } else {
            Toast.show('No slide selected to export', 'error');
        }
    });

    document.getElementById('exportAllSlidesButton').addEventListener('click', () => {
        if (slideManager.getSlidesCount() > 0) {
            exportManager.exportAllSlides();
            Toast.show('All slides exported successfully', 'success');
        } else {
            Toast.show('No slides to export', 'error');
        }
    });

    document.getElementById('exportZipButton').addEventListener('click', () => {
        if (slideManager.getSlidesCount() > 0) {
            exportManager.exportZip();
            Toast.show('ZIP file created successfully', 'success');
        } else {
            Toast.show('No slides to export', 'error');
        }
    });

    document.getElementById('saveProject').addEventListener('click', () => {
        if (slideManager.getSlidesCount() > 0) {
            storageManager.saveProject();
            Toast.show('Project saved successfully', 'success');
        } else {
            Toast.show('No slides to save', 'error');
        }
    });

    document.getElementById('loadProject').addEventListener('click', () => {
        document.getElementById('projectFileInput').click();
    });

    document.getElementById('projectFileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            storageManager.loadProject(file, () => {
                // Callback after loading
                if (slideManager.getSlidesCount() > 0) {
                    slideManager.selectSlide(0);
                    formBuilder.loadSlideForm(0);
                }
                Toast.show('Project loaded successfully', 'success');
            });
        }
    });

    // Initialize preview scale control
    document.getElementById('previewScaleSelect').addEventListener('change', (e) => {
        const scale = parseFloat(e.target.value);
        const preview = document.getElementById('cardPreview');
        preview.style.transform = `scale(${scale})`;
        preview.style.transformOrigin = 'top center';
    });

    // Check if there's a saved project in localStorage
    const savedProject = localStorage.getItem('slideBuilder_project');
    if (savedProject) {
        try {
            storageManager.loadProjectFromJson(savedProject, () => {
                if (slideManager.getSlidesCount() > 0) {
                    slideManager.selectSlide(0);
                    formBuilder.loadSlideForm(0);
                    Toast.show('Last session restored', 'success');
                }
            });
        } catch (error) {
            console.error('Error loading saved project:', error);
            localStorage.removeItem('slideBuilder_project');
        }
    }
}