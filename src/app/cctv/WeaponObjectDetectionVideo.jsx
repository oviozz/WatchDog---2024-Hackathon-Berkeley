
'use client'
import { useRef, useEffect, useState } from "react";
import { FaTrashAlt, FaPlay, FaStop, FaPause } from "react-icons/fa";
import * as moment from "moment";
import "../WeaponObjectDetectionVideo.css";

//roboflow cred
const PUBLISHABLE_ROBOFLOW_API_KEY = process.env.NEXT_PUBLIC_ROBOFLOW_PUBLISHABLE_API_KEY;
const PROJECT_URL = "weapon-detection-3esci";
const MODEL_VERSION = "1";

const WeaponObjectDetectionVideo = (props) => {
    const [modelStatus, setModelStatus] = useState("model not loaded");
    const [modelStatusCss, setModelStatusCss] = useState("removed");

    const [enableCamText, setEnableCamText] = useState(
        "Enable camera to start detection",
    );
    const [disableCamButton, setDisableCamButton] = useState(false);
    const [disableStopButton, setDisableStopButton] = useState(true);

    const canvasRef = useRef(null);
    const streamSourceRef = useRef(null);
    var videoWidth = 460;
    var videoHeight = 460;

    var model = undefined;
    var detectInterval = useRef(null);

    const emptyTolerance = 30;
    var emptyingTrash = false;

    useEffect(() => {
        loadModel();
    }, []);

    useEffect(() => {
        loadingAnimations();
    }, []);

    //show loading animations at startup
    const loadingAnimations = () => {
        setDisableCamButton(true);
        setModelStatusCss("model-status-loading");
        setModelStatus("Object Detection Loading");
        setTimeout(() => {
            setModelStatusCss("removed");
            setDisableCamButton(false);
        }, 2000);
    };

    const showWebCam = async () => {
        setDisableCamButton(true); // disable button wait for cam permission first

        const camPermissions = await enableCam(true);
        if (camPermissions) {
            if (enableCamText === "Restart Camera and Detection") {
                restartCamDetection();
            }

            await loadModel();
            setModelStatusCss("removed");

            await enableCam();
            setDisableStopButton(false);
            startDetection();
        }
    };

    const restartCamDetection = () => {
        emptyingTrash = false;
    };

    //load the model
    const loadModel = async () => {
        await window.roboflow
            .auth({
                publishable_key: PUBLISHABLE_ROBOFLOW_API_KEY,
            })
            .load({
                model: PROJECT_URL,
                version: MODEL_VERSION,
                onMetadata: function (m) {},
            })
            .then((ml) => {
                model = ml;
            });
    };

    //Start detecting
    const startDetection = () => {
        if (model) {
            detectInterval.current = setInterval(() => {
                detect(model);
            }, 1000);
        }
    };

    //Stop detection
    const stopDetection = async () => {
        clearInterval(detectInterval.current);

        //clear canvas when stop detecting
        setTimeout(() => {
            clearCanvas();
        }, 500);
    };


    const clearCanvas = () => {
        canvasRef.current.getContext("2d").clearRect(0, 0, 360, 360);
    };

//Enable live webcam
    const enableCam = (checkCamPermission = false) => {
        const constraints = {
            video: {
                width: videoWidth, //416
                height: videoHeight, //416
                facingMode: "environment",
            },
        };

        return navigator.mediaDevices.getUserMedia(constraints).then(
            function (stream) {
                if (checkCamPermission) {
                    stream.getVideoTracks().forEach((track) => {
                        track.stop();
                    });
                    return true;
                } else {
                    streamSourceRef.current.srcObject = stream;
                    streamSourceRef.current.addEventListener("loadeddata", function () {
                        return true;
                    });
                }
            },
            (error) => {
                setDisableCamButton(true);
                setDisableStopButton(true);
                checkCamPermission && alert("You have to allow camera permissions");
                setEnableCamText("Allow your camera permissions and reload");
                return false;
            },
        );
    };




    const stopCamera = (options) => {
        if (
            streamSourceRef.current != null &&
            streamSourceRef.current.srcObject !== null
        ) {
            streamSourceRef.current.srcObject.getVideoTracks().forEach((track) => {
                track.stop();
            });
        }
        stopDetection();
        setEnableCamText("Restart Camera and Detection");
        setDisableCamButton(false);
        setDisableStopButton(true);
    };

    const restartDetection = (intervalTimer) => {
        clearInterval(detectInterval.current);
        detectInterval.current = undefined;
        if (model) {
            detectInterval.current = setInterval(() => {
                detect(model);
            }, intervalTimer);
        }
    };

    let trashToleranceTicker = 0;
    let trashToleranceTimer = undefined;
    const emptyTrashTolerance = (start) => {
        if (!start) {
            clearInterval(trashToleranceTimer);
        } else {
            trashToleranceTimer = setInterval(() => {
                trashToleranceTicker++;
            }, 1000);
        }
        return trashToleranceTicker;
    };

    //Detection stuff
    const detect = async (model) => {
        if (
            typeof streamSourceRef.current !== "undefined" &&
            streamSourceRef.current !== null
        ) {
            adjustCanvas(videoWidth, videoHeight);

            const detections = await model.detect(streamSourceRef.current);

            let truckPresent = false;

            if (detections.length > 0) {
                detections.forEach((el) => {
                    if (el.class === "garbageTruck" && el.confidence > 0.6) {
                        truckPresent = true;
                    }

                    if (
                        truckPresent &&
                        el.class === "garbagePickingUp" &&
                        el.confidence > 0.6
                    ) {
                        emptyingTrash = true;
                        emptyTrashTolerance(true);
                    }
                });
            }

            if (truckPresent) {
                restartDetection(10);
            } else {
                restartDetection(1000);
            }

            if (
                emptyingTrash &&
                !truckPresent &&
                trashToleranceTicker > emptyTolerance
            ) {
                emptyingTrash = false;
                emptyTrashTolerance(false);
                stopCamera("fromDetect");
                pickupTimes.push(moment().format("ddd, MM-DD-YYYY, h:mm a"));
            }

            const ctx = canvasRef.current.getContext("2d");
            drawBoxes(detections, ctx);
        }
    };

    const adjustCanvas = (w, h) => {
        canvasRef.current.width = w * window.devicePixelRatio;
        canvasRef.current.height = h * window.devicePixelRatio;

        canvasRef.current.style.width = w + "px";
        canvasRef.current.style.height = h + "px";

        canvasRef.current
            .getContext("2d")
            .scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const drawBoxes = (detections, ctx) => {
        detections.forEach((row) => {
            if (true) {
                //video
                var temp = row.bbox;
                temp.class =
                    row.class === "GarbageBin"
                        ? "bin"
                        : row.class === "garbagePickingUp"
                            ? "pickup"
                            : row.class;
                temp.color = row.color;
                temp.confidence = row.confidence;
                row = temp;
            }
            if (row.confidence < 0) return;

            //dimensions
            var x = row.x - row.width / 2;
            var y = row.y - row.height / 2;
            var w = row.width;
            var h = row.height;

            //box
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = row.color;
            ctx.rect(x, y, w, h);
            ctx.stroke();

            //shade
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x, y, w, h);
            ctx.globalAlpha = 1.0;

            //label
            var fontColor = "black";
            var fontSize = 12;
            ctx.font = `${fontSize}px monospace`;
            ctx.textAlign = "center";
            var classTxt = row.class;

            var confTxt = (row.confidence * 100).toFixed().toString() + "%";
            var msgTxt = classTxt + " " + confTxt;

            const textHeight = fontSize;
            var textWidth = ctx.measureText(msgTxt).width;

            if (textHeight <= h && textWidth <= w) {
                ctx.strokeStyle = row.color;
                ctx.fillStyle = row.color;
                ctx.fillRect(
                    x - ctx.lineWidth / 2,
                    y - textHeight - ctx.lineWidth,
                    textWidth + 2,
                    textHeight + 1,
                );
                ctx.stroke();
                ctx.fillStyle = fontColor;
                ctx.fillText(msgTxt, x + textWidth / 2 + 1, y - 1);
            } else {
                textWidth = ctx.measureText(confTxt).width;
                ctx.strokeStyle = row.color;
                ctx.fillStyle = row.color;
                ctx.fillRect(
                    x - ctx.lineWidth / 2,
                    y - textHeight - ctx.lineWidth,
                    textWidth + 2,
                    textHeight + 1,
                );
                ctx.stroke();
                ctx.fillStyle = fontColor;
                ctx.fillText(confTxt, x + textWidth / 2 + 1, y - 1);
            }
        });
    };


    return (
        <div className="w-[70%] mx-auto font-sans text-white bg-gray-900 p-10 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
                <div className="w-full border-4 border-dashed border-purple-700 rounded-lg p-4">
                    {/* Camera Enable Button */}
                    <div className="mb-5 flex justify-center">
                        <button
                            onClick={showWebCam}
                            disabled={disableCamButton}
                            className={`w-full py-3 text-md uppercase font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-500 transition duration-300 ease-in-out cursor-pointer outline-none ${
                                disableCamButton ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                        >
                            {enableCamText}
                        </button>
                    </div>

                    {/* Model Status */}
                    <div className="flex flex-col items-center">
                        <div className={`p-3 rounded-lg text-center ${modelStatusCss}`}>
                            <p>{modelStatus || "Model status: Waiting for input..."}</p>
                        </div>
                    </div>

                    {/* Video and Controls */}
                    <div className="my-8 flex flex-col items-center">
                        <div className="relative w-[700px] h-[700px] bg-gradient-to-b from-gray-800 to-gray-600 rounded-lg">
                            {/* Video Feed */}
                            <canvas ref={canvasRef} className="absolute z-20 w-full h-full" />
                            <video
                                ref={streamSourceRef}
                                autoPlay
                                muted
                                playsInline
                                width={videoWidth}
                                height={videoHeight}
                                className="block rounded-lg w-full h-full"
                            />
                        </div>

                        {/* Stop Button */}
                        <div className="mt-4">
                            <button
                                className={`w-[100px] h-[35px] text-xs uppercase font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-500 transition duration-300 ease-in-out cursor-pointer outline-none ${
                                    disableStopButton ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                                onClick={stopCamera}
                                disabled={disableStopButton}
                            >
                                <FaStop className="inline mr-1" /> Stop Cam
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WeaponObjectDetectionVideo;