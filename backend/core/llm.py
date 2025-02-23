from beeai_framework.backend.chat import ChatModel, ChatModelInput, ChatModelOutput
from beeai_framework.backend.message import UserMessage
from beeai_framework.agents.bee import BeeAgent
from beeai_framework.agents.types import BeeInput, BeeRunInput
from beeai_framework.memory import UnconstrainedMemory
from beeai_framework.tools.search.duckduckgo import DuckDuckGoSearchTool
import os
from dotenv import load_dotenv
import asyncio
import litellm

# Turn on debug mode for litellm
litellm._turn_on_debug()

WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
WATSONX_API_URL = os.getenv("WATSONX_URL")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
# Create a ChatModel to interface with ibm/granite-3-8b-instruct from watsonx

model = ChatModel.from_name(
    "watsonx:ibm/granite-3-8b-instruct",
    options={
        "project_id": WATSONX_PROJECT_ID,
        "api_key": WATSONX_API_KEY,
        "api_base": WATSONX_API_URL,
        "stream": False,
    }
)

class Result:
    def __init__(self, text):
        self.text = text

class SearchResult:
    def __init__(self, result):
        self.result = result




# model = ChatModel.from_name("ollama:granite3.1-dense:2b")
# model = ChatModel.from_name("ollama:llama3.2:1b",options={"stream": False})

# async def get_response(prompt: str):
#     message = UserMessage(content=prompt)
#     output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
#     return output.get_text_content()



async def get_medical_soap_note(conversation_text: str, doctor_notes: str, patient_information: str) -> str:
    """
    Convert conversation text into a SOAP note format for medical use cases.
    
    Args:
        conversation_text (str): The medical conversation/text to be summarized
        
    Returns:
        str: Formatted SOAP note
    """
    prompt = f"""Please analyze the following medical conversation and convert it into a SOAP note format.
    Follow this structure strictly:
    
    Subjective (S): Patient's symptoms, complaints, and relevant history
    Objective (O): Observable findings, vital signs, examination results
    Assessment (A): Medical diagnosis or clinical impression
    Plan (P): Treatment plan, medications, follow-up
    
    Here's the conversation to analyze:
    {conversation_text} + {doctor_notes}+{patient_information}
    
    Format the response maintaining clear SOAP sections."""

    message = UserMessage(content=prompt)
    output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
    return output.get_text_content()

async def get_medical_referral_letter(conversation_text: str, doctor_notes: str, patient_information: str) -> str:
    """
    Generate a medical referral letter from a doctor to another healthcare provider.
    
    Args:
        conversation_text (str): The medical conversation/text to reference
        doctor_notes (str): Additional notes from the referring doctor
        patient_information (str): Patient's demographic and medical history
        
    Returns:
        str: Formatted referral letter
    """
    prompt = f"""Please generate a professional medical referral letter using the following information. Add no misinformation. If any information is not available, ignore it.
    The letter should follow this structure:

    [Today's Date]

    Dear Dr. [Receiving Doctor],

    RE: [Patient Name] - Medical Referral
    DOB: [Patient's date of birth]

    I am writing to refer [Patient Name] for [specialty/reason for referral].

    Patient History and Current Presentation:
    [Include relevant medical history, current symptoms, and findings from the conversation]

    Current Medications:
    [List any current medications]

    Investigations and Results:
    [Include any relevant test results or investigations]

    Reason for Referral:
    [Clearly state the reason for referral and any specific questions or concerns]

    Thank you for seeing this patient. Please do not hesitate to contact me if you require any additional information.

    Yours sincerely,
    Dr. [Referring Doctor's Name]
    [Contact Details]

    Use this information to generate the letter:
    Conversation: {conversation_text}
    Doctor's Notes: {doctor_notes}
    Patient Information: {patient_information}

    Please maintain a professional and formal tone throughout the letter."""

    message = UserMessage(content=prompt)
    output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
    return output.get_text_content()


async def get_appointment_prerequisites(condition: str) -> str:
    """
    Get pre-appointment information and prerequisites based on medical condition.
    Uses DuckDuckGo search combined with LLM knowledge.
    
    Args:
        condition (str): Primary medical condition or symptoms
        
    Returns:
        str: Formatted prerequisites and precautions
    """
    # Create initial welcome message if this is the first message
    if condition.lower() in ["hi", "hello", "hey"]:
        return """Hello! I'm here to help you prepare for your appointment. 
        Please tell me about your condition or symptoms, and I'll provide specific 
        preparation guidelines and prerequisites for your visit."""

    # Setup BeeAgent with search capability
    agent = BeeAgent(
        BeeInput(
            llm=model, 
            tools=[DuckDuckGoSearchTool()], 
            memory=UnconstrainedMemory()
        )
    )
    
    # Create search query
    search_prompt = f"""
    What are the pre-appointment preparations and precautions for a patient with {condition}. Include information about:
    1. Required fasting or dietary restrictions before the appointment
    2. Medical tests that might be needed
    3. Documents or medical history to bring
    4. Any specific preparations needed
    """
    # Get search results
    flag = True
    search_result = None
    try:
        search_result = await agent.run(BeeRunInput(prompt=search_prompt))
    except Exception as e:
        print(f"An error occurred by searching: {e}")
        flag = False
    if not flag:
        # Creating an instance
        result_obj = Result("No search results found for the given condition.")
        search_result = SearchResult(result_obj)
    
    # Create final prompt combining search results with LLM analysis
    try :
        final_prompt = f"""
        Based on the following search results and your medical knowledge, provide a friendly and clear 
        response about preparations and precautions for a patient with {condition}
        before their doctor's appointment.

        Search findings:
        {search_result.result.text}

        Please format the response in a conversational way, but make sure to cover:
        1. Any pre-appointment testing requirements
        2. Dietary restrictions (if any)
        3. Required documents
        4. Specific preparations
        5. Additional precautions

        Make the response friendly and reassuring, but maintain professionalism.
        Highlight any critical timing requirements (like fasting duration) 
        and essential items to bring to the appointment. Keep it short and concise.
        """
        print(final_prompt)
        message = UserMessage(content=final_prompt)
        output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
        return output.get_text_content()
    except Exception as e:
        print(f"An error occurred: {e}")
        return "An error occurred while retrieving the appointment prerequisites. Please try again later."


async def get_transcription_summary(conversation_text) -> str:
    """
    Generate a concise summary of a medical conversation or transcription.
    
    Args:
        conversation_text (str): The medical conversation/transcription to be summarized
        
    Returns:
        str: A clear summary highlighting key medical information and discussion points
    """
    prompt = f"""Please provide a clear and concise summary of the following medical conversation.
    Focus on capturing:
    - Main symptoms or health concerns discussed
    - Key findings or observations mentioned
    - Important decisions or next steps agreed upon
    - Any critical follow-up items
    
    Conversation to summarize:
    {conversation_text}
    
    Please provide a structured summary that highlights the most relevant medical information."""

    message = UserMessage(content=prompt)
    output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
    return output.get_text_content()

if __name__ == "__main__":
    load_dotenv()
    # Example usage for prerequisites
    # test_condition = "diabetes"
    # print("Getting appointment prerequisites...")
    # print(asyncio.run(get_appointment_prerequisites(test_condition)))
    
    # Example usage for SOAP note
    test_conversation = """
    Patient complains of severe headache for 3 days, accompanied by nausea. 
    BP reading shows 140/90. Patient reports similar episodes in the past.
    Physical examination reveals slight neck stiffness.
    """
    print("\nGenerating SOAP note...")
    print(asyncio.run(get_medical_soap_note(test_conversation)))