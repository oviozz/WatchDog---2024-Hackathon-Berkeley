
"use client"

import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FaShieldDog } from "react-icons/fa6";
import {
    AlertCircle,
    Camera,
    Crop,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Shield,
    Loader,
    BarChart2,
    PieChart as PieChartIcon,
    TrendingUp,
    Tag, Target
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import watchdogImg from "@/assests/watchdog.png"

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

NProgress.configure({ showSpinner: false });

const SkeletonLoader = () => (
    <div className="flex items-center justify-center py-52">
        <Card className="bg-gray-900/50 backdrop-blur border-none">
            <CardContent className="p-8">
                <Loader className="h-10 w-10 text-purple-500 animate-spin mx-auto" />
                <p className="text-white mt-4 text-center">Analyzing conversation...</p>
            </CardContent>
        </Card>
    </div>
);

const read = async (text) => {
    const deepgramApiKey = "54d577082d2986c7a2f39f5215fd5cae890bbf5e";
    try {
        const response = await fetch(
            `https://api.deepgram.com/v1/read?summarize=v2&topics=true&custom_topic=guns%2C%20killing%2C%20weapons%2C%20knife%2C%20gun%2C%20shooting&intents=true&sentiment=true&language=en`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Token ${deepgramApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: text }),
            }
        );
        const data = await response.json();
        return response.ok ? data : null;
    } catch (error) {
        console.error("Error fetching data from Deepgram API:", error);
        return null;
    }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 p-4 rounded shadow-lg border border-gray-700">
                <p className="text-white font-semibold">{`${label}: ${(payload[0].value * 100).toFixed(2)}%`}</p>
                <p className="text-white mt-2">{payload[0].payload.text}</p>
            </div>
        );
    }
    return null;
};

const StatsCard = ({ icon: Icon, title, value, trend, bgColor = "bg-gray-900" }) => (
    <Card className={`${bgColor} transition-all duration-200 hover:scale-105 border-none`}>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-md font-medium text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-white mt-2">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-white opacity-75" />
            </div>
            {trend && (
                <div className="mt-4">
                    <span className={`text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                </div>
            )}
        </CardContent>
    </Card>
);

export default function SecurityAudioAnalysis({ fullText = [] }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStartedTalking, setHasStartedTalking] = useState(false);
    const lastFetchTime = useRef(null);
    const previousFullTextRef = useRef(null);

    useEffect(() => {
        if (fullText.length > 5 && !hasStartedTalking) {
            setHasStartedTalking(true);
        }

        if (!hasStartedTalking || fullText.length <= 5) return;

        const submit_text = fullText.join(" ");

        if (previousFullTextRef.current === submit_text) {
            return;
        }

        previousFullTextRef.current = submit_text;

        const fetchData = async () => {
            const now = Date.now();
            if (lastFetchTime.current && now - lastFetchTime.current < 7000) {
                return;
            }

            lastFetchTime.current = now;
            NProgress.start();
            setIsLoading(true);
            try {
                const result = await read(submit_text);
                if (result) {
                    setData(result);
                    setError(null);
                } else {
                    setError("Failed to fetch data");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            } finally {
                NProgress.done();
                setIsLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 10000);

        return () => {
            clearInterval(intervalId);
            NProgress.done();
        };
    }, [fullText, hasStartedTalking]);

    if (!hasStartedTalking) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 flex flex-col gap-4 items-center py-32">
                <img className={"rounded-xl w-72 h-72 opacity-50 animate-pulse"} alt={"watchdog"} src={watchdogImg.src} />

                <Alert className="bg-purple-900 border-blue-700 max-w-2xl border-none">
                    <AlertDescription className="ml-2 text-md text-white">
                        Start speaking to begin the analysis. The dashboard will appear once you start talking.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
                <Alert className="bg-red-900 border-red-700 border-none">
                    <AlertCircle className="h-6 w-6" />
                    <AlertDescription className="ml-2">{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
                <Alert className="bg-gray-800 border-gray-700 border-none">
                    <Camera className="h-6 w-6" />
                    <AlertDescription className="ml-2">No analysis data available yet.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const averageSentiment = data.results?.sentiments?.segments?.length
        ? data.results.sentiments.segments.reduce((acc, curr) => acc + curr.sentiment_score, 0) / data.results.sentiments.segments.length
        : 0;

    const overallSafety = ((averageSentiment + 1) / 2 * 100).toFixed(2);

    // Prepare data for Topics word cloud
    const topicsData = data.results?.topics?.segments.flatMap(segment =>
        segment.topics.map(topic => ({
            text: topic.topic,
            value: topic.confidence_score * 100,
            fullText: segment.text
        }))
    ) || [];

    // Prepare data for Intents
    const intentsData = data.results?.intents?.segments[0]?.intents.map(intent => ({
        name: intent.intent,
        value: intent.confidence_score
    })) || [];

    // Prepare data for Sentiment Timeline
    const sentimentData = data.results?.sentiments?.segments.map((segment, index) => ({
        index,
        score: segment.sentiment_score,
        text: segment.text
    })) || [];

    return (
        <div className="min-h-screen bg-gray-900 text-white px-5 py-1 pb-[90vh]">
            <div className="">
                <h1 className="text-2xl font-bold mb-2 text-white flex items-center p-4 rounded-lg">
                    <FaShieldDog className="w-7 h-7 mr-3" />
                    Security Analysis Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        icon={TrendingUp}
                        title="Overall Safety Score"
                        value={`${overallSafety}%`}
                        bgColor="bg-blue-900"
                    />
                    <StatsCard
                        icon={MessageSquare}
                        title="Average Sentiment"
                        value={`${(averageSentiment * 100).toFixed(2)}%`}
                        bgColor="bg-purple-900"
                    />
                    <StatsCard
                        icon={Tag}
                        title="Unique Topics"
                        value={topicsData.length}
                        bgColor="bg-green-900"
                    />
                    <StatsCard
                        icon={Target}
                        title="Intents Detected"
                        value={intentsData.length}
                        bgColor="bg-orange-900"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gray-900 border border-gray-200 rounded-xl">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <Tag className="w-5 h-5 mr-2" />
                                Topics Word Cloud
                            </h2>
                        </CardHeader>
                        <CardContent className="h-80">
                            {topicsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topicsData}
                                            dataKey="value"
                                            nameKey="text"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            fill="#8884d8"
                                            label={({ text, value }) => `${text} (${value.toFixed(1)}%)`}
                                        >
                                            {topicsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-400">No topic data available</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border border-gray-200 rounded-xl">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Intent Analysis
                            </h2>
                        </CardHeader>
                        <CardContent className="h-80">
                            {intentsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={intentsData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                                        <YAxis dataKey="name" type="category" width={150} />
                                        <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                                        <Bar dataKey="value" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-400">No intent data available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gray-900 border-none mb-8">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Sentiment Timeline
                        </h2>
                    </CardHeader>
                    <CardContent className="h-80">
                        {sentimentData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sentimentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="index" stroke="#9CA3AF" />
                                    <YAxis domain={[-1, 1]} stroke="#9CA3AF" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="score" stroke="#3B82F6" dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400">No sentiment data available</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.results?.sentiments?.segments && data.results.sentiments.segments.length > 0 ? (
                        data.results.sentiments.segments.map((sentiment, index) => (
                            <Card key={index} className={`
                                ${sentiment.sentiment === 'positive' ? 'bg-green-900' :
                                sentiment.sentiment === 'neutral' ? 'bg-yellow-900' :
                                    'bg-red-900'} 
                                transition-all duration-200 hover:scale-105 border-none
                            `}>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-2 text-white flex items-center">
                                        {sentiment.sentiment === 'positive' ? (
                                            <ThumbsUp className="w-5 h-5 mr-2" />
                                        ) : sentiment.sentiment === 'negative' ? (
                                            <ThumbsDown className="w-5 h-5 mr-2" />
                                        ) : null}
                                        {sentiment.sentiment}
                                    </h3>
                                    <p className="text-2xl font-bold text-white">{(sentiment.sentiment_score * 100).toFixed(2)}%</p>
                                    <p className="text-sm mt-2 text-gray-200 line-clamp-2">"{sentiment.text}"</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-400">No sentiment data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}