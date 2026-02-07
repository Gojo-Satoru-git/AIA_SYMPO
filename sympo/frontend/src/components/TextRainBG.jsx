import { useEffect, useRef } from "react";

const TextRainBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ===== TEXT =====
    let letters = "TEKHORA26 TEKHORA26 TEKHORA26";
    
    letters = letters.split("");

    const fontSize = 12;
    let columns = Math.floor(canvas.width / fontSize);

    let drops = new Array(columns).fill(1);

    // Stranger Things color variants
    const colors = [
      "#ff0713",
      "#006aff",
      "#ffffff"
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];

    ctx.font = `${fontSize}px monospace`;

    let animationFrame;

    const draw = () => {
      // Fade background trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        drops[i]++;

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.96) {
          drops[i] = 0;
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
    />
  );
};

export default TextRainBackground;
