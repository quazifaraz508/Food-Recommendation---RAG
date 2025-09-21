### 🍽️ Food Search Systems Comparison

An interactive web application that demonstrates three approaches to food search: Interactive Search, Advanced Search, and a RAG-powered Chatbot.

The project combines a React frontend with a Django backend, using ChromaDB vector search and RAG pipelines for semantic understanding and retrieval.

🚀 Features

Interactive Search → Finds food items using vector similarity (ChromaDB).

Advanced Search → Filters results by cuisine, calories, and match score.

RAG Chatbot → Retrieval-Augmented Generation (RAG) chatbot that generates conversational, context-aware recommendations.

Vector Search → Embeddings stored and queried in ChromaDB for fast semantic retrieval.

Modern UI → Dark-themed, responsive interface with real-time search results.

## 🛠️ Tech Stack
Frontend

React (Create React App)

TailwindCSS / CSS

Backend

Django (Python)

Django REST Framework (for APIs)

ChromaDB (vector database for embeddings & similarity search)

Hugging Face / Sentence Transformers (for embeddings)

RAG Pipeline (for contextual response generation)

## ⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/yourusername/food-search-system.git
cd food-search-system

## 2. Backend (Django + RAG + ChromaDB)
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


## Backend runs on 👉 http://127.0.0.1:8000/

3. Frontend (React)
cd frontend
npm install
npm start


Frontend runs on 👉 http://localhost:3000/

## 📡 API Endpoints (Examples)

POST /api/search/interactive/ → Vector similarity search (ChromaDB).

POST /api/search/advanced/ → Filtered results (e.g., by cuisine, calories).

POST /api/search/rag/ → RAG-powered chatbot recommendations.

## 📖 How It Works

User enters a query (e.g., "chocolate dessert").

Frontend sends the query to Django backend.

Backend:

Converts query into embeddings using a Sentence Transformer model.

Performs similarity search in ChromaDB.

Passes retrieved context into a RAG pipeline.

Results are displayed in three panels:

Interactive Search (ranked by similarity score).

Advanced Search (structured results with filters).

RAG Chatbot (AI-generated conversational response).

📷 Preview

## 📌 Future Enhancements

Support for multiple embedding models.

User-specific history & favorites.

Deploy ChromaDB as a persistent external service.

Add multilingual RAG chatbot support.

👨‍💻 Author

Developed with ❤️ using React, Django, RAG, and ChromaDB.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
<img width="1920" height="1308" alt="screencapture-localhost-3000-2025-09-21-22_24_00" src="https://github.com/user-attachments/assets/59ae16b3-38de-44f9-bc96-ce38f2dff03d" />

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
