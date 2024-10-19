
import BuildingInfo from "@/app/(dashboard)/_components/left/BuildingInfo";
import {Info} from "lucide-react";
import ThreatIndicator from "@/app/(dashboard)/_components/left/ThreatIndicator";
import ActionsButtons from "@/app/(dashboard)/_components/left/ActionsButtons";
import EmergencyResources from "@/app/(dashboard)/_components/left/EmergencyResources";
import RecentThreats from "@/app/(dashboard)/_components/left/RecentThreats";

export default function LeftSide(){

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 flex flex-shrink-0 justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-0.5 flex items-center">
                        <Info className="mr-2 text-blue-400" />
                        Floor 4 Security
                    </h2>
                    <p className="text-md text-gray-400">Real-time status and alerts for floor 4 of the building.</p>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto hide-scrollbar">
                <BuildingInfo />
                <ThreatIndicator />
                <ActionsButtons />
                <EmergencyResources />
                <RecentThreats />
            </div>
        </div>
    )

}