import { useNavigate } from "react-router";
import { useAppSelector } from "../../app/hooks.ts";

export function useSetupNavigation() {
  const navigate = useNavigate();
  const provider = useAppSelector((state) => state.setup.provider);

  function keyStepPath(): string | null {
    if (provider === "OpenRouter") return "/setup/open-router-key";
    if (provider === "Gemini") return "/setup/gemini-key";
    return null;
  }

  return {
    provider,
    forward: {
      fromProvider: () => navigate("/setup/model"),
      fromModel: () => navigate(keyStepPath() ?? "/setup/github-token"),
      fromKeyStep: () => navigate("/setup/github-token"),
      fromGithubToken: () => navigate("/setup/language"),
      fromLanguage: () => navigate("/setup/theme"),
      fromTheme: () => navigate("/setup/review"),
      fromReview: () => navigate("/setup/done"),
    },
    back: {
      fromModel: () => navigate("/setup"),
      fromKeyStep: () => navigate("/setup/model"),
      fromGithubToken: () => navigate(keyStepPath() ?? "/setup/model"),
      fromLanguage: () => navigate("/setup/github-token"),
      fromTheme: () => navigate("/setup/language"),
      fromReview: () => navigate("/setup/theme"),
      fromDone: () => navigate("/setup/review"),
    },
  };
}
