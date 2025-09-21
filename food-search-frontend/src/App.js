import React, { useState } from 'react';

const App = () => {
    // State to hold the search query, results, loading status, and any errors
    const [query, setQuery] = useState('chocolate dessert');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cuisineFilter, setCuisineFilter] = useState('Indian');
    const [error, setError] = useState(null); // New state for holding error messages

    // Function to handle the search
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        setError(null); // Reset error on new search

        try {
            // Sending a request to the Django backend
            const response = await fetch('http://127.0.0.1:8000/api/search/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    cuisine_filter: cuisineFilter
                }),
            });

            if (!response.ok) {
                // This will catch HTTP errors like 500, 404, etc.
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            // Set a user-friendly error message to be displayed in the UI
            setError(`Failed to connect to the backend. Is the Django server running? (Details: ${error.message})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans">
            <div className="container mx-auto p-8">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-2 text-green-400">🔬 Food Search Systems Comparison</h1>
                    <p className="text-gray-400">Comparing Interactive, Advanced, and RAG Search Approaches</p>
                </header>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-12">
                    <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter a food query (e.g., 'chocolate dessert')"
                            className="flex-grow p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                         <select
                            value={cuisineFilter}
                            onChange={(e) => setCuisineFilter(e.target.value)}
                            className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="Indian">Indian</option>
                            <option value="American">American</option>
                            <option value="Italian">Italian</option>
                            <option value="Mexican">Mexican</option>
                            {/* Add other cuisine types as needed */}
                        </select>
                        <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 disabled:bg-gray-500">
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* --- NEW: Error Display --- */}
                {error && (
                    <div className="max-w-2xl mx-auto bg-red-800 border border-red-600 text-white px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}


                {/* Loading Indicator */}
                {loading && (
                     <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                        <p className="mt-2">Searching for delicious food...</p>
                    </div>
                )}

                {/* Results Display */}
                {results && (
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {/* Interactive Search Results */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b-2 border-green-400 pb-2">1️⃣ Interactive Search</h2>
                            {results.interactive && results.interactive.results.map((item, index) => (
                                <div key={index} className="mb-4 bg-gray-700 p-4 rounded-md">
                                    <h3 className="font-bold text-lg">{item.food_name} <span className="text-green-400 text-sm">({(item.similarity_score * 100).toFixed(1)}% match)</span></h3>
                                    <p className="text-gray-300 text-sm">{item.food_description}</p>
                                </div>
                            ))}
                            <p className="text-right text-gray-500 mt-4">⏱️ {results.interactive.time.toFixed(3)}s</p>
                        </div>

                        {/* Advanced Search Results */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b-2 border-green-400 pb-2">2️⃣ Advanced Search</h2>
                            <div>
                                <h3 className="font-semibold mb-2">📋 Basic Results:</h3>
                                <ul className="list-disc list-inside bg-gray-700 p-4 rounded-md mb-4">
                                    {results.advanced && results.advanced.basic_results.map((item, index) => (
                                        <li key={index}>{item.food_name} - {item.cuisine_type} ({item.food_calories_per_serving} cal)</li>
                                    ))}
                                </ul>
                                <h3 className="font-semibold mb-2">🌶️ Filtered for {cuisineFilter} Cuisine:</h3>
                                <ul className="list-disc list-inside bg-gray-700 p-4 rounded-md">
                                    {results.advanced && results.advanced.filtered_results.map((item, index) => (
                                        <li key={index}>{item.food_name} <span className="text-green-400 text-sm">({(item.similarity_score * 100).toFixed(1)}% match)</span></li>
                                    ))}
                                </ul>
                            </div>
                             <p className="text-right text-gray-500 mt-4">⏱️ {results.advanced.time.toFixed(3)}s</p>
                        </div>

                        {/* RAG Chatbot Results */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b-2 border-green-400 pb-2">3️⃣ RAG Chatbot</h2>
                            <div className="bg-gray-700 p-4 rounded-md">
                                <p className="text-lg">🤖 <span className="font-bold">Bot:</span> {results.rag && results.rag.response}</p>
                            </div>
                             <p className="text-right text-gray-500 mt-4">⏱️ {results.rag.time.toFixed(3)}s</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

