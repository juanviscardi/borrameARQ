const express = require('express');
const Pipeline = require('./pipeline');
const Validator = require('./validator');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Almacenar resultados de ejecuciones
let executionResults = [];

/**
 * Endpoint REST que recibe datos y procesa mediante Pipeline
 */
app.post('/api/process', (req, res) => {
    const { data } = req.body;

    // Validación trivial
    const validationErrors = Validator.validate(data);
    if (validationErrors.length > 0) {
        console.log(`[VALIDATION FAILED] Data: "${data}" - Errors:`, validationErrors);
        return res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
        });
    }

    // Responder 200 inmediatamente
    console.log(`[ACCEPTED] Data: "${data}" - Processing initiated`);
    res.status(200).json({
        message: 'Data accepted and processing started',
        data: data
    });

    // Procesar en el Pipeline (asincronamente)
    Pipeline.execute(data).then(result => {
        executionResults.push(result);
        console.log(`[PIPELINE RESULT]`, result);
    }).catch(error => {
        console.error(`[PIPELINE ERROR]`, error);
        executionResults.push({
            input: data,
            status: 'ERROR',
            error: error.message,
            timestamp: new Date()
        });
    });
});

/**
 * Endpoint para obtener los resultados de todas las ejecuciones
 */
app.get('/api/results', (req, res) => {
    res.json({
        totalExecutions: executionResults.length,
        results: executionResults
    });
});

/**
 * Endpoint para guardar resultados en archivo
 */
app.post('/api/results/save', (req, res) => {
    try {
        const outputPath = path.join(__dirname, 'results.json');
        fs.writeFileSync(outputPath, JSON.stringify(executionResults, null, 2));
        console.log(`[FILE SAVED] Results saved to ${outputPath}`);
        res.json({
            message: 'Results saved successfully',
            file: outputPath,
            count: executionResults.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Send POST requests to http://localhost:${PORT}/api/process`);
});

// Manejo de cierre
process.on('SIGINT', () => {
    console.log('\n[SHUTDOWN] Saving results before exit...');
    const outputPath = path.join(__dirname, 'results.json');
    fs.writeFileSync(outputPath, JSON.stringify(executionResults, null, 2));
    console.log(`[FILE SAVED] Results saved to ${outputPath}`);
    process.exit(0);
});
