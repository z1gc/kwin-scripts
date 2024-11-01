const primaryScreen = workspace.activeScreen.name;
const blacklistCaptions = new Set([
    // The startmenu will cause it:
    "plasmashell",
]);

function bind(window) {
    window.previousScreen = window.screen;
    window.outputChanged.connect(window, update);
    // window.desktopsChanged.connect(window, update);
    // print("Window " + window.caption + " has been bound");
}

function update(window) {
    // only when screens is ready... TODO: configurable
    if (workspace.screens.length < 2)
        return;

    // TODO: what the window is with no caption?
    var window = window || this;
    const caption = window.caption;
    if (window.specialWindow || caption.length == 0 || blacklistCaptions.has(caption))
        return;

    // KDE: `Window::isShown`
    if (window.deleted || window.hidden || window.minimized)
        return;

    // Might be slow?
    if (!window.moveable && !window.resizeable)
        return;

    const onDesktops = window.onAllDesktops;
    const currentScreen = window.output.name;
    const previousScreen = window.previousScreen;
    window.previousScreen = currentScreen;

    if (currentScreen !== primaryScreen) {
        if (!onDesktops) {
            window.onAllDesktops = true;
            print("Window " + caption + " has been pinned");
        }
    } else if (previousScreen !== primaryScreen) {
        if (onDesktops) {
            window.desktops = [workspace.currentDesktop];
            print("Window " + caption + " has been unpinned");
        }
    }
}

function bindUpdate(window) {
    bind(window);
    update(window);
}

function main() {
    // https://github.com/wsdfhjxc/kwin-scripts/issues/9#issuecomment-1744811107
    print(`total screens: ${workspace.screens.length}, primary: ${primaryScreen}`);

    // global object exposed via: KWin::Script::slotScriptLoadedFromFile
    workspace.windowList().forEach(bind);
    workspace.windowList().forEach(update);
    workspace.windowAdded.connect(bindUpdate);
}

main();
