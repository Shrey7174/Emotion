# Emotion UI Adapter

A full-stack web application that listens to your voice and dynamically adapts the user interface in real-time to match your detected emotion.

This project features a clean, professional landing page to introduce the application, and a powerful sentiment analysis tool that provides an engaging, animated user experience based on your speech.

## Core Features

 - Real-time Speech-to-Text: Uses the browser's built-in Speech Recognition API to capture and transcribe your voice.

 - AI-Powered Sentiment Analysis: Spoken text is sent to a FastAPI backend, which uses a HuggingFace Transformer model (cardiffnlp/twitter-roberta-base-sentiment-latest) to classify emotion as Positive, Negative, or Neutral.

 - Dynamic, Reactive UI: The entire React frontend instantly adapts its theme (colors, gradients, and emojis) based on the sentiment returned from the API.

 - Rich Animations:

     - Positive: Triggers a vibrant confetti-fall animation.

    -  Negative: Triggers a lightning flash effect.

     - Neutral: Triggers a soft, subtle "sunny day" glow.

 - Seamless Single-Page Application (SPA): A unified React app provides smooth navigation between the introductory landing page and the main sentiment analyzer tool.

## Technology Stack

### Frontend

**React**: Used for the entire frontend, including functional components and hooks (useState, useEffect, useRef).

**Tailwind CSS**: For all styling, utility classes, and custom theme animations.

**Axios**: For making asynchronous API requests from the frontend to the backend.

**Web Speech API**: (Browser-native) for all speech-to-text functionality.

## Backend

**FastAPI (Python)**: A high-performance Python web framework for building the API.

**HuggingFace transformers**: The library used to load and run the pre-trained RoBERTa sentiment analysis model.

**Pydantic**: Used by FastAPI for robust data validation of API request bodies.

**Uvicorn / Gunicorn**: ASGI server used to run the FastAPI application.

## Local Development Setup

To run this project on your local machine, you must run the backend and frontend in two separate terminals.

### Prerequisites

 - Node.js (v18 or later)

- Python (v3.8 or later)

 - pip and npm (or yarn)

### 1. Backend (FastAPI) Setup

First, get the Python server running.

#### 1. Clone the repository (if you haven't already)
```
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

cd /path/to/your/project-folder
```

#### 2. Create and activate a virtual environment
```
# On macOS/Linux:

python3 -m venv venv
source venv/bin/activate
```
#### On Windows:
```
python -m venv venv
.\\venv\\Scripts\\activate
```
#### 3. Install Python dependencies
   You will need to create a 'requirements.txt' file for a real project,
 but for now, you can install them directly:
pip install fastapi uvicorn "transformers[torch]"

#### 4. Run the server
This command runs the 'app' object from the 'main.py' file on port 8000
```
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Your backend is now running at http://localhost:8000.

Note: The first time you run this, it may take a few minutes to download the HuggingFace model files (over 500MB).

## 2. Frontend (React) Setup

In a new terminal, run the React app.

### 1. Navigate to the same project folder
```
cd /path/to/your/project-folder
```

### 2. Install Node.js dependencies
```
npm install
```

### 3. Start the development server
 This will likely run on port 5173 (if using Vite)
```
npm run dev
```


Your frontend is now running at http://localhost:5173.

You can open http://localhost:5173 in your browser (Chrome or Edge is recommended for Speech API support) to use the complete application.


## Future Aspects & Potential Improvements

 - Advanced Emotion Classification
 - Sentiment History Dashboard
 - Real-time Streaming Analysis
 - Multi-Language Support
