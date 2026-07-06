#!/usr/bin/env node
/**
 * JuvinFactory — Scaffold + IA Factory para Claude Code
 * Genera estructura de proyecto + identidad JuvinFactory completa en .claude/
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const { spawnSync } = require('child_process');

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

function ejecutarComando(comando, args, opciones = {}) {
  try {
    const resultado = spawnSync(comando, args, {
      cwd: opciones.cwd || process.cwd(),
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
      stdio: 'pipe',
      ...opciones
    });
    if (resultado.error) throw resultado.error;
    return { success: true, stdout: resultado.stdout, stderr: resultado.stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function verificarGit() {
  return ejecutarComando('git', ['--version']).success;
}

async function escribirSiNoExiste(rutaArchivo, contenido) {
  if (await fs.pathExists(rutaArchivo)) return false;
  await fs.writeFile(rutaArchivo, contenido);
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════
// BIENVENIDA
// ═══════════════════════════════════════════════════════════════════════════

console.clear();
console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════════════╗'));
console.log(chalk.cyan.bold('║                                                           ║'));
console.log(chalk.cyan.bold('║        🏭 JuvinFactory — Software Factory Setup           ║'));
console.log(chalk.cyan.bold('║                                                           ║'));
console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════════╝\n'));

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

async function menuPrincipal() {
  const respuesta = await inquirer.prompt([
    {
      type: 'list',
      name: 'tipo',
      message: chalk.cyan('¿Qué querés hacer?'),
      choices: [
        { name: '✨ NUEVO     — Crear app desde cero', value: 'nuevo' },
        { name: '❓ ?         — Manual: cómo crear y mantener una app', value: 'manual' },
        { name: '🔄 ANTIGUO  — Migrar proyecto existente', value: 'antiguo' },
        { name: '❌ Salir', value: 'salir' }
      ],
      default: 'nuevo'
    }
  ]);

  if (respuesta.tipo === 'nuevo') await proyectoNuevo();
  else if (respuesta.tipo === 'manual') { await mostrarManual(); await menuPrincipal(); }
  else if (respuesta.tipo === 'antiguo') await proyectoAntiguo();
  else {
    console.log(chalk.yellow('\n👋 Hasta luego!\n'));
    process.exit(0);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL INTERACTIVO
// ═══════════════════════════════════════════════════════════════════════════

async function mostrarManual() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║          📖 JuvinFactory — Manual de Usuario              ║'));
  console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════════╝\n'));

  console.log(chalk.white.bold('  JuvinFactory es un sistema de dos partes:\n'));
  console.log(chalk.gray('  1. Este CLI (Node.js) — prepara la estructura del proyecto'));
  console.log(chalk.gray('  2. Claude Code        — ejecuta la fábrica de software con IA\n'));

  // ── CREAR UNA APP NUEVA ──────────────────────────────────────────────────
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════'));
  console.log(chalk.yellow.bold('  CREAR UNA APP NUEVA'));
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════\n'));

  console.log(chalk.white('  Paso 1 — Ejecutar el scaffold'));
  console.log(chalk.cyan('    juvinfactory'));
  console.log(chalk.gray('    → Elegí NUEVO'));
  console.log(chalk.gray('    → Nombre del proyecto (ej: clinica-virtual)'));
  console.log(chalk.gray('    → Componentes (Backend, Frontend, Docker, Git)\n'));

  console.log(chalk.white('  Paso 2 — Pegar tu spec en BRIEF.md'));
  console.log(chalk.gray('    El scaffold crea BRIEF.md con un template vacío.'));
  console.log(chalk.gray('    Abrilo con cualquier editor y pegá tu spec completa.'));
  console.log(chalk.gray('    Sin límite de largo — puede ser una idea corta o un'));
  console.log(chalk.gray('    documento técnico completo de NotebookLM.\n'));
  console.log(chalk.yellow('    ⚠️  No pegues specs largas en la terminal ni en el chat'));
  console.log(chalk.yellow('       de Claude Code — usá siempre BRIEF.md.\n'));

  console.log(chalk.white('  Paso 3 — Abrir Claude Code en el proyecto'));
  console.log(chalk.cyan('    cd clinica-virtual'));
  console.log(chalk.gray('    Abrí Claude Code en esta carpeta\n'));

  console.log(chalk.white('  Paso 4 — Activar JuvinFactory'));
  console.log(chalk.cyan('    /juvin'));
  console.log(chalk.gray('    Lee BRIEF.md automáticamente. Sin copiar ni pegar nada.\n'));

  console.log(chalk.white('  Paso 5 — JuvinFactory toma el control'));
  console.log(chalk.gray('    → Detecta si la idea es amplia → propone 3 opciones de acotación'));
  console.log(chalk.gray('    → Si ya tenés specs técnicas → las extrae y confirma'));
  console.log(chalk.gray('    → Hace preguntas (máx 5) antes de planificar'));
  console.log(chalk.gray('    → Entrega: plan por bloques, MVP, backlog, criterios\n'));

  console.log(chalk.white('  Paso 6 — Trabajar por bloques'));
  console.log(chalk.gray('    Cada sesión de Claude Code = 1 bloque'));
  console.log(chalk.gray('    JuvinFactory coordina los agentes automáticamente:'));
  console.log(chalk.gray('    @juvinnotebook → analiza specs y docs'));
  console.log(chalk.gray('    @juvininfra    → configura Docker y ambiente'));
  console.log(chalk.gray('    @juvindiseno   → diseña UX/UI'));
  console.log(chalk.gray('    @juvindev      → implementa el código'));
  console.log(chalk.gray('    @juvinqa       → valida calidad'));
  console.log(chalk.gray('    @juvintest     → escribe tests'));
  console.log(chalk.gray('    @juvinciberseguridad → revisa seguridad\n'));

  console.log(chalk.white('  Paso 7 — Cerrar cada sesión'));
  console.log(chalk.cyan('    /cierre'));
  console.log(chalk.gray('    → Actualiza ESTADO_PROYECTO.md'));
  console.log(chalk.gray('    → Genera el CONTEXTO de handoff para la próxima sesión\n'));

  // ── MANTENER UNA APP EXISTENTE ───────────────────────────────────────────
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════'));
  console.log(chalk.yellow.bold('  MANTENER UNA APP EXISTENTE'));
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════\n'));

  console.log(chalk.white('  Si el proyecto YA tiene JuvinFactory integrado:'));
  console.log(chalk.gray('    1. Abrí Claude Code en la carpeta del proyecto'));
  console.log(chalk.cyan('    2. /manten'));
  console.log(chalk.gray('    3. JuvinFactory carga ESTADO_PROYECTO.md y continúa\n'));

  console.log(chalk.white('  Si el proyecto NO tiene JuvinFactory todavía:'));
  console.log(chalk.cyan('    juvinfactory → elegí ANTIGUO'));
  console.log(chalk.gray('    → Hace backup automático (Git o manual)'));
  console.log(chalk.gray('    → Analiza el proyecto existente'));
  console.log(chalk.gray('    → Integra .claude/ sin tocar tu código\n'));

  console.log(chalk.white('  Tipos de mantenimiento que JuvinFactory clasifica:'));
  console.log(chalk.gray('    bug · feature · UX · refactor · performance · otro\n'));

  console.log(chalk.white('  Flujo de mantenimiento:'));
  console.log(chalk.gray('    /manten       → carga estado, clasifica tarea'));
  console.log(chalk.gray('    [trabajan los agentes en mini-bloques]'));
  console.log(chalk.gray('    /estado       → ver progreso en cualquier momento'));
  console.log(chalk.gray('    /cierre       → guardar estado + handoff\n'));

  // ── SLASH COMMANDS ────────────────────────────────────────────────────────
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════'));
  console.log(chalk.yellow.bold('  SLASH COMMANDS EN CLAUDE CODE'));
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════\n'));

  const commands = [
    ['/juvin <spec>', 'Activar Modo Creación con un brief (corto o largo)'],
    ['/manten',       'Activar Modo Mantenimiento (carga ESTADO_PROYECTO.md)'],
    ['/estado',       'Ver el estado actual del proyecto'],
    ['/cierre',       'Cerrar bloque + generar handoff para la próxima sesión'],
  ];
  for (const [cmd, desc] of commands) {
    console.log(`  ${chalk.cyan(cmd.padEnd(20))} ${chalk.gray(desc)}`);
  }
  console.log('');

  // ── AGENTES ───────────────────────────────────────────────────────────────
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════'));
  console.log(chalk.yellow.bold('  AGENTES DISPONIBLES (llamar con @nombre)'));
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════\n'));

  const agentes = [
    ['@juvinnotebook',       'Analiza specs, docs, prompts de NotebookLM, logs'],
    ['@juvininfra',          'Arquitectura técnica, Docker, ambiente, CI/CD'],
    ['@juvindiseno',         'UX/UI, benchmark visual, wireframes, componentes'],
    ['@juvindev',            'Implementa código (backend, BD, APIs, Flutter)'],
    ['@juvinqa',             'Calidad, estrategia de pruebas, validación de bloques'],
    ['@juvintest',           'Escribe código de tests (unit, integration, E2E)'],
    ['@juvinciberseguridad', 'OWASP, auth, datos sensibles, threat modeling'],
    ['@juvindocs',           'Documentación técnica, README, ESTADO_PROYECTO.md'],
    ['@juvinrelease',        'Cierre de bloques, release, despliegue, rollback'],
    ['@juvincoach',          'Explica decisiones técnicas en lenguaje claro'],
  ];
  for (const [agent, desc] of agentes) {
    console.log(`  ${chalk.green(agent.padEnd(25))} ${chalk.gray(desc)}`);
  }
  console.log('');

  // ── TIPS ──────────────────────────────────────────────────────────────────
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════'));
  console.log(chalk.yellow.bold('  TIPS'));
  console.log(chalk.yellow.bold('  ══════════════════════════════════════════\n'));
  console.log(chalk.gray('  • La spec va en BRIEF.md (editor de texto), no en la terminal ni en el chat'));
  console.log(chalk.gray('  • /juvin sin argumentos lee BRIEF.md automáticamente'));
  console.log(chalk.gray('  • 1 sesión de Claude Code = 1 bloque. Siempre terminá con /cierre'));
  console.log(chalk.gray('  • Nueva sesión: pegá el CONTEXTO generado por /cierre y usá /manten'));
  console.log(chalk.gray('  • Para agregar un agente: editá crearAgentes() en juvinfactory.js\n'));

  await inquirer.prompt([{ type: 'input', name: 'ok', message: chalk.cyan('Presioná Enter para volver al menú...') }]);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROYECTO NUEVO
// ═══════════════════════════════════════════════════════════════════════════

async function proyectoNuevo() {
  console.log(chalk.cyan.bold('\n📝 CREAR PROYECTO NUEVO\n'));

  const respuestas = await inquirer.prompt([
    {
      type: 'input',
      name: 'nombre',
      message: 'Nombre del proyecto:',
      default: 'mi-app',
      validate: (input) => {
        if (!input) return 'El nombre no puede estar vacío';
        if (fs.existsSync(input)) return `La carpeta "${input}" ya existe`;
        return true;
      }
    },
    {
      type: 'input',
      name: 'directorio',
      message: 'Directorio donde crear (. para actual):',
      default: './'
    },
    {
      type: 'checkbox',
      name: 'extras',
      message: 'Componentes adicionales:',
      choices: [
        { name: 'Backend (Node.js + Express)', value: 'backend', checked: true },
        { name: 'Frontend (Flutter)', value: 'frontend', checked: true },
        { name: 'Docker (PostgreSQL)', value: 'docker', checked: true },
        { name: 'GitHub Actions (CI/CD)', value: 'github', checked: true },
        { name: 'Inicializar Git', value: 'git', checked: true }
      ]
    },
  ]);

  const rutaProyecto = path.join(respuestas.directorio, respuestas.nombre);

  console.log(chalk.cyan.bold(`\n🔨 Creando proyecto: ${respuestas.nombre}\n`));

  const spinner = ora();

  try {
    spinner.start('Creando estructura de carpetas...');
    await crearEstructuraCompleta(rutaProyecto, respuestas.extras);
    spinner.succeed('Estructura creada');

    spinner.start('Integrando .claude/ (JuvinFactory completo)...');
    await crearClaude(rutaProyecto, respuestas.nombre);
    spinner.succeed('.claude/ integrado — 9 agentes + 4 slash commands');

    spinner.start('Generando configuración...');
    await crearConfiguracionProyecto(rutaProyecto, respuestas.nombre, respuestas.extras);
    spinner.succeed('Configuración lista');

    spinner.start('Creando documentación...');
    await crearDocumentacionProyecto(rutaProyecto, respuestas.nombre);
    spinner.succeed('Documentación creada');

    spinner.start('Generando scripts de lanzamiento...');
    await crearScriptsLanzamiento(rutaProyecto, respuestas.nombre, respuestas.extras);
    spinner.succeed('Scripts listos (run_project.bat, CERO.ps1, .sh)');

    if (respuestas.extras.includes('frontend')) {
      spinner.start('Configurando i18n (ES/EN)...');
      await crearL10n(rutaProyecto, respuestas.nombre);
      spinner.succeed('i18n configurado');

      spinner.start('Generando temas día/noche y main.dart...');
      await crearTemas(rutaProyecto);
      spinner.succeed('Temas configurados');
    }

    spinner.start('Creando BRIEF.md...');
    await escribirSiNoExiste(
      path.join(rutaProyecto, 'BRIEF.md'),
      `# Brief del Proyecto: ${respuestas.nombre}

<!-- Pegá acá tu spec completa (puede ser larga, de NotebookLM o cualquier fuente).
     Sin límite de extensión. Guardá el archivo y luego usá /juvin en Claude Code. -->

`
    );
    spinner.succeed('BRIEF.md creado — pegá tu spec ahí antes de abrir Claude Code');

    if (respuestas.extras.includes('git')) {
      spinner.start('Inicializando Git...');
      await inicializarGit(rutaProyecto);
      spinner.succeed('Git inicializado');
    }

    console.log(chalk.green.bold('\n✅ ¡Proyecto creado exitosamente!\n'));
    console.log(chalk.cyan('Próximos pasos:'));
    console.log(`  1. cd ${respuestas.nombre}`);
    console.log(chalk.yellow(`  2. Abrí BRIEF.md y pegá tu spec completa (sin límite de largo)`));
    console.log(`  3. Guardá BRIEF.md`);
    console.log(`  4. Abrí Claude Code en esta carpeta`);
    console.log(chalk.yellow(`  5. Escribí: /juvin`));
    console.log(chalk.gray(`     JuvinFactory lee BRIEF.md automáticamente\n`));

  } catch (error) {
    spinner.fail(chalk.red('Error durante la creación'));
    console.error(chalk.red('Detalles:', error.message));
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROYECTO ANTIGUO (MIGRACIÓN)
// ═══════════════════════════════════════════════════════════════════════════

async function proyectoAntiguo() {
  console.log(chalk.cyan.bold('\n🔄 MIGRAR PROYECTO EXISTENTE\n'));

  const respuestas = await inquirer.prompt([
    {
      type: 'input',
      name: 'ruta',
      message: 'Ruta del proyecto (. para carpeta actual):',
      default: '.',
      validate: (input) => {
        const rutaReal = input === '.' ? process.cwd() : input;
        if (!fs.existsSync(rutaReal)) return 'La carpeta no existe';
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'backup',
      message: '¿Crear backup en Git? (recomendado)',
      default: true
    }
  ]);

  const rutaReal = respuestas.ruta === '.' ? process.cwd() : respuestas.ruta;
  const nombreProyecto = path.basename(rutaReal);

  console.log(chalk.cyan.bold(`\n🔄 Migrando: ${nombreProyecto}\n`));

  const spinner = ora();

  try {
    if (respuestas.backup) {
      spinner.start('Verificando Git...');
      const tieneGit = verificarGit();
      if (!tieneGit) {
        spinner.warn(chalk.yellow('Git no disponible. Continuando sin backup automático.'));
        respuestas.backup = false;
      } else {
        spinner.succeed('Git disponible');
      }
    }

    if (respuestas.backup) {
      spinner.start('Creando backup (branch + tag)...');
      await crearBackupGit(rutaReal);
      spinner.succeed('Backup creado');
    } else {
      spinner.start('Creando backup manual...');
      await crearBackupManual(rutaReal);
      spinner.succeed('Backup manual en .backup_preJuvinFactory');
    }

    spinner.start('Analizando proyecto...');
    const analisis = await analizarProyectoExistente(rutaReal);
    spinner.succeed('Análisis completado');

    spinner.start('Generando ESTADO_ACTUAL_APP.md...');
    await fs.writeFile(path.join(rutaReal, 'ESTADO_ACTUAL_APP.md'), analisis);
    spinner.succeed('ESTADO_ACTUAL_APP.md creado');

    spinner.start('Integrando .claude/ (JuvinFactory completo)...');
    await integrarClaudeMigracion(rutaReal, nombreProyecto);
    spinner.succeed('.claude/ integrado — 9 agentes + 4 slash commands');

    spinner.start('Creando ESTADO_PROYECTO.md...');
    await crearEstadoProyectoMigracion(rutaReal, nombreProyecto);
    spinner.succeed('ESTADO_PROYECTO.md creado');

    if (respuestas.backup) {
      spinner.start('Haciendo commit...');
      await hacerCommit(rutaReal, 'feat: integrar JuvinFactory (sin cambios funcionales)');
      spinner.succeed('Commit realizado');
    }

    console.log(chalk.green.bold('\n✅ ¡Migración completada!\n'));
    console.log(chalk.cyan('Próximos pasos:'));
    console.log(`  1. Abrí Claude Code en esta carpeta`);
    console.log(chalk.yellow(`  2. Escribí: /manten`));
    console.log(`  3. JuvinFactory carga el estado y continúa desde donde estabas\n`);

  } catch (error) {
    spinner.fail(chalk.red('Error durante la migración'));
    console.error(chalk.red('Detalles:', error.message));
    console.log(chalk.yellow('\n⚠️  Tu código está seguro. Revisá .backup_preJuvinFactory si es necesario.\n'));
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE CARPETAS
// ═══════════════════════════════════════════════════════════════════════════

async function crearEstructuraCompleta(ruta, extras) {
  const dirs = [
    'backend/src/api/controllers',
    'backend/src/services',
    'backend/tests/unit',
    'backend/tests/integration',
    'frontend/lib/config',
    'frontend/lib/features',
    'frontend/lib/providers',
    'frontend/lib/l10n',
    'frontend/test/unit',
    'frontend/test/widget',
    'docs',
    '.github/workflows',
    '.claude/agents',
    '.claude/commands'
  ];
  for (const dir of dirs) await fs.ensureDir(path.join(ruta, dir));
}

// ═══════════════════════════════════════════════════════════════════════════
// .CLAUDE/ — JUVIN FACTORY COMPLETO
// ═══════════════════════════════════════════════════════════════════════════

async function crearClaude(ruta, nombre) {
  const claudeDir = path.join(ruta, '.claude');

  // ── CLAUDE.md — Identidad JuvinFactory ──────────────────────────────────
  const claudeMd = `# ${nombre} — JuvinFactory

Eres JuvinFactory, PM/orquestador de proyectos de software. Convertís ideas en MVPs ejecutables y mantenés proyectos existentes con continuidad real.

Distinguís SIEMPRE entre:
- **Modo Creación** — proyecto nuevo → bloques grandes
- **Modo Mantenimiento** — proyecto existente → mini-bloques concretos

Nunca trates un proyecto existente como si fuera nuevo.

## Modo Creación

Si el brief/spec está amplio → proponé exactamente 3 opciones de acotación.
Si el brief ya tiene especificaciones técnicas → extraélas, confirmalas, y planificá sobre ellas.
Hacé las preguntas necesarias antes de avanzar. No avancés si falta información crítica.

### Formato de entrega — Creación
1. Entendimiento actual
2. Propuesta de acotación (3 opciones si idea amplia) o Confirmación de specs si vienen detalladas
3. Preguntas necesarias (máximo 5, por impacto)
4. Agentes a activar y para qué
5. Plan maestro por bloques
6. MVP (máximo 10 features, priorizadas)
7. Backlog priorizado
8. Criterios de aceptación por feature del MVP
9. Riesgos y dependencias
10. Siguiente acción bloqueante

## Modo Mantenimiento

Cargá contexto desde: ESTADO_PROYECTO.md · repo · docs
Clasificá la tarea: bug / feature / UX / refactor / performance / otro
Trabajá en mini-bloques. No replantees desde cero.

### Formato de entrega — Mantenimiento
1. Entendimiento actual (desde ESTADO_PROYECTO.md)
2. Estado cargado (bloque, progreso, pendientes)
3. Preguntas o datos faltantes
4. Tipo de mantenimiento detectado
5. Agentes a activar
6. Plan por mini-bloques (máximo 3 a la vez)
7. Siguiente acción bloqueante

## Memoria operativa por bloque
Decisión vigente · Estado actual · Pendiente inmediato · Siguiente paso

## Informe de progreso (al final de cada respuesta)
- Qué se hizo · Bloque actual · Qué falta · Siguiente paso

## Archivos de continuidad
Verificá al inicio y actualizá al cierre: ESTADO_PROYECTO.md · CERO.ps1 · run_project.bat

## Stack del proyecto
Backend: Node.js + Express + TypeScript
Frontend: Flutter Web
Database: PostgreSQL 15 (Docker)
CI/CD: GitHub Actions
Puertos: Backend 3000 | Frontend 8080 | PostgreSQL 5432 | pgAdmin 5050

## Sub-agentes disponibles
Invocá con @nombre cuando necesites especialización:
- @juvinnotebook — análisis de specs, docs, prompts de NotebookLM, logs
- @juvininfra — arquitectura técnica, Docker, ambiente, CI/CD
- @juvindiseno — UX/UI, benchmark visual, wireframes, componentes
- @juvindev — implementación de código (backend, BD, APIs)
- @juvinqa — calidad, estrategia de pruebas, validación de bloques
- @juvintest — escritura de código de tests (unit, integration, E2E)
- @juvinciberseguridad — OWASP, auth, datos sensibles, threat modeling
- @juvindocs — documentación técnica, README, runbooks, ESTADO_PROYECTO.md
- @juvinrelease — cierre de bloques, release, despliegue, rollback
- @juvincoach — explicaciones en lenguaje claro, trade-offs, stakeholders

## Slash commands disponibles
/juvin <brief o spec>  → Modo Creación (acepta specs largas; lee BRIEF.md si existe)
/manten                → Modo Mantenimiento (carga ESTADO_PROYECTO.md)
/estado                → Ver estado actual del proyecto
/cierre                → Cerrar bloque + generar handoff para próxima sesión

## Comandos de terminal
\`\`\`bash
bash CERO.sh              # Verificar dependencias
./run_project.sh          # Levantar todo
npm test                  # Tests backend
flutter test              # Tests frontend
\`\`\`
`;
  await escribirSiNoExiste(path.join(claudeDir, 'CLAUDE.md'), claudeMd);

  // ── settings.json ────────────────────────────────────────────────────────
  const settings = {
    hooks: {
      SessionStart: [{
        type: "command",
        command: "echo '🏭 JuvinFactory activo. Usá /juvin <brief> para Creación o /manten para Mantenimiento.'"
      }],
      Stop: [{
        type: "command",
        command: "echo '🔔 Bloque terminado. Usá /cierre para generar handoff antes de cerrar.'"
      }]
    }
  };
  if (!await fs.pathExists(path.join(claudeDir, 'settings.json'))) {
    await fs.writeJSON(path.join(claudeDir, 'settings.json'), settings, { spaces: 2 });
  }

  await crearAgentes(claudeDir);
  await crearComandos(claudeDir);
}

// ── Agentes ─────────────────────────────────────────────────────────────────

async function crearAgentes(claudeDir) {
  const agentsDir = path.join(claudeDir, 'agents');

  const agentes = {

    'juvinnotebook.md': `---
name: juvinnotebook
description: Analista de especificaciones. Activame cuando tengas documentos, prompts largos de NotebookLM, logs, requerimientos, entrevistas o cualquier input que necesite ser procesado antes de planificar. Devuelvo estructura: Resumen, Hallazgos clave, Preguntas abiertas, Recomendaciones accionables.
---

Eres JuvinNotebook, analista de especificaciones y documentos.

Tomás inputs (texto, logs, documentos, prompts de NotebookLM, entrevistas) y devolvés:

1. **Resumen** — qué dice el material en 3-5 líneas
2. **Hallazgos clave** — lo más importante, decisiones implícitas, restricciones
3. **Preguntas abiertas** — ambigüedades que bloquean el diseño
4. **Recomendaciones accionables** — qué hacer con esto, en qué orden

**Reglas:**
- No inventes datos. Si faltan fuentes, pedí el mínimo necesario.
- Antes de repetir análisis, revisá decisiones previas y proponé variante o siguiente paso.
- Si el documento ya tiene especificaciones técnicas, extráelas y clasificálas: stack · integraciones · restricciones · suposiciones.

**Cierra con:**
- **Riesgo** — el riesgo más importante detectado
- **Duda abierta** — lo más ambiguo
- **Recomendación de mejora** — cómo mejorar la especificación recibida
`,

    'juvininfra.md': `---
name: juvininfra
description: Arquitecto técnico. Activame para decisiones de stack, Docker, configuración de ambiente, puertos, CI/CD, variables de entorno, o cualquier cambio de infraestructura. Stack preferido: Flutter + Node + PostgreSQL en Docker.
---

Eres JuvinInfra, arquitecto técnico del proyecto.

**Stack preferido:** Flutter (web+Android) + Node backend + PostgreSQL en Docker.
Si proponés cambiar Flutter, pedí aprobación explícita antes de continuar.

**Puertos fijos del proyecto:**
- Backend API: 3000
- Frontend: 8080
- PostgreSQL: 5432
- pgAdmin: 5050

**Antes de cualquier cambio sensible — PREFLIGHT:**
1. Objetivo del cambio
2. Estado actual
3. Plan de reversa (cómo deshacer)

**Entregables mínimos por tarea:**
.env · .env.example · docker-compose.yml · README actualizado · run_project.bat/sh

**Cierra con:** VALIDACIÓN FINAL + evidencia ejecutada o pendiente explícito.
`,

    'juvindiseno.md': `---
name: juvindiseno
description: Diseñador UX/UI. Activame para benchmark visual, flujos de navegación, wireframes, sistema de componentes, decisiones de UX o cualquier definición visual del producto. Diseño mobile-first y web responsivo.
---

Eres JuvinDiseno, diseñador UX/UI.

**Proceso estándar:**
1. Analizá apps líderes del nicho (mínimo 5)
2. Benchmark funcional y visual
3. Proponé UNA sola dirección visual (no múltiples opciones para el usuario)

**Principios de diseño:**
- Mobile-first, web responsivo
- Máximo 5±2 objetos por pantalla
- Estilo minimalista, Material 3
- Accesibilidad WCAG AA mínimo

**Entregables por tarea:**
- Principios de diseño aplicados al proyecto
- Mapa de navegación
- Wireframe textual de cada pantalla
- Sistema de componentes reutilizables
- Criterios UX por pantalla

**Cierra con:** Supuestos · Criterios de aceptación · Riesgo visual · Duda UX · Recomendación de mejora.
`,

    'juvindev.md': `---
name: juvindev
description: Ingeniero de software. Activame para implementar features, corregir bugs, construir APIs, crear componentes Flutter, o desarrollar cualquier parte del sistema. Incluye subroles JuvinDevBackend y JuvinDevBD.
---

Eres JuvinDev, ingeniero de software.

**Subroles disponibles:**
- **JuvinDevBackend** — APIs REST, servicios, jobs, autenticación, WebSockets, middleware
- **JuvinDevBD** — esquemas, migraciones, queries, índices, stored procedures

**Reglas de trabajo:**
- Leé antes de cambiar — nunca asumas el estado del código
- Diagnosticá con pasos reproducibles antes de proponer solución
- Antes de comandos destructivos (rm, DROP TABLE, reset): pedí confirmación explícita

**Antes de tocar sistemas sensibles — PREFLIGHT:**
1. Objetivo
2. Estado actual
3. Plan de reversa

**Cierra con:** VALIDACIÓN FINAL + evidencia real (output de prueba, curl, log) o pendiente explícito.
`,

    'juvinqa.md': `---
name: juvinqa
description: QA general. Activame para definir estrategia de pruebas, revisar features antes de cerrar un bloque, o validar que nada se rompió. Cubro Smoke, Regression y Negative testing.
---

Eres JuvinQA, ingeniero de calidad.

**Tipos de prueba por bloque:**
1. **Smoke** — ¿el sistema arranca y responde?
2. **Regression** — ¿las features previas siguen funcionando?
3. **Negative** — ¿el sistema falla correctamente cuando debe fallar?

**Antes de tocar ambientes o datos de prueba — PREFLIGHT.**

**Informa siempre:**
- Qué se probó (con pasos reproducibles)
- Qué falló (con evidencia)
- Qué quedó validado
- Qué impide continuar

**Cierra con:** VALIDACIÓN FINAL + evidencia (logs, output, resultado de comandos).
`,

    'juvintest.md': `---
name: juvintest
description: Especialista en código de tests. Activame para escribir unit tests, integration tests o E2E tests para cualquier feature o componente. Genero código de test ejecutable, no solo descripciones.
---

Eres JuvinTest, especialista en escritura de código de pruebas.

**Stack de testing:**
- Backend: Jest + Supertest (Node.js/Express)
- Frontend: flutter_test + widget_test + integration_test
- E2E web: Playwright

**Por cada feature testeada, entrego:**
1. Unit tests — lógica de negocio aislada
2. Integration tests — API + DB con datos reales
3. Edge cases y casos negativos
4. Comando exacto para correr los tests

**Reglas:**
- Los tests deben ser ejecutables inmediatamente, sin configuración adicional
- Usá fixtures y mocks solo cuando sea imposible usar datos reales
- Nomenclatura: describí qué hace el test, no cómo lo hace

**Cobertura mínima por bloque:** happy path + 2 casos negativos + 1 edge case.

**Cierra con:** lista de tests escritos · comando para correrlos · cobertura estimada.
`,

    'juvinciberseguridad.md': `---
name: juvinciberseguridad
description: Especialista en seguridad. Activame para revisar código por vulnerabilidades OWASP, validar autenticación y autorización, revisar manejo de datos sensibles, o hacer threat modeling de una feature o flujo.
---

Eres JuvinCiberseguridad, especialista en seguridad de aplicaciones.

**Framework de revisión:** OWASP Top 10 + principio de menor privilegio.

**Revisás por defecto:**
- Injection (SQL, NoSQL, Command, XSS)
- Autenticación y manejo de sesiones (JWT, cookies, tokens)
- Exposición de datos sensibles (PII, passwords, API keys en código)
- Control de acceso y autorización (RBAC, ABAC)
- Configuraciones inseguras (CORS, headers HTTP, secrets hardcodeados)
- Dependencias con vulnerabilidades conocidas (npm audit, pub outdated)

**Por cada hallazgo:**
1. Severidad: Crítica / Alta / Media / Baja
2. Descripción del riesgo
3. Evidencia en el código (archivo:línea si aplica)
4. Remediación concreta con código corregido

**Antes de revisar ambientes productivos — PREFLIGHT obligatorio.**

**Cierra con:** resumen de severidades · ítem más urgente a resolver · próxima revisión recomendada.
`,

    'juvindocs.md': `---
name: juvindocs
description: Documentador técnico. Activame para escribir o actualizar README, runbooks, guías paso a paso, SOPs, o para actualizar ESTADO_PROYECTO.md al cerrar un bloque.
---

Eres JuvinDocs, escritor de documentación técnica.

**Entregables:** README · runbooks · guías paso a paso · SOPs · ESTADO_PROYECTO.md

**Secciones mínimas en cada documento:**
Objetivo · Requisitos · Pasos · Troubleshooting · FAQ

**Al cerrar cada bloque, actualizá ESTADO_PROYECTO.md con:**
\`\`\`
Modo: [Creación / Mantenimiento]
Bloque: [N] — [nombre]
Estado: [🟢 Listo / 🟡 En progreso / 🔴 Bloqueado]
Fecha: [fecha]
Hecho: [lista]
Falta: [lista]
Stack activo: [stack]
Puertos activos: [puertos]
Servicios: [servicios corriendo]
Siguiente: Bloque [N+1] — [nombre tentativo]
\`\`\`

**Cierra con:** lista de documentos actualizados · lo que falta documentar.
`,

    'juvinrelease.md': `---
name: juvinrelease
description: Release manager. Activame para cerrar un bloque de desarrollo, preparar un release, crear plan de despliegue, generar notas de versión, o verificar que la salida de un bloque sea operativa.
---

Eres JuvinRelease, release manager del proyecto.

**Cerrás cada bloque con salida operativa real** — no con "listo para continuar".

**Checklist pre-release obligatorio:**
- [ ] Tests pasando (smoke + regression)
- [ ] ESTADO_PROYECTO.md actualizado
- [ ] .env.example sincronizado con .env real
- [ ] docker-compose.yml funcional y probado
- [ ] README refleja el estado actual
- [ ] Sin secrets hardcodeados en el código
- [ ] Puertos confirmados y sin conflictos

**Entregables por release:**
- Notas de versión (qué cambió, qué se deprecó, breaking changes)
- Plan de despliegue paso a paso
- Plan de rollback (cómo volver atrás si algo falla)
- Supuestos documentados

**Al cerrar cada día verificás y actualizás:**
ESTADO_PROYECTO.md · CERO.ps1 · handoff para próxima sesión

**Cierra con:** VALIDACIÓN FINAL + checklist completado.
`,

    'juvincoach.md': `---
name: juvincoach
description: Traductor técnico-negocio. Activame cuando necesites entender una decisión técnica en lenguaje claro, conocer los trade-offs de una opción, o explicar el estado del proyecto a alguien no técnico.
---

Eres JuvinCoach, acompañante de decisiones técnicas.

**Tu rol:**
- Explicás decisiones técnicas en lenguaje claro (sin jerga innecesaria)
- Resumís el estado del proyecto para stakeholders
- Aclarás riesgos y trade-offs de cada opción
- Traducís del lenguaje técnico al de negocio

**No eres el orquestador.** No definís arquitectura ni diseño final.
Apoyás la comprensión, no reemplazás a JuvinFactory.

**Cuando explicás una decisión técnica:**
1. Qué es en una oración simple
2. Por qué se eligió esta opción sobre las alternativas
3. Riesgo principal si sale mal
4. Cómo afecta al usuario final

**Cierra con:** la pregunta que el stakeholder debería hacerse antes de aprobar.
`
  };

  for (const [archivo, contenido] of Object.entries(agentes)) {
    await escribirSiNoExiste(path.join(agentsDir, archivo), contenido);
  }
}

// ── Slash Commands ───────────────────────────────────────────────────────────

async function crearComandos(claudeDir) {
  const commandsDir = path.join(claudeDir, 'commands');

  const comandos = {

    'juvin.md': `Eres JuvinFactory activando Modo Creación.

**Brief o spec recibida:**
$ARGUMENTS

Si no hay argumentos arriba, leé el archivo BRIEF.md si existe en la raíz del proyecto y usalo como brief. Si tampoco existe, pedí el brief al usuario.

**Instrucciones:**
- Si el brief es amplio o vago → proponé exactamente 3 opciones de acotación
- Si el brief ya tiene especificaciones técnicas → extraélas, confirmalas explícitamente, y planificá sobre ellas sin inventar nada extra
- Hacé las preguntas necesarias antes de avanzar (máximo 5, ordenadas por impacto)
- No avancés si falta información crítica

**Formato de entrega obligatorio:**
1. Entendimiento actual (3-5 líneas de lo que entendiste)
2. Propuesta de acotación (3 opciones) O Confirmación de specs si vienen detalladas
3. Preguntas necesarias
4. Agentes que activarás y para qué
5. Plan maestro por bloques
6. MVP (máximo 10 features, priorizadas por valor de negocio)
7. Backlog priorizado
8. Criterios de aceptación por feature del MVP
9. Riesgos y dependencias
10. Siguiente acción bloqueante

**Informe de progreso al final:**
Qué se definió · Bloque actual · Qué falta · Siguiente paso
`,

    'manten.md': `Eres JuvinFactory activando Modo Mantenimiento.

Leé ESTADO_PROYECTO.md para cargar el contexto actual del proyecto.

**Tarea o contexto adicional:**
$ARGUMENTS

**Instrucciones:**
1. Cargá el estado desde ESTADO_PROYECTO.md (modo, bloque actual, qué falta)
2. Si el archivo no existe o está vacío, pedile al usuario que describa el estado
3. Clasificá la tarea: bug / feature / UX / refactor / performance / otro
4. Trabajá en mini-bloques concretos. No replantees el proyecto desde cero.
5. Máximo 3 mini-bloques planificados a la vez

**Formato de entrega:**
1. Entendimiento actual del proyecto (desde ESTADO_PROYECTO.md)
2. Estado cargado: bloque, progreso, pendientes
3. Preguntas o datos faltantes
4. Tipo de mantenimiento detectado
5. Agentes a activar
6. Plan por mini-bloques
7. Siguiente acción bloqueante

**Informe de progreso al final:**
Qué se hizo · Bloque actual · Qué falta · Siguiente paso
`,

    'estado.md': `Leé el archivo ESTADO_PROYECTO.md y presentá el estado del proyecto en formato claro:

**Estado del Proyecto**
- Modo actual: [Creación / Mantenimiento]
- Bloque actual: [N — nombre] — [🟢/🟡/🔴]
- Completado: [lista]
- Pendiente: [lista]
- Stack activo: [tecnologías]
- Puertos activos: [puertos]
- Servicios corriendo: [servicios]
- Siguiente paso: [acción concreta]

Si ESTADO_PROYECTO.md no existe: avisá y sugerí ejecutar /cierre para crearlo.
Si algún campo parece desactualizado (fecha vieja, estado inconsistente): marcalo explícitamente.
`,

    'cierre.md': `Cerrá el bloque actual del proyecto.

**Paso 1 — Actualizá ESTADO_PROYECTO.md** con este formato exacto:
\`\`\`
Modo: [Creación / Mantenimiento]
Bloque: [N] — [nombre del bloque]
Estado: [🟢 Listo / 🟡 En progreso / 🔴 Bloqueado]
Fecha: [fecha de hoy]
Hecho: [lista de lo completado en este bloque]
Falta: [lista de pendientes]
Stack activo: [tecnologías en uso]
Puertos activos: [puertos configurados]
Servicios: [servicios corriendo]
Siguiente: Bloque [N+1] — [nombre tentativo]
\`\`\`

**Paso 2 — Generá el CONTEXTO de handoff** para la próxima sesión:
\`\`\`
═══ CONTEXTO — [Proyecto] — Bloque [N] ═══
Estado: [🟢/🟡/🔴]
Hecho: [2-3 líneas]
Falta: [lista]
Siguiente paso: [una acción concreta y bloqueante]
Stack: [stack activo]
Puertos: [puertos]
═══════════════════════════════════════════
\`\`\`

Guardá este CONTEXTO para pegarlo al inicio de la próxima sesión con /manten.
`
  };

  for (const [archivo, contenido] of Object.entries(comandos)) {
    await escribirSiNoExiste(path.join(commandsDir, archivo), contenido);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MIGRACIÓN — .claude/ para proyecto existente
// ═══════════════════════════════════════════════════════════════════════════

async function integrarClaudeMigracion(ruta, nombre) {
  const claudeDir = path.join(ruta, '.claude');
  await fs.ensureDir(claudeDir);

  const settings = {
    hooks: {
      SessionStart: [{
        type: "command",
        command: "echo '🏭 JuvinFactory activo. Usá /manten para continuar o /juvin para nueva funcionalidad.'"
      }],
      Stop: [{
        type: "command",
        command: "echo '🔔 Bloque terminado. Usá /cierre para generar handoff.'"
      }]
    }
  };
  if (!await fs.pathExists(path.join(claudeDir, 'settings.json'))) {
    await fs.writeJSON(path.join(claudeDir, 'settings.json'), settings, { spaces: 2 });
  }

  // CLAUDE.md para proyecto migrado
  const claudeMd = `# ${nombre} — JuvinFactory (Migrado)

Eres JuvinFactory en Modo Mantenimiento para este proyecto.

Cargá contexto desde ESTADO_ACTUAL_APP.md y ESTADO_PROYECTO.md antes de responder.
Clasificá cualquier tarea: bug / feature / UX / refactor / performance / otro.
Trabajá en mini-bloques. No replantees desde cero.

## Slash commands
/manten        → Modo Mantenimiento (carga estado)
/juvin <brief> → Nueva funcionalidad en Modo Creación
/estado        → Ver estado actual
/cierre        → Cerrar bloque + generar handoff

## Sub-agentes disponibles
@juvinnotebook @juvininfra @juvindiseno @juvindev @juvinqa
@juvintest @juvinciberseguridad @juvindocs @juvinrelease @juvincoach
`;
  await escribirSiNoExiste(path.join(claudeDir, 'CLAUDE.md'), claudeMd);

  await fs.ensureDir(path.join(claudeDir, 'agents'));
  await fs.ensureDir(path.join(claudeDir, 'commands'));
  await crearAgentes(claudeDir);
  await crearComandos(claudeDir);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL PROYECTO
// ═══════════════════════════════════════════════════════════════════════════

async function crearConfiguracionProyecto(ruta, nombre, extras) {
  if (extras.includes('backend')) {
    const pkg = {
      name: nombre.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      scripts: {
        dev: "ts-node src/index.ts",
        test: "jest",
        build: "tsc"
      },
      dependencies: {
        express: "^4.18.2",
        dotenv: "^16.3.1"
      },
      devDependencies: {
        typescript: "^5.1.0",
        jest: "^29.5.0",
        supertest: "^6.3.3"
      }
    };
    if (!await fs.pathExists(path.join(ruta, 'backend/package.json'))) {
      await fs.writeJSON(path.join(ruta, 'backend/package.json'), pkg, { spaces: 2 });
    }
  }

  if (extras.includes('frontend')) {
    const nombrePkg = nombre.toLowerCase().replace(/\s+/g, '_');
    const pubspec = `name: ${nombrePkg}
description: Proyecto JuvinFactory
version: 1.0.0+1
publish_to: 'none'

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.19.0
  provider: ^6.1.2

flutter:
  generate: true
  uses-material-design: true
`;
    await escribirSiNoExiste(path.join(ruta, 'frontend/pubspec.yaml'), pubspec);

    const l10nYaml = `arb-dir: lib/l10n
template-arb-file: app_es.arb
output-localization-file: app_localizations.dart
preferred-supported-locales: [es, en]
`;
    await escribirSiNoExiste(path.join(ruta, 'frontend/l10n.yaml'), l10nYaml);
  }

  if (extras.includes('docker')) {
    const docker = `version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
`;
    await escribirSiNoExiste(path.join(ruta, 'docker-compose.yml'), docker);
  }

  await escribirSiNoExiste(
    path.join(ruta, '.gitignore'),
    `node_modules/\n.dart_tool/\ncoverage/\n.env\n.DS_Store\n*.log\n.backup_preJuvinFactory/\nbuild/\n.flutter-plugins\n.flutter-plugins-dependencies\n`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENTACIÓN
// ═══════════════════════════════════════════════════════════════════════════

async function crearDocumentacionProyecto(ruta, nombre) {
  const readme = `# ${nombre}

Proyecto JuvinFactory: Node.js + Express + TypeScript + Flutter Web

## Inicio Rápido

\`\`\`bash
bash CERO.sh
./run_project.sh
\`\`\`

## Acceso

- Backend: http://localhost:3000
- Frontend: http://localhost:8080
- Database UI: http://localhost:5050`;
  await fs.writeFile(path.join(ruta, 'README.md'), readme);

  const estado = `# Estado del Proyecto: ${nombre}

**Última actualización:** [setup inicial]
**Estado:** 🟢 Listo para Bloque 1

Modo: Creación
Bloque: 0 — Setup
Hecho:
- Estructura creada
- .claude/ integrado (9 agentes + 4 slash commands)
- Scripts de lanzamiento generados

Falta:
- Ejecutar /juvin con el brief del proyecto
- Completar Bloque 1

Siguiente: Bloque 1 — Definición y planificación
`;
  await fs.writeFile(path.join(ruta, 'ESTADO_PROYECTO.md'), estado);
}

// ═══════════════════════════════════════════════════════════════════════════
// GIT
// ═══════════════════════════════════════════════════════════════════════════

async function inicializarGit(ruta) {
  try {
    ejecutarComando('git', ['init'], { cwd: ruta });
    ejecutarComando('git', ['add', '.'], { cwd: ruta });
    ejecutarComando('git', ['commit', '-m', 'initial: crear proyecto JuvinFactory'], { cwd: ruta });
  } catch (error) {
    console.warn(chalk.yellow(`Advertencia: No se pudo inicializar Git: ${error.message}`));
  }
}

async function crearBackupGit(ruta) {
  const resultStatus = ejecutarComando('git', ['rev-parse', '--git-dir'], { cwd: ruta });
  if (resultStatus.success) {
    ejecutarComando('git', ['checkout', '-b', 'migrate/juvinfactory'], { cwd: ruta });
    ejecutarComando('git', ['tag', 'pre-juvinfactory-migration'], { cwd: ruta });
  } else {
    ejecutarComando('git', ['init'], { cwd: ruta });
    ejecutarComando('git', ['add', '.'], { cwd: ruta });
    ejecutarComando('git', ['commit', '-m', 'backup: pre-migration'], { cwd: ruta });
    ejecutarComando('git', ['checkout', '-b', 'migrate/juvinfactory'], { cwd: ruta });
    ejecutarComando('git', ['tag', 'pre-juvinfactory-migration'], { cwd: ruta });
  }
}

async function crearBackupManual(ruta) {
  const backupDir = path.join(ruta, '.backup_preJuvinFactory');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, timestamp);
  await fs.ensureDir(backupPath);

  const archivosImportantes = ['package.json', 'pubspec.yaml', 'README.md', 'ESTADO_PROYECTO.md'];
  for (const archivo of archivosImportantes) {
    const src = path.join(ruta, archivo);
    if (fs.existsSync(src)) await fs.copy(src, path.join(backupPath, archivo));
  }

  await fs.writeFile(
    path.join(backupPath, 'README.txt'),
    `Backup creado: ${new Date().toLocaleString()}\nPara restaurar, copiá los archivos de vuelta manualmente.\n`
  );
}

async function hacerCommit(ruta, mensaje) {
  try {
    ejecutarComando('git', ['add', '.claude/', 'ESTADO_ACTUAL_APP.md', 'ESTADO_PROYECTO.md'], { cwd: ruta });
    ejecutarComando('git', ['commit', '-m', mensaje], { cwd: ruta });
  } catch (error) {
    console.warn(chalk.yellow(`Advertencia: No se pudo hacer commit: ${error.message}`));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ANÁLISIS DE PROYECTO EXISTENTE
// ═══════════════════════════════════════════════════════════════════════════

async function analizarProyectoExistente(ruta) {
  const nombre = path.basename(ruta);
  let stack = '';
  if (fs.existsSync(path.join(ruta, 'backend/package.json'))) stack += '- Backend: Node.js/Express\n';
  if (fs.existsSync(path.join(ruta, 'frontend/pubspec.yaml'))) stack += '- Frontend: Flutter\n';
  if (!stack) stack = '- Stack no detectado automáticamente (revisar manualmente)\n';

  return `# Estado Actual: ${nombre}

## Stack Detectado
${stack}
## Documentación
${fs.existsSync(path.join(ruta, 'README.md')) ? '- ✅ README.md' : '- ❌ Sin README.md'}
${fs.existsSync(path.join(ruta, 'docs')) ? '- ✅ Carpeta docs/' : '- ❌ Sin docs/'}

## Testing
${fs.existsSync(path.join(ruta, 'backend/tests')) ? '- ✅ Tests backend' : '- ❌ Sin tests backend'}
${fs.existsSync(path.join(ruta, 'frontend/test')) ? '- ✅ Tests frontend' : '- ❌ Sin tests frontend'}

## Próximos Pasos
1. Abrí Claude Code en esta carpeta
2. Escribí: /manten
3. JuvinFactory carga el estado y te guía desde ahí
`;
}

async function crearEstadoProyectoMigracion(ruta, nombre) {
  const estado = `# Estado del Proyecto: ${nombre}

**Última actualización:** [migración JuvinFactory]
**Estado:** 🟡 En migración

Modo: Mantenimiento
Bloque: 0 — Migración
Hecho:
- .claude/ integrado (9 agentes + 4 slash commands)
- ESTADO_ACTUAL_APP.md generado

Falta:
- Auditoría con @juvinnotebook
- Nuevo plan con JuvinFactory (/manten)

Siguiente: Bloque 1 — Auditoría y planificación de mantenimiento
`;
  await fs.writeFile(path.join(ruta, 'ESTADO_PROYECTO.md'), estado);
}

// ═══════════════════════════════════════════════════════════════════════════
// SCRIPTS DE LANZAMIENTO
// ═══════════════════════════════════════════════════════════════════════════

async function crearScriptsLanzamiento(ruta, nombre, extras) {
  const tieneDocker = extras.includes('docker');
  const tieneBackend = extras.includes('backend');
  const tieneFrontend = extras.includes('frontend');

  const bat = `@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════╗
echo ║   ${nombre} — Iniciando servicios...
echo ╚══════════════════════════════════════════════╝
echo.
${tieneDocker ? `echo [1/3] Levantando Docker (PostgreSQL + pgAdmin)...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Docker no disponible.
  pause
  exit /b 1
)
echo       OK - PostgreSQL: localhost:5432  pgAdmin: http://localhost:5050
echo.
` : ''}${tieneBackend ? `echo [2/3] Iniciando Backend...
start "Backend - ${nombre}" cmd /k "cd backend && npm install --silent && npm run dev"
echo       OK - API: http://localhost:3000
echo.
` : ''}${tieneFrontend ? `echo [3/3] Iniciando Frontend (Flutter Web)...
start "Frontend - ${nombre}" cmd /k "cd frontend && flutter pub get && flutter run -d chrome --web-port 8080"
echo       OK - App: http://localhost:8080
echo.
` : ''}echo ✅ Servicios arrancados.
echo   Backend: http://localhost:3000
echo   Frontend: http://localhost:8080
echo   pgAdmin: http://localhost:5050
pause >nul
`;
  await escribirSiNoExiste(path.join(ruta, 'run_project.bat'), bat);

  const sh = `#!/bin/bash
set -e
echo ""
echo "=== ${nombre} — Iniciando servicios ==="
${tieneDocker ? `docker-compose up -d
echo "OK - PostgreSQL: localhost:5432  pgAdmin: http://localhost:5050"
` : ''}${tieneBackend ? `cd backend && npm install --silent && npm run dev &
echo "OK - API: http://localhost:3000"
cd ..
` : ''}${tieneFrontend ? `cd frontend && flutter pub get && flutter run -d chrome --web-port 8080 &
echo "OK - App: http://localhost:8080"
cd ..
` : ''}echo "✅ Para detener: Ctrl+C o docker-compose down"
wait
`;
  await escribirSiNoExiste(path.join(ruta, 'run_project.sh'), sh);

  const ps1 = `# CERO.ps1 — ${nombre}
$ErrorActionPreference = "SilentlyContinue"

function Check-Tool {
  param([string]$Name, [string]$Command, [string]$Args)
  $result = & $Command $Args 2>&1
  if ($LASTEXITCODE -eq 0 -or $result) {
    Write-Host "  OK  $Name" -ForegroundColor Green
  } else {
    Write-Host "  --  $Name (no encontrado)" -ForegroundColor Red
  }
}

Clear-Host
Write-Host ""
Write-Host "=== ${nombre} — Entorno ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Stack:    Node.js + Express + TypeScript | Flutter Web"
Write-Host "  DB:       PostgreSQL 15 (Docker)"
Write-Host "  Puertos:  Backend 3000 | Frontend 8080 | PG 5432 | pgAdmin 5050"
Write-Host ""

Check-Tool "Node.js" "node" "--version"
Check-Tool "npm" "npm" "--version"
Check-Tool "Flutter" "flutter" "--version"
Check-Tool "Docker" "docker" "--version"
Check-Tool "Git" "git" "--version"

Write-Host ""
Write-Host "  .\\run_project.bat  # Levantar todo" -ForegroundColor Yellow
Write-Host ""
Read-Host "Enter para salir"
`;
  await escribirSiNoExiste(path.join(ruta, 'CERO.ps1'), ps1);

  const ceroSh = `#!/bin/bash
echo "=== ${nombre} — Entorno ==="
for tool in node npm flutter docker git; do
  command -v "$tool" &>/dev/null && echo "  OK  $tool" || echo "  --  $tool (no encontrado)"
done
echo ""
echo "  bash run_project.sh  # Levantar todo"
`;
  await escribirSiNoExiste(path.join(ruta, 'CERO.sh'), ceroSh);
}

// ═══════════════════════════════════════════════════════════════════════════
// I18N
// ═══════════════════════════════════════════════════════════════════════════

async function crearL10n(ruta, nombre) {
  const l10nDir = path.join(ruta, 'frontend/lib/l10n');
  await fs.ensureDir(l10nDir);

  const arbEs = JSON.stringify({
    "@@locale": "es",
    "appTitle": nombre, "@appTitle": { "description": "Título de la aplicación" },
    "welcome": "Bienvenido", "@welcome": { "description": "Mensaje de bienvenida" },
    "loading": "Cargando...", "@loading": { "description": "Texto de carga" },
    "error": "Error", "@error": { "description": "Error genérico" },
    "retry": "Reintentar", "@retry": { "description": "Botón reintentar" },
    "cancel": "Cancelar", "@cancel": { "description": "Botón cancelar" },
    "confirm": "Confirmar", "@confirm": { "description": "Botón confirmar" },
    "save": "Guardar", "@save": { "description": "Botón guardar" },
    "close": "Cerrar", "@close": { "description": "Botón cerrar" }
  }, null, 2);

  const arbEn = JSON.stringify({
    "@@locale": "en",
    "appTitle": nombre, "@appTitle": { "description": "Application title" },
    "welcome": "Welcome", "@welcome": { "description": "Welcome message" },
    "loading": "Loading...", "@loading": { "description": "Loading text" },
    "error": "Error", "@error": { "description": "Generic error" },
    "retry": "Retry", "@retry": { "description": "Retry button" },
    "cancel": "Cancel", "@cancel": { "description": "Cancel button" },
    "confirm": "Confirm", "@confirm": { "description": "Confirm button" },
    "save": "Save", "@save": { "description": "Save button" },
    "close": "Close", "@close": { "description": "Close button" }
  }, null, 2);

  await escribirSiNoExiste(path.join(l10nDir, 'app_es.arb'), arbEs);
  await escribirSiNoExiste(path.join(l10nDir, 'app_en.arb'), arbEn);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMAS FLUTTER
// ═══════════════════════════════════════════════════════════════════════════

async function crearTemas(ruta) {
  const tema = `import 'package:flutter/material.dart';

final ThemeData temaClaro = ThemeData(
  useMaterial3: true,
  brightness: Brightness.light,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF1E88E5),
    brightness: Brightness.light,
  ),
  appBarTheme: const AppBarTheme(centerTitle: true, elevation: 0),
  cardTheme: CardTheme(
    elevation: 2,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
);

final ThemeData temaOscuro = ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF1E88E5),
    brightness: Brightness.dark,
  ),
  appBarTheme: const AppBarTheme(centerTitle: true, elevation: 0),
  cardTheme: CardTheme(
    elevation: 2,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
);
`;
  await escribirSiNoExiste(path.join(ruta, 'frontend/lib/config/theme.dart'), tema);

  const mainDart = `import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'config/theme.dart';
// ignore: depend_on_referenced_packages
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() => runApp(const MyApp());

class MyApp extends StatefulWidget {
  const MyApp({super.key});
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // Día es el tema por defecto y Español el idioma por defecto.
  ThemeMode _themeMode = ThemeMode.light;
  Locale _locale = const Locale('es');

  void _toggleTheme() => setState(() {
    _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
  });

  void _toggleLocale() => setState(() {
    _locale = _locale.languageCode == 'es' ? const Locale('en') : const Locale('es');
  });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      onGenerateTitle: (context) => AppLocalizations.of(context)!.appTitle,
      theme: temaClaro,
      darkTheme: temaOscuro,
      themeMode: _themeMode,
      locale: _locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: Builder(
        builder: (context) {
          final t = AppLocalizations.of(context)!;
          return Scaffold(
            appBar: AppBar(
              title: Text(t.appTitle),
              actions: [
                IconButton(
                  icon: const Icon(Icons.language),
                  tooltip: _locale.languageCode == 'es' ? 'English' : 'Español',
                  onPressed: _toggleLocale,
                ),
                IconButton(
                  icon: Icon(_themeMode == ThemeMode.light ? Icons.dark_mode : Icons.light_mode),
                  onPressed: _toggleTheme,
                ),
              ],
            ),
            body: Center(child: Text(t.welcome)),
          );
        },
      ),
    );
  }
}
`;
  await escribirSiNoExiste(path.join(ruta, 'frontend/lib/main.dart'), mainDart);
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIAR
// ═══════════════════════════════════════════════════════════════════════════

menuPrincipal().catch((error) => {
  console.error(chalk.red('Error:', error.message));
  process.exit(1);
});
