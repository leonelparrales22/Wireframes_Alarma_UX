(function ($) {
  const screenItems = [
    ["screen-1", "Login seguro"],
    ["screen-2", "Dashboard cargando"],
    ["screen-3", "Dashboard analítico"],
    ["screen-4", "Detalle de sesión"],
    ["screen-5", "Historial de sesiones"],
    ["screen-6", "Alertas clínicas"],
    ["screen-7", "Exportar reporte"],
    ["screen-8", "Descarga exitosa"],
    ["screen-9", "Perfil y salud"]
  ];

  const workspace = $("#workspace");

  function setMenuState(screenId) {
    $(".menu-item").removeClass("active");
    $(`.menu-item[data-go="${screenId}"]`).addClass("active");
  }

  function goToScreen(screenId) {
    if (!screenItems.find(([id]) => id === screenId)) {
      return;
    }

    $(".screen").removeClass("active");
    $(`#${screenId}`).addClass("active");
    workspace.toggleClass("login-mode", screenId === "screen-1");
    setMenuState(screenId);
  }

  const trendData = {
    30: {
      bars: [46, 72, 64, 92, 84, 72, 64],
      labels: ["D1", "D5", "D10", "D15", "D20", "D25", "D30"]
    },
    7: {
      bars: [58, 76, 68, 82, 88, 74, 79],
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    },
    90: {
      bars: [34, 46, 52, 67, 72, 78, 86],
      labels: ["M1", "M2", "M3", "M4", "M5", "M6", "M7"]
    }
  };

  function renderTrendRange(rangeKey) {
    const config = trendData[rangeKey];
    if (!config) {
      return;
    }

    const colorMap = {
      30: "linear-gradient(180deg, rgba(56, 189, 248, 0.92), rgba(20, 184, 166, 0.82))",
      7: "linear-gradient(180deg, rgba(20, 184, 166, 0.92), rgba(16, 185, 129, 0.78))",
      90: "linear-gradient(180deg, rgba(14, 165, 233, 0.72), rgba(99, 102, 241, 0.74))"
    };

    $("#trend-bars .bar").each(function (index) {
      $(this)
        .css("height", `${config.bars[index]}%`)
        .css("background", colorMap[rangeKey]);
    });

    $("#trend-axis-x span").each(function (index) {
      $(this).text(config.labels[index]);
    });

    $("[data-trend-range]").removeClass("selected");
    $(`[data-trend-range="${rangeKey}"]`).addClass("selected");
  }

  function initThreads() {
    const canvas = document.getElementById("threads-canvas");
    const stage = document.getElementById("login-stage");

    if (!canvas || !stage) {
      return;
    }

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];

    function resize() {
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      particles = Array.from({ length: 38 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: 1 + Math.random() * 2.2
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) {
          p.vx *= -1;
        }

        if (p.y < 0 || p.y > height) {
          p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(191, 219, 254, 0.55)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(125, 211, 252, ${0.12 - distance / 1800})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      window.requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  $(document).on("click", "[data-go]", function () {
    goToScreen($(this).data("go"));
  });

  $(document).on("click", "[data-trend-range]", function () {
    renderTrendRange(String($(this).data("trend-range")));
  });

  $(document).on("click", "[data-toggle-chip]", function () {
    $(this).toggleClass("selected");
  });

  $(document).on("click", "[data-step-box]", function () {
    $("[data-step-box]").removeClass("active");
    $(this).addClass("active");
  });

  initThreads();
  renderTrendRange("30");
  goToScreen("screen-1");
})(jQuery);
