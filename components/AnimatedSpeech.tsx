import { motion } from "framer-motion";
import { range } from "lodash";

const TOP = "-70%";
const BOTTOM = "100%";

const ON = 1;
const OFF = 0.4;

const BouncingDot: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.span
    className="h-1 w-1 rounded-full bg-white"
    animate={{
      y: [BOTTOM, TOP, BOTTOM, TOP, BOTTOM, BOTTOM, BOTTOM],
      opacity: [OFF, ON, ON, ON, ON, ON, OFF],
    }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export const AnimatedSpeech: React.FC = () => (
  <span className="m-auto flex h-6 flex-row items-center gap-1">
    {range(3).map((i) => (
      <BouncingDot key={i} delay={i * 0.25} />
    ))}
  </span>
);
