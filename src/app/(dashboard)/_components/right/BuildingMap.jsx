
import React from 'react';
import { Map } from "lucide-react";

export default function BuildingMap() {
    const currentFloor = 4;

    return (
        <div className="bg-gray-800 rounded-lg">
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-0.5 flex items-center text-white">
                    <Map className="mr-2 text-green-400" />
                    Interactive Floor Plan
                </h2>
                <p className="text-gray-400">Real-time visualization of Floor {currentFloor} layout, security zones, and active alerts.</p>
            </div>
            <div className="w-full h-[370px] bg-gray-700 rounded-lg overflow-hidden">
                <iframe
                    title="Mappedin Map"
                    name="Mappedin Map"
                    allow="clipboard-write 'self' https://app.mappedin.com/; web-share 'self' https://app.mappedin.com/"
                    scrolling="no"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{border: 0}}
                    src="https://app.mappedin.com/map/6712f7708224dc000b392f19?embedded=true"
                />
            </div>
        </div>
    );
}