import React, { useMemo } from 'react';

interface MetricEntry {
  id: number;
  date: string;
  waist: string;
  weight: string;
  photosTaken: boolean;
}

interface ProgressChartProps {
  entries: MetricEntry[];
}

const STORAGE_KEY = 'fitness_progress_metrics';

const ProgressChart: React.FC<ProgressChartProps> = ({ entries: propEntries }) => {
  const entries = useMemo(() => {
    if (propEntries && propEntries.length > 0) return propEntries;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as MetricEntry[];
      } catch {
        return [];
      }
    }
    return [];
  }, [propEntries]);

  const chartData = useMemo(() => {
    const validEntries = entries
      .filter(e => e.waist || e.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-8); // Last 8 entries

    if (validEntries.length < 2) return null;

    const waistValues = validEntries.map(e => parseFloat(e.waist) || null);
    const weightValues = validEntries.map(e => parseFloat(e.weight) || null);
    const dates = validEntries.map(e => new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

    const validWaist = waistValues.filter((v): v is number => v !== null);
    const validWeight = weightValues.filter((v): v is number => v !== null);

    const waistMin = validWaist.length > 0 ? Math.min(...validWaist) - 2 : 0;
    const waistMax = validWaist.length > 0 ? Math.max(...validWaist) + 2 : 100;
    const weightMin = validWeight.length > 0 ? Math.min(...validWeight) - 2 : 0;
    const weightMax = validWeight.length > 0 ? Math.max(...validWeight) + 2 : 100;

    return {
      waistValues,
      weightValues,
      dates,
      waistMin,
      waistMax,
      weightMin,
      weightMax,
      hasWaist: validWaist.length >= 2,
      hasWeight: validWeight.length >= 2,
    };
  }, [entries]);

  if (!chartData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Progress Trends</h3>
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p>Log at least 2 entries to see your progress chart</p>
          </div>
        </div>
      </div>
    );
  }

  const width = 320;
  const height = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getPath = (values: (number | null)[], min: number, max: number): string => {
    const points: string[] = [];
    const xStep = chartWidth / (values.length - 1);

    values.forEach((value, index) => {
      if (value !== null) {
        const x = padding.left + index * xStep;
        const y = padding.top + chartHeight - ((value - min) / (max - min)) * chartHeight;
        points.push(`${points.length === 0 ? 'M' : 'L'} ${x} ${y}`);
      }
    });

    return points.join(' ');
  };

  const getPoints = (values: (number | null)[], min: number, max: number): { x: number; y: number; value: number }[] => {
    const xStep = chartWidth / (values.length - 1);
    return values
      .map((value, index) => {
        if (value === null) return null;
        const x = padding.left + index * xStep;
        const y = padding.top + chartHeight - ((value - min) / (max - min)) * chartHeight;
        return { x, y, value };
      })
      .filter((p): p is { x: number; y: number; value: number } => p !== null);
  };

  const waistPath = chartData.hasWaist ? getPath(chartData.waistValues, chartData.waistMin, chartData.waistMax) : '';
  const weightPath = chartData.hasWeight ? getPath(chartData.weightValues, chartData.weightMin, chartData.weightMax) : '';
  const waistPoints = chartData.hasWaist ? getPoints(chartData.waistValues, chartData.waistMin, chartData.waistMax) : [];
  const weightPoints = chartData.hasWeight ? getPoints(chartData.weightValues, chartData.weightMin, chartData.weightMax) : [];

  // Calculate trends
  const getChange = (values: (number | null)[]) => {
    const valid = values.filter((v): v is number => v !== null);
    if (valid.length < 2) return null;
    return valid[valid.length - 1] - valid[0];
  };

  const waistChange = getChange(chartData.waistValues);
  const weightChange = getChange(chartData.weightValues);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Progress Trends</h3>
        <div className="flex gap-4 text-xs">
          {chartData.hasWaist && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-slate-600">Waist</span>
              {waistChange !== null && (
                <span className={waistChange <= 0 ? 'text-green-600' : 'text-red-500'}>
                  ({waistChange <= 0 ? '' : '+'}{waistChange.toFixed(1)}cm)
                </span>
              )}
            </div>
          )}
          {chartData.hasWeight && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">Weight</span>
              {weightChange !== null && (
                <span className={weightChange <= 0 ? 'text-green-600' : 'text-red-500'}>
                  ({weightChange <= 0 ? '' : '+'}{weightChange.toFixed(1)}kg)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[280px]" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + chartHeight * ratio}
              x2={width - padding.right}
              y2={padding.top + chartHeight * ratio}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {/* Waist line */}
          {chartData.hasWaist && (
            <>
              <path
                d={waistPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {waistPoints.map((point, i) => (
                <g key={`waist-${i}`}>
                  <circle cx={point.x} cy={point.y} r="4" fill="#6366f1" stroke="white" strokeWidth="2" />
                  <text x={point.x} y={point.y - 8} textAnchor="middle" className="text-[10px] fill-slate-500">
                    {point.value}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* Weight line */}
          {chartData.hasWeight && (
            <>
              <path
                d={weightPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {weightPoints.map((point, i) => (
                <g key={`weight-${i}`}>
                  <circle cx={point.x} cy={point.y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <text x={point.x} y={point.y + 14} textAnchor="middle" className="text-[10px] fill-slate-500">
                    {point.value}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* X-axis labels */}
          {chartData.dates.map((date, i) => {
            const x = padding.left + (i * chartWidth) / (chartData.dates.length - 1);
            return (
              <text
                key={i}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-400"
              >
                {date}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ProgressChart;
