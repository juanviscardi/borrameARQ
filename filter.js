/**
 * Clase base para filtros
 */
class BaseFilter {
    constructor(name) {
        this.name = name;
    }

    async apply(data) {
        throw new Error('apply() must be implemented by subclass');
    }
}

/**
 * Filtro de ejemplo: convertir a mayúsculas
 */
class UpperCaseFilter extends BaseFilter {
    constructor() {
        super('UpperCaseFilter');
    }

    async apply(data) {
        const output = data.toUpperCase();
        return {
            output,
            details: `Converted to uppercase: ${output}`
        };
    }
}

/**
 * Filtro de ejemplo: obtener longitud
 */
class LengthFilter extends BaseFilter {
    constructor() {
        super('LengthFilter');
    }

    async apply(data) {
        const length = data.length;
        return {
            output: { data, length },
            details: `Length: ${length} characters`
        };
    }
}

/**
 * Filtro de ejemplo: contar palabras (si contiene espacios)
 */
class WordCountFilter extends BaseFilter {
    constructor() {
        super('WordCountFilter');
    }

    async apply(data) {
        const wordCount = typeof data === 'string'
            ? data.trim().split(/\s+/).length
            : 1;
        return {
            output: { data, wordCount },
            details: `Word count: ${wordCount}`
        };
    }
}

/**
 * Filtro de ejemplo: filtrar caracteres especiales
 */
class RemoveSpecialCharsFilter extends BaseFilter {
    constructor() {
        super('RemoveSpecialCharsFilter');
    }

    async apply(data) {
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        const output = dataStr.replace(/[^a-zA-Z0-9áéíóúñ\s]/g, '');
        return {
            output,
            details: `Special characters removed: ${output}`
        };
    }
}


/**
 * Filtro: cuenta la letra "a" (mayúsculas y minúsculas)
 */
class CountLetterAFilter extends BaseFilter {
    constructor() {
        super('CountLetterAFilter');
    }

    async apply(data) {
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        const count = (dataStr.match(/a/gi) || []).length;
        return {
            output: dataStr,
            details: `Letter "a" count: ${count}`,
            count: count
        };
    }
}

/**
 * Filtro: remueve la letra "o" (mayúsculas y minúsculas)
 */
class RemoveLetterOFilter extends BaseFilter {
    constructor() {
        super('RemoveLetterOFilter');
    }

    async apply(data) {
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        const output = dataStr.replace(/o/gi, '');
        return {
            output,
            details: `Letter "o" removed: ${output}`
        };
    }
}




/**
 * Manejador de filtros activos
 */
class Filter {
    // Filtros activos (modificar aquí durante la prueba)
    static activeFilters = [
        new UpperCaseFilter(),
        new LengthFilter(),
        new WordCountFilter(),
        // new CountLetterAFilter(),
        new RemoveLetterOFilter(),
    ];

    /**
     * Obtiene los filtros activos
     */
    static getActiveFilters() {
        return this.activeFilters;
    }

    /**
     * Agrega un nuevo filtro
     */
    static addFilter(filter) {
        this.activeFilters.push(filter);
    }

    /**
     * Limpia los filtros y reinicia con los por defecto
     */
    static resetFilters() {
        this.activeFilters = [
            new UpperCaseFilter(),
            new LengthFilter(),
            new WordCountFilter(),
            //new CountLetterAFilter(),
            new RemoveLetterOFilter(),

        ];
    }

    /**
     * Obtiene todos los filtros disponibles
     */
    static getAvailableFilters() {
        return [
            { name: 'UpperCaseFilter', class: UpperCaseFilter },
            { name: 'LengthFilter', class: LengthFilter },
            { name: 'WordCountFilter', class: WordCountFilter },
            { name: 'RemoveSpecialCharsFilter', class: RemoveSpecialCharsFilter },
            // { name: 'CountLetterAFilter', class: CountLetterAFilter },
            { name: 'RemoveLetterOFilter', class: RemoveLetterOFilter },

        ];
    }
}

module.exports = Filter;
