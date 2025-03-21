# Manejo de Imágenes en la Aplicación

## Arquitectura
- Las imágenes se almacenan usando GridFS de MongoDB
- Los archivos grandes se dividen en chunks para mejor manejo
- Las imágenes se sirven a través de endpoints específicos

## Flujo de Imágenes
1. **Almacenamiento**
   - Las imágenes se suben al servidor
   - GridFS las divide en chunks de 256KB
   - Se genera un ObjectId único para cada imagen

2. **Recuperación**
   - El frontend solicita la imagen usando su ID
   - El backend recupera los chunks
   - Se transmite la imagen al cliente

## Implementación
- `GridFSBucket`: Maneja el almacenamiento
- Endpoint: `/auth/images/:id`
- Los usuarios tienen un campo `image` que referencia el ID de su imagen

## Ejemplo de Uso
```javascript
// Obtener imagen de usuario
const imageUrl = `http://localhost:4000/auth/images/${userData.imageId}`;
```