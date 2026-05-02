import { IncidentWatchSDK } from "./sdk";
import { UserConfig } from "./types";

let _instance: IncidentWatchSDK | null = null;

/**
 * SDK initialize karo — app ke entry point mein ek baar call karo.
 */
export async function init(config: UserConfig): Promise<IncidentWatchSDK> {
  if (_instance) {
    _instance.logger.warn(
      "[IW] SDK already initialized — ignoring duplicate init()",
    );
    return _instance;
  }

  const sdk = new IncidentWatchSDK(config);
  await sdk._bootstrap();
  _instance = sdk;
  return sdk;
}

/**
 * Already initialized SDK instance lo.
 */
export function getInstance(): IncidentWatchSDK {
  if (!_instance) {
    throw new Error(
      '[IW] SDK not initialized. Call require("@incidentwatch/sdk").init({...}) first.',
    );
  }
  return _instance;
}

/**
 * Express middleware — manually lagana ho to (optional).
 */
export function expressMiddleware(): any {
  return getInstance().integrations.express.errorMiddleware();
}

/**
 * Check if SDK has been initialized.
 */
export function isInitialized(): boolean {
  return _instance !== null;
}

/**
 * Gracefully shut down the SDK — flushes pending incidents, stops monitors.
 */
export async function shutdown(): Promise<void> {
  if (_instance) {
    await _instance.shutdown();
    _instance = null;
  }
}

export * from "./types";
export { IncidentWatchSDK };
