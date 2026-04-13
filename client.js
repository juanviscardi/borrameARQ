const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

/**
 * Palabras de ejemplo para generar datos aleatorios
 */
const WORDS = [
    'arquitectura', 'software', 'pipeline', 'validacion', 'filtro',
    'datos', 'servidor', 'cliente', 'respuesta', 'solicitud',
    'procesamiento', 'consistencia', 'eficiencia', 'diseño', 'patron'
];

/**
 * Genera una palabra aleatoria
 */
function generateRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

/**
 * Genera un dato aleatorio (puede ser palabra o números)
 */
function generateRandomData() {
    const dataTypes = [
        () => generateRandomWord(),
        () => generateRandomWord() + Math.floor(Math.random() * 100),
        () => '', // Caso de error: vacío
        () => 'a'.repeat(1000), // Caso de error: muy largo
    ];

    return dataTypes[Math.floor(Math.random() * dataTypes.length)]();
}

/**
 * Envía un dato al servidor
 */
async function sendData(data) {
    try {
        const response = await axios.post(`${SERVER_URL}/api/process`, { data });
        console.log(`[CLIENT] Sent: "${data}" - Status: ${response.status}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(`[CLIENT] Sent: "${data}" - Status: ${error.response.status} - Error: ${error.response.data.error}`);
        } else {
            console.error(`[CLIENT ERROR] Connection failed:`, error.message);
        }
    }
}

/**
 * Genera y envía múltiples datos
 */
async function sendMultipleData(count = 5) {
    console.log(`\n[CLIENT] Generating and sending ${count} random data items...\n`);

    for (let i = 0; i < count; i++) {
        const data = generateRandomData();
        await sendData(data);
        // Pequeño delay para no saturar
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

/**
 * Obtiene los resultados del servidor
 */
async function getResults() {
    try {
        const response = await axios.get(`${SERVER_URL}/api/results`);
        console.log('\n[CLIENT] Results from server:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('[CLIENT ERROR]', error.message);
    }
}

/**
 * Guarda los resultados en archivo
 */
async function saveResults() {
    try {
        const response = await axios.post(`${SERVER_URL}/api/results/save`);
        console.log('\n[CLIENT]', response.data);
    } catch (error) {
        console.error('[CLIENT ERROR]', error.message);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    (async () => {
        // Esperar a que el servidor esté listo
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Enviar datos
        await sendMultipleData(10);

        // Esperar un poco para que se procesen los datos
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Obtener resultados
        await getResults();

        // Guardar resultados
        await saveResults();

        process.exit(0);
    })();
}

module.exports = { sendData, sendMultipleData, getResults, saveResults };
