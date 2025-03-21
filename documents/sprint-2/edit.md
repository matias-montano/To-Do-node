# Funcionalidad de Edición de Perfil de Usuario

## Características Implementadas
- Edición de información del perfil
- Subida y vista previa de imagen de perfil
- Actualización de datos personales

## Campos Editables
- Imagen de Perfil
- Contraseña (opcional)
- Correo Electrónico
- Número de Teléfono
- Nombre
- Apellido
- Fecha de Nacimiento
- Habilidades (separadas por comas)

## Implementación Técnica
### Frontend
- Formulario con vista previa de imagen
- Vista previa de imagen en tiempo real
- Validación de datos
- Estados de carga
- Manejo de errores

### Backend
- Endpoint para subida de imágenes
- Endpoint para actualización de datos
- Validación de correo electrónico único
- Almacenamiento de imágenes y vinculación con usuario

## Endpoints de API
```javascript
PUT /auth/user/update
POST /auth/upload (para imágenes)
```

## Flujo de Datos
1. Usuario selecciona imagen -> Se muestra vista previa
2. Usuario envía formulario
3. La imagen se sube primero (si se cambió)
4. Los datos del usuario se actualizan con el nuevo ID de imagen
5. El perfil se actualiza con los nuevos datos

## Seguridad
- Autenticación basada en tokens
- Validación de tipo de archivo
- Verificación de correo electrónico único