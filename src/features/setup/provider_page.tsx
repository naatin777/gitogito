import { useRenderer } from "@opentui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { Select } from "../../components/Select.tsx";
import { AI_PROVIDER } from "../../services/config/schema/fields/ai_schema.ts";
import { setProvider } from "./setup_slice.ts";
import { useSetupNavigation } from "./hook.ts";

const providerChoices = AI_PROVIDER.map((p) => ({
  name: p,
  value: p,
  description: {
    Ollama: "Local model, no API key required.",
    OpenRouter: "Cloud models via OpenRouter (API key required).",
    Gemini: "Google Gemini models (API key required).",
  }[p],
}));

/* v8 ignore start */
export function ProviderPage() {
  const dispatch = useAppDispatch();
  const nav = useSetupNavigation();
  const renderer = useRenderer();
  const currentProvider = useAppSelector((state) => state.setup.provider);
  const initialIndex = AI_PROVIDER.indexOf(currentProvider);

  return (
    <Select
      message="Select AI provider"
      choices={[...providerChoices]}
      initialIndex={initialIndex}
      onSelect={(provider) => {
        if (!provider) {
          renderer.destroy();
          return;
        }
        dispatch(setProvider(provider));
        nav.forward.fromProvider();
      }}
    />
  );
}
/* v8 ignore stop */
