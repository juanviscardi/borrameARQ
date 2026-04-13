# RAT2 - Sistema de Generación de Datos y Pipeline de Procesamiento

## Descripción

Poner lo que piden

## Estructura del Proyecto

### Archivos Principales

- **server.js**: Web server Express
  - Endpoint POST `/api/process` - recibe datos y valida
  - Endpoint GET `/api/results` - obtiene resultados
  - Endpoint POST `/api/results/save` - guarda resultados en archivo

- **client.js**: Cliente que genera datos aleatorios
  - Genera palabras y datos de prueba (incluyendo casos inválidos)
  - Envía múltiples solicitudes al servidor
  - Obtiene y guarda resultados

- **pipeline.js**: Orquestador del pipeline
  - Ejecuta los filtros en secuencia
  - Registra resultados de cada filtro
  - Mide tiempo de ejecución

- **filter.js**: Definición de filtros
  - Clase base `BaseFilter`
  - Filtros de ejemplo: `UpperCaseFilter`, `LengthFilter`, `WordCountFilter`, `RemoveSpecialCharsFilter`
  - Manejador `Filter` para activar/desactivar filtros

- **validator.js**: Validador de datos
  - Valida longitud (min/max)
  - Valida que no esté vacío
  - Configurable durante la prueba

## Instalación

```bash
npm install
```

## Uso

### Opción 1: Ejecutar servidor y cliente por separado

Terminal 1 - Iniciar servidor:

```bash
npm start
```

Terminal 2 - Ejecutar cliente:

```bash
npm run client
```

### Opción 2: Ejecutar todo junto

```bash
npm test
```

## Flujo de Ejecución

1. **Cliente genera datos aleatorios**
   - Genera 10 datos de prueba
   - Algunos válidos, algunos inválidos (vacíos o muy largos)

2. **Cliente envía datos al servidor**
   - POST a `/api/process`

3. **Servidor valida los datos**
   - Si es inválido: responde 400 inmediatamente
   - Si es válido: responde 200 inmediatamente

4. **Servidor inicia Pipeline (asincronamente)**
   - Aplica filtros en secuencia
   - Registra resultados de cada filtro
   - Almacena resultado final

5. **Información de resultados**
   - Mostrada en consola
   - Guardada en archivo `results.json`

## Personalización para la Prueba

### Agregar nuevos filtros

1. Crear clase que extienda `BaseFilter` en [filter.js](filter.js):

```javascript
class CustomFilter extends BaseFilter {
  constructor() {
    super('CustomFilter');
  }

  async apply(data) {
    // Tu lógica aquí
    const output = /* procesamiento */;
    return {
      output,
      details: 'Descripción de lo hecho'
    };
  }
}
```

1. Agregar a los filtros activos en [filter.js](filter.js):

```javascript
static activeFilters = [
  new UpperCaseFilter(),
  new CustomFilter(),  // Tu nuevo filtro
  new LengthFilter()
];
```

### Modificar validaciones

Editar en [validator.js](validator.js):

```javascript
static config = {
  minLength: 1,
  maxLength: 500,    
  allowEmpty: false
};
```

### Cambiar configuración del servidor

Editar en [server.js](server.js):

- Puerto: modificar `PORT`
- Agregar nuevos endpoints
- Cambiar lógica de validación

## Resultados

Los resultados se guardan en `results.json` con estructura:

```json
{
  "input": "datos originales",
  "filters": [
    {
      "name": "NombreDelFiltro",
      "status": "APPLIED",
      "output": "resultado del filtro",
      "details": "descripción"
    }
  ],
  "finalOutput": "resultado final",
  "status": "SUCCESS",
  "executionTime": 123,
  "timestamp": "2026-04-09..."
}
```

## Códigos de Respuesta

- **200**: Datos válidos, procesamiento iniciado
- **400**: Datos inválidos (vacío, muy largo, etc.)
- **500**: Error en el servidor o pipeline

## Notas

- Los filtros son extensibles y pueden redefinirse durante la prueba
- El sistema es asincrónico: responde inmediatamente y procesa en background
- Los resultados se persisten automáticamente al hacer SIGINT (Ctrl+C)
