
import { Phone, Shield, Ambulance } from "lucide-react"
import {cn} from "@/lib/utils";
import {inter} from "@/assests/fonts";
export default function EmergencyResources(){

    return (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
            <h3 className={cn("text-lg font-bold mb-2 tracking-wide")}>Quick Emergency Resources</h3>
            <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors">
                    <Phone className="mr-2" />
                    Call 911
                </button>
                <button className="flex items-center justify-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                    <Shield className="mr-2" />
                    Alert Security
                </button>
                <button className="flex items-center justify-center bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 transition-colors">
                    <Ambulance className="mr-2" />
                    Medical Help
                </button>
                <button className="flex items-center justify-center bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors">
                    <Shield className="mr-2" />
                    Contact Police
                </button>
            </div>
        </div>
    )


}