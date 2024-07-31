from langchain_openai import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
import Key 
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

os.environ["OPENAI_API_KEY"] = Key.OPENAI_API_KEY
llm = ChatOpenAI(
        temperature=0.7,
        model='gpt-3.5-turbo-1106',
        max_tokens=3000  
    )

def create_chain():
    combine_prompt = """
    list all mental disorders the patient currently has and has had in the past .
    list all medications.
    Additionally Write a concise summary of the following Notes delimited by triple backquotes. 
    Analyze the notes to determine and overall improvement status.
    Return your response in bullet points with each point on a separate line and two empty lines after each point.

    `{text}`
    BULLET POINT SUMMARY:
    """
    combine_prompt_template = PromptTemplate(template=combine_prompt, input_variables=["text"])
    map_prompt = """
    Write a concise summary of the following:
    "{text}"
    CONCISE SUMMARY:
    """
    map_prompt_template = PromptTemplate(template=map_prompt, input_variables=["text"])
    summary_chain = load_summarize_chain(llm=llm,
                                        chain_type='map_reduce',
                                        map_prompt=map_prompt_template,
                                        combine_prompt=combine_prompt_template,
                                        )
    return summary_chain

def process_chat(summary_chain, input):

    llm.get_num_tokens(input)
    text_splitter = RecursiveCharacterTextSplitter(separators=["\n\n", "\n"], chunk_size=10000, chunk_overlap=500)

    docs = text_splitter.create_documents([input])
    num_docs = len(docs)

    num_tokens_first_doc = llm.get_num_tokens(docs[0].page_content)

    output = summary_chain.invoke(docs)
    return output["output_text"]

def convert_data(data):
    custom_dialogue = ""
    for record in data:
        # Extract relevant information
        date = record.get('created_at').split('T')[0]  # Extract date from created_at
        doctor = record.get('doctor_name')  # Extract date from created_at
        patient = record.get('patient_name')  # Extract date from created_at
        notes = record.get('notes')
        pre_med = record.get('preMed')
        post_med = record.get('postMed')
        conference_id = f"C{len(custom_dialogue) // 100 + 1:03d}"  # Generate unique ID

        # Build the dialogue entry
        entry = f"""

        Date: {date}
        Doctor: {doctor}
        patient: {patient}
        Notes: {notes}
        Medicine Taken Before: {pre_med if pre_med else 'None'}
        Medicine Prescribed After: {post_med if post_med else 'None'}
        Conference ID: {conference_id}


        """
        custom_dialogue += entry

    return custom_dialogue
app = Flask(__name__)
CORS(app)
chain = create_chain()
@app.route('/summarization', methods=['POST'])
def summarization():
    # Retrieve user message from request
    data = request.get_json()
    print(data)

    user_notes = data.get('Notes')
    custom_dialogue = convert_data(user_notes)
    # Process the message
    response = process_chat(chain, custom_dialogue)

    # Return response as JSON
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True,host="127.0.0.1",port=5173)
    