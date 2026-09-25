
import { apiClient } from "./api";

export const openaiService = {
  async sendChatMessage(message, history = [], context = {}) {
    const data = await apiClient("/openai/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        history,
        context,
      }),
    });

    return data.reply || "No response generated.";
  },

  async analyzeRisk(damData, weatherData, terrainData) {
    const data = await apiClient("/openai/risk-analysis", {
      method: "POST",
      body: JSON.stringify({
        damData,
        weatherData,
        terrainData,
      }),
    });

    return data.analysis || "No risk analysis generated.";
  },
};