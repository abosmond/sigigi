// src/pages/dashboard/components/DashboardCharts.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from "recharts"
import { type ChartData } from "@/services/dashboard"

interface DashboardChartsProps {
  visitsData: ChartData[];
  revenueData: ChartData[];
  loading: boolean;
}

export const DashboardCharts = ({ visitsData, revenueData, loading }: DashboardChartsProps) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle>Statistik Tahunan</CardTitle>
        <CardDescription>
          Data kunjungan dan pendapatan per bulan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visits" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visits">Kunjungan</TabsTrigger>
            <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          </TabsList>
          <TabsContent value="visits" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-72">
                <p>Memuat data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ strokeWidth: 1 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ strokeWidth: 1 }}
                  />
                  <Tooltip formatter={(value) => [`${value} kunjungan`, 'Total']} />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    name="Jumlah Kunjungan" 
                    fill="#4F46E5" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          <TabsContent value="revenue" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-72">
                <p>Memuat data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ strokeWidth: 1 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ strokeWidth: 1 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Pendapatan']} 
                  />
                  <Legend />
                  <Line 
                    type="monotone"
                    dataKey="total" 
                    name="Total Pendapatan" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}