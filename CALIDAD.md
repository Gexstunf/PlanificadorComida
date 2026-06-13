# Calidad y automatizacion

## Estrategia general

La estrategia de calidad de Meal Planner combina validaciones automaticas y reglas de trabajo en GitHub. La idea es que cada cambio pase por una barrera tecnica antes de llegar a produccion: primero se revisa el estilo del codigo con lint, despues se ejecutan tests unitarios sobre funciones de negocio, luego se genera el build de produccion y finalmente se corre un test E2E sobre un flujo critico de la aplicacion.

Elegimos automatizar estos pasos porque la aplicacion depende de varios flujos conectados: autenticacion, rutas protegidas, recetas, plan semanal, nutricion y lista de compras. Un error pequeno en una funcion utilitaria puede afectar pantallas completas. Por eso protegemos tanto la logica aislada como el comportamiento visible para el usuario.

El deploy a Vercel queda al final del pipeline y solo se ejecuta cuando todos los pasos anteriores pasan. Si falla el lint, un test o el build, el workflow se corta y no publica una version rota.

## Herramientas seleccionadas

- ESLint: valida errores estaticos de JavaScript y React antes de ejecutar la aplicacion. Lo elegimos porque se integra directo con Vite y detecta problemas frecuentes de hooks, imports y codigo no usado.
- Vitest: ejecuta tests unitarios rapidos sobre funciones de negocio. Lo elegimos porque funciona bien con Vite y permite correr los tests en CI sin levantar toda la app.
- Playwright: cubre pruebas E2E en navegador real. Lo elegimos sobre Cypress porque se integra bien con GitHub Actions, permite instalar solo Chromium para mantener el pipeline liviano y no necesita una interfaz interactiva.
- GitHub Actions: orquesta el pipeline cada vez que hay push o pull request a `main`. Lo elegimos porque queda integrado al repositorio y deja evidencia visible en cada PR.
- Vercel CLI: despliega el artefacto de produccion generado por CI. Se usa con `vercel build` y `vercel deploy --prebuilt --prod` para que el deploy publique exactamente lo que ya fue validado.

## Tests desarrollados

- `src/lib/__tests__/shopping.test.js`: valida que la lista de compras categorice ingredientes, fusione duplicados por nombre/unidad y agrupe items por categoria. Protege el flujo de compras generado desde el plan semanal.
- `src/lib/__tests__/nutrition.test.js`: valida que los calculos nutricionales usen datos reales cuando existen, estimen valores cuando faltan, generen promedios semanales, filtren recetas altas en proteina y asignen metadatos de recetas. Protege el dashboard, los filtros y el planificador.
- `tests/e2e/auth.spec.js`: valida que un usuario no autenticado que intenta entrar a `/dashboard` sea redirigido a `/login` y vea el formulario de acceso. Protege el flujo principal de seguridad de rutas privadas.

## Casos de uso criticos

- Autenticacion y rutas protegidas: si esto falla, un usuario podria acceder a pantallas privadas o quedar bloqueado sin poder iniciar sesion.
- Calculo de lista de compras: es una funcionalidad central de la app y depende de combinar correctamente recetas, ingredientes y cantidades.
- Calculo nutricional: alimenta el dashboard, los objetivos y los filtros de recetas. Un error aca puede mostrar informacion incorrecta al usuario.
- Build de produccion: confirma que la app completa puede compilarse antes de intentar publicarla.

Priorizamos estos casos porque concentran el valor principal del producto y tienen mayor impacto sobre la experiencia diaria del usuario.

## Pipeline de CI/CD

El workflow esta en `.github/workflows/ci-cd.yml` y se dispara en:

- `pull_request` hacia `main`
- `push` a `main`

El job de calidad ejecuta:

1. Instala dependencias con `npm ci`.
2. Instala Chromium para Playwright.
3. Corre `npm run lint`.
4. Corre `npm run test`.
5. Corre `npm run build`.
6. Corre `npm run test:e2e`.

El job de deploy depende del job de calidad. Solo corre en `push` a `main`, no en PRs. Usa Vercel CLI para traer la configuracion de produccion, construir el artefacto y publicarlo con `vercel deploy --prebuilt --prod`.

Esta decision evita publicar cambios que todavia estan en revision y garantiza que produccion solo reciba codigo validado.

## Variables y secretos necesarios

Para que el pipeline funcione en GitHub Actions hay que configurar estos secrets en el repositorio:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Los secrets de Vercel permiten desplegar desde CI. Los de Supabase permiten construir la app con la misma configuracion que usa produccion. En PRs, el job de calidad puede usar valores de prueba para validar build y E2E sin exponer credenciales.

## Flujo de trabajo en GitHub

Cada cambio debe tener un issue antes de empezar. La rama debe salir de `main` o `develop` segun el flujo acordado por el equipo y debe seguir una convencion clara:

- `feature/nombre-feature`
- `fix/nombre-bug`
- `docs/nombre-documentacion`
- `test/nombre-test`

Cada PR debe:

- Referenciar el issue que resuelve con `Closes #numero`.
- Pasar el workflow de GitHub Actions.
- Tener revision del otro integrante.
- Incluir al menos un comentario concreto de revision, no solo una aprobacion vacia.

El historial de issues y PRs queda como evidencia de la trazabilidad pedida en el TP.

## Limitaciones y deuda tecnica

- El test E2E actual cubre seguridad de rutas privadas, pero todavia no cubre un flujo completo con datos reales como crear una receta y verla en el recetario. Para eso haria falta una cuenta de prueba estable o mocks controlados de Supabase.
- La cobertura no esta configurada como umbral obligatorio. Se podria agregar `vitest --coverage` y exigir un porcentaje minimo sobre `src/lib`.
- No se integro Sentry ni otro servicio de monitoreo de errores. Seria una mejora util para capturar errores reales de produccion.
- El pipeline depende de que los secrets de GitHub esten correctamente cargados. Si falta un secret de Vercel, el job de calidad puede pasar, pero el deploy va a fallar.
- El proyecto todavia tiene varias vulnerabilidades reportadas por `npm audit` en dependencias transitivas. No se aplico `npm audit fix --force` porque podria introducir cambios incompatibles.

## Uso de IA

Se uso Codex como apoyo para revisar el enunciado, identificar brechas contra el repositorio y generar una primera version de configuracion CI/CD, test E2E y documentacion de calidad. El equipo debe revisar y entender cada archivo agregado antes de la defensa, especialmente el workflow, el test E2E y las decisiones explicadas en este documento.
