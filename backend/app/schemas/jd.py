from pydantic import BaseModel, Field

class JDTextInput(BaseModel):
    text: str = Field(..., min_length=50, description="Job description text")
