/**
 * Validador de datos triviales
 */
class Validator {
    // Configuración de validaciones
    static config = {
        minLength: 1,
        maxLength: 500,
        allowEmpty: false
    };

    /**
     * Valida un dato contra las reglas configuradas
     * @returns {Array} Array de errores (vacío si es válido)
     */
    static validate(data) {
        const errors = [];

        // Validar que no sea undefined o null
        if (data === undefined || data === null) {
            errors.push('Data cannot be null or undefined');
            return errors;
        }

        // Convertir a string si no lo es
        const dataStr = String(data);

        // Validar que no esté vacío
        if (!this.config.allowEmpty && dataStr.trim().length === 0) {
            errors.push('Data cannot be empty');
        }

        // Validar longitud mínima
        if (dataStr.length < this.config.minLength) {
            errors.push(`Data length must be at least ${this.config.minLength} characters`);
        }

        // Validar longitud máxima
        if (dataStr.length > this.config.maxLength) {
            errors.push(`Data length must not exceed ${this.config.maxLength} characters`);
        }

        return errors;
    }

    /**
     * Verifica si un dato es válido
     */
    static isValid(data) {
        return this.validate(data).length === 0;
    }

    /**
     * Actualiza la configuración de validación
     */
    static setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Obtiene la configuración actual
     */
    static getConfig() {
        return { ...this.config };
    }
}

module.exports = Validator;
