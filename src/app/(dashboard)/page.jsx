
import LeftSide from "@/app/(dashboard)/_components/LeftSide";
import RightSide from "@/app/(dashboard)/_components/RightSide";

export default function Dashboard() {
    return (
        <div className={"flex xl:flex-row flex-col w-full bg-gray-800 h-screen p-5 rounded-xl"}>
            <div className="xl:w-1/2 w-full pr-2">
                <LeftSide />
            </div>
            <div className="w-full pl-2">
                <RightSide />
            </div>
        </div>
    );
}
