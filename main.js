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

const translations = {
  en: {
    title: "Swimming Pool pH+/- Calculator",
    volCalc: "Calculate pool volume",
    shape: "Shape:",
    rect: "Rectangle",
    round: "Round",
    length: "Length (m):",
    width: "Width (m):",
    depth: "Average Depth (m):",
    diameter: "Diameter (m):",
    rdepth: "Average Depth (m):",
    volume: "Pool Volume (m³):",
    currentPh: "Current pH:",
    targetPh: "Target pH:",
    strength: "Product Strength (pH change per dose):",
    dose: "Dose (g):",
    doseVolume: "Dose Volume (m³):"
  },
  fr: {
    title: "Calculateur pH+/- pour piscine",
    volCalc: "Calculer le volume de la piscine",
    shape: "Forme :",
    rect: "Rectangle",
    round: "Ronde",
    length: "Longueur (m) :",
    width: "Largeur (m) :",
    depth: "Profondeur moyenne (m) :",
    diameter: "Diamètre (m) :",
    rdepth: "Profondeur moyenne (m) :",
    volume: "Volume de la piscine (m³) :",
    currentPh: "pH actuel :",
    targetPh: "pH cible :",
    strength: "Puissance du produit (variation de pH par dose) :",
    dose: "Dose (g) :",
    doseVolume: "Volume de dose (m³) :"
  }
};

function setLanguage() {
  const lang = document.getElementById('lang-switch').value;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      if (el.tagName === 'OPTION') {
        el.textContent = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
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
