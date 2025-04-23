// Import libraries
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// Import modules
import { PreviewRenderer } from './PreviewRenderer';

/**
 * Handles exporting slides in various formats
 */
export class ExportManager {
    constructor() {
        this.previewRenderer = new PreviewRenderer();
        this.slideManager = null;
        
        // Get a reference to the slide manager when it's available
        document.addEventListener('slideSelected', (e) => {
            if (!this.slideManager) {
                this.slideManager = e.target.slideManager;
            }
        });
    }

    /**
     * Exports a single slide as HTML
     * @param {number} slideIndex - The index of the slide to export
     */
    exportSingleSlide(slideIndex) {
        const slides = this.slideManager.getAllSlides();
        if (!slides || !slides[slideIndex]) return;
        
        const slide = slides[slideIndex];
        const slideNumber = slideIndex + 1;
        
        // Generate the slide HTML
        const cardHTMLContent = this.previewRenderer.generateSlideHTML(slide);
        const fullHTML = this.generateFullHTML(cardHTMLContent, `Slide ${slideNumber}`);
        
        // Download the file
        this.downloadFile(`slide-${slideNumber}.html`, fullHTML);
    }

    /**
     * Exports all slides as individual HTML files
     */
    exportAllSlides() {
        const slides = this.slideManager.getAllSlides();
        if (!slides || slides.length === 0) return;
        
        slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            
            // Generate the slide HTML
            const cardHTMLContent = this.previewRenderer.generateSlideHTML(slide);
            const fullHTML = this.generateFullHTML(cardHTMLContent, `Slide ${slideNumber}`);
            
            // Download the file
            this.downloadFile(`slide-${slideNumber}.html`, fullHTML);
        });
    }

    /**
     * Exports all slides as a ZIP file
     */
    exportZip() {
        const slides = this.slideManager.getAllSlides();
        if (!slides || slides.length === 0) return;
        
        // Create a new ZIP file
        const zip = new JSZip();
        
        // Add each slide as an HTML file
        slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            
            // Generate the slide HTML
            const cardHTMLContent = this.previewRenderer.generateSlideHTML(slide);
            const fullHTML = this.generateFullHTML(cardHTMLContent, `Slide ${slideNumber}`);
            
            // Add the file to the ZIP
            zip.file(`slide-${slideNumber}.html`, fullHTML);
        });
        
        // Generate a table of contents
        const tocHTML = this.generateTableOfContents(slides);
        zip.file('index.html', tocHTML);
        
        // Add a CSS file
        const cssContent = this.previewRenderer.getExportStyles();
        zip.file('styles.css', cssContent);
        
        // Generate the ZIP file
        zip.generateAsync({ type: 'blob' })
            .then(content => {
                // Download the ZIP file
                saveAs(content, `slides-${new Date().toISOString().slice(0, 10)}.zip`);
            });
    }

    /**
     * Generates a complete HTML document with the slide content
     * @param {string} slideHTML - The HTML content of the slide
     * @param {string} title - The title of the document
     * @returns {string} The complete HTML document
     */
    generateFullHTML(slideHTML, title) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${this.previewRenderer.getExportStyles()}
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="card">
            ${slideHTML}
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generates a table of contents HTML file
     * @param {Array} slides - The slides array
     * @returns {string} The HTML content
     */
    generateTableOfContents(slides) {
        // Generate the table of contents HTML
        let listItems = '';
        slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            listItems += `
                <li>
                    <a href="slide-${slideNumber}.html" target="_blank">
                        <strong>Slide ${slideNumber}</strong>: ${slide.mainHeading || 'Untitled Slide'}
                    </a>
                </li>
            `;
        });
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slides Table of Contents</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #42b4ac;
            border-bottom: 2px solid #42b4ac;
            padding-bottom: 10px;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            margin-bottom: 15px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #42b4ac;
        }
        a {
            text-decoration: none;
            color: #2a579a;
        }
        a:hover {
            text-decoration: underline;
        }
        .info {
            margin-top: 40px;
            padding: 20px;
            background-color: #f0f8ff;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <h1>Slides Table of Contents</h1>
    <p>This file contains links to all the slides in this package. Click on a slide to open it.</p>
    
    <ul>
        ${listItems}
    </ul>
    
    <div class="info">
        <h2>Usage Instructions</h2>
        <p>These slides are standalone HTML files that can be viewed in any web browser. They are designed to work well with Learning Management Systems and can be embedded in most platforms.</p>
        <p><strong>Opening slides:</strong> Click on any slide link above to open it in a new tab.</p>
        <p><strong>Printing:</strong> Each slide is formatted for printing if needed - use your browser's print function.</p>
        <p><strong>Embedding:</strong> You can use the HTML files directly in your LMS by uploading them as content.</p>
    </div>
</body>
</html>
        `;
    }

    /**
     * Downloads a file with the given filename and content
     * @param {string} filename - The name of the file to download
     * @param {string} content - The content of the file
     */
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        saveAs(blob, filename);
    }
}