

class Tracker {
  private apiUrl: string;

  public constructor() {
    this.apiUrl = import.meta.env.VITE_BACKURL_RENDER || import.meta.env.VITE_BACKURL_PROD || import.meta.env.VITE_BACKURL_LOCAL;

  }

  private async post(endpoint: string, body?: object) {
    try {
      await fetch(`${this.apiUrl}${endpoint}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      // on ignore les erreurs de tracking
      console.warn("Tracking failed:", endpoint, error);
    }
  }

  public trackRoll(): void {
    this.post("/track/roll");
  }

  public trackEndGame(score: number, time: number): void {
    this.post("/track/endGame", { score, time });
  }

  public trackCombination(name: string, score: number): void {
    this.post(`/track/combination?name=${encodeURIComponent(name)}`, { score });
  }
}

export default Tracker;