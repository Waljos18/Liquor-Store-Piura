# Solución: "Java file is located outside of the module source root"

Este error ocurre cuando el IDE (IntelliJ IDEA o Eclipse) no reconoce correctamente las carpetas de código fuente.

---

## 🔧 Solución para IntelliJ IDEA

### Opción 1: Marcar Source Root Manualmente

1. **Abre el proyecto en IntelliJ IDEA:**
   - `File > Open` → Selecciona la carpeta `backend`

2. **Marca las carpetas como Source Root:**
   - Click derecho en `backend/src/main/java`
   - Selecciona `Mark Directory as > Sources Root`
   - Click derecho en `backend/src/main/resources`
   - Selecciona `Mark Directory as > Resources Root`

3. **Si aparece un mensaje sobre Maven:**
   - Click en "Import Maven Project" o "Reload Project"
   - IntelliJ detectará automáticamente la estructura Maven

### Opción 2: Reimportar Proyecto Maven

1. Abre el panel de Maven (lado derecho o `View > Tool Windows > Maven`)
2. Click en el ícono de "Reload All Maven Projects" (flecha circular)
3. O click derecho en `pom.xml` → `Maven > Reload Project`

### Opción 3: Invalidar Caché

1. `File > Invalidate Caches...`
2. Marca todas las opciones
3. Click en "Invalidate and Restart"

---

## 🔧 Solución para Eclipse

### Opción 1: Importar como Proyecto Maven

1. `File > Import > Existing Maven Projects`
2. Selecciona la carpeta `backend`
3. Eclipse detectará automáticamente la estructura

### Opción 2: Configurar Build Path Manualmente

1. Click derecho en el proyecto `backend`
2. `Properties > Java Build Path > Source`
3. Verifica que `src/main/java` esté marcado como "Source folder"
4. Si no está, click en "Add Folder..." y selecciona `src/main/java`

---

## 🔧 Solución para VS Code

1. Abre la carpeta `backend` (no la raíz del proyecto)
2. VS Code debería detectar automáticamente la estructura Maven
3. Si no, instala la extensión "Extension Pack for Java"

---

## ✅ Verificación

Después de aplicar la solución, verifica que:

1. ✅ Los archivos `.java` en `src/main/java` no muestren errores de "outside source root"
2. ✅ El IDE reconoce las clases y puede hacer autocompletado
3. ✅ Puedes ejecutar `LicoreriaApplication.java` sin errores

---

## 📝 Nota Importante

**Estructura correcta de Maven:**
```
backend/
├── src/
│   ├── main/
│   │   ├── java/          ← Source Root (código Java)
│   │   └── resources/      ← Resources Root (configuración)
│   └── test/
│       └── java/           ← Test Source Root
└── pom.xml
```

Si tu estructura es diferente, el IDE no la reconocerá correctamente.

---

## 🐛 Si el Problema Persiste

1. **Cierra y vuelve a abrir el IDE**
2. **Verifica que estés abriendo la carpeta `backend`**, no la raíz del proyecto
3. **Asegúrate de tener el plugin de Maven instalado** en tu IDE
4. **Revisa que `pom.xml` esté en la raíz de `backend`**

---

**¿Sigue sin funcionar?** Intenta crear un nuevo proyecto Maven y copiar los archivos, o contacta al equipo de desarrollo.
