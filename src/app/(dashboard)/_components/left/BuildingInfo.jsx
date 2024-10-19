
import {ChevronDown, ChevronUp, Info} from "lucide-react";

export default function BuildingInfo(){

    const currentFloor = 4;

    return (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 tracking-wide">Building Information</h3>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className="font-medium text-gray-400">Floor:</p>
                    <p>{currentFloor}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-400">Rooms:</p>
                    <p>{currentFloor === 1 ? '20' : '15'}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-400">Size:</p>
                    <p>{currentFloor === 1 ? '10,000' : '8,000'} sq ft</p>
                </div>
                <div>
                    <p className="font-medium text-gray-400">Occupancy:</p>
                    <p>{currentFloor === 1 ? '150 / 200' : '100 / 150'}</p>
                </div>
            </div>
        </div>
    )

}