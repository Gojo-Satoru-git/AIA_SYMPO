import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo } from 'react';

// 1. Sliding Number Logic
function Number({ mv, number, height }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        y,
      }}
    >
      {number}
    </motion.span>
  );
}

// 2. Individual Digit/Separator Column
function Digit({ isSeparator, value, height, char }) {
  // We initialize the spring with the current value
  const animatedValue = useSpring(value, {
    stiffness: 150,
    damping: 20,
    restDelta: 0.001,
  });

  // CRITICAL: This effect forces the spring to update when 'value' changes
  useEffect(() => {
    if (!isSeparator) {
      animatedValue.set(value);
    }
  }, [value, isSeparator, animatedValue]);

  if (isSeparator) {
    return (
      <span style={{ height, display: 'flex', alignItems: 'center', width: '0.3ch' }}>{char}</span>
    );
  }

  return (
    <span
      style={{
        height,
        position: 'relative',
        width: '1ch',
        overflow: 'hidden',
        display: 'inline-flex',
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

// 3. Main Exported Component
export default function EventCounter({
  value, // Total seconds remaining
  fontSize = 80,
  textColor = '#E50914',
  gap = 8,
}) {
  const height = fontSize;

  const segments = useMemo(() => {
    const d = Math.floor(value / 86400);
    const h = Math.floor((value % 86400) / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = Math.floor(value % 60);

    const pad = (n) => Math.max(0, n).toString().padStart(2, '0');
    const timeString = `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;

    return timeString.split('').map((char, index) => ({
      char,
      isSeparator: char === ':',
      val: char === ':' ? 0 : parseInt(char, 10),
      id: index,
    }));
  }, [value]);

  return (
    <div
      style={{
        display: 'flex',
        gap,
        fontSize,
        color: textColor,
        fontWeight: 'bold',
        fontFamily: 'monospace',
      }}
    >
      {segments.map((s) => (
        <Digit key={s.id} char={s.char} isSeparator={s.isSeparator} value={s.val} height={height} />
      ))}
    </div>
  );
}
