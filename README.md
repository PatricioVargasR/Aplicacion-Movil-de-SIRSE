# 🚀 SIRSE API - Backend REST

<div align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Turso-4F46E5?style=for-the-badge&logo=turso&logoColor=white" />
</div>

<br>

<div align="center">
  <h3>🛡️ Sistema Integral de Reportes de Seguridad y Emergencias</h3>
  <p>API RESTful para Tulancingo de Bravo, Hidalgo</p>
</div>

## 📋 Descripción

**SIRSE API** es el backend del Sistema Integral de Reportes de Seguridad y Emergencias, una API RESTful construida con **FastAPI** que proporciona servicios para la gestión de reportes ciudadanos, autenticación de usuarios, estadísticas en tiempo real y administración de catálogos.

La API sirve como puente entre el **chatbot de WhatsApp**, el **panel web administrativo** y la **aplicación móvil ciudadana**, centralizando toda la lógica de negocio y el acceso a datos.

### 🎯 Propósito

Proveer una API robusta, escalable y bien documentada para:
- 🔐 Gestión de autenticación y autorización con JWT
- 📋 CRUD completo de reportes ciudadanos
- 📊 Generación de estadísticas y métricas en tiempo real
- 👥 Administración de usuarios municipales
- 🏷️ Gestión de catálogos (categorías, estados)
- 📄 Documentación interactiva automática (Swagger/ReDoc)

> **Nota**: Esta API está diseñada para ser consumida por múltiples clientes: WhatsApp Bot, Panel Web y App Móvil.

## ✨ Características Principales

### 🔐 Autenticación y Autorización
- Sistema de autenticación basado en **JWT (JSON Web Tokens)**
- Endpoints públicos y protegidos
- Gestión de sesiones y tokens de acceso
- Hash seguro de contraseñas (pendiente: bcrypt)
- Refresh tokens (pendiente)

### 📋 Gestión de Reportes
- **CRUD completo** de reportes ciudadanos
- Generación automática de folios únicos
- Filtrado por categoría, estado y fecha
- Georreferenciación (latitud/longitud)
- Endpoints públicos para consulta
- Endpoints protegidos para modificación
- Soporte para multimedia (imágenes, videos)

### 📊 Estadísticas en Tiempo Real
- Métricas generales del sistema
- Reportes por categoría
- Reportes por estado
- Tendencias mensuales
- Reportes recientes
- Zonas calientes (mayor concentración)
- Análisis temporal

### 👥 Administración de Usuarios
- Gestión completa de usuarios administrativos
- Roles y permisos por departamento
- Cambio de contraseña seguro
- Perfil de usuario actual

### 🏷️ Catálogos Configurables
- Gestión de categorías de reportes
- Gestión de estados de reportes
- Soft delete (desactivación)
- Validación de relaciones

### 📄 Documentación Automática
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- Esquemas de validación con Pydantic
- Ejemplos de requests y responses

## 📁 Estructura del Proyecto

```
sirse-api/
├── alembic/                      # Migraciones de base de datos
│   ├── versions/                 # Scripts de migración
│   │   └── 87f019df8236_fix_string_lengths.py
│   ├── env.py                    # Configuración de Alembic
│   └── README                    # Documentación de Alembic
│
├── routers/                      # Endpoints organizados por dominio
│   ├── __init__.py
│   ├── auth.py                   # 🔐 Autenticación y autorización
│   ├── categorias.py             # 🏷️ Gestión de categorías
│   ├── estados.py                # 📊 Gestión de estados
│   ├── reportes.py               # 📋 CRUD de reportes
│   ├── estadisticas.py           # 📈 Estadísticas y métricas
│   ├── usuarios.py               # 👥 Gestión de usuarios
│   └── multimedia.py             # 📷 Gestión de archivos multimedia
│
├── main.py                       # 🚀 Aplicación principal FastAPI
├── models.py                     # 📊 Modelos de SQLAlchemy
├── schemas.py                    # 📝 Esquemas de Pydantic
├── database.py                   # 🗄️ Configuración de base de datos
├── seed_data.py                  # 🌱 Script de inicialización de datos
│
├── alembic.ini                   # Configuración de Alembic
├── requirements.txt              # 📦 Dependencias del proyecto
├── .env                          # 🔒 Variables de entorno (no versionado)
├── .gitignore                    # 📝 Archivos ignorados por Git
└── README.md                     # 📖 Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos

#### Software Necesario
- **Python 3.11+** (recomendado)
- **pip** (gestor de paquetes de Python)
- **Git** (control de versiones)
- **Base de datos**:
  - Turso (SQLite en la nube) - recomendado
  - MySQL 8.0+
  - PostgreSQL 13+

### Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sirse-api.git
cd sirse-api
```

#### 2. Crear entorno virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

#### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# ============================================
# BASE DE DATOS (Turso - SQLite en la nube)
# ============================================
TURSO_DATABASE_URL=libsql://tu-instancia.turso.io
TURSO_AUTH_TOKEN=tu_token_de_autenticacion

# ============================================
# JWT SECRETO
# ============================================
SECRET_KEY=tu_clave_secreta_super_segura_cambiar_en_produccion_123456
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ============================================
# CONFIGURACIÓN DE LA API
# ============================================
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
DEBUG=True

# ============================================
# CORS (dominios permitidos)
# ============================================
ALLOWED_ORIGINS=http://localhost:3000,https://panel.sirse.tulancingo.gob.mx
```

**Alternativa con MySQL/PostgreSQL:**
```env
# MySQL
DB_USER=root
DB_PASS=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sirse_db

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/sirse_db
```

#### 5. Inicializar la base de datos

**Con Alembic (recomendado para producción):**
```bash
# Crear las tablas
alembic upgrade head

# Poblar datos iniciales
python seed_data.py
```

**Automático (FastAPI creará las tablas al iniciar):**
```python
# En main.py ya está configurado:
Base.metadata.create_all(bind=engine)
```

#### 6. Ejecutar el servidor de desarrollo
```bash
# Modo desarrollo con auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Acceder a:
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
# Health: http://localhost:8000/health
```

#### 7. Verificar instalación

Abre tu navegador en: `http://localhost:8000/docs`

Deberías ver la documentación interactiva de Swagger.

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### `usuarios`
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
nombre          VARCHAR(100) NOT NULL
email           VARCHAR(150) UNIQUE NOT NULL
contraseña      VARCHAR(255) NOT NULL
telefono        VARCHAR(20)
departamento    VARCHAR(100)
rol             VARCHAR(50) DEFAULT 'Operador'
created_at      DATETIME DEFAULT NOW()
updated_at      DATETIME DEFAULT NOW()
```

#### `reportes`
```sql
id_reporte           INT PRIMARY KEY AUTO_INCREMENT
folio                VARCHAR(50) UNIQUE NOT NULL
nombre               VARCHAR(100) NOT NULL
apellido_paterno     VARCHAR(100) NOT NULL
apellido_materno     VARCHAR(100) NOT NULL
telefono_reportante  VARCHAR(20)
descripcion          VARCHAR(500)
latitud              VARCHAR(50)
longitud             VARCHAR(50)
direccion            VARCHAR(255)
id_categoria         INT FOREIGN KEY -> categorias
id_estado            INT FOREIGN KEY -> estados
created_at           DATETIME DEFAULT NOW()
updated_at           DATETIME DEFAULT NOW()
```

#### `categorias`
```sql
id_categoria    INT PRIMARY KEY AUTO_INCREMENT
nombre          VARCHAR(100) NOT NULL
descripcion     TEXT
estado          BOOLEAN DEFAULT TRUE
created_at      DATETIME DEFAULT NOW()
```

#### `estados`
```sql
id_estado       INT PRIMARY KEY AUTO_INCREMENT
nombre          VARCHAR(100) NOT NULL
descripcion     TEXT
activo          BOOLEAN DEFAULT TRUE
created_at      DATETIME DEFAULT NOW()
```

#### `multimedia`
```sql
id_multimedia   INT PRIMARY KEY AUTO_INCREMENT
id_reporte      INT FOREIGN KEY -> reportes
url_archivo     VARCHAR(255) NOT NULL
tipo_archivo    VARCHAR(50) NOT NULL
created_at      DATETIME DEFAULT NOW()
```

### Diagrama de Relaciones

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  categorias  │◄──────│   reportes   │──────►│   estados    │
└──────────────┘       └──────┬───────┘       └──────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌──────────────┐
                       │  multimedia  │
                       └──────────────┘
```

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:8000/api
```

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/registro` | Registrar nuevo usuario | ❌ |
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ |
| `GET` | `/api/auth/me` | Obtener perfil actual | ✅ |
| `DELETE` | `/api/auth/borrar_todos` | Eliminar todos los usuarios (dev) | ❌ |

#### Ejemplo de Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tulancingo.gob.mx",
    "contraseña": "admin123"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Admin Municipal",
    "email": "admin@tulancingo.gob.mx",
    "telefono": null,
    "departamento": "Sistemas",
    "rol": "Administrador"
  }
}
```

### 📋 Reportes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/reportes/` | Listar reportes (con filtros) | ❌ |
| `GET` | `/api/reportes/{id}` | Obtener reporte por ID | ❌ |
| `GET` | `/api/reportes/folio/{folio}` | Obtener reporte por folio | ❌ |
| `GET` | `/api/reportes/mapa/puntos` | Reportes para mapa | ❌ |
| `POST` | `/api/reportes/` | Crear nuevo reporte | ✅ |
| `PUT` | `/api/reportes/{id}` | Actualizar reporte | ✅ |
| `DELETE` | `/api/reportes/{id}` | Eliminar reporte | ✅ |

#### Ejemplo de Creación de Reporte
```bash
curl -X POST "http://localhost:8000/api/reportes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "nombre": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "telefono_reportante": "7751234567",
    "descripcion": "Bache profundo en calle principal",
    "latitud": "20.0846",
    "longitud": "-98.3634",
    "direccion": "Av. Juárez #123, Centro",
    "id_categoria": 7,
    "id_estado": 1
  }'
```

#### Filtros Disponibles
```bash
# Filtrar por categoría
GET /api/reportes/?id_categoria=1

# Filtrar por estado
GET /api/reportes/?id_estado=1

# Paginación
GET /api/reportes/?skip=0&limit=20

# Combinar filtros
GET /api/reportes/?id_categoria=1&id_estado=1&limit=10
```

### 📊 Estadísticas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/estadisticas/generales` | Métricas generales | ✅ |
| `GET` | `/api/estadisticas/por-categoria` | Reportes por categoría | ✅ |
| `GET` | `/api/estadisticas/por-estado` | Reportes por estado | ✅ |
| `GET` | `/api/estadisticas/por-mes` | Reportes por mes | ✅ |
| `GET` | `/api/estadisticas/recientes` | Reportes recientes | ✅ |
| `GET` | `/api/estadisticas/zonas-calientes` | Zonas con más reportes | ✅ |

#### Ejemplo de Respuesta - Estadísticas Generales
```json
{
  "total_reportes": 150,
  "total_categorias": 11,
  "reportes_pendientes": 45,
  "reportes_proceso": 30,
  "reportes_resueltos": 75,
  "reportes_ultimo_mes": 28
}
```

### 🏷️ Categorías

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/categorias/` | Listar categorías | ✅ |
| `GET` | `/api/categorias/{id}` | Obtener categoría | ✅ |
| `POST` | `/api/categorias/` | Crear categoría | ✅ |
| `PUT` | `/api/categorias/{id}` | Actualizar categoría | ✅ |
| `DELETE` | `/api/categorias/{id}` | Desactivar categoría | ✅ |

### 📊 Estados

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/estados/` | Listar estados | ❌ |
| `GET` | `/api/estados/{id}` | Obtener estado | ❌ |
| `POST` | `/api/estados/` | Crear estado | ✅ |
| `PUT` | `/api/estados/{id}` | Actualizar estado | ✅ |
| `DELETE` | `/api/estados/{id}` | Desactivar estado | ✅ |

### 👥 Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/usuarios/` | Listar usuarios | ✅ |
| `GET` | `/api/usuarios/{id}` | Obtener usuario | ✅ |
| `POST` | `/api/usuarios/` | Crear usuario | ✅ |
| `PUT` | `/api/usuarios/{id}` | Actualizar usuario | ✅ |
| `DELETE` | `/api/usuarios/{id}` | Eliminar usuario | ✅ |
| `PUT` | `/api/usuarios/me/cambiar-contraseña` | Cambiar contraseña | ✅ |

### 📷 Multimedia

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/multimedia/{reporte_id}/upload` | Subir archivo | ✅ |
| `GET` | `/api/multimedia/reporte/{reporte_id}` | Listar archivos | ✅ |
| `DELETE` | `/api/multimedia/{id}` | Eliminar archivo | ✅ |

## 🔐 Autenticación con JWT

### Flujo de Autenticación

```
1. Cliente → POST /api/auth/login
   Body: { email, contraseña }

2. API valida credenciales
   ✓ Usuario existe
   ✓ Contraseña correcta

3. API genera JWT Token
   Token = { sub: email, exp: timestamp }

4. API responde con token
   Response: { access_token, token_type, usuario }

5. Cliente guarda token
   localStorage.setItem('token', access_token)

6. Cliente incluye token en requests
   Headers: { Authorization: "Bearer <token>" }

7. API valida token en endpoints protegidos
   ✓ Token válido → Procesa request
   ✗ Token inválido → 401 Unauthorized
```

### Uso del Token en Requests

```bash
# Incluir token en header Authorization
curl -X GET "http://localhost:8000/api/estadisticas/generales" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Endpoints Públicos vs Protegidos

✅ **Públicos** (no requieren autenticación):
- `GET /api/reportes/` - Listar reportes
- `GET /api/reportes/{id}` - Ver detalles
- `GET /api/estados/` - Listar estados
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrarse

🔒 **Protegidos** (requieren JWT token):
- Todos los endpoints de **usuarios**
- Todos los endpoints de **estadísticas**
- Crear, actualizar y eliminar **reportes**
- Gestión de **categorías**
- Subir **multimedia**

## 📝 Schemas de Pydantic

### Reporte (Create)
```python
{
  "nombre": "string",
  "apellido_paterno": "string",
  "apellido_materno": "string",
  "telefono_reportante": "string",  # opcional
  "descripcion": "string",          # opcional
  "latitud": "string",              # opcional
  "longitud": "string",             # opcional
  "direccion": "string",            # opcional
  "id_categoria": 1,
  "id_estado": 1
}
```

### Reporte (Response)
```python
{
  "id_reporte": 1,
  "folio": "SIRSE-20231215143000-AB12",
  "nombre": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "García",
  "telefono_reportante": "7751234567",
  "descripcion": "Bache profundo",
  "latitud": "20.0846",
  "longitud": "-98.3634",
  "direccion": "Av. Juárez #123",
  "id_categoria": 7,
  "id_estado": 1,
  "created_at": "2023-12-15T14:30:00",
  "updated_at": "2023-12-15T14:30:00",
  "categoria": {
    "id_categoria": 7,
    "nombre": "Baches",
    "descripcion": "...",
    "estado": true,
    "created_at": "..."
  },
  "estado": {
    "id_estado": 1,
    "nombre": "Pendiente",
    "descripcion": "...",
    "activo": true,
    "created_at": "..."
  },
  "multimedia": []
}
```

### Usuario (Registro)
```python
{
  "nombre": "string",
  "email": "user@example.com",
  "contraseña": "string",
  "telefono": "string",        # opcional
  "departamento": "string",    # opcional
  "rol": "Operador"           # opcional
}
```

## 🗄️ Migraciones con Alembic

### Comandos Útiles

```bash
# Crear una nueva migración
alembic revision --autogenerate -m "descripción_del_cambio"

# Aplicar migraciones pendientes
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver historial de migraciones
alembic history

# Ver estado actual
alembic current

# Revertir a una versión específica
alembic downgrade <revision_id>
```

### Crear una Migración Manual

```bash
# Generar script de migración
alembic revision -m "agregar_columna_prioridad"

# Editar el archivo generado en alembic/versions/
# Agregar lógica en upgrade() y downgrade()

# Aplicar migración
alembic upgrade head
```

## 🌱 Datos Iniciales (Seed)

El script `seed_data.py` inicializa la base de datos con:

### Estados (5)
```python
1. Pendiente      - Reporte recibido, pendiente de revisión
2. En proceso     - Reporte en proceso de atención
3. Resuelto       - Reporte atendido y resuelto
4. Rechazado      - Reporte no válido o duplicado
5. Cerrado        - Reporte cerrado
```

### Categorías (11)
```python
1.  Seguridad            - Reportes de seguridad pública
2.  Robo                 - Reportes de robos o asaltos
3.  Accidente            - Reportes de accidentes viales
4.  Vandalismo           - Actos de vandalismo
5.  Persona sospechosa   - Reportes de personas sospechosas
6.  Alumbrado público    - Problemas de iluminación
7.  Baches               - Reportes de baches en calles
8.  Basura               - Acumulación de basura
9.  Fuga de agua         - Reportes de fugas de agua
10. Animal callejero     - Presencia de animales
11. Otro                 - Otros tipos de reportes
```

### Ejecutar Seed
```bash
python seed_data.py
```

## 🧪 Testing

### Estructura de Tests (Recomendada)
```
tests/
├── __init__.py
├── test_auth.py              # Tests de autenticación
├── test_reportes.py          # Tests de reportes
├── test_categorias.py        # Tests de categorías
├── test_estados.py           # Tests de estados
├── test_usuarios.py          # Tests de usuarios
└── conftest.py               # Fixtures compartidos
```

### Ejecutar Tests
```bash
# Instalar pytest
pip install pytest pytest-cov

# Ejecutar todos los tests
pytest

# Con cobertura
pytest --cov=. --cov-report=html

# Test específico
pytest tests/test_auth.py -v
```

## 🔒 Seguridad

### Mejores Prácticas Implementadas
- ✅ **JWT para autenticación**: Tokens con expiración
- ✅ **Validación de datos**: Pydantic schemas
- ✅ **CORS configurado**: Orígenes permitidos específicos
- ✅ **Endpoints protegidos**: Dependencias de autenticación
- ✅ **Soft delete**: No eliminación física de datos críticos

### Pendientes / Recomendaciones
- ⚠️ **Hash de contraseñas**: Implementar bcrypt/argon2
- ⚠️ **Refresh tokens**: Para sesiones persistentes
- ⚠️ **Rate limiting**: Prevenir abuso de la API
- ⚠️ **HTTPS obligatorio**: En producción
- ⚠️ **Validación de inputs**: Sanitización adicional
- ⚠️ **Logging de seguridad**: Auditoría de accesos
- ⚠️ **Roles y permisos**: RBAC más granular

### Implementar Bcrypt (Recomendado)

```python
# En requirements.txt
passlib[bcrypt]

# En routers/auth.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_contraseña(contraseña: str) -> str:
    return pwd_context.hash(contraseña)

def verificar_contraseña(contraseña_plana: str, contraseña_hash: str) -> bool:
    return pwd_context.verify(contraseña_plana, contraseña_hash)
```

## 🚀 Despliegue en Producción

### Checklist Pre-Despliegue
- [ ] Cambiar `SECRET_KEY` a uno seguro (mínimo 32 caracteres)
- [ ] Configurar base de datos de producción
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Habilitar HTTPS en el servidor
- [ ] Configurar CORS con dominios específicos
- [ ] Implementar logging robusto
- [ ] Configurar backups automáticos de BD
- [ ] Implementar rate limiting
- [ ] Configurar monitoreo (Prometheus/Grafana)
- [ ] Documentar credenciales de acceso

### Despliegue con Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Configurar proyecto
vercel

# Deploy a producción
vercel --prod
```

**vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

### Despliegue con Docker

**Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - TURSO_DATABASE_URL=${TURSO_DATABASE_URL}
      - TURSO_AUTH_TOKEN=${TURSO_AUTH_TOKEN}
      - SECRET_KEY=${SECRET_KEY}
    restart: unless-stopped
```

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f api
```

### Despliegue con Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Deploy
railway up
```

## 🐛 Solución de Problemas

### Error: "No module named 'routers'"
```bash
# Verificar estructura de carpetas
ls -la routers/

# Verificar que existe routers/__init__.py
touch routers/__init__.py
```

### Error: "Could not connect to database"
```bash
# Verificar variables de entorno
cat .env

# Verificar conexión a Turso
curl -I ${TURSO_DATABASE_URL}

# Verificar token de autenticación
echo $TURSO_AUTH_TOKEN
```

### Error: "401 Unauthorized"
```bash
# Verificar que el token esté incluido
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/usuarios/

# Verificar que el token no esté expirado
# Los tokens expiran en 30 minutos por defecto

# Generar un nuevo token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tulancingo.gob.mx","contraseña":"admin123"}'
```

### Error: "CORS policy blocked"
```bash
# Verificar configuración de CORS en main.py
# Agregar tu dominio a allow_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-dominio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Base de datos no se crea
```bash
# Opción 1: Dejar que FastAPI la cree automáticamente
# Ya está configurado en main.py:
Base.metadata.create_all(bind=engine)

# Opción 2: Usar Alembic
alembic upgrade head

# Opción 3: Poblar con seed_data.py
python seed_data.py
```

## 📊 Monitoreo y Métricas

### Health Check
```bash
# Verificar estado de la API
curl http://localhost:8000/health

# Respuesta esperada:
{"status": "ok", "service": "SIRSE API"}
```

### Logs
```python
# Configurar logging en main.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
```

### Métricas Recomendadas
- Total de requests por endpoint
- Tiempo de respuesta promedio
- Tasa de errores (4xx, 5xx)
- Reportes creados por día
- Usuarios activos
- Uso de categorías

## 📚 Documentación Adicional

### Swagger UI
Accede a la documentación interactiva en:
```
http://localhost:8000/docs
```

**Características:**
- Prueba endpoints directamente
- Ve esquemas de request/response
- Autenticación integrada (botón "Authorize")
- Ejemplos de código

### ReDoc
Documentación alternativa (más limpia):
```
http://localhost:8000/redoc
```

### OpenAPI Schema
Descarga el schema JSON:
```
http://localhost:8000/openapi.json
```

## 🔄 Versionado de la API

### Estrategia Recomendada
```python
# Opción 1: Prefijo en routers
app.include_router(reportes.router, prefix="/api/v1")

# Opción 2: Múltiples versiones
from routers.v1 import reportes as reportes_v1
from routers.v2 import reportes as reportes_v2

app.include_router(reportes_v1.router, prefix="/api/v1")
app.include_router(reportes_v2.router, prefix="/api/v2")
```

### Deprecación de Endpoints
```python
@router.get("/viejo-endpoint", deprecated=True)
def endpoint_deprecado():
    """Este endpoint será eliminado en v2.0"""
    return {"message": "Usa /nuevo-endpoint en su lugar"}
```

## 🤝 Contribución

### Flujo de Trabajo
```bash
# 1. Fork del repositorio
# 2. Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# 3. Hacer commits
git commit -m "feat: agregar endpoint de notificaciones"

# 4. Push a tu fork
git push origin feature/nueva-funcionalidad

# 5. Crear Pull Request
```

### Convención de Commits
```
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
style:    Formato, punto y coma faltante, etc
refactor: Refactorización de código
test:     Agregar tests
chore:    Actualizar dependencias, etc
```

### Guía de Estilo
- Seguir PEP 8
- Docstrings en español
- Type hints donde sea posible
- Tests para nuevas funcionalidades

## 📞 Soporte y Contacto

### Reportar Problemas
- **GitHub Issues**: [github.com/tu-usuario/sirse-api/issues](https://github.com/tu-usuario/sirse-api/issues)
- **Email Técnico**: soporte@sirse.tulancingo.gob.mx

### Contacto Institucional
- **Oficina Municipal**: (775) 123-4567
- **Sitio Web**: [www.tulancingo.gob.mx](https://www.tulancingo.gob.mx)

### Documentación Técnica
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **SQLAlchemy**: [docs.sqlalchemy.org](https://docs.sqlalchemy.org)
- **Alembic**: [alembic.sqlalchemy.org](https://alembic.sqlalchemy.org)
- **Pydantic**: [docs.pydantic.dev](https://docs.pydantic.dev)

## 👥 Créditos

**Universidad Tecnológica de Tulancingo**  
Ingeniería en Desarrollo y Gestión de Software

**Desarrollado para:**  
H. Ayuntamiento de Tulancingo de Bravo, Hidalgo

**Con el apoyo de:**
- Mtro. Netzer Gabriel Díaz Jaime - Director CIAPEM A.C.
- Lic. Luis Armando Granillo Islas - Jefatura de Seguimiento
- Lic. Héctor Alfaro Mellado - Primera Oficialía de Partes

**Stack Tecnológico:**
- **Framework**: FastAPI 0.104.1
- **ORM**: SQLAlchemy 2.0.23
- **Base de datos**: Turso (SQLite)
- **Autenticación**: JWT (python-jose)
- **Validación**: Pydantic 2.5.0
- **Servidor**: Uvicorn 0.24.0
- **Migraciones**: Alembic

## 📄 Licencia

Este proyecto es propiedad del **H. Ayuntamiento de Tulancingo de Bravo, Hidalgo**.

Desarrollado bajo licencia académica por la Universidad Tecnológica de Tulancingo.

**Uso Restringido**: Este software es para uso exclusivo del H. Ayuntamiento de Tulancingo de Bravo, Hidalgo y sus sistemas autorizados (WhatsApp Bot, Panel Web, App Móvil).

---

<div align="center">
  <strong>Construido con ❤️ para el gobierno municipal de Tulancingo</strong>
  <br>
  <sub>© 2025 SIRSE API - v1.0.0</sub>
  <br><br>
  <img src="https://img.shields.io/badge/Made%20in-Tulancingo%2C%20Hidalgo-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Production-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat-square" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" />
</div>
