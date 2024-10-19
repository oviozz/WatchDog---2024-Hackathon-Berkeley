
"use client"

import React, { useEffect, useRef, useState } from 'react';

const Page = () => {
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const [translations, setTranslations] = useState([
        { text: "Hello", timestamp: 0, type: "info" },
        { text: "How are you?", timestamp: 5, type: "question" },
        { text: "Goodbye", timestamp: 10, type: "info" }
    ]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <audio ref={audioRef} controls className="mb-4">
                <source src="your-audio-file.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <canvas ref={canvasRef} width="800" height="400" className="mb-4 border-2 border-purple-500"></canvas>
            <div className="w-4/5 max-h-24 overflow-y-auto bg-gray-800 rounded-lg p-4">
                {translations.map((translation, index) => (
                    <div key={index} className={`p-2 mb-2 rounded ${translation.type === 'info' ? 'bg-purple-600' : 'bg-cyan-600'}`}>
                        <span>{translation.text}</span>
                        <span className="ml-auto text-gray-300">{translation.timestamp}s</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;

