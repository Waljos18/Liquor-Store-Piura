/**
 * Script para importar productos desde PRECIO_DE_VENTA_CHILALO.csv al sistema.
 * Uso: node scripts/importar-productos.js [ruta-al-csv]
 *
 * Requiere: Backend corriendo en http://localhost:8080
 * Credenciales por defecto: admin / Admin123!
 */

const fs = require('fs');
const path = require('path');

const API_BASE = process.env.VITE_API_URL || 'http://localhost:8080';
const CSV_PATH = process.argv[2] || path.join(__dirname, '..', 'PRECIO_DE_VENTA_CHILALO.csv');
const USERNAME = process.env.IMPORT_USER || 'admin';
const PASSWORD = process.env.IMPORT_PASS || 'Admin123!';

async function login() {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  const data = await res.json();
  if (!data.success || !data.data?.accessToken) {
    throw new Error(data.error?.message || 'Error al iniciar sesión');
  }
  return data.data.accessToken;
}

async function importarProductos(token, csvContent) {
  const res = await fetch(`${API_BASE}/api/v1/productos/importar/texto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body: csvContent,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `HTTP ${res.status}`);
  }
  return data;
}

async function main() {
  console.log('=== Importador de productos CHILALO ===\n');
  console.log('API:', API_BASE);
  console.log('CSV:', CSV_PATH);
  console.log('');

  if (!fs.existsSync(CSV_PATH)) {
    console.error('ERROR: No se encontró el archivo CSV:', CSV_PATH);
    process.exit(1);
  }

  try {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    console.log('Archivo leído:', csvContent.length, 'caracteres\n');

    console.log('Iniciando sesión...');
    const token = await login();
    console.log('Sesión iniciada OK\n');

    console.log('Importando productos...');
    const result = await importarProductos(token, csvContent);

    if (!result.success || !result.data) {
      console.error('Error en importación:', result.error || result);
      process.exit(1);
    }

    const d = result.data;
    console.log('\n--- Resultado de la importación ---');
    console.log('Total procesados:', d.totalProcesados);
    console.log('Productos creados:', d.creados);
    console.log('Omitidos:', d.omitidos);
    console.log('Errores:', d.errores);

    if (d.mensajesError?.length > 0) {
      console.log('\nMensajes:');
      d.mensajesError.slice(0, 10).forEach((m) => console.log('  -', m));
      if (d.mensajesError.length > 10) {
        console.log('  ... y', d.mensajesError.length - 10, 'más');
      }
    }

    console.log('\nImportación completada.');
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

main();
