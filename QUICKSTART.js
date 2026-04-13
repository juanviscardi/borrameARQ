#!/usr/bin/env node

/**
 * GUÍA DE INICIO RÁPIDO - RAT2 Pipeline System
 * 
 * Este script demuestra cómo usar el sistema paso a paso
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║   RAT2 - Sistema de Generación de Datos y Pipeline             ║
║          Guía de Inicio Rápido                                 ║
╚════════════════════════════════════════════════════════════════╝
`);

console.log(`
📋 COMPONENTES DEL SISTEMA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SERVER (server.js)
   ├─ Escucha en puerto 3000
   ├─ Endpoint: POST /api/process
   ├─ Valida datos y responde 200/400
   └─ Procesa Pipeline asincronamente

2. CLIENT (client.js)
   ├─ Genera datos aleatorios
   ├─ Envía múltiples solicitudes
   ├─ Obtiene resultados
   └─ Guarda en archivo

3. PIPELINE (pipeline.js)
   ├─ Orquesta los filtros
   ├─ Ejecuta en secuencia
   └─ Registra resultados

4. FILTROS (filter.js)
   ├─ UpperCaseFilter (ejemplo)
   ├─ LengthFilter (ejemplo)
   ├─ WordCountFilter (ejemplo)
   └─ RemoveSpecialCharsFilter (ejemplo)

5. VALIDADOR (validator.js)
   ├─ Verifica no vacío
   ├─ Valida longitud (1-500 chars)
   └─ Retorna 400 si falla


🚀 PASOS PARA EJECUTAR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPCIÓN A - Ejecución separada (Recomendado para probar):
  
  Terminal 1:
    $ npm start
    ✓ Servidor iniciado en http://localhost:3000
  
  Terminal 2 (después que el servidor estea listo):
    $ npm run client
    ✓ Cliente genera datos y los envía
    ✓ Resultados mostrados en consola
    ✓ Archivo results.json creado

OPCIÓN B - Ejecución conjunta:
  
    $ npm test
    ✓ Inicia ambos procesos automáticamente


📊 FLUJO DE EVALUACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cliente                          Servidor                   Pipeline
  │                                │                           │
  ├─ Genera dato aleatorio ───────>│                           │
  │                                ├─ Valida                  │
  │                                │  ✓ Válido? → 200        │
  │<──────────────────────────────┤  ✗ Inválido? → 400       │
  │                                │                           │
  │                                ├─ Inicia Pipeline         │
  │                                │   (asincronamente)        │
  │                                │                           │
  │                                │  ┌─────────────────────┐  │
  │                                │  │ Filtro 1: UPPERCASE │  │
  │                                │  └──────────┬──────────┘  │
  │                                │             │              │
  │                                │  ┌──────────▼──────────┐  │
  │                                │  │ Filtro 2: LENGTH    │  │
  │                                │  └──────────┬──────────┘  │
  │                                │             │              │
  │                                │  ┌──────────▼──────────┐  │
  │                                │  │ Filtro 3: WORDCOUNT │  │
  │                                │  └─────────────────────┘  │
  │                                │                           │
  │                                ├─ Resultados guardados ◄───
  │                                │   en results.json         │


⚙️ PERSONALIZACIÓN PARA LA PRUEBA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AGREGAR NUEVOS FILTROS:
   
   a) Define en filter.js o filters-examples.js:
   
      class MiFiltro extends BaseFilter {
        constructor() {
          super('MiFiltro');
        }
        async apply(data) {
          const output = /* tu lógica */;
          return { output, details: '...' };
        }
      }
   
   b) Agrega a Filter.activeFilters en filter.js:
      
      static activeFilters = [
        new UpperCaseFilter(),
        new MiFiltro(),  // ← Aquí
        new LengthFilter()
      ];

2. MODIFICAR VALIDACIONES:
   
   En validator.js - Cambiar config:
   
      static config = {
        minLength: 1,
        maxLength: 500,  // ← Cambiar aquí
        allowEmpty: false
      };

3. CAMBIAR PUERTO O CONFIGURACIÓN:
   
   En server.js:
   
      const PORT = 3000;  // ← Cambiar aquí


📁 ARCHIVOS DE SALIDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  results.json          → Resultados de todas las ejecuciones
  (generado automáticamente después cada ejecución)


✅ VALIDACIÓN DE RESPUESTAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  200 OK - Datos válidos procesados
  400 Bad Request - Validación fallida:
    • Datos vacíos
    • Longitud < minLength
    • Longitud > maxLength
  500 Server Error - Error en pipeline


💡 EJEMPLO DE DATOS:

  VÁLIDOS:
    ✓ "palabra"
    ✓ "arquitectura"
    ✓ "RAT2prueba123"

  INVÁLIDOS (Retornan 400):
    ✗ "" (vacío)
    ✗ "a" repetida 1000 veces (muy largo)
    ✗ null
    ✗ undefined


🔗 ENDPOINTS DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  POST /api/process
    Request:  { "data": "palabra" }
    Response: { "message": "...", "data": "palabra" }
    Status:   200 (si válido) | 400 (si inválido)

  GET /api/results
    Response: { "totalExecutions": N, "results": [...] }
    Status:   200

  POST /api/results/save
    Response: { "message": "...", "file": "...", "count": N }
    Status:   200


🎓 NOTAS IMPORTANTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • El sistema responde inmediatamente (200/400)
  • El Pipeline se ejecuta asincronamente
  • Los resultados se guardan automáticamente
  • Puedes agregar filtros sin modificar el core
  • Cada filtro recibe la salida del anterior
  • Los errores no detienen el pipeline


📚 RECURSOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  README.md:           Documentación completa
  filter.js:           Definición de filtros
  filters-examples.js: Ejemplos de extensión
  validator.js:        Validaciones configurables
  pipeline.js:         Orquestación del procesamiento


¡Listo para usar! 🚀
═══════════════════════════════════════════════════════════════════
`);
