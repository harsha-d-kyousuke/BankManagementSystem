
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const NUTRITION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The common name of the food item.',
    },
    calories: {
      type: Type.NUMBER,
      description: 'Total calories per 100g serving.',
    },
    protein: {
      type: Type.NUMBER,
      description: 'Grams of protein per 100g serving.',
    },
    carbohydrates: {
      type: Type.NUMBER,
      description: 'Grams of carbohydrates per 100g serving.',
    },
    fat: {
      type: Type.NUMBER,
      description: 'Grams of fat per 100g serving.',
    },
  },
  required: ['name', 'calories', 'protein', 'carbohydrates', 'fat'],
};


export async function searchFoodNutrition(query: string): Promise<FoodItem[]> {
  try {
    const prompt = `Provide a list of potential matches for the food item "${query}". For each match, provide its nutritional information per 100g serving, including calories, protein, carbohydrates, and fat. Only return food items. If you cannot find any, return an empty list.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: NUTRITION_SCHEMA,
        },
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    if (!Array.isArray(data)) {
      console.error("Gemini API did not return an array:", data);
      throw new Error("Received an unexpected format from the nutrition analysis service.");
    }
    
    // Validate that items in array match expected structure
    return data.filter(item => 
        typeof item.name === 'string' &&
        typeof item.calories === 'number' &&
        typeof item.protein === 'number' &&
        typeof item.carbohydrates === 'number' &&
        typeof item.fat === 'number'
    );

  } catch (error) {
    console.error("Error fetching nutrition data from Gemini API:", error);
    throw new Error("Could not fetch nutrition data. Please check your query or try again later.");
  }
}
