from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import time
import os
from typing import List, Dict, Any

# --- New Import ---
import ollama

# Use a relative import to find shared_functions.py within the same app directory.
from .shared_functions import (
    load_food_data, 
    create_similarity_search_collection, 
    populate_similarity_collection, 
    perform_similarity_search, 
    perform_filtered_similarity_search
)

# --- OLLAMA & RAG SETUP ---

# Ollama Configuration
OLLAMA_MODEL_ID = "llama3"
GEN_PARAMS = {"num_predict": 400}

class ModelInference:
    """A wrapper for the Ollama client for compatibility and ease of use."""
    def __init__(self, model_id: str, params: Dict[str, Any]):
        self.model_id = model_id
        self.params = params

    def generate(self, prompt: str) -> str:
        try:
            response = ollama.chat(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}],
                options=self.params
            )
            return response["message"]["content"]
        except Exception as e:
            print(f"🔥 Ollama Error: {e}")
            # This indicates Ollama might not be running or the model is not pulled.
            return "" 

# Initialize the LLM model instance
llm_model = ModelInference(model_id=OLLAMA_MODEL_ID, params=GEN_PARAMS)

def prepare_context_for_llm(search_results: List[Dict]) -> str:
    """Prepare structured context from search results for the LLM."""
    if not search_results:
        return "No relevant food items found in the database."
    
    context_parts = ["Based on your query, here are the most relevant food options from our database:\n"]
    for i, result in enumerate(search_results[:3], 1):
        food_context = [
            f"Option {i}: {result['food_name']}",
            f"  - Description: {result['food_description']}",
            f"  - Cuisine: {result['cuisine_type']}",
            f"  - Calories: {result['food_calories_per_serving']} per serving",
            f"  - Similarity score: {result['similarity_score']*100:.1f}%",
        ]
        context_parts.extend(food_context)
    return "\n".join(context_parts)

def generate_fallback_response(query: str, search_results: List[Dict]) -> str:
    """Generate a simple fallback response when the LLM fails."""
    if not search_results:
        return f"I'm sorry, I couldn't find any specific matches for '{query}'. Would you like to try another search?"
    top_result = search_results[0]
    return f"Based on your request for '{query}', a good option is {top_result['food_name']}, which is a {top_result['cuisine_type']} dish."

def generate_llm_rag_response(query: str, search_results: List[Dict]) -> str:
    """Generate a response using the Ollama LLM with retrieved context."""
    context = prepare_context_for_llm(search_results)
    prompt = f'''You are a helpful food recommendation assistant. A user is asking for food recommendations.

User Query: "{query}"

Retrieved Food Information:
{context}

Please provide a helpful, short response that:
1. Acknowledges the user's request.
2. Recommends 1-2 specific food items from the retrieved options.
3. Explains why these recommendations match their request.
4. Uses a friendly, conversational tone.
5. Keeps the response concise but informative.

Response:'''
    
    generated_response = llm_model.generate(prompt=prompt)
    
    if generated_response and len(generated_response) > 20:
        return generated_response.strip()
    else:
        # Fallback if LLM fails or gives an empty response
        return generate_fallback_response(query, search_results)

# --- DATABASE AND COLLECTION SETUP ---
main_collection = None
try:
    json_file_path = os.path.join(settings.BASE_DIR, 'FoodDataSet.json')
    food_items = load_food_data(json_file_path)
    main_collection = create_similarity_search_collection("food_search_collection")
    populate_similarity_collection(main_collection, food_items)
    print("✅ Food data loaded and collection populated successfully.")
    # Test LLM connection on startup
    print("🔗 Testing LLM connection...")
    if llm_model.generate("Hello"):
        print("✅ LLM connection established with Ollama.")
    else:
        print("🔥 WARNING: LLM connection to Ollama failed. RAG chatbot will use fallback responses.")
        print("🔥 Ensure Ollama is running and you have pulled the model: `ollama pull llama3`")

except FileNotFoundError:
    print(f"🔥 ERROR: FoodDataSet.json not found at {json_file_path}")
except Exception as e:
    print(f"🔥 Error during initial data load: {e}")


class SearchAPIView(APIView):
    """
    API endpoint that receives a search query and returns results
    from three different search system simulations.
    """
    def post(self, request, *args, **kwargs):
        if not main_collection:
            return Response({"error": "Search collection not initialized."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        query = request.data.get('query')
        cuisine_filter = request.data.get('cuisine_filter', 'Indian')

        if not query:
            return Response({"error": "Query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # --- System 1: Interactive Search ---
        start_time_interactive = time.time()
        interactive_results = perform_similarity_search(main_collection, query, 3)
        interactive_time = time.time() - start_time_interactive

        # --- System 2: Advanced Search ---
        start_time_advanced = time.time()
        basic_results = perform_similarity_search(main_collection, query, 3)
        filtered_results = perform_filtered_similarity_search(main_collection, query, cuisine_filter=cuisine_filter, n_results=2)
        advanced_time = time.time() - start_time_advanced

        # --- System 3: Enhanced RAG Chatbot (with Ollama) ---
        start_time_rag = time.time()
        rag_search_results = perform_similarity_search(main_collection, query, 3)
        
        # This now calls our new, powerful RAG function
        rag_response = generate_llm_rag_response(query, rag_search_results)
        
        rag_time = time.time() - start_time_rag
        
        # --- Final Response Structure ---
        response_data = {
            "interactive": {"results": interactive_results, "time": interactive_time},
            "advanced": {"basic_results": basic_results, "filtered_results": filtered_results, "time": advanced_time},
            "rag": {"response": rag_response, "time": rag_time},
        }

        return Response(response_data, status=status.HTTP_200_OK)

