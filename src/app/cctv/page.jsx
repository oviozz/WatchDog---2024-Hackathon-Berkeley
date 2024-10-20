

import WeaponObjectDetectionVideo from "@/app/cctv/WeaponObjectDetectionVideo";
import Script from "next/script";


export default async function Page(){

    return (
        <>
            <Script
                src={"https://cdn.roboflow.com/0.2.26/roboflow.js"}
                strategy="beforeInteractive"
            />

            <WeaponObjectDetectionVideo />
        </>
    )
}