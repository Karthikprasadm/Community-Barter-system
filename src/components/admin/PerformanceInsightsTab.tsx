
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Clock, Zap, Database, Server } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PerformanceInsightsTabProps {
  queryHistory: Array<{
    id: string;
    query: string;
    executionTime: number;
    rowsReturned: number;
    timestamp: Date;
    isBookmarked: boolean;
  }>;
}

export const PerformanceInsightsTab = ({ queryHistory }: PerformanceInsightsTabProps) => {
  const [queryTimeByComplexity, setQueryTimeByComplexity] = useState<any[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [queryTypePerformance, setQueryTypePerformance] = useState<any[]>([]);
  
  useEffect(() => {
    if (queryHistory.length > 0) {
      // Process data for visualization
      processTimeSeriesData();
      processQueryComplexityData();
      processQueryTypeData();
    }
  }, [queryHistory]);
  
  const processTimeSeriesData = () => {
    // Get the 20 most recent queries
    const recentQueries = [...queryHistory].slice(0, 20).reverse();
    
    const data = recentQueries.map((item, index) => ({
      name: `Q${index + 1}`,
      time: item.executionTime,
      rows: item.rowsReturned
    }));
    
    setTimeSeriesData(data);
  };
  
  const processQueryComplexityData = () => {
    // Classify queries by complexity (using simple heuristics)
    const complexityData = [
      { name: 'Simple', value: 0, count: 0 },
      { name: 'Medium', value: 0, count: 0 },
      { name: 'Complex', value: 0, count: 0 }
    ];
    
    queryHistory.forEach(item => {
      const query = item.query.toLowerCase();
      let complexityIndex = 0;
      
      // Simple heuristics for query complexity
      if (query.includes('join') || query.includes('group by')) {
        complexityIndex = 1; // Medium
      }
      
      if ((query.match(/join/g) || []).length > 1 || 
          (query.includes('join') && query.includes('group by') && query.includes('having'))) {
        complexityIndex = 2; // Complex
      }
      
      complexityData[complexityIndex].value += item.executionTime;
      complexityData[complexityIndex].count += 1;
    });
    
    // Calculate average execution time per complexity
    const processedData = complexityData.map(item => ({
      name: item.name,
      avgTime: item.count > 0 ? parseFloat((item.value / item.count).toFixed(2)) : 0,
      count: item.count
    }));
    
    setQueryTimeByComplexity(processedData);
  };
  
  const processQueryTypeData = () => {
    const queryTypes = [
      { name: 'SELECT', value: 0, count: 0 },
      { name: 'SELECT + JOIN', value: 0, count: 0 },
      { name: 'SELECT + GROUP BY', value: 0, count: 0 },
      { name: 'Complex Queries', value: 0, count: 0 }
    ];
    
    queryHistory.forEach(item => {
      const query = item.query.toLowerCase();
      let typeIndex = 0;
      
      if (query.includes('join') && !query.includes('group by')) {
        typeIndex = 1; // SELECT + JOIN
      } else if (!query.includes('join') && query.includes('group by')) {
        typeIndex = 2; // SELECT + GROUP BY
      } else if (query.includes('join') && query.includes('group by')) {
        typeIndex = 3; // Complex
      }
      
      queryTypes[typeIndex].value += item.executionTime;
      queryTypes[typeIndex].count += 1;
    });
    
    // Calculate average execution time per query type
    const processedData = queryTypes.map(item => ({
      name: item.name,
      avgTime: item.count > 0 ? parseFloat((item.value / item.count).toFixed(2)) : 0,
      count: item.count
    }));
    
    setQueryTypePerformance(processedData);
  };
  
  // Calculate overall statistics
  const calculateStats = () => {
    if (queryHistory.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const times = queryHistory.map(item => item.executionTime);
    return {
      avg: parseFloat((times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)),
      min: Math.min(...times),
      max: Math.max(...times)
    };
  };
  
  const stats = calculateStats();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Query Performance Insights
          </CardTitle>
          <CardDescription>
            Performance metrics and visualization for your SQL queries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queryHistory.length === 0 ? (
            <div className="text-center p-6 bg-slate-100 rounded-md">
              <Database className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-600">No Query Data Available</h3>
              <p className="text-slate-500 mt-1">
                Run some SQL queries in the Query tab to generate performance insights.
              </p>
            </div>
          ) : (
            <>
              {/* Performance metrics summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Average Execution Time</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-blue-900">{stats.avg}ms</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Fastest Query</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-green-900">{stats.min}ms</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Slowest Query</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-purple-900">{stats.max}ms</div>
                </div>
              </div>
              
              <Tabs defaultValue="timeline">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="timeline">Execution Timeline</TabsTrigger>
                  <TabsTrigger value="complexity">Query Complexity</TabsTrigger>
                  <TabsTrigger value="types">Query Types</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="h-80">
                  <ChartContainer 
                    config={{
                      time: { label: "Execution Time (ms)", color: "#8884d8" },
                      rows: { label: "Rows Returned", color: "#82ca9d" },
                    }}
                  >
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line yAxisId="left" type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="rows" stroke="#82ca9d" />
                    </LineChart>
                  </ChartContainer>
                </TabsContent>
                
                <TabsContent value="complexity" className="h-80">
                  <ChartContainer 
                    config={{
                      avgTime: { label: "Average Time (ms)", color: "#8884d8" },
                      count: { label: "Query Count", color: "#82ca9d" },
                    }}
                  >
                    <BarChart data={queryTimeByComplexity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="avgTime" fill="#8884d8" />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ChartContainer>
                </TabsContent>
                
                <TabsContent value="types" className="h-80">
                  <ChartContainer 
                    config={{
                      avgTime: { label: "Average Time (ms)", color: "#8884d8" },
                    }}
                  >
                    <AreaChart data={queryTypePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="avgTime" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Performance Insights</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 h-4 rounded-full bg-blue-500 mt-1"></div>
                    <span>
                      {stats.avg < 100 
                        ? "Your queries are performing well with fast execution times."
                        : "Some queries may benefit from optimization to improve execution time."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 h-4 rounded-full bg-green-500 mt-1"></div>
                    <span>
                      {queryTypePerformance.length > 0 && queryTypePerformance[3].count > 0
                        ? "Complex queries are taking longer to execute. Consider optimizing with indexes."
                        : "You're mostly using simple queries which are executing efficiently."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 h-4 rounded-full bg-purple-500 mt-1"></div>
                    <span>
                      {queryHistory.length > 0 
                        ? `You've executed ${queryHistory.length} queries in this session.`
                        : "Start running queries to generate performance insights."}
                    </span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceInsightsTab;
