# JuvinFactory v1.0

**Software factory para Claude Code — scaffold + IA orquestada por JuvinFactory**

Un solo comando crea la estructura completa de tu proyecto y configura Claude Code con 9 agentes especializados y 4 slash commands listos para usar.

---

## Instalación

```bash
git clone https://github.com/javilaelias/juvinfactory.git
cd juvinfactory
npm install
```

**Para usarlo desde cualquier carpeta (recomendado):**
```bash
npm link
# Ahora: juvinfactory (desde cualquier directorio)
```

---

## Uso

```bash
juvinfactory
# o sin instalar globalmente:
node juvinfactory.js
```

El menú ofrece tres opciones:

| Opción | Qué hace |
|---|---|
| ✨ NUEVO | Crea estructura de proyecto desde cero |
| ❓ ? | Manual completo de uso |
| 🔄 ANTIGUO | Migra un proyecto existente |

---

## Flujo completo — App nueva

```bash
# 1. Scaffold
juvinfactory → NUEVO → nombre: mi-app → [componentes] → [brief opcional]

# 2. Ir al proyecto y abrir Claude Code
cd mi-app

# 3. Activar JuvinFactory con tu brief o spec
/juvin quiero una clínica virtual con videollamadas y gestión de turnos

# 4. JuvinFactory responde con:
#    → Plan por bloques, MVP, backlog, criterios de aceptación

# 5. Trabajar por bloques. Al terminar cada sesión:
/cierre  # guarda estado + genera handoff
```

---

## Flujo completo — Mantenimiento

```bash
# Si el proyecto ya tiene JuvinFactory:
/manten  # carga ESTADO_PROYECTO.md y continúa

# Si no lo tiene aún:
juvinfactory → ANTIGUO  # integra .claude/ sin tocar el código existente
```

---

## Lo que genera el scaffold

```
mi-app/
├── .claude/
│   ├── CLAUDE.md              ← Identidad JuvinFactory (orquestador)
│   ├── settings.json          ← Hooks de sesión
│   ├── agents/
│   │   ├── juvinnotebook.md   ← Analista de specs y docs
│   │   ├── juvininfra.md      ← Arquitectura técnica y Docker
│   │   ├── juvindiseno.md     ← UX/UI y benchmark visual
│   │   ├── juvindev.md        ← Implementación de código
│   │   ├── juvinqa.md         ← Calidad y validación
│   │   ├── juvintest.md       ← Tests (unit, integration, E2E)
│   │   ├── juvinciberseguridad.md  ← OWASP y seguridad
│   │   ├── juvindocs.md       ← Documentación técnica
│   │   ├── juvinrelease.md    ← Release y despliegue
│   │   └── juvincoach.md      ← Traductor técnico-negocio
│   └── commands/
│       ├── juvin.md           ← /juvin <brief>
│       ├── manten.md          ← /manten
│       ├── estado.md          ← /estado
│       └── cierre.md          ← /cierre
├── BRIEF.md                   ← Si pegaste spec en el wizard
├── ESTADO_PROYECTO.md         ← Estado vivo del proyecto
├── backend/                   ← Node.js + Express + TypeScript
├── frontend/                  ← Flutter Web (i18n ES/EN, temas día/noche)
├── docker-compose.yml         ← PostgreSQL 15 + pgAdmin
├── run_project.bat / .sh      ← Levanta todo con un click
└── CERO.ps1 / .sh             ← Verifica dependencias
```

---

## Slash commands en Claude Code

| Comando | Descripción |
|---|---|
| `/juvin <spec>` | Activar Modo Creación (acepta specs largas de NotebookLM) |
| `/manten` | Activar Modo Mantenimiento (carga estado del proyecto) |
| `/estado` | Ver el estado actual del proyecto |
| `/cierre` | Cerrar bloque + generar handoff para la próxima sesión |

---

## Agentes disponibles (invocar con @nombre)

| Agente | Especialidad |
|---|---|
| `@juvinnotebook` | Analiza specs, docs, prompts de NotebookLM, logs |
| `@juvininfra` | Arquitectura técnica, Docker, CI/CD, puertos |
| `@juvindiseno` | UX/UI, benchmark visual, wireframes |
| `@juvindev` | Implementación (backend, BD, APIs, Flutter) |
| `@juvinqa` | Calidad, pruebas Smoke/Regression/Negative |
| `@juvintest` | Código de tests (unit, integration, E2E) |
| `@juvinciberseguridad` | OWASP, auth, datos sensibles |
| `@juvindocs` | README, runbooks, ESTADO_PROYECTO.md |
| `@juvinrelease` | Release, despliegue, rollback |
| `@juvincoach` | Explicaciones técnicas en lenguaje claro |

---

## Stack generado por defecto

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** Flutter Web (i18n ES/EN, temas día/noche, Material 3)
- **Database:** PostgreSQL 15 en Docker
- **CI/CD:** GitHub Actions
- **Puertos:** Backend `3000` | Frontend `8080` | PostgreSQL `5432` | pgAdmin `5050`

---

## Requisitos

- Node.js 18+
- Git
- Flutter SDK (si usás frontend)
- Docker Desktop (si usás PostgreSQL)
- Claude Code

---

## Agregar un agente nuevo

Editá `crearAgentes()` en `juvinfactory.js` y agregá una entrada al objeto `agentes`:

```javascript
'juvinnuevo.md': `---
name: juvinnuevo
description: Descripción para que Claude sepa cuándo invocarme automáticamente.
---

Eres JuvinNuevo...
`
```

El próximo `juvinfactory` que ejecutes incluirá el nuevo agente.

---

## Versiones

| Versión | Cambios |
|---|---|
| v1.0.0 | Sistema completo: 9 agentes, 4 slash commands, manual interactivo, captura de brief |
