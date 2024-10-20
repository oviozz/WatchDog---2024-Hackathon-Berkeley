
"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Loader, StopCircle, PlayCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAction, useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { imageAnalysisService } from "../../../../../convex/imageAnalysis"

export default function LiveCameraFeed() {
    const [status, setStatus] = useState("idle")
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)

    const createAlert = useAction(api.securityAlert.createSecurityAlert)
    const generateUploadUrl = useMutation(api.securityAlert.generateUploadUrl)

    const toggleSurveillance = async () => {
        if (status === "idle") {
            setStatus("connecting")
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
                streamRef.current = stream
                setStatus("active")
            } catch (error) {
                console.error("Error accessing camera:", error)
                setStatus("idle")
            }
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
            setStatus("idle")
        }
    }

    const captureFrame = async () => {
        if (!videoRef.current) return null

        const video = videoRef.current
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        return canvas.toDataURL("image/jpeg", 0.8)
    }

    const handleCaptureAlert = async () => {
        try {
            const base64Image = await captureFrame()
            if (!base64Image) {
                console.error("Failed to capture frame")
                return
            }

            const uploadUrl = await generateUploadUrl()
            const response = await fetch(base64Image)
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
            ])

            const { storageId } = await uploadResponse.json()
            const result = await createAlert({
                imageID: storageId,
                last_seen: "Floor 4",
                groqResult: analysisResult,
            })

            console.log("Alert created:", result)
        } catch (error) {
            console.error("Error creating alert:", error)
        }
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center text-white">
                    <Camera className="mr-2 text-blue-400" />
                    Security Camera Feed
                </h2>
            </div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <div className="w-full h-[390px] bg-gray-700 flex flex-col gap-2 items-center justify-center">
                    {status === "connecting" && (
                        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black bg-opacity-50 z-10">
                            <Loader className="h-12 w-12 animate-spin text-blue-400" />
                            <p className="text-white text-lg">Connecting to camera...</p>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-[415px] object-cover ${status === 'active' ? 'block' : 'hidden'}`}
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full"
                    />
                    {status === "idle" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <p className="text-white text-lg">Camera is offline</p>
                        </div>
                    )}
                </div>

                {status === "active" && (
                    <div className="absolute top-2 right-2">
                        <div className="relative inline-flex items-center">
                            <div className="flex items-center space-x-2 bg-green-500 bg-opacity-75 px-3 py-1.5 rounded-lg">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-white font-semibold text-sm tracking-wider">Live</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <Button
                        onClick={toggleSurveillance}
                        className={`${status === 'idle' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white px-6 py-3 rounded-xl text-md transition-all duration-300 ease-in-out`}
                    >
                        {status === 'idle' ? (
                            <>
                                <PlayCircle className="mr-2 h-5 w-5" /> Start Surveillance
                            </>
                        ) : (
                            <>
                                <StopCircle className="mr-2 h-5 w-5" /> Stop Surveillance
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleCaptureAlert}
                        className="bg-gray-800 hover:bg-gray-800 text-sm hover:underline text-gray-500 transition-all duration-300 ease-in-out"
                    >
                        <Bell className="mr-2 h-5 w-5" /> Capture Alert
                    </Button>
                </div>
            </div>
        </div>
    )
}