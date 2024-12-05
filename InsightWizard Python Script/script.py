import sys
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import Chroma

# Set up API key
GOOGLE_API_KEY = "your key here"

# Load the models
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)

# Define paths
pdf_path = Path("/home/ezaan/Desktop/InsightWizard/InsightWizard Python Script/Student_Handbook_Fall_2024.pdf")
db_dir = Path("/home/ezaan/Desktop/InsightWizard/InsightWizard Python Script/chroma_db")

# Check if the ChromaDB already exists
if db_dir.exists() and any(db_dir.iterdir()):
    # Load the vectors from the existing ChromaDB
    vectordb = Chroma(persist_directory=str(db_dir), embedding_function=embeddings)
else:
    # Load the PDF and create chunks
    loader = PyPDFLoader(pdf_path)
    text_splitter = CharacterTextSplitter(
        separator=".",
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
        is_separator_regex=False,
    )
    pages = loader.load_and_split(text_splitter)

    # Turn the chunks into embeddings and store them in Chroma
    vectordb = Chroma.from_documents(pages, embeddings, persist_directory=str(db_dir))
    # The data is automatically saved in the `persist_directory`

# Configure Chroma as a retriever with top_k=5
retriever = vectordb.as_retriever(search_kwargs={"k": 10})

# Create the retrieval chain
template = """
You are a helpful AI assistant.
Answer based on the context provided.
context: {context}
input: {input}
answer:
"""
prompt = PromptTemplate.from_template(template)
combine_docs_chain = create_stuff_documents_chain(llm, prompt)
retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

# Get the input from the command-line arguments
user_input = sys.argv[1]

# Invoke the retrieval chain with the user input
response = retrieval_chain.invoke({"input": user_input})

# Print the answer to the question
print(response["answer"])
