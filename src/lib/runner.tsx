import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Provider } from "react-redux";
import { type AppDependencies, type AppStore, createAppStore } from "../app/store.ts";
import { AppDependenciesProvider } from "../contexts/app_dependencies_context.tsx";
import { ThemeModeProvider } from "../contexts/theme_mode_context.tsx";

function AppProviders({
  store,
  dependencies,
  children,
}: {
  store: AppStore;
  dependencies: AppDependencies;
  children: React.ReactNode;
}) {
  return (
    <ThemeModeProvider>
      <AppDependenciesProvider value={dependencies}>
        <Provider store={store}>{children}</Provider>
      </AppDependenciesProvider>
    </ThemeModeProvider>
  );
}

export async function runFullScreenTui(component: React.ReactNode, dependencies: AppDependencies) {
  const mergedConfig = await dependencies.config.getMergedConfig();
  const store = createAppStore({
    config: {
      mergedConfig,
    },
    dependencies,
  });

  const renderer = await createCliRenderer({
    backgroundColor: "black",
  });

  createRoot(renderer).render(
    <AppProviders store={store} dependencies={dependencies}>
      {component}
    </AppProviders>,
  );
}

export async function runInlineTui(component: React.ReactNode, dependencies: AppDependencies) {
  const mergedConfig = await dependencies.config.getMergedConfig();
  const store = createAppStore({
    config: {
      mergedConfig,
    },
    dependencies,
  });
  const renderer = await createCliRenderer({
    screenMode: "split-footer",
    footerHeight: 1,
    externalOutputMode: "capture-stdout",
    consoleMode: "disabled",
    useMouse: false,
    clearOnShutdown: false,
  });

  createRoot(renderer).render(
    <AppProviders store={store} dependencies={dependencies}>
      {component}
    </AppProviders>,
  );
}
