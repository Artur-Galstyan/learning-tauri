import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";

const initStronghold = async () => {
  const vaultPath = `${await appDataDir()}/vault.hold`;
  const vaultPassword = (await invoke("get_vault_creds")) as string;
  console.log("vaultPassword", vaultPassword);
  const stronghold = await Stronghold.load(vaultPath, vaultPassword);

  let client: Client;
  const clientName = "regulaido";
  try {
    client = await stronghold.loadClient(clientName);
  } catch {
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};

export class StrongholdSingleton {
  private static _initialized = false;
  private static _stronghold: Stronghold | null;
  private static _client: Client | null;

  public static async initialise() {
    if (!StrongholdSingleton._initialized) {
      const { stronghold, client } = await initStronghold();
      StrongholdSingleton._stronghold = stronghold;
      StrongholdSingleton._client = client;
      StrongholdSingleton._initialized = true;
    }
  }

  public static async insertRecord(key: string, value: string) {
    await StrongholdSingleton.initialise();
    if (!StrongholdSingleton._client || !StrongholdSingleton._stronghold) {
      throw new Error("Failed to initialise Stronghold!");
    }
    const store = StrongholdSingleton._client.getStore();
    const data = Array.from(new TextEncoder().encode(value));
    await store.insert(key, data);
    await StrongholdSingleton._stronghold.save();
  }

  public static async getRecord(key: string): Promise<string | null> {
    await StrongholdSingleton.initialise();
    if (!StrongholdSingleton._client || !StrongholdSingleton._stronghold) {
      throw new Error("Failed to initialise Stronghold!");
    }
    const store = StrongholdSingleton._client.getStore();
    const data = await store.get(key);
    if (data) {
      return new TextDecoder().decode(new Uint8Array(data));
    } else {
      return null;
    }
  }
}
