# 🖥️ SIRSE Panel Web - Administración Municipal

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
</div>

<br>

<div align="center">
  <h3>🛡️ Sistema Integral de Reportes de Seguridad y Emergencias</h3>
  <p>Panel de administración web para Tulancingo de Bravo, Hidalgo</p>
</div>

## 📋 Descripción

**SIRSE Panel Web** es la interfaz administrativa del Sistema Integral de Reportes de Seguridad y Emergencias, diseñada para que los funcionarios municipales de **Tulancingo de Bravo, Hidalgo** gestionen, supervisen y den seguimiento a los reportes ciudadanos de manera eficiente.

El panel proporciona una visión integral del sistema mediante dashboards interactivos, estadísticas en tiempo real, gestión de reportes y administración de usuarios.

### 🎯 Propósito

Facilitar a los administradores municipales una herramienta profesional para:
- 📊 Visualizar estadísticas generales del sistema
- 📋 Gestionar el ciclo de vida de los reportes
- ✅ Validar y resolver incidentes
- 👥 Administrar usuarios del sistema
- 📈 Analizar tendencias y métricas clave
- 🎯 Tomar decisiones basadas en datos

> **Nota**: Este panel es para **uso exclusivo de personal autorizado** del H. Ayuntamiento de Tulancingo. Requiere autenticación mediante credenciales municipales.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login seguro con email y contraseña
- Validación de credenciales contra API backend
- Gestión de sesión con tokens JWT
- Cierre de sesión seguro
- Protección de rutas privadas

### 📊 Dashboard Principal
- **Cards de métricas clave**:
  - Total de reportes
  - Reportes atendidos
  - Reportes pendientes
  - Falsos positivos
- **Gráficos interactivos**:
  - Reportes por mes (línea temporal)
  - Reportes por categoría (gráfico de dona)
- Actualización automática cada 30 segundos
- Visualización responsiva

### 📋 Feed de Reportes
- Lista completa de reportes ciudadanos
- **Filtros dinámicos**:
  - Por categoría (Luminarias, Servicios, etc.)
  - Por estado (Pendiente, En proceso, Resuelto)
  - Búsqueda por texto (nombre, folio, descripción)
- **Acciones disponibles**:
  - ✓ Validar reporte
  - ✅ Marcar como resuelto
  - 🗑️ Eliminar reporte
- Vista de cards con información completa
- Badges de categoría y estado
- Metadatos: fecha, hora, ubicación

### 📈 Estadísticas Avanzadas
- **Métricas clave**:
  - Tasa de resolución (%)
  - Tiempo promedio de respuesta
  - Satisfacción ciudadana
  - Reportes del mes actual
- **Gráficos analíticos**:
  - Tendencias por categoría (multi-línea)
  - Tiempo de respuesta promedio
  - Tasa de resolución semanal
  - Rendimiento por departamento
- Análisis temporal y comparativo

### 👥 Gestión de Usuarios
- Listado completo de administradores
- **Operaciones CRUD**:
  - ➕ Crear nuevos usuarios
  - ✏️ Editar información de usuarios
  - 🗑️ Eliminar usuarios
- **Perfil actual**:
  - Visualización de datos del usuario logueado
  - Cambio de contraseña seguro
- Roles y permisos por departamento
- Estadísticas de usuarios activos

## 📁 Estructura del Proyecto

```
panel-web/
├── index.html                    # 🔐 Pantalla de login
├── dashboard.html                # 📊 Dashboard principal
├── reportes.html                 # 📋 Feed de reportes
├── estadisticas.html             # 📈 Estadísticas detalladas
├── usuarios.html                 # 👥 Gestión de usuarios
│
├── css/
│   └── styles.css                # 🎨 Estilos globales del panel
│
├── js/
│   ├── auth.js                   # 🔐 Autenticación y sesión
│   ├── dashboard.js              # 📊 Lógica del dashboard
│   ├── reportes.js               # 📋 Gestión de reportes
│   ├── estadisticas.js           # 📈 Lógica de estadísticas
│   └── usuarios.js               # 👥 Gestión de usuarios
│
├── .gitignore                    # 📝 Archivos ignorados por Git
└── README.md                     # 📖 Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos

#### Hardware Mínimo
- **Servidor**:
  - 2 GB RAM mínimo
  - Procesador Dual-core
  - 500 MB de espacio en disco
  - Conexión a Internet estable

#### Software Requerido
- Navegador web moderno:
  - Google Chrome 90+ (recomendado)
  - Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+
- Servidor web (Apache, Nginx, o similar)
- Node.js 18+ (opcional, para servidor de desarrollo)

### Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sirse-panel-web.git
cd sirse-panel-web
```

#### 2. Configurar la URL de la API

Edita el archivo `js/auth.js` y `index.html`:
```javascript
// Cambiar la URL de la API
const API_URL = 'https://api-sirse.vercel.app/api';
// Por: const API_URL = 'https://tu-api.tulancingo.gob.mx/api';
```

#### 3. Desplegar en servidor web

**Opción A: Servidor local con Python**
```bash
# Python 3
python -m http.server 8080

# Acceder a: http://localhost:8080
```

**Opción B: Servidor local con Node.js**
```bash
# Instalar http-server globalmente
npm install -g http-server

# Iniciar servidor
http-server -p 8080

# Acceder a: http://localhost:8080
```

**Opción C: Apache/Nginx**
```bash
# Copiar archivos al directorio del servidor
sudo cp -r * /var/www/html/sirse-panel/

# Configurar permisos
sudo chown -R www-data:www-data /var/www/html/sirse-panel
sudo chmod -R 755 /var/www/html/sirse-panel
```

#### 4. Configurar HTTPS (Producción)

Para producción, siempre usa HTTPS:
```bash
# Con Certbot (Let's Encrypt)
sudo certbot --nginx -d panel.sirse.tulancingo.gob.mx
```

#### 5. Verificar conexión con API

Abre las DevTools del navegador (F12) y verifica:
```javascript
// En la consola del navegador
fetch('https://api-sirse.vercel.app/api/')
  .then(r => r.json())
  .then(d => console.log(d));
```

## 🎨 Pantallas del Panel

### 1️⃣ Login (`index.html`)

**Funcionalidades:**
- Formulario de autenticación
- Toggle para mostrar/ocultar contraseña
- Validación de credenciales
- Manejo de errores
- Redirección automática si ya hay sesión activa
- Diseño responsivo y moderno

```javascript
// Ejemplo de estructura del login
{
  "email": "admin@tulancingo.gob.mx",
  "contraseña": "tu_contraseña_segura"
}
```

### 2️⃣ Dashboard (`dashboard.html`)

**Componentes:**
- **Sidebar**: Menú de navegación principal
- **Header**: Barra de búsqueda y perfil de usuario
- **Cards de métricas**: 4 indicadores clave
- **Gráficos**:
  - Reportes por mes (Chart.js - Line)
  - Reportes por categoría (Chart.js - Doughnut)

```javascript
// Estructura de métricas
{
  "total_reportes": 150,
  "reportes_resueltos": 120,
  "reportes_pendientes": 30,
  "falsos_positivos": 0
}
```

### 3️⃣ Feed de Reportes (`reportes.html`)

**Componentes:**
- **Filtros superiores**:
  - Select de categoría
  - Select de estado
  - Barra de búsqueda en tiempo real
- **Lista de reportes**: Cards individuales con:
  - Imagen (placeholder)
  - Badges de categoría y estado
  - Información del reportante
  - Descripción del incidente
  - Metadatos (fecha, hora, ubicación)
  - Botones de acción (Validar, Resolver, Eliminar)

### 4️⃣ Estadísticas (`estadisticas.html`)

**Componentes:**
- **4 Cards de métricas avanzadas**:
  - Tasa de resolución
  - Tiempo promedio de respuesta
  - Satisfacción ciudadana
  - Reportes del mes
- **4 Gráficos interactivos**:
  - Tendencias por categoría (multi-línea)
  - Tiempo de respuesta (línea con fill)
  - Tasa de resolución semanal (barras)
  - Rendimiento por departamento (barras horizontales)

### 5️⃣ Gestión de Usuarios (`usuarios.html`)

**Componentes:**
- **Perfil actual**: Card con información del usuario logueado
- **Tabla de usuarios**:
  - Avatar con iniciales
  - Nombre y email
  - Rol y departamento
  - Fecha de ingreso
  - Estado (Activo)
  - Acciones (Editar, Eliminar)
- **Botones de acción**:
  - ➕ Añadir usuario
  - 🔒 Cambiar contraseña
- **Cards de estadísticas**:
  - Total de usuarios
  - Usuarios activos
  - Total de departamentos

## 🔌 Integración con API Backend

### Configuración de la API

El panel se conecta a la API REST de SIRSE:
```javascript
const API_URL = 'https://api-sirse.vercel.app/api';
```

### Endpoints Utilizados

#### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `GET` | `/usuarios/me` | Obtener usuario actual |

#### Reportes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/reportes/` | Lista de reportes (con filtros opcionales) |
| `GET` | `/reportes/{id}` | Detalle de un reporte |
| `PUT` | `/reportes/{id}` | Actualizar reporte (cambiar estado) |
| `DELETE` | `/reportes/{id}` | Eliminar reporte |

#### Estadísticas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/estadisticas/generales` | Métricas generales del sistema |
| `GET` | `/estadisticas/por-mes-chart` | Datos para gráfico mensual |
| `GET` | `/estadisticas/por-categoria-chart` | Datos para gráfico de categorías |

#### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/usuarios/` | Lista de usuarios |
| `POST` | `/usuarios/` | Crear nuevo usuario |
| `PUT` | `/usuarios/{id}` | Actualizar usuario |
| `DELETE` | `/usuarios/{id}` | Eliminar usuario |
| `PUT` | `/usuarios/me/cambiar-contraseña` | Cambiar contraseña |

#### Catálogos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/categorias/` | Lista de categorías |
| `GET` | `/estados/` | Lista de estados de reportes |

### Autenticación con JWT

```javascript
// Almacenar token después del login
localStorage.setItem('token', data.access_token);
localStorage.setItem('user', JSON.stringify(data.usuario));

// Enviar token en cada request
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Manejo de token expirado (401)
if (response.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}
```

### Formato de Datos

#### Usuario
```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  departamento?: string;
  rol: string;
  created_at: string;
}
```

#### Reporte
```typescript
interface Reporte {
  id_reporte: number;
  folio: string;
  nombre: string;
  apellido_paterno: string;
  descripcion: string;
  direccion: string;
  created_at: string;
  categoria: {
    id_categoria: number;
    nombre: string;
  };
  estado: {
    id_estado: number;
    nombre: string;
  };
}
```

## 🎨 Guía de Estilos

### Paleta de Colores
```css
/* Colores principales */
:root {
  --primary: #003366;        /* Azul marino */
  --secondary: #00d084;      /* Verde institucional */
  --background: #f5f5f5;     /* Gris claro */
  --white: #ffffff;
  
  /* Textos */
  --text-primary: #333333;
  --text-secondary: #666666;
  
  /* Categorías */
  --luminarias: #ffd700;     /* Amarillo */
  --servicios: #ff8c00;      /* Naranja */
  --obras: #003366;          /* Azul */
  --parques: #00d084;        /* Verde */
  
  /* Estados */
  --pendiente: #ffc107;      /* Amarillo */
  --proceso: #2196f3;        /* Azul */
  --resuelto: #4caf50;       /* Verde */
  --rechazado: #ff4444;      /* Rojo */
}
```

### Tipografía
```css
/* Fuente principal */
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Tamaños */
.page-title { font-size: 28px; font-weight: 600; }
.card-title { font-size: 16px; font-weight: 600; }
.body-text { font-size: 14px; font-weight: 400; }
.small-text { font-size: 12px; font-weight: 400; }
```

### Componentes Reutilizables

#### Badges
```html
<!-- Badge de categoría -->
<span class="badge yellow">Luminarias</span>
<span class="badge orange">Servicios Municipales</span>
<span class="badge green">Parques y Jardines</span>
<span class="badge blue">Obras Públicas</span>

<!-- Badge de estado -->
<span class="badge yellow">Pendiente</span>
<span class="badge blue">En proceso</span>
<span class="badge green">Resuelto</span>
```

#### Botones
```html
<!-- Botón primario -->
<button class="btn-primary">Acción Principal</button>

<!-- Botón de validar -->
<button class="btn-validate">Validar</button>

<!-- Botón de resolver -->
<button class="btn-resolve">✓ Resolver</button>

<!-- Botón de eliminar -->
<button class="btn-delete">🗑 Eliminar</button>
```

## 📊 Chart.js - Configuración de Gráficos

### Gráfico de Línea (Reportes por Mes)
```javascript
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{
      label: 'Reportes por mes',
      data: [5, 8, 12, 6, 9, 15],
      borderColor: '#003366',
      backgroundColor: 'rgba(0, 51, 102, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});
```

### Gráfico de Dona (Categorías)
```javascript
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ["Luminarias", "Servicios", "Obras", "Parques"],
    datasets: [{
      data: [8, 5, 3, 4],
      backgroundColor: ['#ffd700', '#ff8c00', '#003366', '#00d084'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' }
    },
    cutout: '50%'
  }
});
```

## 🔒 Seguridad

### Mejores Prácticas Implementadas
- ✅ **Autenticación JWT**: Tokens seguros con expiración
- ✅ **HTTPS obligatorio**: Comunicación cifrada
- ✅ **Validación de sesión**: Verificación en cada request
- ✅ **Cierre de sesión**: Limpieza de tokens
- ✅ **Protección de rutas**: Redirección si no hay sesión
- ✅ **Manejo de errores**: Sin exposición de información sensible
- ✅ **XSS Protection**: Sanitización de inputs

### Recomendaciones Adicionales
```javascript
// Configurar Content Security Policy
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline';">

// Implementar rate limiting en la API
// Usar CORS apropiado
// Implementar refresh tokens
// Agregar 2FA para administradores principales
```

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la API"
```javascript
// Verificar URL de la API
console.log('API URL:', API_URL);

// Verificar CORS en la API
// El backend debe incluir:
res.headers['Access-Control-Allow-Origin'] = '*';
res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
```

### Error: "Token inválido o expirado"
```javascript
// Limpiar localStorage y volver a iniciar sesión
localStorage.clear();
window.location.href = '/index.html';
```

### Gráficos no se renderizan
```javascript
// Verificar que Chart.js esté cargado
if (typeof Chart === 'undefined') {
  console.error('Chart.js no está cargado');
}

// Verificar que el canvas exista
const ctx = document.getElementById('chart-id');
if (!ctx) {
  console.error('Canvas no encontrado');
}

// Destruir gráfico anterior antes de crear uno nuevo
if (window.chartInstance) {
  window.chartInstance.destroy();
}
```

### Problema con el sidebar en móviles
```css
/* Agregar media queries */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    position: fixed;
    left: -200px;
    transition: left 0.3s;
  }
  
  .sidebar.active {
    left: 0;
  }
}
```

## 📱 Responsive Design

El panel está optimizado para:
- 💻 **Desktop**: 1920x1080 (óptimo)
- 💻 **Laptop**: 1366x768
- 📱 **Tablet**: 768x1024 (landscape)
- 📱 **Mobile**: 375x667 (funcionalidad limitada)

### Breakpoints
```css
/* Tablet */
@media (max-width: 1024px) {
  .charts-grid { grid-template-columns: 1fr; }
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar { width: 200px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
```

## 🚀 Despliegue en Producción

### Checklist Pre-Despliegue
- [ ] Cambiar `API_URL` a la URL de producción
- [ ] Habilitar HTTPS en el servidor
- [ ] Configurar CORS en el backend
- [ ] Minificar CSS y JS (opcional)
- [ ] Configurar backups automáticos
- [ ] Implementar logging de errores
- [ ] Configurar monitoreo (uptime)
- [ ] Documentar credenciales de acceso

### Hosting Recomendado
- **Vercel**: Despliegue automático con Git
- **Netlify**: Similar a Vercel
- **GitHub Pages**: Para proyectos públicos
- **Servidor propio**: Apache/Nginx con SSL

### Comando de Despliegue (Vercel)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📞 Soporte y Contacto

### Reportar Problemas
- **GitHub Issues**: [github.com/tu-usuario/sirse-panel-web/issues](https://github.com/tu-usuario/sirse-panel-web/issues)
- **Email Técnico**: soporte@sirse.tulancingo.gob.mx

### Contacto Institucional
- **Oficina Municipal**: (775) 123-4567
- **Sitio Web**: [www.tulancingo.gob.mx](https://www.tulancingo.gob.mx)
- **WhatsApp SIRSE**: Para reportes ciudadanos

### Capacitación
Para solicitar capacitación o manuales de usuario, contactar a:
- **Jefatura de Seguimiento**
- Lic. Luis Armando Granillo Islas

## 👥 Créditos

**Universidad Tecnológica de Tulancingo**  
Ingeniería en Desarrollo y Gestión de Software

**Desarrollado para:**  
H. Ayuntamiento de Tulancingo de Bravo, Hidalgo

**Con el apoyo de:**
- Mtro. Netzer Gabriel Díaz Jaime - Director CIAPEM A.C.
- Lic. Luis Armando Granillo Islas - Jefatura de Seguimiento
- Lic. Héctor Alfaro Mellado - Primera Oficialía de Partes

**Tecnologías Utilizadas:**
- HTML5 / CSS3 / JavaScript (Vanilla)
- Chart.js v4.4.0
- Font Awesome (iconos)
- Google Fonts

## 📄 Licencia

Este proyecto es propiedad del **H. Ayuntamiento de Tulancingo de Bravo, Hidalgo**.

Desarrollado bajo licencia académica por la Universidad Tecnológica de Tulancingo.

**Uso Restringido**: Este software es para uso exclusivo del personal autorizado del H. Ayuntamiento de Tulancingo de Bravo, Hidalgo.

---

<div align="center">
  <strong>Hecho con ❤️ para el gobierno municipal de Tulancingo</strong>
  <br>
  <sub>© 2025 SIRSE Panel Web - v1.0.0</sub>
  <br><br>
  <img src="https://img.shields.io/badge/Made%20in-Tulancingo%2C%20Hidalgo-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Production-success?style=flat-square" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" />
</div>
