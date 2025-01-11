let stepCount = 1;

// Reference to the input and output elements
const fileInput = document.getElementById('jsonFileInput');
const processButton = document.getElementById('processButton');
const output = document.getElementById('output');

function getText(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const text = doc.body.textContent || "";
    return text.trim();
}

function updateFileName() {
    const input = document.getElementById('jsonFileInput');
    const fileName = document.getElementById('fileName');
    if (input.files.length > 0) {
        fileName.textContent = `Selected file: ${input.files[0].name}`;
    } else {
        fileName.textContent = '';
    }
}

processButton.addEventListener('click', () => {
    const file = fileInput.files[0]; // Get the selected file

    if (!file) {
        alert('Please select a JSON file first!');
        return;
    }

    const reader = new FileReader();

    // Read the file as text
    reader.onload = (event) => {
        try {
            const jsonData = JSON.parse(event.target.result); // Parse JSON
            processJsonData(jsonData); // Process the JSON data
        } catch (error) {
            alert('Error parsing JSON file!');
            console.error('Error parsing JSON:', error);
        }
    };

    reader.readAsText(file); // Read the file
});

function processJsonData(jsonData) {
    const vulnerabilities = jsonData.Vulnerabilities;
    if (vulnerabilities && vulnerabilities.length > 0) {
        const container = document.createElement('div');
        vulnerabilities.forEach(vulnerability => {
            const box = document.createElement('div');
            box.classList.add('vulnerability-box');

            const name = document.createElement('p');
            const nameStrong = document.createElement('strong');
            nameStrong.classList.add('vulnerability-name');
            nameStrong.textContent = vulnerability.Name;
            name.appendChild(nameStrong);

            const severity = document.createElement('p');
            severity.innerHTML = `<strong>Severity:</strong> ${vulnerability.Severity}`;

            const description = document.createElement('p');
            description.innerHTML = `<strong>Description:</strong> ${getText(vulnerability.Description)}`;

            const recommendation = document.createElement('p');
            recommendation.innerHTML = `<strong>Recommendation:</strong> ${vulnerability.Recommendation}`;

            const url = document.createElement('p');
            url.innerHTML = `<strong>URL:</strong> <a href="${vulnerability.Url}" target="_blank">${vulnerability.Url}</a>`;

            const type = document.createElement('p');
            type.innerHTML = `<strong>Type:</strong> ${vulnerability.Type}`;

            const cwe = document.createElement('p');
            cwe.innerHTML = `<strong>CWE:</strong> ${vulnerability.Classification.Cwe}`;

            const cvss = document.createElement('p');
            cvss.innerHTML = `<strong>CVSS:</strong> ${vulnerability.Classification.Pci32 || vulnerability.Classification.PciDss40}`;

            const owasp = document.createElement('p');
            owasp.innerHTML = `<strong>OWASP Category:</strong> ${vulnerability.Classification.OwaspTopTen2021 || vulnerability.Classification.OwaspTopTen2023}`;

            const impact = document.createElement('p');
            impact.innerHTML = `<strong>Impact:</strong> ${vulnerability.Impact}`;

            const remediation = document.createElement('p');
            remediation.innerHTML = `<strong>Remediation:</strong> ${getText(vulnerability.RemedialProcedure)}`;

            const references = document.createElement('p');
            references.innerHTML = `<strong>References:</strong> ${getText(vulnerability.RemedyReferences)}`;

            const poc = document.createElement('p');
            poc.innerHTML = `<strong>POC:</strong> ${getText(vulnerability.ProofOfConcept)}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeElement(removeButton);

            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Form';
            addButton.onclick = () => addToForm(vulnerability);

            box.appendChild(name);
            box.appendChild(severity);
            box.appendChild(description);
            box.appendChild(recommendation);
            box.appendChild(url);
            box.appendChild(type);
            box.appendChild(cwe);
            box.appendChild(cvss);
            box.appendChild(owasp);
            box.appendChild(impact);
            box.appendChild(remediation);
            box.appendChild(references);
            box.appendChild(poc);
            box.appendChild(removeButton);
            box.appendChild(addButton);

            container.appendChild(box);
        });
        const output = document.getElementById('output');
        output.innerHTML = ''; // Clear previous content
        output.appendChild(container);
    }
}

function removeElement(button) {
    const box = button.parentElement;
    box.remove();
}

function addToForm(vulnerability) {
    document.querySelector('input[name="output"]').value = vulnerability.Name;
    document.querySelector('input[name="title"]').value = vulnerability.Name;
    document.querySelector('input[name="severity"]').value = vulnerability.Severity;
    document.querySelector('select[name="status"]').value = vulnerability.Status || 'N/A';
    document.querySelector('input[name="cvss_score"]').value = vulnerability.Classification.Pci32 || vulnerability.Classification.PciDss40 || '';
    document.querySelector('input[name="cwe_id"]').value = vulnerability.Classification.Cwe || '';
    document.querySelector('input[name="owasp_category"]').value = vulnerability.Classification.OwaspTopTen2021 || vulnerability.Classification.OwaspTopTen2023 || '';
    document.querySelector('textarea[name="description"]').value = getText(vulnerability.Description);
    document.querySelector('textarea[name="impact"]').value = getText(vulnerability.Impact) || '';
    document.querySelector('input[name="affected_url"]').value = vulnerability.Url || '';
    document.querySelector('input[name="reference_url"]').value = vulnerability.ReferenceUrl || '';
    document.querySelector('textarea[name="recommendations"]').value = getText(vulnerability.RemedialProcedure) || '';
}

function previewImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const step = input.getAttribute('data-step');
            const imgId = `preview-${step}`;
            document.getElementById(imgId).src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function addStep() {
    stepCount++;
    const stepsContainer = document.getElementById('steps-container');
    const newStep = document.createElement('div');
    newStep.classList.add('step');
    newStep.innerHTML = `
        <label>Step ${stepCount}: <input type="text" name="steps[]"></label><br>
        <label>Picture ${stepCount}: <input type="file" name="pictures[]" data-step="${stepCount}" onchange="previewImage(this)"></label><br>
        <img id="preview-${stepCount}" src="https://via.placeholder.com/150" alt="Step ${stepCount} Picture"><br>
        <button type="button" onclick="removeStep(this)">Remove Step</button><br>
    `;
    stepsContainer.appendChild(newStep);
}

function removeStep(button) {
    const step = button.parentElement;
    step.remove();
    stepCount--;
    updateStepNumbers();
}

function updateStepNumbers() {
    const steps = document.querySelectorAll('#steps-container .step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.querySelector('label').innerHTML = `Step ${stepNumber}: <input type="text" name="steps[]">`;
        const pictureLabel = step.querySelector('label:nth-of-type(2)');
        pictureLabel.innerHTML = `Picture ${stepNumber}: <input type="file" name="pictures[]" data-step="${stepNumber}" onchange="previewImage(this)">`;
        const img = step.querySelector('img');
        img.id = `preview-${stepNumber}`;
        img.alt = `Step ${stepNumber} Picture`;
    });
}

function ClearForm() {
    document.querySelector('form').reset();
    const stepsContainer = document.getElementById('steps-container');
    stepsContainer.innerHTML = `
        <div class="step">
            <label>Step 1: <input type="text" name="steps[]"></label><br>
            <label>Picture 1: <input type="file" name="pictures[]" data-step="1" onchange="previewImage(this)"></label><br>
            <img id="preview-1" src="https://via.placeholder.com/150" alt="Step 1 Picture"><br>
            <button type="button" onclick="removeStep(this)">Remove Step</button><br>
        </div>
    `;
    stepCount = 1;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    sidebar.classList.toggle('show');
    content.classList.toggle('shift');
}

function updateFileName(input) {
    const fileName = document.getElementById('fileName');
    if (input.files.length > 0) {
        fileName.textContent = `Selected file: ${input.files[0].name}`;
    } else {
        fileName.textContent = '';
    }
}