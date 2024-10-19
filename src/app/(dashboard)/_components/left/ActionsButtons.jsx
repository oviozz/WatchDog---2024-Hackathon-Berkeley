
import { Camera, Headphones } from 'lucide-react'

export default function ActionsButtons(){

    return (
        <div className="grid grid-cols-2 gap-4 mb-4">
            <button className="flex items-center justify-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                <Camera className="mr-2" />
                View Camera
            </button>
            <button className="flex items-center justify-center bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors">
                <Headphones className="mr-2" />
                Listen Audio
            </button>
        </div>
    )


}