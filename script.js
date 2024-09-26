let boxCounter = 0;

function parseTextFormatting(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Bold **text**
        .replace(/\*(.*?)\*/g, '<i>$1</i>');     // Italic *text*
}

function generateCard() {
    const bannerTitle = document.getElementById("bannerTitle").value;
    const mainHeading = document.getElementById("mainHeading").value;
    const description = parseTextFormatting(document.getElementById("description").value);

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
        } else if (type === 'character') {
            const heading = box.querySelector('.character-heading').value;
            const content = parseTextFormatting(box.querySelector('.character-content').value);
            const imageURL = box.querySelector('.character-image').value || 'https://via.placeholder.com/150';
            cardHTML += `
                <div class="character-box flex-container">
                    <div class="card-image" style="background-image: url('${imageURL}');"></div>
                    <div>
                        <div class="card-title">${heading}</div>
                        <div class="card-description">${content}</div>
                    </div>
                </div>
            `;
        }
    });

    document.getElementById("cardPreview").innerHTML = cardHTML;
}

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

function deleteBox(boxId) {
    const box = document.getElementById(`box-${boxId}`);
    box.remove();
    generateCard();
}

function exportCard() {
    const cardHTMLContent = document.getElementById("cardPreview").innerHTML;
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Exported Card</title>
    <style>
        /* Include necessary styles for the exported card */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            background-color: white;
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
        }
        .description-box .box-content, .character-box .card-description {
            font-size: 18px;
        }
        .card-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-size: cover;
            margin-right: 20px;
        }
        .flex-container {
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body>
    ${cardHTMLContent}
</body>
</html>
    `;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'card.html';
    link.click();
}
