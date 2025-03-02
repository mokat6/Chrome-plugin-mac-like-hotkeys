"use strict";

chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case "new_tab":
      chrome.tabs.create({ url: "chrome://newtab" });
      break;

    case "reload_page":
      chrome.tabs.reload();
      break;

    case "close_tab":
      console.log("closing the tab lol")
      chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(function (tab) {
          console.log("the tab is  > ", tab)

          if (tab.length === 0) {
            // this is the case when the user tries to close a popped out separate window of DevTools
            // doesn't work, no way to get that window. Doesn't show up in chrome.windows.getAll()
          }

          // can't close "new tab", hotfix: change url, then close
          if (!tab.url || tab.url.includes("://newtab")) {
            chrome.tabs.update(tab[0].id, { url: "about:blank" }, function () {
              chrome.tabs.remove(tab[0].id);
            });
          } else {
            chrome.tabs.remove(tab[0].id);
          }
        });
      break;

    case "find_on_page":
      break;

    case "focus_on_url":
      break;

    case "new_window":
      chrome.windows.create();

      break;
    case "next_window":
      switchWindow(1);

      break;
    case "prev_window":
      switchWindow(-1);

      break;
    case "tab1":
      switchToTab(0);
      break;
    case "tab2":
      switchToTab(1);
      break;
    case "tab3":
      switchToTab(2);
      break;
    case "tab4":
      switchToTab(3);
      break;
    case "tab5":
      switchToTab(4);
      break;
    case "tab6":
      switchToTab(5);
      break;
    case "tab7":
      switchToTab(6);
      break;
    case "tab8":
      switchToTab(7);
      break;
    case "tab_last":
      switchToTab();
      break;
  }
});

function switchToTab(n) {
  chrome.tabs.query({ currentWindow: true }).then((tabs) => {
    const index = n ?? tabs.length - 1;
    if (tabs.length === 0 || index >= tabs.length) return;

    const tabId = tabs.find((tab) => tab.index == index)?.id;
    chrome.tabs.update(tabId, { active: true });
  });
}

function switchWindow(direction) {
  chrome.windows.getAll({ populate: false }).then((windows) => {
    if (windows.length < 2) return;

    chrome.windows.getCurrent().then((current) => {
      windows.sort((a, b) => a.id - b.id);
      let index = windows.findIndex((win) => win.id === current.id);
      if (index === -1) return;

      index = (index + direction + windows.length) % windows.length;
      chrome.windows.update(windows[index].id, { focused: true });
    });
  });
}

// Click the icon in extension toolbar. Navigates to the page.

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: 'chrome://extensions/shortcuts'
  });
});