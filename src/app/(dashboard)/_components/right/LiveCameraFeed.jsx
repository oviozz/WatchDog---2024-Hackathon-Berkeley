
"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAction, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import {imageAnalysisService} from "../../../../../../convex/imageAnalysis";
import("../../../../WeaponObjectDetectionVideo.css")


const PUBLISHABLE_ROBOFLOW_API_KEY = process.env.NEXT_PUBLIC_ROBOFLOW_PUBLISHABLE_API_KEY;
const PROJECT_URL = "weapon-detection-3esci";
const MODEL_VERSION = "1";
export default function LiveCameraFeed() {

    const [status, setStatus] = useState("idle")
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const canvasRef = useRef(document.createElement('canvas'));
    const modelRef = useRef(null);
    const detectIntervalRef = useRef(null);

    const createAlert = useAction(api.securityAlert.createSecurityAlert)
    const generateUploadUrl = useMutation(api.securityAlert.generateUploadUrl)

    const startSurveillance = async () => {
        setStatus("connecting")
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setStatus("active");

            await loadModel();
            startDetection();
        } catch (error) {
            console.error("Error accessing camera:", error)
            setStatus("idle")
        }
    }

    const loadModel = async () => {
        try {
            const model = await window.roboflow
                .auth({
                    publishable_key: PUBLISHABLE_ROBOFLOW_API_KEY,
                })
                .load({
                    model: PROJECT_URL,
                    version: MODEL_VERSION,
                });
            modelRef.current = model;
        } catch (error) {
            console.error("Error loading the Roboflow model:", error);
        }
    };

    const captureFrame = async () => {
        if (!videoRef.current) return null

        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert to base64
        return canvas.toDataURL('image/jpeg', 0.8)
    }

    const handleCaptureAlert = async () => {
        try {
            const base64Image = await captureFrame()
            if (!base64Image) {
                console.error("Failed to capture frame")
                return
            }

            // Get upload URL from Convex
            const uploadUrl = await generateUploadUrl()

            // Convert base64 to blob
            const response = await fetch(base64Image);
            const blob = await response.blob()

            const [uploadResponse, analysisResult] = await Promise.all([
                fetch(uploadUrl, {
                    method: "POST",
                    body: blob,
                    headers: {
                        "Content-Type": blob.type,
                    },
                }),
                imageAnalysisService.analyzeImage(base64Image),
            ]);

            const { storageId } = await uploadResponse.json();
            const result = await createAlert({
                imageID: storageId,
                last_seen: "Floor 4",
                groqResult: analysisResult,
            });

            console.log("Alert created:", result)
        } catch (error) {
            console.error("Error creating alert:", error)
        }
    }

    const startDetection = () => {
        detectIntervalRef.current = setInterval(async () => {
            if (modelRef.current && videoRef.current) {
                const detections = await modelRef.current.detect(videoRef.current);
                if (detections.length > 0) {
                    const weaponDetected = detections.some((detection) => detection.class === "weapon" && detection.confidence > 0.6);
                    if (weaponDetected) {
                        handleCaptureAlert(detections);
                    }
                }
            }
        }, 1000);
    };


    const endSurveillance = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (detectIntervalRef.current) {
            clearInterval(detectIntervalRef.current);
        }
        setStatus("idle");
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="bg-gray-800 rounded-lg">
            <div className="mb-2 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center text-white">
                    <Camera className="mr-2 text-blue-400" />
                    Security Camera Feed
                </h2>
            </div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                {status === "idle" ? (
                    <div className="w-full h-[415px] bg-gray-700 flex items-center justify-center">
                        <Button onClick={startSurveillance} className="bg-blue-500 hover:bg-blue-600 text-white">
                            Start Surveillance
                        </Button>
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-[415px] object-cover" />
                )}

                {status !== "idle" && (
                    <div className="absolute top-2 right-2">
                        <div className="relative inline-flex items-center">
                            <div className="flex items-center space-x-2 bg-blue-500 bg-opacity-75 px-3 py-1.5 rounded-lg">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-900 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-700"></span>
                                </span>
                                <span className="text-white font-semibold text-sm tracking-wider">Live</span>
                            </div>
                        </div>
                    </div>
                )}

                {status === "active" && (
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        <Button onClick={endSurveillance} className="bg-red-500 hover:bg-red-600 text-white">
                            <StopCircle className="mr-2 h-4 w-4" /> End
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}