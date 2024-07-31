import Key 
import os
os.environ["OPENAI_API_KEY"] = Key.OPENAI_API_KEY
from flask import Flask, request, jsonify
from langchain_community.document_loaders import DirectoryLoader,PyPDFLoader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain.chains import create_retrieval_chain
from flask_cors import CORS
# Conversation imports
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chains.history_aware_retriever import create_history_aware_retriever
import time

docs=[]
chat_history = []

# Retrieve Data
def get_docs():
    global docs

    loader=DirectoryLoader('E:/sireen/study/JUP/JUP/model/test1/splittedper/',
                       glob="*.pdf",
                       loader_cls=PyPDFLoader)

    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=20
    )

    splitDocs = text_splitter.split_documents(docs)
    print("end of get_docs")

def create_db(docs):
    global vectorStore
    embedding = OpenAIEmbeddings()
    vectorStore = FAISS.from_documents(docs, embedding=embedding)
    print("end of create_db")

def create_chain(vectorStore):
    global chain
    model = ChatOpenAI(
        temperature=0.7,
        model='gpt-3.5-turbo-1106'
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """diagnosis the mental disorder based on the context: {context},
        if you are not sure about the disorder don't give answer just ask questions to be sure.
        if you sure about the answer (mental disorder) don't give answer just ask if there is additional information.
        if the user answer with "there is no additional information" then give the answer (mental disorder) """),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}")
    ])
    # chain = prompt | model
    chain = create_stuff_documents_chain(
        llm=model,
        prompt=prompt
    )
    retriever = vectorStore.as_retriever(search_kwargs={"k":3})
    retriever_prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        ("user", """ Given the above conversation,if it is empty just chat with user and if not
         generate a search query to look up in order to get information relevant to the conversation""")
    ])
    history_aware_retriever = create_history_aware_retriever(
        llm=model,
        retriever=retriever,
        prompt=retriever_prompt
    )


    retrieval_chain = create_retrieval_chain(
        history_aware_retriever,
        chain
    )
    return retrieval_chain

def process_chat(chain, question, chat_history):
    response = chain.invoke({
        "chat_history": chat_history,
        "input": question,
    })
    return response["answer"]
app = Flask(__name__)
CORS(app)
get_docs()
create_db(docs)
chain = create_chain(vectorStore)
query_times=[]
total_queries=0
@app.route('/chatbot', methods=['POST'])
def chat():
    print(chat_history)
    start_time = time.time()  # Start timing queries
    # Retrieve user message from request
    data = request.get_json()
    user_message = data.get('message')

    # Process the message
    response = process_chat(chain, user_message, chat_history)

    # Update chat history
    chat_history.append(HumanMessage(content=user_message))
    chat_history.append(AIMessage(content=response))
    
    # End timing queries
    end_time = time.time()  
    query_time=end_time - start_time
    global query_times
    query_times.append(query_time)
    global total_queries
    total_queries += 1
    print(query_times)
    qps=0
    avgResponseTime=0
    # Calculate and display QPS
    if query_times:
        total_time = sum(query_times)
        qps = total_queries / total_time
        
    # Return response as JSON
    return jsonify({'response': response,'qps':qps,'art':avgResponseTime,'qt':query_time})

if __name__ == '__main__':
    app.run(debug=True,host="127.0.0.1",port=5173)
    