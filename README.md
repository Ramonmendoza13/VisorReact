# 🎬 VISOR - Puntuación de Series y Películas


Una aplicación web moderna para descubrir y explorar películas y series con puntuaciones detalladas, desarrollada con React y Tailwind CSS.

## ✨ Características

- **🎯 Búsqueda Inteligente**: Busca películas y series por título
- **📊 Puntuaciones Detalladas**: Visualiza calificaciones con códigos de colores
- **📺 Información Completa**: Detalles de películas y series con descripciones
- **🎬 Episodios por Temporada**: Tabla interactiva con puntuaciones de episodios
- **📱 Diseño Responsivo**: Optimizado para todos los dispositivos
- **🎨 Interfaz Moderna**: Diseño atractivo con efectos visuales

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **React Router** - Enrutamiento de aplicaciones de una sola página
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP para realizar peticiones a APIs
- **Vite** - Herramienta de construcción rápida para desarrollo

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/ramonmendoza13/visor.git
   cd visor
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## 🎯 Funcionalidades Principales

### 🏠 Página de Inicio
- **Destacados**: Muestra las mejores películas y series
- **Navegación Intuitiva**: Diseño limpio y fácil de usar
- **Búsqueda Rápida**: Barra de búsqueda prominente

### 🔍 Búsqueda
- **Búsqueda en Tiempo Real**: Encuentra contenido instantáneamente
- **Resultados Filtrados**: Películas y series organizadas
- **Interfaz Responsiva**: Adaptada a todos los tamaños de pantalla

### 📖 Información Detallada
- **Datos Completos**: Título, año, géneros, duración
- **Puntuaciones Visuales**: Códigos de colores para calificaciones
- **Descripciones**: Sinopsis detalladas de cada título

### 📊 Tabla de Episodios (Series)
- **Puntuaciones por Episodio**: Calificaciones individuales
- **Leyenda de Colores**: Guía visual para interpretar notas
- **Organización por Temporadas**: Estructura clara y ordenada

## 🎨 Diseño y UX

### Paleta de Colores
- **Azul Profundo**: Fondo principal y elementos de navegación
- **Amarillo Dorado**: Acentos y elementos destacados
- **Grises**: Textos y elementos secundarios

### Efectos Visuales
- **Gradientes**: Fondos atractivos y modernos
- **Hover Effects**: Interacciones suaves y responsivas
- **Sombras**: Profundidad y elegancia visual
- **Transiciones**: Animaciones fluidas entre estados

### Responsividad
- **Mobile First**: Diseño optimizado para móviles
- **Tablet**: Adaptación para pantallas medianas
- **Desktop**: Experiencia completa en pantallas grandes

## 📁 Estructura del Proyecto

```
visor/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── HeaderComponent.jsx
│   │   ├── FooterComponent.jsx
│   │   ├── MovieCard.jsx
│   │   ├── InfoMovieComponent.jsx
│   │   ├── InfoTvComponent.jsx
│   │   └── TablaNotasEpisodios.jsx
│   ├── pages/              # Páginas de la aplicación
│   │   ├── HomePage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── InfoPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── data/               # Datos estáticos
│   │   └── destacados.js
│   ├── utils/              # Utilidades
│   │   └── notaColors.js
│   └── App.jsx             # Componente principal
├── public/                 # Archivos públicos
└── package.json           # Configuración del proyecto
```

## 🔧 Configuración

### Variables de Entorno
La aplicación utiliza la API de The Movie Database (TMDB). Para desarrollo local, asegúrate de tener configurada la API key:

```javascript
const API_KEY = "tu_api_key_de_tmdb";
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de la construcción
npm run lint         # Análisis de código
```

## 🌟 Características Destacadas

### Códigos de Color para Puntuaciones
- **🟢 Verde Esmeralda (9+)**: Excelente
- **🟢 Verde (8+)**: Muy buena
- **🔵 Verde Azulado (7+)**: Buena
- **🟡 Amarillo (6+)**: Regular
- **🟠 Naranja (5+)**: Aceptable
- **🔴 Rojo (4+)**: Mala
- **🟣 Rosa (3+)**: Muy mala
- **🟣 Morado (<3)**: Pésima

### Navegación Intuitiva
- **Header Fijo**: Navegación siempre accesible
- **Breadcrumbs Visuales**: Orientación clara del usuario
- **Botones de Acción**: Llamadas a la acción prominentes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Ramón Mendoza Candelario**
- LinkedIn: [Ramón Mendoza](https://www.linkedin.com/in/ram%C3%B3n-mendoza-candelario-8894252a9/)
- Portfolio: [Portfolio](https://ramonmendoza13.github.io/Porfolio/)
- GitHub: [@ramonmendoza13](https://github.com/ramonmendoza13)

## 🙏 Agradecimientos

- **The Movie Database (TMDB)** por proporcionar la API de datos
- **React Team** por el framework increíble
- **Tailwind CSS** por el sistema de diseño utility-first
- **Vite** por las herramientas de desarrollo rápidas

---

<div align="center">
  <p>🎬 <strong>VISOR</strong> - Descubre las mejores películas y series</p>
  <p>⭐ ¡Dale una estrella si te gusta el proyecto!</p>
</div>