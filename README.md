# 🛡️ Watchdog: AI-Powered School Safety System

## Images

**Weapon Detection**
![image](https://github.com/user-attachments/assets/32f33874-5178-4714-b463-b8d0b7773938)
**Alert System**
![image](https://github.com/user-attachments/assets/54bd45f7-bb25-48e7-8fad-921ca3f0f56b)
**Police Report**
![image](https://github.com/user-attachments/assets/98cb0faa-9535-437f-80f2-191a4161c948)
**Real-time voice analysis**
![image](https://github.com/user-attachments/assets/62ca2428-68cd-4ee6-bae9-02292b43447d)
![image](https://github.com/user-attachments/assets/729caff5-40ac-4ad1-ac40-7c7328230e11)



## 🚀 Inspiration
Gun violence is now the leading cause of death among American children and teens, with 1 in every 10 gun fatalities involving individuals aged 19 or younger. In the U.S., school shootings have escalated into a tragic epidemic, underscoring the urgent need for enhanced security in schools. United by a shared vision, our team leveraged AI technology to create a platform aimed at improving school safety, protecting children, and giving peace of mind to students, parents, and educators alike.

## 🎯 What It Does
Watchdog uses advanced AI to enhance school security by detecting threats in real-time. Our platform streams live surveillance footage, leveraging AI to identify weapons and other indicators of potential violence, and issues instant alerts to security personnel and administrators. Additionally, our audio streaming feature detects sentiment changes, such as raised voices or distress signals, allowing security teams to respond rapidly to unfolding threats. By combining visual and auditory cues, Watchdog offers a comprehensive and proactive approach to school safety.

## 🛠️ How We Built It
With the support of our incredible sponsors—Deepgram, Hyperbolic, Groq, and Fetch.AI—we developed a robust AI security solution. Here’s an overview of our tech stack and approach:

- **Real-Time Data Processing**: Integrated Firebase and Convex for rapid data retrieval and write-back to facilitate real-time communication and alerts.
- **Weapon Detection**: Trained an agent using Ultralytics YOLO v8 on the Roboflow platform, achieving ~90% accuracy in weapon detection.
- **Audio Analysis**: Implemented sentiment analysis through Deepgram’s API to detect audio patterns like raised voices, signaling potential distress.
- **Model Deployment**: We experimented with Flask and FastAPI for model serving and explored AWS and Docker to optimize performance. Ultimately, we chose to implement Roboflow.js directly in the browser with a Native SDK, enabling fast and efficient model inference on the client side.

## 🧩 Challenges We Encountered
Achieving low latency and high accuracy with real-time AI object detection presented challenges, especially during initial model deployment. We experimented with various backends and infrastructures but ultimately found that running the model directly in the browser yielded optimal results. By leveraging Roboflow.js's Native SDK, we achieved efficient tracking with fast response times, meeting the stringent performance requirements of our safety solution.

## 🏆 Key Accomplishments
We’re proud of the capabilities we built into Watchdog:

- **Instant Weapon Detection**: Our AI agents quickly detect weapons and alert law enforcement, faculty, and students in real-time.
- **Sentiment Analysis**: Integrated sentiment detection to identify emotional escalations that could indicate potential threats.
- **Comprehensive Data Display**: We developed real-time data dashboards that provide school officials and security teams with up-to-the-minute information, helping them make informed decisions swiftly.
- **Integrated AI-Driven Safety Solution**: Bringing together visual and auditory detection in a unified system, Watchdog offers a robust, proactive approach to school security.

## 💡 What We Learned
Building Watchdog reinforced our belief in the power of perseverance. We learned that each challenge pushed us closer to our goal, and that by standing firm as a team, we could achieve our vision of a safer learning environment.

## 🚀 What's Next for Watchdog
Our ultimate vision is to see Watchdog incorporated into the American school system, providing a safer educational environment across the nation.

---

### 🛠️ Built With
- **AI & Machine Learning**: Ultralytics YOLO v8, Roboflow
- **Audio Analysis**: Deepgram API
- **Data Management**: Firebase, Convex
- **Backend**: Roboflow.js Native SDK, Flask, FastAPI, AWS, Docker
- **Real-Time Streaming & Dashboard**: Custom JavaScript integrations with Convex

---
