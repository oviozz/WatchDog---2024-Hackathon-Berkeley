
"use client"

import { useEffect, useRef, useState } from "react";
import { LiveConnectionState, LiveTranscriptionEvents, useDeepgram } from "@/providers/DeepgramContextProvider";
import { MicrophoneEvents, MicrophoneState, useMicrophone } from "@/providers/MicrophoneContextProvider";
import AudioVisualizerIndicator from "@/components/AudioVisualizerIndicator";
import SecurityAudioAnalysis from "@/app/voice/SecurityAudioAnalysis";

const VoicePage = () => {

    const [captions, setCaptions] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentStreamingText, setCurrentStreamingText] = useState("");
    const [isHovering, setIsHovering] = useState(false);
    const { connection, connectToDeepgram, connectionState } = useDeepgram();
    const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
    const keepAliveInterval = useRef();
    const containerRef = useRef(null);

    // Simulated audio data for visualization
    const [audioData, setAudioData] = useState(Array(50).fill(50));

    useEffect(() => {
        // Simulate audio visualization
        const interval = setInterval(() => {
            setAudioData(prev => prev.map(() => Math.random() * 80 + 10));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setupMicrophone();
    }, []);

    useEffect(() => {
        if (microphoneState === MicrophoneState.Ready) {
            connectToDeepgram({
                model: "nova-2",
                interim_results: true,
                smart_format: true,
                filler_words: true,
                utterance_end_ms: 3000,
            });
        }
    }, [microphoneState]);

    const streamText = async (text) => {
        setIsStreaming(true);
        let currentText = "";
        const words = text.split(" ");

        for (let word of words) {
            currentText += word + " ";
            setCurrentStreamingText(currentText);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        setIsStreaming(false);
        setCurrentStreamingText("");
        setCaptions(prev => [...prev, text]);
    };

    useEffect(() => {
        if (!microphone || !connection) return;

        const onData = (e) => {
            if (e.data.size > 0) {
                connection?.send(e.data);
            }
        };

        const onTranscript = (data) => {
            const thisCaption = data.channel.alternatives[0].transcript;
            if (thisCaption.trim() !== "") {
                streamText(thisCaption);
            }
        };

        if (connectionState === LiveConnectionState.OPEN) {
            connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
            microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
            startMicrophone();
        }

        return () => {
            connection?.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
            microphone?.removeEventListener(MicrophoneEvents.DataAvailable, onData);
        };
    }, [connectionState]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [captions, currentStreamingText]);

    return (
        <div className="relative flex h-screen antialiased">
            <div className="flex flex-col h-full w-full overflow-x-hidden relative">

                <div className="flex-1">
                    <SecurityAudioAnalysis fullText={captions}/>
                </div>

                {/* Caption container fixed at bottom */}
                <div className="fixed bottom-0 left-0 right-0 p-4 rounded-t-2xl bg-gray-800 border-white-2 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2
                            className={`text-2xl font-bold text-purple-200 transition-all duration-300 ease-in-out ${
                                isHovering ? 'scale-110' : ''
                            }`}
                            style={{
                                textShadow: isHovering ? '0 0 10px #e9d5ff' : 'none',
                            }}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            Audio Transcription
                        </h2>
                        {connectionState === LiveConnectionState.OPEN && (
                            <div className="text-green-400 font-medium animate-pulse">
                                Hearing you speak...
                            </div>
                        )}
                    </div>

                    <div className="h-24 bg-purple-200/50 rounded-md overflow-hidden mb-4">
                        <AudioVisualizerIndicator />
                    </div>

                    <div
                        ref={containerRef}
                        className="bg-purple-800/50 p-4 rounded-md mb-4 max-h-[200px] overflow-y-auto"
                    >
                        <div className="flex items-center flex-wrap gap-2">
                            {captions.map((caption, index) => (
                                <p key={index} className="text-md text-purple-100">
                                    {caption}
                                </p>
                            ))}
                            {isStreaming && (
                                <p className="text-purple-100">
                                    {currentStreamingText}
                                    <span className="animate-pulse">▊</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoicePage;