// import "./RotatingChakra.css";
import chakra from "../../public/images/temple/chakra.png";

export function RotatingChakra({ className = "" }) {
  return (
    <img
      src={chakra}
      alt=""
      aria-hidden="true"
      className={`rotating-chakra ${className}`}
    />
  );
}