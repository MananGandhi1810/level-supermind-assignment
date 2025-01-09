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
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUpIcon, ArrowDownIcon, Download } from "lucide-react";
import { useState, useEffect } from "react";

const COLORS = ["#FF7F6A", "#4FD1C5", "#2C5282", "#FFFFFF"];

export default function InstagramCharts() {
  const [username, setUsername] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
    } else {
      setUsername("");
    }
  }, [router]);

  const clearUsername = () => {
    setUsername("");
    sessionStorage.removeItem("username");
    router.push("/insights");
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/fetch-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Unknown error occurred");
      }

      setData(transformData(result));
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  useEffect(() => {
    if (username != null) {
      fetchRecords();
    }
  }, [username]);

  const transformData = ({ data: { documents } }) => {
    const postDistributionData = documents.reduce((acc, doc) => {
      const type = doc.product_type || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const postDistributionArray = Object.entries(postDistributionData).map(
      ([name, value]) => ({ name, value })
    );

    const engagementSummaryData2 = documents
      .filter((doc) => doc.product_type === "" || doc.product_type === "feed") // Filter for "" and "feed"
      .reduce((acc, doc) => {
        const type = doc.product_type || "Other"; // Default to "Post" if product_type is empty
        const currentValue =
          doc.like_count + doc.comment_count + (doc.view_count || 0);
        const currentTrend = doc.like_count > 50 ? "up" : "down";

        // Accumulate value for each type using Map
        if (acc.has(type)) {
          const existing = acc.get(type);
          existing.value += currentValue;
          existing.trend = currentTrend; // Update the trend
        } else {
          acc.set(type, { type, value: currentValue, trend: currentTrend });
        }
        return acc;
      }, new Map());

    const engagementSummaryData = Array.from(engagementSummaryData2.values());

    const totalEngagementData = documents.reduce(
      (acc, doc) => {
        acc.likes += Number(doc.like_count || 0);
        acc.shares += Number(doc.play_count || 0);
        acc.comments += Number(doc.comment_count || 0);
        return acc;
      },
      { likes: 0, shares: 0, comments: 0 }
    );

    const performanceData = documents.map((doc) => ({
      date: new Date(doc.taken_at.$date).toISOString().split("T")[0],
      likes: doc.like_count || 0,
      shares: doc.play_count || 0,
      comments: doc.comment_count || 0,
    }));

    return {
      postDistributionData: postDistributionArray,
      engagementSummaryData,
      totalEngagementData,
      performanceData,
    };
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <section className=" flex flex-row justify-between items-center py-10">
        <h1 className="text-4xl tracking-tighter  bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] text-transparent md:text-7xl py-1">
          YetiLytics
        </h1>
        <h2>{username}</h2>
        <span className="text-muted-foreground space-x-3 group hover:underline">
          Download Dataset
          <Download className="size-5 ml-3 text-muted-foreground inline-block group-hover:text-white" />
        </span>
      </section>
      <div className="grid grid-cols-1 gap-4">
        {/* Post Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle>Post Distribution</CardTitle>
            <CardDescription>Breakdown by post type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                clips: {
                  label: "Reels",
                  color: COLORS[0],
                },
                feed: {
                  label: "Feed",
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
                <PieChart className="md:!w-fit !w-3/4">
                  <Pie
                    data={data?.postDistributionData}
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
                    {data?.postDistributionData.map((entry, index) => (
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

        {/* Engagement Summary Card
        <Card>
          <CardHeader>
            <CardTitle>Engagement Summary</CardTitle>
            <CardDescription>Average engagement by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.engagementSummaryData.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{item.value}%</span>
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
        </Card> */}

        {/* Total Engagement Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Total Engagement</CardTitle>
            <CardDescription>All-time totals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {data?.totalEngagementData.likes.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {data?.totalEngagementData.shares.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Shares</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {data?.totalEngagementData.comments.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Performance Over Time Card */}
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
                <LineChart data={data?.performanceData}>
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
      </div>
    </>
  );
}
