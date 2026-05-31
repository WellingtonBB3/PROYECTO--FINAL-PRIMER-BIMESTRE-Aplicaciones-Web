
# Proyecto Final — Primer Bimestre · Aplicaciones Web

Juego de plataformas 2D desarrollado con **Phaser 3** y **Vite**, ambientado en los íconos turísticos de **Guayaquil, Ecuador**. El jugador recorre tres niveles de dificultad creciente, cada uno con una mecánica diferente, música de fondo y efectos de sonido.

**Video de demostración:** https://www.youtube.com/watch?v=0eFydbKJnCo

---

## Requisitos previos

* Node.js v18 o superior
* npm (incluido con Node.js)

---

## Guía de ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/PROYECTO--FINAL-PRIMER-BIMESTRE-Aplicaciones-Web.git
cd PROYECTO--FINAL-PRIMER-BIMESTRE-Aplicaciones-Web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173` (o el puerto que indique Vite).

### 4. Generar build de producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `dist/`.

### 5. Previsualizar el build

```bash
npm run preview
```

> **Nota sobre audio:** los archivos de sonido deben estar en `public/audio/` para que Vite los sirva correctamente. Si ves errores 404 en consola, verifica que `bgm.mp3`, `jump.mp3` y `hit.mp3` existan en esa ruta.

---

## Controles

### Desktop (teclado)

| Acción          | Tecla                              |
| --------------- | ---------------------------------- |
| Mover izquierda | `A`                                |
| Mover derecha   | `D`                                |
| Saltar          | `Barra espaciadora`                |
| Pausar          | `ESC` o botón de pausa en pantalla |
| Silenciar audio | Botón de silencio en pantalla      |

### Mobile (controles táctiles)

Los botones aparecen automáticamente en pantalla:

* ← → : mover al personaje
* ↑ : saltar (disponible en Nivel 1 y Nivel 3)
* Pausa : congelar el juego

---

## Niveles

### Nivel 1 — El Malecón

Plataformer lateral con scroll horizontal. El objetivo es **eliminar 5 ladrones** saltando sobre ellos antes de llegar al final del mapa.

* Cada enemigo eliminado otorga **+1 punto** y restaura una vida (máximo 3).
* Recibir daño de un ladrón quita una vida y activa **1 segundo de invulnerabilidad**.
* Al completar el objetivo, aparece el mensaje *"Llega al final del mapa"*.
* Al alcanzar el extremo derecho del mundo con el objetivo cumplido, se avanza al Nivel 2.

### Nivel 2 — El Cerro Santa Ana

Nivel de supervivencia de vista fija. Cuatro disparadores animados lanzan proyectiles dirigidos al jugador durante **30 segundos**.

* El jugador solo puede moverse lateralmente (sin salto).
* Esquivar todos los proyectiles durante el tiempo indicado completa el nivel.
* Completar el nivel otorga **+5 puntos de bonificación**.

### Nivel 3 — La Bahía

Plataformer lateral con scroll horizontal. Cajas caen desde arriba de forma aleatoria y continua.

* El jugador debe avanzar hasta el extremo derecho del mundo esquivando las cajas.
* Cada caja golpeada quita una vida y activa invulnerabilidad temporal.
* Llegar al final sin quedarse sin vidas activa la pantalla de victoria.

---

## Sistema de puntuación y progreso

* El puntaje se acumula a lo largo de los tres niveles.
* El **High Score** y el **nivel más alto alcanzado** se guardan en `localStorage` mediante `StorageManager`.
* En el Menú Principal se muestran ambos valores al iniciar el juego.
* Al reiniciar una partida desde el menú, el estado de la ronda actual se resetea pero el récord persiste.

### Pantallas especiales

| Pantalla  | Condición de aparición              |
| --------- | ----------------------------------- |
| Game Over | El jugador pierde todas las vidas   |
| Pausa     | Se presiona ESC o el botón de pausa |
| Victoria  | Se completa el Nivel 3              |

Desde **Game Over** y **Pausa** se puede volver a jugar o regresar al menú.

---

## Estructura del proyecto

```text
PROYECTO--FINAL-PRIMER-BIMESTRE-Aplicaciones-Web/
│
├── main.js
├── package.json
├── index.html
│
├── scenes/
│   ├── Preload.js
│   ├── MainMenu.js
│   ├── Level1.js
│   ├── Level2.js
│   ├── Level3.js
│   ├── PauseMenu.js
│   ├── GameOver.js
│   └── Win.js
│
├── objects/
│   ├── Player.js
│   ├── Thief.js
│   └── Collectable.js
│
├── managers/
│   ├── AudioManager.js
│   ├── GameStateManager.js
│   └── StorageManager.js
│
├── physics/
│   ├── constants.js
│   └── world.js
│
├── ui/
│   ├── Hud.js
│   ├── MuteButton.js
│   ├── PauseControls.js
│   └── TouchControls.js
│
├── assets/
├── audio/
├── public/
│   ├── assets/
│   └── audio/
└── dist/
```

---

## Tecnologías utilizadas

| Herramienta           | Versión | Uso                                   |
| --------------------- | ------- | ------------------------------------- |
| Phaser                | ^3.90.0 | Motor de juego 2D con física Arcade   |
| Vite                  | ^5.0.0  | Empaquetador y servidor de desarrollo |
| JavaScript ES Modules | —       | Arquitectura modular del proyecto     |

---

## Créditos

Proyecto desarrollado como entrega final del **Primer Bimestre** de la materia **Aplicaciones Web**.

| Rol           | Descripción                                              |
| ------------- | -------------------------------------------------------- |
| Desarrollo    | Implementación de escenas, lógica de juego y UI          |
| Arte / Assets | Sprites del protagonista, enemigos y fondos de Guayaquil |
| Audio         | Música de fondo (`bgm.mp3`) y efectos de sonido          |
| Motor         | Phaser 3                                                 |

Los fondos utilizados hacen referencia a lugares icónicos de Guayaquil: el **Malecón 2000**, el **Cerro Santa Ana** y la **Bahía**.

---

Para reportar errores o sugerencias, abre un issue en el repositorio.
