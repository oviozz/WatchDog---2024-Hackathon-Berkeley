
import {MicrophoneContextProvider} from "@/providers/MicrophoneContextProvider";
import {DeepgramContextProvider} from "@/providers/DeepgramContextProvider";

export default function Layout({children}){

    return (
        <div>
            <MicrophoneContextProvider>
                <DeepgramContextProvider>{children}</DeepgramContextProvider>
            </MicrophoneContextProvider>
        </div>
    )


}