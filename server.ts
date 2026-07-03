import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// File-based database paths
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TRIPS_FILE = path.join(DATA_DIR, "trips.json");

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(TRIPS_FILE)) {
  fs.writeFileSync(TRIPS_FILE, JSON.stringify([]));
}

// Helpers to read/write JSON data
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readTrips() {
  try {
    const data = fs.readFileSync(TRIPS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeTrips(trips: any[]) {
  fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2));
}

// ==================== REST APIs ====================

// 1. Authentication Endpoints
app.post("/api/auth/register", (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const users = readUsers();
  if (users.find((u: any) => u.email === email)) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const newUser = {
    uid: "user_" + Date.now(),
    email,
    password, // Stored safely for mock/prototype session
    fullName,
    homeCity: "",
    preferences: "",
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ message: "Registration successful", user: userWithoutPassword });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const users = readUsers();
  const user = users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ message: "Login successful", user: userWithoutPassword });
});

// 2. Profile endpoints
app.post("/api/profile/update", (req, res) => {
  const { uid, fullName, homeCity, preferences } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Unauthorized" });
  }

  const users = readUsers();
  const userIndex = users.findIndex((u: any) => u.uid === uid);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    fullName: fullName || users[userIndex].fullName,
    homeCity: homeCity || users[userIndex].homeCity,
    preferences: preferences || users[userIndex].preferences,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName || users[userIndex].fullName)}`,
  };

  writeUsers(users);

  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json({ message: "Profile updated", user: userWithoutPassword });
});

// 3. AI Trip Generator Endpoint
app.post("/api/trips/generate", async (req, res) => {
  const { from, destination, budget, days, people, travelType } = req.body;

  // Validation
  if (!from || !destination || !budget || !days || !people || !travelType) {
    return res.status(400).json({ error: "All input fields are required" });
  }

  if (days < 1 || days > 14) {
    return res.status(400).json({ error: "Travel days must be between 1 and 14 days" });
  }

  if (budget <= 0) {
    return res.status(400).json({ error: "Budget must be a positive number" });
  }

  if (people < 1) {
    return res.status(400).json({ error: "Number of people must be at least 1" });
  }

  try {
    const prompt = `You are an elite, senior-level AI Travel Planner. Generate a comprehensive, realistic, and highly customized travel itinerary and trip plan from "${from}" to "${destination}" for ${days} days, for ${people} people, with a "${travelType}" travel style and a total budget of ₹${budget} Indian Rupees (INR).

Please construct a response that conforms exactly to the following JSON structure. All prices, costs, and budgets in this plan MUST be calculated and represented in Indian Rupees (INR). Do not use USD. Convert standard dollar amounts to realistic, proportional INR travel costs (e.g. 5,000 INR to 5,00,000 INR depending on budget tier).

Required Response Schema (must be valid JSON):
{
  "destinationDetails": "Engaging description of the destination, its current vibe, and travel highlights.",
  "itinerary": [
    {
      "dayNumber": 1,
      "theme": "Theme or highlight of Day 1",
      "activities": [
        {
          "time": "e.g., 09:00 AM",
          "title": "Title of the activity",
          "description": "Vivid description of what to do, including local secrets or travel tips.",
          "cost": 1500,
          "location": "Name of the location or landmark"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Name of the hotel matching the budget tier",
      "rating": 4.5,
      "pricePerNight": 12000,
      "description": "Compelling reasons to stay here, highlighting amenities corresponding to the style.",
      "address": "A realistic address or neighborhood description in the destination",
      "tags": ["Boutique", "Central", "Pool"]
    }
  ],
  "restaurants": [
    {
      "name": "Name of recommended local restaurant",
      "rating": 4.7,
      "priceLevel": "₹₹",
      "cuisine": "Cuisine type, e.g. Indian, Street Food",
      "description": "What dish to order and the dining atmosphere.",
      "address": "Realistic address in the destination"
    }
  ],
  "weather": {
    "temperature": 22,
    "condition": "Sunny",
    "humidity": 55,
    "windSpeed": 10,
    "forecast": [
      {
        "day": "Day 1",
        "temp": 22,
        "condition": "Sunny"
      }
    ]
  },
  "budgetBreakdown": {
    "accommodation": 45000,
    "food": 30000,
    "activities": 20000,
    "transport": 15000,
    "miscellaneous": 10000,
    "total": 120000
  }
}

Strictly adhere to these planning principles:
1. Ensure the hotel and restaurant suggestions fit the travel style ("${travelType}").
2. Day-by-day itineraries must contain at least 2-3 engaging activities per day.
3. The budget breakdown must total approximately or remain under the user's budget in INR (₹${budget}). Include real estimations for transportation from ${from} if applicable.
4. The forecast array must contain ${days} elements matching the days of the trip.
5. Price levels for restaurants must be selected from "₹", "₹₹", "₹₹₹", or "₹₹₹₹".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destinationDetails: { type: Type.STRING },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cost: { type: Type.NUMBER },
                        location: { type: Type.STRING },
                      },
                      required: ["time", "title", "description", "cost", "location"],
                    },
                  },
                },
                required: ["dayNumber", "theme", "activities"],
              },
            },
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  pricePerNight: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  address: { type: Type.STRING },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["name", "rating", "pricePerNight", "description", "address", "tags"],
              },
            },
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  priceLevel: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  description: { type: Type.STRING },
                  address: { type: Type.STRING },
                },
                required: ["name", "rating", "priceLevel", "cuisine", "description", "address"],
              },
            },
            weather: {
              type: Type.OBJECT,
              properties: {
                temperature: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                windSpeed: { type: Type.NUMBER },
                forecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      temp: { type: Type.NUMBER },
                      condition: { type: Type.STRING },
                    },
                    required: ["day", "temp", "condition"],
                  },
                },
              },
              required: ["temperature", "condition", "humidity", "windSpeed", "forecast"],
            },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                accommodation: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                activities: { type: Type.NUMBER },
                transport: { type: Type.NUMBER },
                miscellaneous: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
              },
              required: ["accommodation", "food", "activities", "transport", "miscellaneous", "total"],
            },
          },
          required: [
            "destinationDetails",
            "itinerary",
            "hotels",
            "restaurants",
            "weather",
            "budgetBreakdown",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "Failed to generate travel plan. Please check your Gemini API configuration." });
  }
});

// 4. Save and Retrieve Trip Plans
app.post("/api/trips/save", (req, res) => {
  const { userId, trip } = req.body;

  if (!userId || !trip) {
    return res.status(400).json({ error: "Missing required saving parameters" });
  }

  const trips = readTrips();
  const newTrip = {
    ...trip,
    id: "trip_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    userId,
    createdAt: new Date().toISOString(),
  };

  trips.push(newTrip);
  writeTrips(trips);

  res.status(201).json({ message: "Trip saved successfully", trip: newTrip });
});

app.get("/api/trips", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId query parameter" });
  }

  const trips = readTrips();
  const userTrips = trips.filter((t: any) => t.userId === userId);
  res.json(userTrips);
});

app.delete("/api/trips/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!id || !userId) {
    return res.status(400).json({ error: "Missing trip ID or user ID" });
  }

  const trips = readTrips();
  const initialLength = trips.length;
  const filteredTrips = trips.filter((t: any) => !(t.id === id && t.userId === userId));

  if (filteredTrips.length === initialLength) {
    return res.status(404).json({ error: "Trip not found or unauthorized" });
  }

  writeTrips(filteredTrips);
  res.json({ message: "Trip deleted successfully" });
});

// 5. Separate Search Endpoints (for Weather, Hotels, Restaurants directly)
app.get("/api/hotels/search", async (req, res) => {
  const { destination, budgetTier } = req.query;
  if (!destination) {
    return res.status(400).json({ error: "Destination parameter is required" });
  }

  try {
    const prompt = `Give me 4 realistic and descriptive hotel options in ${destination} for a "${budgetTier || "Moderate"}" budget tier. Make them incredibly immersive. Make sure the "pricePerNight" field is in Indian Rupees (INR) with realistic pricing (Budget: 1500 to 3000 INR, Moderate: 3500 to 10000 INR, Luxury: 12000 to 35000 INR, Ultra Luxury: 40000+ INR). Give the response in valid JSON matching this schema:
    {
      "hotels": [
        { "name": "string", "rating": number, "pricePerNight": number, "description": "string", "address": "string", "tags": ["string"] }
      ]
    }`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  pricePerNight: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  address: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "rating", "pricePerNight", "description", "address", "tags"]
              }
            }
          },
          required: ["hotels"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch hotel search suggestions" });
  }
});

app.get("/api/restaurants/search", async (req, res) => {
  const { destination, cuisine } = req.query;
  if (!destination) {
    return res.status(400).json({ error: "Destination parameter is required" });
  }

  try {
    const prompt = `Give me 4 top-rated restaurants in ${destination} specialized in or including "${cuisine || "Local"}" cuisine. Give the response in valid JSON matching this schema, using the Indian Rupee symbol for the "priceLevel" field:
    {
      "restaurants": [
        { "name": "string", "rating": number, "priceLevel": "₹₹ (options: ₹, ₹₹, ₹₹₹, ₹₹₹₹)", "cuisine": "string", "description": "string", "address": "string" }
      ]
    }`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  priceLevel: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  description: { type: Type.STRING },
                  address: { type: Type.STRING }
                },
                required: ["name", "rating", "priceLevel", "cuisine", "description", "address"]
              }
            }
          },
          required: ["restaurants"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch restaurant search suggestions" });
  }
});

app.get("/api/weather/search", async (req, res) => {
  const { destination } = req.query;
  if (!destination) {
    return res.status(400).json({ error: "Destination parameter is required" });
  }

  try {
    const prompt = `Provide current realistic weather and a 5-day weather forecast for "${destination}". Give the response in valid JSON matching this schema:
    {
      "weather": {
        "temperature": number,
        "condition": "string",
        "humidity": number,
        "windSpeed": number,
        "forecast": [
          { "day": "string", "temp": number, "condition": "string" }
        ]
      }
    }`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: {
              type: Type.OBJECT,
              properties: {
                temperature: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                windSpeed: { type: Type.NUMBER },
                forecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      temp: { type: Type.NUMBER },
                      condition: { type: Type.STRING }
                    },
                    required: ["day", "temp", "condition"]
                  }
                }
              },
              required: ["temperature", "condition", "humidity", "windSpeed", "forecast"]
            }
          },
          required: ["weather"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch weather forecast suggestions" });
  }
});

// ==================== VITE MIDDLEWARE AND SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
