import { getCompatibilityColor } from '../utils/helpers';

export default function CompatibilityScore({ score }) {
  const colorClass = getCompatibilityColor(score);

  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      <span>{score}%</span>
      <span className="opacity-75">Match</span>
    </div>
  );
}
