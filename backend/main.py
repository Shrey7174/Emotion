
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(
    title="Sentiment Analysis API",
    description="A FastAPI backend for the Emotion-Based UI Theme Adapter.",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"

try:
    logger.info(f"Loading HuggingFace model: {MODEL_NAME}...")
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

    sentiment_pipeline = pipeline(
        "sentiment-analysis", 
        model=model,
        tokenizer=tokenizer
    )
    
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    sentiment_pipeline = None

class TextIn(BaseModel):
    """Request model for incoming text."""
    text: str

class SentimentOut(BaseModel):
    """Response model for outgoing sentiment."""
    label: str  
    score: float



@app.get("/", tags=["Root"])
async def read_root():
    """Health check endpoint."""
    return {"message": "Sentiment Analysis API is running."}


@app.post("/analyze-sentiment/", response_model=SentimentOut, tags=["Analysis"])
async def analyze_sentiment_endpoint(payload: TextIn):
    """
    Analyzes the sentiment of a given text string.
    Maps the model's label (0, 1, 2) to our 3-label sentiment.
    """
    if sentiment_pipeline is None:
        logger.error("Sentiment pipeline not loaded.")
        return {"label": "NEUTRAL", "score": 0.0}

    try:
        result = sentiment_pipeline(payload.text)[0]
        
        
        
        model_label = result['label'].upper()
        score = result['score']
        
        sentiment_label = 'NEUTRAL'  
        
        if model_label == 'POSITIVE' or model_label == 'LABEL_2':
            sentiment_label = 'POSITIVE'
        elif model_label == 'NEGATIVE' or model_label == 'LABEL_0':
            sentiment_label = 'NEGATIVE'
        elif model_label == 'NEUTRAL' or model_label == 'LABEL_1':
            sentiment_label = 'NEUTRAL'
            
        return SentimentOut(label=sentiment_label, score=score)

    except Exception as e:
        logger.error(f"Error during sentiment analysis: {e}")
        return SentimentOut(label="NEUTRAL", score=0.0)

