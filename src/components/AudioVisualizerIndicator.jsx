
"use client"

import { useEffect, useRef, useState } from "react";

const AudioVisualizerIndicator = () => {

    const [audioData, setAudioData] = useState(new Uint8Array(50));
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const initializeAudio = async () => {
            try {
                // Create audio context
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();

                // Configure analyser
                analyserRef.current.fftSize = 256;
                analyserRef.current.smoothingTimeConstant = 0.7;

                // Get microphone stream
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                sourceRef.current.connect(analyserRef.current);

                // Start visualization
                visualize();
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        };

        initializeAudio();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const visualize = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteTimeDomainData(dataArray);

            // Process the audio data for visualization
            const processedData = Array.from(dataArray).map(value => {
                // Convert byte data (0-255) to audio waveform (-1 to 1)
                const normalized = (value - 128) / 128;
                // Scale for visualization (0-100)
                return 50 + (normalized * 40);
            });

            setAudioData(processedData);
        };

        draw();
    };

    // Calculate smooth curve points using Bezier curves
    const generateSmoothPath = (points) => {
        if (points.length < 2) return "";

        let path = `M ${0},${points[0]} `;

        for (let i = 0; i < points.length - 1; i++) {
            const x1 = i * 10;
            const x2 = (i + 1) * 10;
            const y1 = points[i];
            const y2 = points[i + 1];

            // Calculate control points for smooth curve
            const cp1x = x1 + (x2 - x1) / 3;
            const cp2x = x1 + 2 * (x2 - x1) / 3;

            path += `C ${cp1x},${y1} ${cp2x},${y2} ${x2},${y2} `;
        }

        return path;
    };

    return (
        <div className="h-24 bg-purple-900/20 rounded-lg overflow-hidden mb-4 backdrop-blur-sm">
            <svg
                viewBox="0 0 500 100"
                className="w-full h-full"
                preserveAspectRatio="none"
            >
                {/* Mirror effect - bottom wave */}
                <path
                    d={generateSmoothPath(Array.from(audioData))}
                    fill="none"
                    stroke="rgba(216, 180, 254, 0.3)"
                    strokeWidth="2"
                />

                {/* Main wave */}
                <path
                    d={generateSmoothPath(Array.from(audioData))}
                    fill="none"
                    stroke="#d8b4fe"
                    strokeWidth="3"
                    className="drop-shadow-[0_0_3px_rgba(216,180,254,0.7)]"
                />

                {/* Glow effect */}
                <path
                    d={generateSmoothPath(Array.from(audioData))}
                    fill="none"
                    stroke="rgba(216, 180, 254, 0.5)"
                    strokeWidth="1"
                    filter="url(#glow)"
                />

                {/* Define glow filter */}
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default AudioVisualizerIndicator;