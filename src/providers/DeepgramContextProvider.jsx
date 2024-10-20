
"use client";

import {
    createClient,
    LiveConnectionState,
    LiveTranscriptionEvents,
} from "@deepgram/sdk";

import {
    createContext,
    useContext,
    useState,
    useCallback,
} from "react";

const DeepgramContext = createContext(undefined);

const getApiKey = async () => {
    try {
        const response = await fetch("/api/deepgram", { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Failed to fetch API key");
        }
        const result = await response.json();
        return result.key;
    } catch (error) {
        console.error("Error fetching API key:", error);
        throw error;
    }
};

const DeepgramContextProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const [connectionState, setConnectionState] = useState(
        LiveConnectionState.CLOSED
    );
    const [error, setError] = useState(null);

    const connectToDeepgram = useCallback(async (options, endpoint) => {
        try {
            setConnectionState(LiveConnectionState.CONNECTING);
            setError(null);

            const key = await getApiKey();
            const deepgram = createClient(key);

            const conn = deepgram.listen.live(options, endpoint);

            conn.addListener(LiveTranscriptionEvents.Open, () => {
                setConnectionState(LiveConnectionState.OPEN);
            });

            conn.addListener(LiveTranscriptionEvents.Close, () => {
                setConnectionState(LiveConnectionState.CLOSED);
            });

            conn.addListener(LiveTranscriptionEvents.Error, (error) => {
                console.error("Deepgram connection error:", error);
                setError(error);
                setConnectionState(LiveConnectionState.CLOSED);
            });

            setConnection(conn);
        } catch (error) {
            console.error("Error connecting to Deepgram:", error);
            setError(error);
            setConnectionState(LiveConnectionState.CLOSED);
        }
    }, []);

    const disconnectFromDeepgram = useCallback(async () => {
        if (connection) {
            connection.finish();
            setConnection(null);
            setConnectionState(LiveConnectionState.CLOSED);
        }
    }, [connection]);

    return (
        <DeepgramContext.Provider
            value={{
                connection,
                connectToDeepgram,
                disconnectFromDeepgram,
                connectionState,
                error,
            }}
        >
            {children}
        </DeepgramContext.Provider>
    );
};

function useDeepgram() {
    const context = useContext(DeepgramContext);
    if (context === undefined) {
        throw new Error(
            "useDeepgram must be used within a DeepgramContextProvider"
        );
    }
    return context;
}

export {
    DeepgramContextProvider,
    useDeepgram,
    LiveConnectionState,
    LiveTranscriptionEvents,
};