function bind(window) {
    window.previousScreen = window.screen;
    window.outputChanged.connect(window, update);
    window.desktopsChanged.connect(window, update);
    // print("Window " + window.caption + " has been bound");
}

function update(window) {
    var window = window || this;

    // only when screens and desktops are ready... TODO: configurable
    if (workspace.screens.length < 2 || workspace.desktops.length < 9)
        return;
    
    if (window.specialWindow || (!window.normalWindow && window.skipTaskbar))
        return;

    // TODO: what the window is?
    if (window.caption.length == 0) {
        print("Window " + window.pid + " ignored due to empty caption");
        return;
    }

    // FIXME: in wayland seems no interface for primary screen...
    // So hard coded here, sad.
    var primaryScreen = workspace.screens[1];
    var currentScreen = window.output;
    var previousScreen = window.previousScreen;
    window.previousScreen = currentScreen;

    if (currentScreen != primaryScreen) {
        window.onAllDesktops = true;
        print("Window " + window.caption + " has been pinned");
    } else if (window.onAllDesktops && previousScreen != primaryScreen) {
        window.desktops = [workspace.currentDesktop];
        print("Window " + window.caption + " has been unpinned");
    }
}

function bindUpdate(window) {
    bind(window);
    update(window);
}

function main() {
    // global object exposed via: KWin::Script::slotScriptLoadedFromFile
    workspace.windowList().forEach(bind);
    workspace.windowList().forEach(update);
    workspace.windowAdded.connect(bindUpdate);
}

main();
