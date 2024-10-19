
import BuildingMap from "@/app/(dashboard)/_components/right/BuildingMap";
import LiveCameraFeed from "@/app/(dashboard)/_components/right/LiveCameraFeed";

export default function RightSide() {
    return (
        <div className={"flex flex-col overflow-y-auto hide-scrollbar gap-4"}>
            <BuildingMap />
            <LiveCameraFeed />
        </div>
    )
}