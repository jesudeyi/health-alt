import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { Business } from "./model.js";

const router = express.Router();
dotenv.config();

// Initialize Anthropic AI
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

router.post("/ai-conversation", async (req, res) => {
    const systemMessage = `INTRO:
The primary input from users is their health info (details later) and the meal/junk input (the name or image). We need to do the following:

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

- First field in response should be the 'overview' field, which is analysis of the meal/junk before proceeding with the alternatives. Just briefly discuss the nutritional content and the comparison of the meal/junk to the user health record (if provided any)

- Each alternative should have a name, ingredients, recipe and comparison field

- Separate each alternative from the other - including their recipes, ingredients and comparison.

- List ingredients and recipe as an array

- Hence, your response should be a JSON ALWAYS look like this type, ALWAYS: {
  overview: string,
  alternatives: Array
}

- The response is processed by a computer program so don't add any extra text or info. NO EXTRA TEXT, GREETINGS OR INFO!!!! IMPORTANT!!

- Let's indicate why we are recommending such an alternative based on users' health info. We let them know which one of their health info are taken into consideration AND HOW IT COMPARES WITH THE JUNK OR MEAL INPUT

GUIDELINES:
1) Do not respond to anything outside of food-health return a js object of the type: { error: string }. This also applies if the attached meal/junk image (when provided) is not of our focus (a food/meal/junk)
2) If there are no health info provided, just analyze the junk/meal generally for the pros/cons etc. based on it's content and nutritional benefits
3) If there are no junk/meal provided, provide the user with a daily meal plan (for all 7 days of the week) based on their health info
4) The users are Nigerians, so only recommend LOCAL Nigerian healthier meals/dishes/snacks
5) Do not shorten words like tablespoons, etc.
5) Be empathetic to users like a doctor! Make use of pronouns like "your", "you"
6) DO NOT ADD ANY INTRO TEXT! NO INTRO TEXT! Just the JSON response. BE CONCISE AND STRAIGHTFORWARD
7) Lastly, In comparison, do well to break down medical terms to LAYMAN understanding. If there are implications or anything, use easily-relatable explanations for the readers

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

// Implement business creation route
router.post("/businesses", async (req, res) => {
    try {
        // Create a new business
        const business = await Business.create(req.body);

        // Return the created business to the client
        res.status(201).json(business);
    } catch (error) {
        console.error("Unable to create business: ", error);
        res.status(500).json({ error: "Unable to create business" });
    }
});

// Implement get business route - get by regNumber if present in query
router.get("/businesses", async (req, res) => {
    try {
        const { regNumber } = req.query;

        if (regNumber) {
            // Get business by regNumber
            const business = await Business.findOne({ regNumber });

            // Return the business to the client
            res.status(200).json(business);
        } else {
            // Get all businesses
            const businesses = await Business.find();

            // Return the businesses to the client
            res.status(200).json(businesses);
        }
    } catch (error) {
        console.error("Unable to get businesses: ", error);
        res.status(500).json({ error: "Unable to get businesses" });
    }
});

// Implement update business route by id in params
router.put("/businesses/:id", async (req, res) => {
    try {
        const { businessId } = req.params;
        const { updatedFields } = req.body;

        // Update business by id
        const business = await Business.findByIdAndUpdate(
            businessId,
            { $set: updatedFields },
            {
                new: true,
            }
        );
    } catch (error) {
        console.error("Unable to update business: ", error);
        res.status(500).json({ error: "Unable to update business" });
    }
});

export default router;
