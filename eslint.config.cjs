module.exports = [
  {
    // Ignora potencialmente la carpeta node_modules, dist, etc.
    ignores: ["node_modules"],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        es6: true,
        node: true,
        jest: true,
      },
    },
    // Las reglas recomendadas se agregan a través de "extends"
    plugins: {},
    rules: {
      // Añade tus reglas personalizadas aquí
    },
  },
];