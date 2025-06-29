// Pool volume calculator logic
function showFields() {
    const shape = document.getElementById('shape').value;
    document.getElementById('rectFields').style.display = shape === 'rect' ? '' : 'none';
    document.getElementById('roundFields').style.display = shape === 'round' ? '' : 'none';
}

let translations = {};

function loadLanguage(lang, callback) {
    fetch(`locales/${lang}.json`)
    .then(response => response.json())
    .then(data => {
        translations = data;
        if (typeof callback === 'function') callback();
    });
}

function setLanguage() {
    const lang = document.getElementById('lang-switch').value;
    document.documentElement.lang = lang;
    loadLanguage(lang, () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            if (el.tagName === 'OPTION') {
                el.textContent = translations[key];
            } else {
                el.innerText = translations[key];
            }
        }
        });
        calculateAndDisplay();
    });
}

function calculateAndDisplay() {
    if (!translations) {
        // Don't attempt to display result until translations are loaded
        return;
    }
    const volume = parseFloat(document.getElementById('volume').value); // in m³
    const currentPh = parseFloat(document.getElementById('currentPh').value);
    const targetPh = parseFloat(document.getElementById('targetPh').value);
    const strength = parseFloat(document.getElementById('strength').value); // pH change per dose
    const dose = parseFloat(document.getElementById('dose').value); // grams per dose
    const doseVolume = parseFloat(document.getElementById('doseVolume').value); // m³ per dose
    const resultDiv = document.getElementById('result');
    const lang = document.getElementById('lang-switch').value;

    if (isNaN(volume) || isNaN(currentPh) || isNaN(targetPh) || isNaN(strength) || isNaN(dose) || isNaN(doseVolume)) {
        resultDiv.textContent = '';
        return;
    }
    const delta = Math.abs(targetPh - currentPh);
    const neededDoses = (delta * volume) / (strength * doseVolume);
    const grams = Math.round(neededDoses * dose);
    let resultKey = targetPh > currentPh ? 'addPlus' : 'addMinus';
    const resultText = translations[resultKey].replace(/\{g\}/g, grams);
    resultDiv.textContent = resultText;
}

function autoCalcVolume() {
    const shape = document.getElementById('shape').value;
    let volume = 0;
    if (shape === 'rect') {
        const l = parseFloat(document.getElementById('length').value);
        const w = parseFloat(document.getElementById('width').value);
        const d = parseFloat(document.getElementById('depth').value);
        if (!isNaN(l) && !isNaN(w) && !isNaN(d)) {
            volume = l * w * d;
        }
    } else {
        const dia = parseFloat(document.getElementById('diameter').value);
        const d = parseFloat(document.getElementById('rdepth').value);
        if (!isNaN(dia) && !isNaN(d)) {
            volume = Math.PI * Math.pow(dia/2, 2) * d;
        }
    }
    const volResult = document.getElementById('volume');
    if (volume > 0) {
        volResult.value = volume.toFixed(2);
        calculateAndDisplay();
    } else {
        volResult.value = '';
    }
}


function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    document.getElementById('theme-toggle-checkbox').checked = isDark;
}

window.addEventListener('DOMContentLoaded', function() {
    // Ensure correct pool shape fields are shown
    showFields();
    setLanguage();
    document.getElementById('lang-switch').addEventListener('change', setLanguage);
    document.getElementById('shape').addEventListener('change', showFields);
    // Attach input listeners for auto-calc
    ['volume','currentPh','targetPh','strength','dose','doseVolume'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculateAndDisplay);
    });
    ['length','width','depth','diameter','rdepth','shape'].forEach(id => {
        document.getElementById(id).addEventListener('input', autoCalcVolume);
    });

    const themeCheckbox = document.getElementById('theme-toggle-checkbox');
    // Set initial state
    setTheme(themeCheckbox.checked);
    // Listen for changes
    themeCheckbox.addEventListener('change', function() {
        setTheme(this.checked);
    });
});
