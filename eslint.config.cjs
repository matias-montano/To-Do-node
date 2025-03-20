module.exports = [
  {
    ignores: ["node_modules", "frontend/build"], // Ignora la carpeta build del frontend
  },
  {
    files: ["**/*.js", "**/*.jsx"], // Aplica esta configuración a archivos .js y .jsx
    languageOptions: {
      parser: "@babel/eslint-parser", // Usa el parser de Babel
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Habilita JSX
        },
        requireConfigFile: false, // No requiere un archivo de configuración de Babel
      },
      globals: {
        es6: true,
        node: true,
        browser: true, // Habilita el entorno del navegador
      },
    },
    plugins: {
      react: {}, // Habilita el plugin de React
    },
    rules: {
      // Añade tus reglas personalizadas aquí
      "react/jsx-uses-vars": "error", // Previene que variables no utilizadas en JSX sean marcadas como no utilizadas
      "react/jsx-uses-react": "error", // Previene que React sea marcado como no utilizado
    },
  },
];