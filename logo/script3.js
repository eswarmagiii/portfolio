 // Auto Redirect in 5 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);

      // 🎉 Confetti Animation
      const canvas = document.getElementById("confettiCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confetti = Array.from({ length: 150 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 50 + 50,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
      }));

      function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c) => {
          ctx.beginPath();
          ctx.fillStyle = c.color;
          ctx.ellipse(c.x, c.y, c.r, c.r / 2, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill();
        });
        updateConfetti();
        requestAnimationFrame(drawConfetti);
      }

      function updateConfetti() {
        confetti.forEach((c) => {
          c.y += Math.cos(c.d) + 2;
          c.x += Math.sin(c.d);
          if (c.y > canvas.height) {
            c.y = -10;
            c.x = Math.random() * canvas.width;
          }
        });
      }

      drawConfetti();