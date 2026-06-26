# FIX: Error ENOBUFS al Migrar Proyecto

El error que obtuviste:
```
spawnSync C:\windows\system32\cmd.exe ENOBUFS
```

**Causa:** Problema con Git o buffers insuficientes al ejecutar comandos.

**Solución:** Versión v2 del programa (juvinfactory-unico-v2.js)

---

## Qué Cambió en v2

1. **Manejo mejor de errores git**
   - Si Git no está disponible, crea backup manual
   - No falla, continúa sin backup automático

2. **Buffers más grandes**
   - maxBuffer: 1MB (antes más pequeño)
   - Evita ENOBUFS

3. **Backup manual**
   - Si Git falla, crea carpeta .backup_preJuvinFactory
   - Tu código siempre está respaldado

4. **Mensajes más claros**
   - Te dice si Git no está disponible
   - Te avisa qué está pasando

---

## Usa la Versión v2

```bash
# Reemplaza el archivo anterior
# Descarga: juvinfactory-unico-v2.js
# Renombra a: juvinfactory.js

node juvinfactory.js
```

---

## Si Aún Tienes Problemas

### Opción 1: Instalar/Actualizar Git

**Windows:**
1. Descarga desde: https://git-scm.com/download/win
2. Instala con opciones por defecto
3. Reinicia la terminal

**Verificar que funciona:**
```bash
git --version
```

### Opción 2: Ejecutar como Administrador

Windows (PowerShell como Admin):
```powershell
Start-Process powershell -ArgumentList "cd D:\juvinfactory-setup; node juvinfactory.js" -Verb RunAs
```

### Opción 3: Usar el programa sin Git

El programa v2 funciona sin Git. Solo que no crea backup automático. Crea uno manual en `.backup_preJuvinFactory/`.

---

## Ahora Intenta de Nuevo

```bash
cd D:\juvinfactory-setup
node juvinfactory.js

# Elige: ANTIGUO
# Ruta: D:\inicIAtiva
# Backup: Yes (o No si Git no funciona)
```

---

**¿Funciona ahora?**

Usa `juvinfactory-unico-v2.js` (renombra a `juvinfactory.js`)

Si aún tienes problemas, dime exactamente qué mensaje de error sale.
