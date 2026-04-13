const Filter = require('./filter');

/**
 * Pipeline: procesa datos a través de una serie de filtros
 */
class Pipeline {
    /**
     * Ejecuta el pipeline con los filtros definidos
     */
    static async execute(data) {
        const startTime = new Date();
        const results = {
            input: data,
            filters: [],
            status: 'SUCCESS',
            timestamp: startTime
        };

        try {
            // Aplicar filtros en secuencia
            let currentData = data;

            // Obtener filtros (serán definidos en clase durante la prueba)
            const filters = Filter.getActiveFilters();

            for (const filter of filters) {
                try {
                    const filterResult = await filter.apply(currentData);
                    results.filters.push({
                        name: filter.name,
                        status: 'APPLIED',
                        output: filterResult.output,
                        details: filterResult.details
                    });
                    currentData = filterResult.output;
                } catch (error) {
                    results.filters.push({
                        name: filter.name,
                        status: 'ERROR',
                        error: error.message
                    });
                    results.status = 'PARTIAL_ERROR';
                }
            }

            results.finalOutput = currentData;
            results.endTime = new Date();
            results.executionTime = results.endTime - startTime;

            return results;
        } catch (error) {
            results.status = 'ERROR';
            results.error = error.message;
            results.endTime = new Date();
            results.executionTime = results.endTime - startTime;
            return results;
        }
    }
}

module.exports = Pipeline;
