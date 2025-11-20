// src/components/dashboard/VoterChartCard.tsx
// Tarjeta para el gráfico de dona "Votos vs Usuarios"

interface VoterChartCardProps {
  title: string;
  percentage: number;
  subtitle: string;
}

export default function VoterChartCard({ title, percentage, subtitle }: VoterChartCardProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.327...

  // Calcula el "offset" para la parte verde. 
  // (100% = 0 offset, 0% = 251.3 offset)
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-white border-2 border-blue-950/60 rounded-[15px] font-poppins min-h-fit min-w-[230px] text-center p-0 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
      <h3 className="text-base text-gray-900 mb-2 font-medium">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-28 h-28">
          {/* Círculo de fondo (gris) */}
          <svg className="w-[90%] h-[90%] m-auto" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#b0b0b0"
              strokeWidth="10"
            />
            {/* Círculo de progreso (verde) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#4ade80"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          {/* Texto en el centro */}
          <div className="absolute m-auto inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">
              {Math.round(percentage) + "%"}
            </span>
          </div>
        </div>
      </div>
      <p className="text-base text-gray-900 font-medium text-center mt-2">
        {subtitle}
      </p>
    </div>
  );
}