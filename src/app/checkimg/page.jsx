
"use client"

import { useState } from 'react';
import {useAction, useMutation} from "convex/react";
import { Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {api} from "../../../convex/_generated/api";

const ImageAnalyzer = () => {
    const [imageData, setImageData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeImage = useAction(api.imageAnalysis.analyzeImage);

    const encodeImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            setError(null);

            const base64Image = await encodeImage(file);
            setImageData(URL.createObjectURL(file));

            const result = await analyzeImage({ base64Image });
            setAnalysis(result);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error analyzing image:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader className="text-xl font-bold">Person & Weapon Detector</CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                </div>
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="ml-2">Analyzing image...</span>
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {imageData && (
                            <div className="mt-4">
                                <img src={imageData} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
                            </div>
                        )}

                        {analysis && (
                            <div className="mt-4 space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium mb-2">Analysis Results</h3>
                                    <pre className="text-sm bg-white p-2 rounded whitespace-pre-wrap">
                                        {JSON.stringify(analysis, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ImageAnalyzer;