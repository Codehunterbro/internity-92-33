
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Define the chart config with colors
const chartConfig = {
  courses: {
    label: "Course Progress",
    theme: {
      light: "#8b5cf6",
      dark: "#a78bfa",
    },
  },
};

interface ProgressChartProps {
  data: {
    name: string;
    progress: number;
  }[];
  isLoading?: boolean;
}

const ProgressChart = ({ data, isLoading = false }: ProgressChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Format data for chart display
  const formattedData = data.map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    courses: item.progress,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-[4/3] h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 40,
              }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                tickMargin={10}
                height={70}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <ChartTooltipContent>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            Course
                          </span>
                          <span className="font-semibold">{data.name}</span>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-semibold">{data.courses}%</span>
                          </div>
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="courses"
                fill="var(--color-courses)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
