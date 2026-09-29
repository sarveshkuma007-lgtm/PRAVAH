
import { apiClient } from "./api";

/**
 * OpenAI Service for PRAVAH
 * Communicates with the backend OpenAI endpoint.
 * API keys remain on the server.
 */
export const openaiService = {
  async sendChatMessage(message, history = [], context = {}) {
    try {
      const data = await apiClient("/openai/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          history,
          context,
        }),
      });

      return data.reply || "No response generated.";
    } catch (error) {
      console.error("OpenAI service error:", error);

      return this.generateOfflineResponse(message, context);
    }
  },

  generateOfflineResponse(query, context = {}) {
    const q = String(query || "").toLowerCase();

    if (
      q.includes("emergency") ||
      q.includes("dam break") ||
      q.includes("flood")
    ) {
      return (
        "During a flood emergency, move to higher ground, " +
        "avoid flooded roads and bridges, and follow official " +
        "instructions from local authorities. Call 112 for " +
        "immediate emergency assistance."
      );
    }

    if (q.includes("shelter") || q.includes("safe route")) {
      return (
        "Please check the verified shelter locations and safe " +
        "routes displayed in the PRAVAH dashboard. Follow " +
        "local disaster management instructions."
      );
    }

    if (q.includes("rain") || q.includes("weather")) {
      return (
        "Weather conditions should be verified through official " +
        "IMD updates and the available PRAVAH weather service. " +
        "I cannot confirm live rainfall conditions while offline."
      );
    }

    return (
      "PRAVAH AI is temporarily offline. I can help explain " +
      "dam safety, flood preparedness, evacuation planning, " +
      "and reservoir monitoring when the AI service is available."
    );
  },
};

export default openaiService;