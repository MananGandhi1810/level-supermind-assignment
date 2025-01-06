"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon, Download } from "lucide-react";

const postDistributionData = [
  { name: "Reel", value: 35 },
  { name: "Carousel", value: 40 },
  { name: "Static", value: 25 },
];

const engagementSummaryData = [
  { type: "Reel", value: 59802.4, trend: "up" },
  { type: "Carousel", value: 41606.0, trend: "up" },
  { type: "Static", value: 28646.8, trend: "down" },
];

const totalEngagementData = {
  likes: 171975,
  shares: 37576,
  comments: 20339,
};

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toISOString().split("T")[0],
  likes: Math.floor(Math.random() * 4000 + 1000),
  shares: Math.floor(Math.random() * 800 + 200),
  comments: Math.floor(Math.random() * 400 + 100),
}));

const COLORS = ["#FF7F6A", "#4FD1C5", "#2C5282"];

export default function InstagramCharts() {
  return (
    <>
      <section className=" flex flex-row justify-between items-center py-10">
        <h1 className="text-4xl tracking-tighter  bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] text-transparent md:text-7xl py-1">
          YetiLytics
        </h1>
        <span className="text-muted-foreground space-x-3 group hover:underline">
          Download Dataset
          <Download className="size-5 ml-3 text-muted-foreground inline-block group-hover:text-white" /> 
        </span>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Post Distribution</CardTitle>
            <CardDescription>Breakdown by post type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                reel: {
                  label: "Reel",
                  color: COLORS[0],
                },
                carousel: {
                  label: "Carousel",
                  color: COLORS[1],
                },
                static: {
                  label: "Static",
                  color: COLORS[2],
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={postDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {postDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Summary</CardTitle>
            <CardDescription>Average engagement by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementSummaryData.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{item.value.toFixed(1)}%</span>
                    {item.trend === "up" ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Total Engagement</CardTitle>
            <CardDescription>All-time totals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {totalEngagementData.likes.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {totalEngagementData.shares.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Shares</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {totalEngagementData.comments.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Post Performance Over Time</CardTitle>
            <CardDescription>Daily engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                likes: {
                  label: "Likes",
                  color: COLORS[0],
                },
                shares: {
                  label: "Shares",
                  color: COLORS[1],
                },
                comments: {
                  label: "Comments",
                  color: COLORS[2],
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })
                    }
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke={COLORS[0]}
                    dot={{ r: 2 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="shares"
                    stroke={COLORS[1]}
                    dot={{ r: 2 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke={COLORS[2]}
                    dot={{ r: 2 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>{" "}
    </>
  );
}