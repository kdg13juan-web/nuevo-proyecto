# MiniBlogM2

API REST completa para gestionar autores y posts. Construida con Node.js, Express y PostgreSQL.

🚀 **Deploy en producción:** https://miniblogm2-production.up.railway.app  
📖 **Documentación Swagger:** https://miniblogm2-production.up.railway.app/api-docs

---

## 📋 Tabla de contenidos

- [Requisitos](#requisitos)
- [Instalación local](#instalación-local)
- [Endpoints](#endpoints)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Tests](#tests)
- [Deploy en Railway](#deploy-en-railway)
- [Validaciones y errores](#validaciones-y-errores)
- [Estructura del proyecto](#estructura-del-proyecto)

---

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/kdg13juan/MiniBlogM2.git
cd MiniBlogM2
npm install
```

### 2. Configurar variables de entorno

Creá un archivo `.env` en la raíz basándote en `.env.example`:

```bash
cp .env.example .env
```

Editá `.env` con tus credenciales:

```
PORT=4000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=nodepg
DB_PASSWORD=tu_password
DB_PORT=5432
```

### 3. Crear la base de datos

```bash
psql -U postgres -d nodepg -f docs/setup.sql
```

Esto crea las tablas `authors` y `posts` con 3 autores y 4 posts de ejemplo.

### 4. Iniciar el servidor

```bash
npm start          # modo producción
npm run dev        # modo desarrollo (auto-reload con --watch)
```

**Local:** http://localhost:4000  
**Swagger:** http://localhost:4000/api-docs

---

## Endpoints

### Autores CRUD

| Método | Ruta         | Descripción               | Status codes     |
|--------|--------------|---------------------------|------------------|
| GET    | /authors     | Listar todos los autores  | 200              |
| GET    | /authors/:id | Obtener un autor por ID   | 200, 404         |
| POST   | /authors     | Crear nuevo autor         | 201, 400, 409    |
| PUT    | /authors/:id | Actualizar un autor       | 200, 400, 404    |
| DELETE | /authors/:id | Eliminar un autor         | 204, 404         |

### Posts CRUD

| Método | Ruta                             | Descripción                             | Status codes  |
|--------|----------------------------------|-----------------------------------------|---------------|
| GET    | /authors/posts                   | Listar todos los posts                  | 200           |
| GET    | /posts/author/:authorId          | Posts de un autor (ruta alternativa)   | 200, 404      |
| GET    | /authors/:id/posts               | Posts de un autor específico             | 200, 404      |
| GET    | /authors/:id/posts/:postId       | Un post específico de un autor           | 200, 404      |
| POST   | /authors/:id/posts               | Crear post para un autor                | 201, 400, 404 |
| PUT    | /authors/:authorId/posts/:postId | Actualizar un post                      | 200, 400, 404 |
| DELETE | /authors/:authorId/posts/:postId | Eliminar un post                        | 200, 404      |

---

## Ejemplos de uso

### Crear un autor

```bash
curl -X POST https://miniblogm2-production.up.railway.app/authors \
  -H "Content-Type: application/json" \
  -d '{
    "username": "maria_tech",
    "email": "maria@example.com",
    "password_hash": "hashed_pass_123"
  }'
```

**Respuesta (201):**
```json
{
  "id": 4,
  "username": "maria_tech",
  "email": "maria@example.com",
  "created_at": "2026-06-23T10:30:00.000Z"
}
```

### Obtener todos los autores

```bash
curl https://miniblogm2-production.up.railway.app/authors
```

### Crear un post para un autor

```bash
curl -X POST https://miniblogm2-production.up.railway.app/authors/1/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi nuevo blog post",
    "content": "Contenido del post aquí...",
    "published": true
  }'
```

### Obtener posts de un autor

```bash
curl https://miniblogm2-production.up.railway.app/posts/author/1
```

---

## Validaciones y errores

### Status codes

- **200** — Operación exitosa (GET, PUT, DELETE)
- **201** — Recurso creado (POST)
- **204** — Recurso eliminado, sin contenido (DELETE autor)
- **400** — Campos obligatorios faltantes o datos inválidos
- **404** — Recurso no encontrado
- **409** — Email o username ya en uso
- **500** — Error del servidor

### Campos obligatorios

**Autor (POST/PUT):**
- `username` (string, único)
- `email` (string, único)
- `password_hash` (string)

**Post (POST/PUT):**
- `title` (string)
- `content` (string)

### Ejemplos de errores

**Email duplicado (409):**
```json
{
  "error": "El email ya está en uso"
}
```

**Campos faltantes (400):**
```json
{
  "error": "username, email y password_hash son obligatorios"
}
```

**Recurso no encontrado (404):**
```json
{
  "error": "Autor no encontrado"
}
```

---

## Tests

Ejecutá los 18 tests automáticos que cubren CRUD completo y casos de error:

```bash
npm test
```

Con cobertura:

```bash
npm run test:coverage
```

Los tests usan Jest + Supertest y crean/eliminan sus propios datos sin afectar el seed.

---

## Deploy en Railway

### 1. Preparar el repositorio

```bash
git add .
git commit -m "ready for railway deploy"
git push origin main
```

### 2. Crear proyecto en Railway

- Entrá a [railway.app](https://railway.app)
- Creá una cuenta con GitHub
- Click en **New Project → Deploy from GitHub repo**
- Seleccioná tu repositorio

### 3. Agregar PostgreSQL

- Click en **+ Add**
- Seleccioná **Database → PostgreSQL**

### 4. Configurar variables de entorno

En tu servicio Node.js → **Variables → Raw Editor**, pegá:

```
DB_USER=${{Postgres.PGUSER}}
DB_HOST=${{Postgres.PGHOST}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_PORT=${{Postgres.PGPORT}}
PORT=4000
```

### 5. Crear las tablas

En el servicio Postgres → **Database → Data**, pegá y ejecutá el contenido de `docs/setup.sql`.

### 6. Generar URL pública

En tu servicio Node.js → **Settings → Networking → Generate Domain**.

### 7. Confirmar deploy

Cada push a `main` redeploya automáticamente.

---

## Estructura del proyecto

```
MiniBlogM2/
├── src/
│   ├── controllers/           # Lógica de peticiones/respuestas
│   │   ├── authors.controllers.js
│   │   └── posts.controllers.js
│   ├── services/              # Lógica de negocio y BD
│   │   ├── authors.service.js
│   │   └── posts.service.js
│   ├── routes/                # Definición de endpoints
│   │   ├── authors.routes.js
│   │   └── posts.routes.js
│   ├── middleware/            # Manejo global de errores
│   │   └── errorHandler.js
│   ├── db.js                  # Pool de conexión PostgreSQL
│   └── index.js               # Punto de entrada
├── docs/
│   ├── openapi.yaml           # Documentación Swagger
│   └── setup.sql              # Script de creación de tablas
├── tests/
│   └── api.test.js            # 18 tests automatizados
├── .env.example               # Variables de ejemplo
├── package.json
└── README.md                  # Este archivo
```

---

## Tecnologías

- **Runtime:** Node.js 18+
- **Framework:** Express 5
- **Base de datos:** PostgreSQL 14+
- **Testing:** Jest + Supertest
- **Documentación:** OpenAPI 3.0 / Swagger UI
- **Hosting:** Railway

---

## Variables de entorno

Copiar `.env.example` a `.env`:

```bash
PORT=4000                      # Puerto del servidor
DB_USER=postgres               # Usuario de PostgreSQL
DB_HOST=localhost              # Host de la BD
DB_NAME=nodepg                 # Nombre de la BD
DB_PASSWORD=tu_password        # Contraseña
DB_PORT=5432                   # Puerto de PostgreSQL
```

---

## Próximas mejoras

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Paginación en endpoints GET
- [ ] Filtros de búsqueda en posts
- [ ] Validación de email con regex
- [ ] Logs centralizados

---

## Licencia

ISC — Libre de usar, modificar y distribuir.

---

## Contacto

GitHub: [@kdg13juan-web](https://github.com/kdg13juan-web)  
