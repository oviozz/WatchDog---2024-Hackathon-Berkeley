
"use client"

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { BsShieldFillExclamation } from "react-icons/bs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTimeAgo } from "@/lib/utils";
import { GoAlertFill } from "react-icons/go";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function WeaponAlertDialog() {

    const [open, setOpen] = useState(false);
    const alert = useQuery(api.securityAlert.getUnnotifiedAlerts);

    console.log(alert)
    const markAsNotified = useMutation(api.securityAlert.markAlertAsNotified);

    useEffect(() => {
        if (alert && alert.isNotified === false) {
            setOpen(true);
        } else {
            setOpen(false); // Close the dialog if no unnotified alerts are available
        }
    }, [alert]);

    const handleClose = async () => {
        if (alert) {
            await markAsNotified({ id: alert._id });
        }
        setOpen(false);
    };

    // Check if alert is empty or undefined
    if (!alert) return null;

    const alertTime = alert?._creationTime;
    const lastSeen = alert?.last_seen;
    const currentTime = Date.now();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="max-w-[700px] bg-gray-900 text-white shadow-xl rounded-lg p-6 border border-gray-700">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-red-500 tracking-wide text-xl font-bold mb-1">
                        <GoAlertFill className="mr-2 h-5 w-5" />
                        URGENT: Weapon Detected
                    </DialogTitle>
                    <DialogDescription className="space-y-4 mt-1 text-white">
                        <div className="bg-red-200 shadow border-2 border-red-300 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between font-medium text-lg text-gray-900">
                                <h3 className="font-semibold text-md flex items-center">
                                    <BsShieldFillExclamation className="mr-2 h-5 w-5" />
                                    Suspect Information
                                </h3>
                                <span className="text-sm">
                                    Time Detected: {getTimeAgo(alertTime)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-gray-800 p-3 rounded-md shadow-sm">
                                    <h4 className="font-medium text-gray-400">Description:</h4>
                                    <p className="text-gray-300">{alert?.suspect_description}</p>
                                </div>

                                <div className="bg-gray-800 p-3 rounded-md shadow-sm">
                                    <h4 className="font-medium text-gray-400">Weapon Details:</h4>
                                    <p className="text-gray-300">
                                        <span className="font-semibold text-gray-200">Type:</span> {alert?.weapon.name}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="font-semibold text-gray-200">Details:</span> {alert?.weapon.detail}
                                    </p>
                                </div>

                                <div className="bg-gray-800 p-3 rounded-md shadow-sm">
                                    <h4 className="font-medium text-gray-400">Last Seen:</h4>
                                    <p className="text-gray-300">
                                        {lastSeen ? `Was last seen on ${lastSeen}` : "Information not available"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100 tracking-wide">
                                <BiSolidMessageSquareDots className={"h-5 w-5"} />
                                Automatic Notifications
                            </h2>

                            {["Alert sent to local authorities",
                                "Emergency notification sent to all occupants",
                                "Security team deployed to location"].map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, translateY: -10 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ delay: index, duration: 1 }}
                                    className={`p-2 bg-${index === 0 ? 'red' : index === 1 ? 'yellow' : 'blue'}-900 rounded-lg shadow-md flex items-center justify-between`}
                                >
                                    <div>
                                        <p className={`font-semibold text-${index === 0 ? 'red' : index === 1 ? 'yellow' : 'blue'}-200`}>{message}</p>
                                        <p className="text-sm text-gray-300">Sent {getTimeAgo(currentTime)}</p>
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index + 0.5, duration: 0.3 }}
                                    >
                                        <CheckCircle className="text-green-200 h-5 w-5" />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-600 rounded-lg p-3 mt-4">
                            <p className="text-md text-yellow-400 font-medium">
                                ⚠️ Please take appropriate security measures immediately.
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className={"mt-2"}>
                    <Button
                        onClick={handleClose}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                        Acknowledge Alert
                    </Button>

                    <Button
                        variant={"secondary"}
                        onClick={handleClose}
                    >
                        View Details
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
