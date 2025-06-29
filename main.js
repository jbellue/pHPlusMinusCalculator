// Pool volume calculator logic
function showFields() {
    const shape = document.getElementById('shape').value;
    document.getElementById('rectFields').style.display = shape === 'rect' ? '' : 'none';
    document.getElementById('roundFields').style.display = shape === 'round' ? '' : 'none';
}

function calculateAndDisplay() {
    const volume = parseFloat(document.getElementById('volume').value); // in m³
    const currentPh = parseFloat(document.getElementById('currentPh').value);
    const targetPh = parseFloat(document.getElementById('targetPh').value);
    const strength = parseFloat(document.getElementById('strength').value); // pH change per dose
    const dose = parseFloat(document.getElementById('dose').value); // grams per dose
    const doseVolume = parseFloat(document.getElementById('doseVolume').value); // m³ per dose
    const resultDiv = document.getElementById('result');

    if (isNaN(volume) || isNaN(currentPh) || isNaN(targetPh) || isNaN(strength) || isNaN(dose) || isNaN(doseVolume)) {
        resultDiv.textContent = '';
        return;
    }
    const delta = Math.abs(targetPh - currentPh);
    const neededDoses = (delta * volume) / (strength * doseVolume);
    const grams = neededDoses * dose;
    const roundedGrams = Math.round(grams);
    let resultText = `Add approximately ${roundedGrams}g of pH`;
    if (targetPh > currentPh) {
        resultText += '+ (increaser).';
    } else {
        resultText += '- (decreaser).';
    }
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

let translations = {};

function loadLanguage(lang, callback) {
  fetch(`locales/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      translations = data;
      callback();
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
  });
}

function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

window.addEventListener('DOMContentLoaded', function() {
    // Ensure correct pool shape fields are shown
    showFields();
    document.getElementById('shape').addEventListener('change', showFields);
    // Perform initial calculation
    calculateAndDisplay();
    // Attach input listeners for auto-calc
    ['volume','currentPh','targetPh','strength','dose','doseVolume'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculateAndDisplay);
    });
    ['length','width','depth','diameter','rdepth','shape'].forEach(id => {
        document.getElementById(id).addEventListener('input', autoCalcVolume);
    });
    setLanguage();
    document.getElementById('lang-switch').addEventListener('change', setLanguage);

    setTheme(localStorage.getItem('theme') === 'dark');
    document.getElementById('theme-toggle').addEventListener('click', function() {
        setTheme(!document.body.classList.contains('dark'));
    });
});
