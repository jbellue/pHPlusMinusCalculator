// Basic formula: 1g of pH+ (sodium bisulfate) raises 1m³ (1000L) by ~0.001 pH
// 1g of pH- (hydrochloric acid or sodium bisulfate) lowers 1m³ by ~0.001 pH
// This is a simplification. Always check product instructions.
document.getElementById('phForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const volume = parseFloat(document.getElementById('volume').value); // in m³
    const currentPh = parseFloat(document.getElementById('currentPh').value);
    const targetPh = parseFloat(document.getElementById('targetPh').value);
    const strength = parseFloat(document.getElementById('strength').value); // pH change per dose
    const dose = parseFloat(document.getElementById('dose').value); // grams per dose
    const doseVolume = parseFloat(document.getElementById('doseVolume').value); // m³ per dose
    const resultDiv = document.getElementById('result');

    if (isNaN(volume) || isNaN(currentPh) || isNaN(targetPh) || isNaN(strength) || isNaN(dose) || isNaN(doseVolume)) {
        resultDiv.textContent = 'Please fill in all fields.';
        return;
    }
    const delta = Math.abs(targetPh - currentPh);
    // Calculate how many doses are needed for the whole pool
    const neededDoses = (delta * volume) / (strength * doseVolume);
    const grams = neededDoses * dose;
    const roundedGrams = Math.round(grams);
    if (targetPh > currentPh) {
        resultDiv.textContent = `Add approximately ${roundedGrams}g of pH+ (increaser).`;
    } else {
        resultDiv.textContent = `Add approximately ${roundedGrams}g of pH- (decreaser).`;
    }
});

// Pool volume calculator logic
function showFields() {
    const shape = document.getElementById('shape').value;
    document.getElementById('rectFields').style.display = shape === 'rect' ? '' : 'none';
    document.getElementById('roundFields').style.display = shape === 'round' ? '' : 'none';
}
document.getElementById('shape').addEventListener('change', showFields);
document.getElementById('calcVolume').addEventListener('click', function() {
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
    const volResult = document.getElementById('volResult');
    if (volume > 0) {
        volResult.textContent = `Volume: ${volume.toFixed(2)} m³`;
        document.getElementById('volume').value = volume.toFixed(2);
    } else {
        volResult.textContent = 'Please fill in all fields.';
    }
});
// Add a helper to calculate phPerGramPerL from dose info
function updatePhPerGramPerL() {
    const s = parseFloat(document.getElementById('setStrength').value);
    const d = parseFloat(document.getElementById('setDose').value);
    const v = parseFloat(document.getElementById('setDoseVolume').value);
    if (!isNaN(s) && !isNaN(d) && !isNaN(v) && d > 0 && v > 0) {
        // s = pH delta for d grams in v m³
        // Convert v m³ to liters
        const liters = v * 1000;
        // pH delta per gram per liter
        const phPerGramPerL = s / (d * liters);
        document.getElementById('phPerGramPerL').value = phPerGramPerL.toPrecision(5);
    }
}
