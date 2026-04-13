/**
 * Ejemplo de cómo crear y agregar filtros personalizados durante la prueba
 * 
 * Este archivo muestra patterns comunes para extender el sistema con nuevos filtros.
 */

const Filter = require('./filter');

// ============================================
// EJEMPLO 1: Crear un filtro simple
// ============================================
class ReverseFilter {
    constructor() {
        this.name = 'ReverseFilter';
    }

    async apply(data) {
        const dataStr = String(data);
        const output = dataStr.split('').reverse().join('');
        return {
            output,
            details: `Reversed: ${output}`
        };
    }
}

// ============================================
// EJEMPLO 2: Crear un filtro con lógica compleja
// ============================================
class ValidationStatsFilter {
    constructor() {
        this.name = 'ValidationStatsFilter';
    }

    async apply(data) {
        const dataStr = String(data);
        const stats = {
            length: dataStr.length,
            vowels: (dataStr.match(/[aeiouáéíóú]/gi) || []).length,
            consonants: (dataStr.match(/[bcdfghjklmnñpqrstvwxyz]/gi) || []).length,
            numbers: (dataStr.match(/[0-9]/g) || []).length,
            spaces: (dataStr.match(/\s/g) || []).length
        };
        return {
            output: stats,
            details: `Stats: ${JSON.stringify(stats)}`
        };
    }
}

// ============================================
// EJEMPLO 3: Crear un filtro asincrónico
// ============================================
class AsyncProcessFilter {
    constructor() {
        this.name = 'AsyncProcessFilter';
    }

    async apply(data) {
        // Simular operación asincrónica (DB, API, etc.)
        await new Promise(resolve => setTimeout(resolve, 500));

        const output = {
            data,
            processedAt: new Date().toISOString(),
            processingTime: 500
        };
        return {
            output,
            details: 'Async processing completed'
        };
    }
}

// ============================================
// Exportar ejemplos para usar en pruebas
// ============================================
module.exports = {
    ReverseFilter,
    ValidationStatsFilter,
    AsyncProcessFilter
};

// ============================================
// INSTRUCCIONES PARA USAR EN LA PRUEBA
// ============================================
/*

PASO 1: Importar los filtros
  const { ReverseFilter, ValidationStatsFilter } = require('./filters-examples');
  
PASO 2: Agregar a los filtros activos (en filter.js)
  Filter.addFilter(new ReverseFilter());
  Filter.addFilter(new ValidationStatsFilter());

PASO 3: Iniciar el servidor
  npm start
  
PASO 4: Iniciar el cliente (en otra terminal)
  npm run client

RESULTADO:
  Los resultados incluirán todos los filtros aplicados en sequence
  
*/
