from pydantic import BaseModel

class Login(BaseModel):
    username: str # This can be partner name or api_key
    password: str
