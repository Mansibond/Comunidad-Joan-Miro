// Obtener el contexto del canvas para poder dibujar
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Constantes de configuración
    const GRAVITY = 0.4;           // Gravedad que afecta al jugador
    const JUMP_FORCE = -8;        // Fuerza del salto
    const MOVE_SPEED = 2;         // Velocidad horizontal del jugador

    // Definición del jugador como un objeto
    const player = {
      x: 50,
      y: 0,
      width: 16,
      height: 16,
      vx: 0,
      vy: 0,
      jumping: true,
      color: "#FFD700" // Color dorado estilo 8bit
    };

    // Plataformas donde el jugador puede pisar
    const platforms = [
      { x: 0, y: 240, width: 512, height: 16 }, // Suelo principal
      { x: 100, y: 180, width: 60, height: 10 },
      { x: 200, y: 140, width: 80, height: 10 },
      { x: 320, y: 100, width: 60, height: 10 }
    ];

    // Manejo de teclas
    const keys = {};

    // Eventos de teclado
    document.addEventListener("keydown", (e) => {
      keys[e.code] = true;
    });

    document.addEventListener("keyup", (e) => {
      keys[e.code] = false;
    });

    // Lógica principal del juego (bucle de animación)
    function gameLoop() {
      // Movimiento horizontal
      if (keys["ArrowLeft"]) {
        player.vx = -MOVE_SPEED;
      } else if (keys["ArrowRight"]) {
        player.vx = MOVE_SPEED;
      } else {
        player.vx = 0;
      }

      // Salto (solo si no está saltando)
      if (keys["Space"] && !player.jumping) {
        player.vy = JUMP_FORCE;
        player.jumping = true;
      }

      // Aplicar física
      player.vy += GRAVITY;
      player.x += player.vx;
      player.y += player.vy;

      // Colisiones con plataformas
      let onPlatform = false;
      for (let plat of platforms) {
        // Verificamos colisión desde arriba
        if (
          player.x < plat.x + plat.width &&
          player.x + player.width > plat.x &&
          player.y + player.height > plat.y &&
          player.y + player.height < plat.y + plat.height + player.vy
        ) {
          // Ajustamos al jugador sobre la plataforma
          player.y = plat.y - player.height;
          player.vy = 0;
          player.jumping = false;
          onPlatform = true;
        }
      }

      if (!onPlatform) {
        player.jumping = true; // Si no está sobre plataforma, está saltando
      }

      // Evitar que el jugador salga fuera del canvas
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
      if (player.y > canvas.height) {
        // Si cae fuera de pantalla, reiniciamos
        player.x = 50;
        player.y = 0;
        player.vx = 0;
        player.vy = 0;
      }

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar plataformas
      ctx.fillStyle = "#444";
      for (let plat of platforms) {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      }

      // Dibujar jugador
      ctx.fillStyle = player.color;
      ctx.fillRect(Math.floor(player.x), Math.floor(player.y), player.width, player.height);

      requestAnimationFrame(gameLoop); // Repetir animación
    }

    // Iniciar el juego
    gameLoop();
