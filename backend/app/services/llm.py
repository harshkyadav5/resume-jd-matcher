from openai import OpenAI, RateLimitError
import os

def generate_feedback(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return (
            "AI feedback unavailable (demo mode).\n\n"
            "Your resume matches several job requirements. "
            "Consider strengthening missing skills and adding measurable achievements."
        )

    try:
        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an ATS resume analyzer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )

        return response.choices[0].message.content.strip()

    except RateLimitError:
        return (
            "AI feedback temporarily unavailable due to API quota limits.\n\n"
            "Please try again later or enable demo mode."
        )

    except Exception as e:
        return f"AI feedback error: {str(e)}"

