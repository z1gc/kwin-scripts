const screensNum = workspace.screens.length;
const desktopsNum = workspace.desktops.length;
const primaryScreen = workspace.activeScreen.name;

function bind(window) {
    window.previousScreen = window.screen;
    window.outputChanged.connect(window, update);
    // window.desktopsChanged.connect(window, update);
    // print("Window " + window.caption + " has been bound");
}

function update(window) {
    var window = window || this;

    // TODO: what the window is with no caption?
    if (window.specialWindow || window.caption.length == 0)
        return;

    // only when screens and desktops are ready... TODO: configurable
    if (workspace.screens.length != screensNum || workspace.desktops.length != desktopsNum)
        return;

    const onDesktops = window.onAllDesktops;
    const currentScreen = window.output.name;
    const previousScreen = window.previousScreen;
    window.previousScreen = currentScreen;

    if (currentScreen !== primaryScreen) {
        if (!onDesktops) {
            window.onAllDesktops = true;
            print("Window " + window.caption + " has been pinned");
        }
    } else if (previousScreen !== primaryScreen) {
        if (onDesktops) {
            window.desktops = [workspace.currentDesktop];
            print("Window " + window.caption + " has been unpinned");
        }
    }
}

function bindUpdate(window) {
    bind(window);
    update(window);
}

function main() {
    // https://github.com/wsdfhjxc/kwin-scripts/issues/9#issuecomment-1744811107
    print(`total screens: ${screensNum}, desktops: ${desktopsNum}, primary: ${primaryScreen}`);

    // global object exposed via: KWin::Script::slotScriptLoadedFromFile
    workspace.windowList().forEach(bind);
    workspace.windowList().forEach(update);
    workspace.windowAdded.connect(bindUpdate);
}

main();
