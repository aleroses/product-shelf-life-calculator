# Calculadora de Vida Útil de Productos

Una calculadora responsive para control de bodega y gestión de inventarios que permite calcular la vida útil restante de productos, determinar su estado de aceptación y visualizar resultados de forma clara y moderna.

## 🚀 Características

- ✅ Cálculo automático de vida útil total
- ✅ Cálculo de días restantes hasta la caducidad
- ✅ Porcentaje de vida útil restante
- ✅ Evaluación automática del estado del producto (Aceptable / Límite aceptable / Rechazado)
- ✅ Interfaz responsive (mobile, tablet, desktop)
- ✅ Modo oscuro y claro con efectos glassmorphism
- ✅ Arquitectura limpia con TypeScript
- ✅ Manejo correcto de fechas (años bisiestos, meses variables)

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de la build de producción
npm run preview
```

## 📐 Reglas de Negocio

### Cálculo de Vida Útil

1. **Vida útil total**: Diferencia en días entre la fecha de elaboración y la fecha de caducidad
2. **Días restantes**: Diferencia entre la fecha de caducidad (menos 3 días) y la fecha de evaluación
3. **Porcentaje de vida útil**: `(días restantes / vida útil total) × 100`

### Estados del Producto

| Porcentaje | Estado | Aceptación |
|------------|--------|------------|
| ≥ 80% | Recién producido | ✅ Aceptable |
| ≥ 70% hasta 79% | Límite aceptable | ⚠️ Aceptable |
| ≤ 69% | No aceptable | ❌ Rechazado |

### Nota Importante

Antes de calcular los días restantes, a la fecha de caducidad se le restan **3 días** según estándares de bodega.

## 🏗️ Arquitectura

El proyecto sigue principios de arquitectura limpia y SOLID:

```
src/
├── components/       # Componentes UI reutilizables
├── context/         # Context API para estado global
├── reducers/        # Reducers para manejo de estado
├── services/        # Lógica de negocio (cálculos)
├── types/           # Definiciones TypeScript
└── App.tsx          # Componente principal
```

### Patrones Utilizados

- **Reducer Pattern**: Manejo de estado complejo con `useReducer`
- **Context API**: Compartir estado global
- **Container/Presentational**: Separación de lógica y presentación
- **Custom Hooks**: Lógica reutilizable
- **Service Layer**: Cálculos de negocio aislados

## 🎨 Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **date-fns** - Manejo de fechas

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Mobile: 320px en adelante
- 📱 Tablet: 768px+
- 💻 Desktop: 1024px+

## 🌓 Temas

- **Light Mode**: Tema claro con colores suaves
- **Dark Mode**: Tema oscuro con efectos glassmorphism
- Toggle disponible en el header

## 📝 Ejemplo de Uso

### Datos de Prueba

- **Fecha de elaboración**: 04/12/2025
- **Fecha de caducidad**: 17/01/2026
- **Fecha de evaluación**: Hoy (fecha actual del sistema)

### Resultado Esperado

- **Vida útil total**: 44 días
- **Días restantes**: Calculado dinámicamente según la fecha de evaluación
- **Porcentaje**: Calculado automáticamente
- **Estado**: Visual según el porcentaje calculado

## 🔧 Desarrollo

### Estructura de Componentes

- `App.tsx` - Componente raíz con provider
- `ProductForm` - Formulario de entrada de fechas
- `DateInput` - Input reutilizable para fechas
- `CalculationResults` - Visualización de resultados
- `ThemeToggle` - Toggle de tema

### Servicios

- `dateService.ts` - Funciones puras para cálculos de fechas y reglas de negocio

## 📄 Licencia

Este proyecto es de uso interno para control de bodega.
