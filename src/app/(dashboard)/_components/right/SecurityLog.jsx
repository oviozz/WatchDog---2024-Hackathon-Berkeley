
import {ClipboardList, Loader} from "lucide-react"
import {Button} from "@/components/ui/button";
export default function SecurityLog(){

    return (
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-4">
                <div className={"flex flex-col"}>
                    <h2 className="text-2xl font-bold mb-1 flex items-center">
                        <ClipboardList className="mr-2 text-purple-400" />
                        Security Event Log
                    </h2>
                    <p className="text-gray-400">Record of all security events and system activities.</p>
                </div>

                <Button>
                    <Loader className={"animate-spin"} />
                    <span className={"animate-pulse"}>Checking...</span>
                </Button>
            </div>
            <div className="space-y-2">
                <div className="p-1.5 bg-red-900 rounded">
                    <p className="font-semibold text-red-200">Alert sent to local authorities</p>
                    <p className="text-sm text-red-300">10:31 AM</p>
                </div>
                <div className="p-2 bg-yellow-900 rounded">
                    <p className="font-semibold text-yellow-200">Emergency notification sent to all occupants</p>
                    <p className="text-sm text-yellow-300">10:31 AM</p>
                </div>
                <div className="p-2 bg-blue-900 rounded">
                    <p className="font-semibold text-blue-200">Security team deployed to location</p>
                    <p className="text-sm text-blue-300">10:32 AM</p>
                </div>
            </div>
        </div>
    )


}