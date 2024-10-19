
"use client"

import React from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { capitalizeFirstLetter, getTimeAgo } from "@/lib/utils";
import { BsShieldFillExclamation } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const AlertCard = ({ alert }) => {
    const { id, last_seen, suspect_description, weapon, _creationTime } = alert;
    const weaponName = capitalizeFirstLetter(weapon.name);
    const isWeaponDetected = weaponName.trim() !== "None";

    return (
        <Card
            key={id}
            className={`border-l-4 ${
                isWeaponDetected ? 'bg-red-900/20 border-red-500' : 'bg-green-900/20 border-green-500'
            }`}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`flex items-center text-lg font-semibold ${
                        isWeaponDetected ? 'text-red-300' : 'text-green-300'
                    }`}>
                        <BsShieldFillExclamation className="mr-2 text-white" />
                        ALERT - {weaponName} {isWeaponDetected ? 'Detected' : 'Clear'}
                    </h3>
                    <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300">
                        {getTimeAgo(_creationTime)}
                    </Badge>
                </div>
                <div className="space-y-1 text-md">
                    <p><span className="font-semibold text-gray-300">Suspect:</span> <span className="text-gray-400">{suspect_description}</span></p>
                    <p><span className="font-semibold text-gray-300">Weapon:</span> <span className="text-gray-400">{weaponName} ({weapon.detail})</span></p>
                    <p><span className="font-semibold text-gray-300">Location:</span> <span className="text-gray-400">{last_seen}</span></p>
                </div>
            </CardContent>
        </Card>
    );
};

export default function RecentThreats() {
    const alerts = useQuery(api.securityAlert.getRecentAlerts);

    return (
        <div className="bg-gray-700 p-4 min:h-[300px] overflow-y-auto rounded-lg mb-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold mb-2">Recent Threats</h3>
                <Button className="bg-purple-700 font-medium text-white rounded-xl">
                    <Loader className="animate-spin h-5 w-5" />
                    <span>Live Checking</span>
                </Button>
            </div>
            <ul className="space-y-4">
                {!alerts || alerts.length === 0 ? (
                    <div className="mb-4 p-5 bg-gray-900 border-l-4 border-gray-500 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-300">No Threats Detected</h3>
                    </div>
                ) : (
                    alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
                )}
            </ul>
        </div>
    );
}