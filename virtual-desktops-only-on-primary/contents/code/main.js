function bind(window) {
    window.previousScreen = window.screen;
    window.outputChanged.connect(window, update);
    window.desktopsChanged.connect(window, update);
    print("Window " + window.caption + " has been bound");
}

function update(window) {
    var window = window || this;
    
    if (window.desktopWindow || window.dock || (!window.normalWindow && window.skipTaskbar)) {
        return;
    }

    // FIXME: in wayland seems no interface for primary screen...
    // So hard coded here, sad.
    var primaryScreen = workspace.screens[1];
    var currentScreen = window.output;
    var previousScreen = window.previousScreen;
    window.previousScreen = currentScreen;

    if (currentScreen != primaryScreen) {
        window.desktops = [];
        print("Window " + window.caption + " has been pinned");
    } else if (previousScreen != primaryScreen) {
        window.desktops = [workspace.currentDesktop];
        print("Window " + window.caption + " has been unpinned");
    }
}

function bindUpdate(window) {
    bind(window);
    update(window);
}

function main() {
    workspace.windowList().forEach(bind);
    workspace.windowList().forEach(update);
    workspace.windowAdded.connect(bindUpdate);
}

main();
