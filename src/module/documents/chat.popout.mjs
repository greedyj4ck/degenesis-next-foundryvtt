const { ChatPopout } = foundry.applications.sidebar.apps;

export default class DGNSChatPopout extends ChatPopout {
  static DEFAULT_OPTIONS = {
    classes: ["chat-popout", "themed", "theme-degenesis-fuck-yeah"],
  };
}
