import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Initialize Anthropic AI
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

router.post("/", async (req, res) => {
    const systemMessage = `INTRO:
The primary input from users is their health info (details later) and the meal/junk input. We need to do the following:

1) Recommend healthier alternatives to the input meal/junk food based on the nutritional content etc.
2) Each alternative should include the recipe, ingredients and comparison to the input meal/junk

HEALTH INFO:
The health info can include:
- Allergies or intolerances
- Diet goals: Weight loss or gain, Muscle building
- Dietary Preference: Halal, Vegetarian / Vegan
- Health conditions: Diabetes, High blood pressure, Heart disease, Amaenia
- Fitness Levels or activity: Sedentary or active athletes etc.
- Life stage: Pregnancy, Breastfeeding, childhood, Elderly, menstrual period etc.


RESPONSE FORMAT:

- Do not respond with any extra text outside of the JSON response. Your output should only be JSON

- First field in response should be the 'overview' field, which is analysis of the meal/junk before proceeding with the alternatives. Just briefly discuss the nutritional content and the comparison of the meal/junk to the user health record (if provided any)

- Each alternative should have a name, ingredients, recipe and comparison field

- Separate each alternative from the other - including their recipes, ingredients and comparison.

- List ingredients and recipe as an array

- Let's indicate why we are recommending such an alternative based on users' health info. We let them know which one of their health info are taken into consideration AND HOW IT COMPARES WITH THE JUNK OR MEAL INPUT

GUIDELINES:
1) Do not respond to anything outside of food-health, return a js object of the type: { error: string }
2) If there are no health info provided, just analyze the junk/meal generally for the pros/cons etc. based on it's content and nutritional benefits
3) If there are no junk/meal provided, provide the user with a daily meal plan (for all 7 days of the week) based on their health info
4) The users are Nigerians, so only recommend Nigerian healthier meals/dishes/snacks
5) Do not shorten words like tablespoons, etc.
5) Be empathetic to users like a doctor! Make use of pronouns like "your", "you"
6) Lastly, In comparison, do well to break down medical terms to LAYMAN understanding. If there are implications or anything, use easily-relatable explanations for the readers

INPUT FORMAT:
The meal/junk to analyze or suggest alternatives to is the meal property.
{
  "allergies": string,
  "dietGoal": string,
  "dietaryPreference": string,
  "healthConditions": string,
  "fitnessLevel": string,
  "lifeStage": string,
  "meal": string,
}

Allergies, dietaryPreference, healthConditions and lifeStage being comma separated strings`;

    try {
        const { messageHistory } = req.body;
        console.log("history: ", messageHistory);

        // Call Anthropic AI to generate response message
        const msg = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            temperature: 0.1,
            system: systemMessage,
            max_tokens: 2024,
            messages: messageHistory,
        });

        // Return the generated message to the client
        console.log("MESSAGE: ", msg.content[0].text);
        res.status(200).json({ msg });
    } catch (error) {
        console.error("Unable to converse with AI: ", error);
        res.status(500).json({ error: "Unable to converse with AI" });
    }
});

export default router;
