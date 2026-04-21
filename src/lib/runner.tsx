import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Provider } from "react-redux";
import { type AppDependencies, type AppStore, createAppStore } from "../app/store.ts";
import { AppDependenciesProvider } from "../contexts/app_dependencies_context.tsx";
import { ThemeModeProvider } from "../contexts/theme_mode_context.tsx";

/** OpenTUI の `createRoot` 直下。`useRenderer()` が必要なので最外側。 */
function TuiThemeShell({ children }: { children: React.ReactNode }) {
  return <ThemeModeProvider>{children}</ThemeModeProvider>;
}

/**
 * Redux と DI 用コンテキストをまとめる（順序固定: store → dependencies）。
 * Thunk の extraArgument と揃えて、コンポーネントからも `useAppDependencies` で参照できるようにする。
 */
function TuiReduxAppProviders({
  store,
  dependencies,
  children,
}: {
  store: AppStore;
  dependencies: AppDependencies;
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AppDependenciesProvider value={dependencies}>{children}</AppDependenciesProvider>
    </Provider>
  );
}

export async function runFullScreenTui(component: React.ReactNode) {
  const renderer = await createCliRenderer({
    backgroundColor: "#FF00FF",
  });
  createRoot(renderer).render(<TuiThemeShell>{component}</TuiThemeShell>);
}

export async function runInlineTui(component: React.ReactNode) {
  const renderer = await createCliRenderer({
    backgroundColor: "#FF00FF",
    screenMode: "split-footer",
    footerHeight: 1,
    externalOutputMode: "capture-stdout",
    consoleMode: "disabled",
    useMouse: false,
    clearOnShutdown: false,
  });
  createRoot(renderer).render(<TuiThemeShell>{component}</TuiThemeShell>);
}

export type RunTuiWithReduxOptions = {
  dependencies: AppDependencies;
};

export async function runTuiWithRedux(
  component: React.ReactNode,
  { dependencies }: RunTuiWithReduxOptions,
) {
  const resolvedConfig = await dependencies.config.getMergedConfig();
  const store = createAppStore({
    config: {
      mergedConfig: resolvedConfig,
    },
    dependencies,
  });

  await runFullScreenTui(
    <TuiReduxAppProviders store={store} dependencies={dependencies}>
      {component}
    </TuiReduxAppProviders>,
  );
}
