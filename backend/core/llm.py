from beeai_framework.backend.chat import ChatModel, ChatModelInput, ChatModelOutput
from beeai_framework.backend.message import UserMessage
from beeai_framework.agents.bee import BeeAgent
from beeai_framework.agents.types import BeeInput, BeeRunInput
from beeai_framework.memory import UnconstrainedMemory
from beeai_framework.tools.search.duckduckgo import DuckDuckGoSearchTool
import os
from dotenv import load_dotenv
import asyncio

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
    },
)

# async def get_response(prompt: str):
#     message = UserMessage(content=prompt)
#     output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
#     return output.get_text_content()



async def get_medical_soap_note(conversation_text: str) -> str:
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
    {conversation_text}
    
    Format the response maintaining clear SOAP sections."""

    message = UserMessage(content=prompt)
    output: ChatModelOutput = await model.create(ChatModelInput(messages=[message]))
    return output.get_text_content()

async def get_appointment_prerequisites(condition: str) -> str:
    """
    Get pre-appointment information and prerequisites based on medical condition and symptoms.
    Uses DuckDuckGo search combined with LLM knowledge.
    
    Args:
        condition (str): Primary medical condition (e.g., "diabetes")
        symptoms (str): Current symptoms (e.g., "swollen legs")
        
    Returns:
        str: Formatted prerequisites and precautions
    """
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
    Search for pre-appointment preparations and precautions for a patient with {condition} . Include information about:
    1. Required fasting or dietary restrictions before the appointment
    2. Medical tests that might be needed
    3. Documents or medical history to bring.
    """
    
    # Get search results
    search_result = await agent.run(BeeRunInput(prompt=search_prompt))
    print(search_result.result.text)
    # Create final prompt combining search results with LLM analysis
    final_prompt = f"""
    Based on the following search results and your medical knowledge, provide a comprehensive 
    list of preparations and precautions for a patient with {condition}
    before their doctor's appointment.

    Search findings:
    {search_result.result.text}

    Please format the response with these sections:
    1. Pre-appointment Testing Requirements
    2. Dietary Restrictions
    3. Required Documents
    4. Symptom-specific Preparations
    5. Additional Precautions

    Make sure to highlight any critical timing requirements (like fasting duration) 
    and essential items to bring to the appointment.
    """
    
    message = UserMessage(content=final_prompt)
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