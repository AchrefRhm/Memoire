import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ConfettiEffect: React.FC = () => {
  const [pieces, setPieces] = useState(Array.from({ length: 30 }, (_, i) => i));

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
      {pieces.map((i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#ff0", "#f00", "#0f0", "#00f"][i % 4],
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "100vh", opacity: 0 }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random(),
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
