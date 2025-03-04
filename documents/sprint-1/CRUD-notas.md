# CRUD-notas

## Descripción
En este sprint, hemos implementado las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) básicas para gestionar tareas pendientes en nuestra API RESTful utilizando Node.js, Express y MongoDB.

## Endpoints

### Obtener todas las tareas
- **Método**: GET
- **URL**: `/tasks`
- **Descripción**: Obtiene una lista de todas las tareas.
- **Respuesta**:
  ```json
  [
    {
      "status": "pending",
      "_id": "67c734d68425110013bfeb05",
      "title": "Nueva tarea",
      "description": "Descripción de la nueva tarea",
      "__v": 0
    }
  ]
  ```

### Crear una nueva tarea
- **Método**: POST
- **URL**: `/tasks`
- **Descripción**: Crea una nueva tarea.
- **Cuerpo de la solicitud**:
  ```json
  {
    "title": "Nueva tarea",
    "description": "Descripción de la nueva tarea"
  }
  ```
- **Respuesta**:
  ```json
  {
    "status": "pending",
    "_id": "67c734d68425110013bfeb05",
    "title": "Nueva tarea",
    "description": "Descripción de la nueva tarea",
    "__v": 0
  }
  ```

### Actualizar una tarea
- **Método**: PUT
- **URL**: `/tasks/:id`
- **Descripción**: Actualiza una tarea existente.
- **Cuerpo de la solicitud**:
  ```json
  {
    "title": "Tarea actualizada",
    "description": "Descripción actualizada",
    "status": "completed"
  }
  ```
- **Respuesta**:
  ```json
  {
    "status": "completed",
    "_id": "67c734d68425110013bfeb05",
    "title": "Tarea actualizada",
    "description": "Descripción actualizada",
    "__v": 0
  }
  ```

### Eliminar una tarea
- **Método**: DELETE
- **URL**: `/tasks/:id`
- **Descripción**: Elimina una tarea existente.
- **Respuesta**:
  ```json
  {
    "message": "Task deleted"
  }
  ```
