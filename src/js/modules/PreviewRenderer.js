/**
 * Handles the rendering of slide previews
 */
export class PreviewRenderer {
    constructor() {
        this.previewContainer = document.getElementById('cardPreview');
        
        // Listen for slide update events
        document.addEventListener('slideUpdated', (e) => {
            this.renderPreview(e.detail.slide);
        });
    }

    /**
     * Renders a slide preview
     * @param {Object} slide - The slide data to render
     */
    renderPreview(slide) {
        if (!slide) {
            this.previewContainer.innerHTML = '';
            return;
        }
        
        // Generate the HTML for the slide
        const cardHTML = this.generateSlideHTML(slide);
        this.previewContainer.innerHTML = `<div class="card">${cardHTML}</div>`;
    }

    /**
     * Generates HTML for a slide
     * @param {Object} slide - The slide data
     * @returns {string} The generated HTML
     */
    generateSlideHTML(slide) {
        let cardHTML = `
            <div class="banner">${slide.bannerTitle || ''}</div>
            <div class="main-heading">${slide.mainHeading || ''}</div>
            <div class="description">${slide.description || ''}</div>
        `;
        
        // Add boxes
        if (slide.boxes && slide.boxes.length > 0) {
            slide.boxes.forEach(boxData => {
                if (boxData.type === 'description') {
                    cardHTML += `
                        <div class="description-box">
                            <div class="box-heading">${boxData.heading || ''}</div>
                            <div class="box-content">${boxData.content || ''}</div>
                        </div>
                    `;
                } else if (boxData.type === 'character') {
                    cardHTML += `
                        <div class="character-box flex-container">
                            <div class="card-image" style="background-image: url('${boxData.imageURL || 'https://via.placeholder.com/150'}');"></div>
                            <div class="content">
                                <div class="card-title">${boxData.heading || ''}</div>
                                <div class="card-description">${boxData.content || ''}</div>
                            </div>
                        </div>
                    `;
                }
            });
        }
        
        return cardHTML;
    }

    /**
     * Gets CSS styles for exported slides
     * @returns {string} The CSS styles as a string
     */
    getExportStyles() {
        return `
            /* Reset & Base Styles */
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: white;
                color: #333;
            }
            
            /* Slide Container */
            .slide-container {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                padding: 20px;
            }
            
            /* Card Styles */
            .card {
                width: 100%;
                max-width: 1200px;
                height: auto;
                aspect-ratio: 16 / 9;
                background-color: white;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                padding: 40px;
                position: relative;
                overflow-y: auto;
            }
            
            /* Banner */
            .banner {
                background-color: #42b4ac;
                color: white;
                padding: 10px 15px;
                font-size: 18px;
                font-weight: bold;
                width: fit-content;
                border-radius: 8px;
            }
            
            /* Main Heading */
            .main-heading {
                color: #2a579a;
                font-size: 36px;
                font-weight: bold;
                margin: 20px 0;
                line-height: 1.2;
            }
            
            /* Description */
            .description {
                font-size: 20px;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            
            /* Description Box */
            .description-box {
                border: 2px solid #42b4ac;
                padding: 25px;
                margin-top: 25px;
                border-radius: 8px;
                background-color: rgba(66, 180, 172, 0.05);
            }
            
            .description-box .box-heading {
                font-size: 24px;
                color: #42b4ac;
                font-weight: bold;
                margin-bottom: 15px;
            }
            
            .description-box .box-content {
                font-size: 20px;
                line-height: 1.6;
            }
            
            /* Character Box */
            .character-box {
                border: 2px solid #42b4ac;
                padding: 25px;
                margin-top: 25px;
                border-radius: 8px;
                background-color: rgba(66, 180, 172, 0.05);
            }
            
            .flex-container {
                display: flex;
                align-items: center;
            }
            
            .card-image {
                flex-shrink: 0;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
                margin-right: 30px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                border: 3px solid white;
            }
            
            .character-box .content {
                flex: 1;
            }
            
            .character-box .card-title {
                font-size: 24px;
                color: #42b4ac;
                font-weight: bold;
                margin-bottom: 15px;
            }
            
            .character-box .card-description {
                font-size: 20px;
                line-height: 1.6;
            }
            
            /* Text Formatting */
            strong {
                font-weight: bold;
                color: #2a579a;
            }
            
            em {
                font-style: italic;
            }
            
            /* Print Styles */
            @media print {
                body {
                    background-color: white;
                }
                
                .slide-container {
                    height: 100%;
                    padding: 0;
                }
                
                .card {
                    box-shadow: none;
                    border: none;
                    height: 100%;
                    max-width: 100%;
                    padding: 20px;
                }
            }
        `;
    }
}