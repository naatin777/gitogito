import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Provider } from "react-redux";
import { createAppStore } from "../app/store.ts";
import { ThemeModeProvider } from "../hooks/use_theme_mode.tsx";
import { ConfigServiceImpl } from "../services/config/config_service.ts";
import { CredentialServiceImpl } from "../services/credential/credential_service.ts";
import { GitRemoteRepositoryCliImpl } from "../services/git/remote_repository.ts";

export async function runTui(
  component: React.ReactNode,
) {
  const renderer = await createCliRenderer({})
  createRoot(renderer).render(
    <ThemeModeProvider>
      {component}
    </ThemeModeProvider>
  )
}


export async function runTuiWithRedux(
  component: React.ReactNode,
) {
  const configService = new ConfigServiceImpl();
  const credentialService = new CredentialServiceImpl();
  const config = await configService.getMergedConfig();
  const store = createAppStore({
    config: {
      mergedConfig: config,
    },
    extraArgument: {
      config: configService,
      credentials: credentialService,
      git: new GitRemoteRepositoryCliImpl(),
    },
  });

  await runTui(
    <Provider store={store}>
      {component}
    </Provider>
  )
}
