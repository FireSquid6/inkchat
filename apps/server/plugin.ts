import type { Kit } from ".";
import type { MessageKind } from "./protocol";

// plugins should export two things:
// - a function named "plugin" that takes a PluginContext and returns void
// - a PluginInfo object that describes the plugin

export type Plugin = (context: PluginContext) => void;

export interface PluginInfo {
  name: string;
  version: string;
  description: string;
}

export class PluginContext {
  constructor(kit: Kit) {}

}
