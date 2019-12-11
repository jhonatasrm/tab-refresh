let reloadTab = 0;
let sec;
let alreadyAccessed = false;
let getTabId;
let date;
let refreshTab;
let activate;
let verifyState = true;
let reloadMinutes;
let verifyTabID;
let showCounter = true;
let secValueRecover;
let iconActive = "../res/icons/refresh_tab_on_32.png";
let iconInactive = "../res/icons/refresh_tab_32.png";
let iconLocalOff = "../res/icons/refresh_tab_off_32.png";

// i18n
let timerUpdate = browser.i18n.getMessage("message_timer");
let timerUpdateEveryXmin = browser.i18n.getMessage("message_timer_min");
let timerMinutes = browser.i18n.getMessage("min");
let timerMinute = browser.i18n.getMessage("min1");

// load Context menu preference
contextMenuFunction();
updatePageFunction();

// tabs
let verifyTab = [];
let storedTabs = localStorage.getItem("verifyTab");
verifyTab = storedTabs ? JSON.parse(storedTabs) : [];
let tabOpened = [];

if (localStorage.getItem("timer") == null) {
    reloadMinutes = 3;
    localStorage.setItem("timer", 3);
    browser.browserAction.setTitle({
        title: timerUpdateEveryXmin + reloadMinutes + timerMinutes
    });
} else if (localStorage.getItem("timer") == 1) {
    reloadMinutes = localStorage.getItem("timer");
    browser.browserAction.setTitle({
        title: timerUpdateEveryXmin + reloadMinutes + timerMinute
    });
} else {
    reloadMinutes = localStorage.getItem("timer");
    browser.browserAction.setTitle({
        title: timerUpdateEveryXmin + reloadMinutes + timerMinutes
    });
}

// tab closed
browser.tabs.onRemoved.addListener(handleRemovedTab);

// start
browser.browserAction.onClicked.addListener(startTimer);

// onUpdate Tab
browser.tabs.onUpdated.addListener(verifyPage);

// setup badge background color
browser.browserAction.setBadgeBackgroundColor({
    'color': '#14C7CD'
});

function changeHoverText(tab, reloadMinutes) {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let secs = currentDate.getSeconds();
    let minutes = currentDate.getMinutes() + parseInt(reloadMinutes);

    if (minutes > 59) {
        hours = hours + 1;
        minutes = minutes - 60;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (hours > 23) {
        hours = 0;
    }

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (secs < 10) {
        secs = "0" + secs;
    }

    date = hours + ":" + minutes + ":" + secs;

    if (reloadTab == 0) {
        browser.browserAction.setTitle({
            'title': timerUpdate + date,
            'tabId': tab.id
        });
        browser.browserAction.setIcon({
            'path': iconActive,
            'tabId': tab.id
        });

        alreadyAccessed = true;
        activate = true;
        reloadTab = 0;
        timerCount(tab, showCounter);
    } else {
        browser.browserAction.setIcon({
            'path': iconInactive,
            'tabId': tab.id
        });

        if (reloadMinutes == 1) {
            browser.browserAction.setTitle({
                'title': timerUpdateEveryXmin + reloadMinutes + timerMinute,
                'tabId': tab.id
            });
        } else {
            browser.browserAction.setTitle({
                'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes,
                'tabId': tab.id
            });
        }

        alreadyAccessed = false;
        activate = false;
        reloadTab = 1;
        timerCount(tab, showCounter);
    }
}

function startTimer(tab) {
    getTabId = tab.id;

    if (localStorage.getItem("timer") == null) {
        reloadMinutes = 3;
        localStorage.setItem("timer", 3);
    } else {
        reloadMinutes = localStorage.getItem("timer");
    }

    if (localStorage.getItem("timer") == null) {
        reloadMinutes = 3;
        browser.browserAction.setTitle({
            title: timerUpdateEveryXmin + reloadMinutes + timerMinutes
        });
    } else if (localStorage.getItem("timer") == 1) {
        reloadMinutes = localStorage.getItem("timer");
        browser.browserAction.setTitle({
            title: timerUpdateEveryXmin + reloadMinutes + timerMinute
        });
    } else {
        reloadMinutes = localStorage.getItem("timer");
        browser.browserAction.setTitle({
            title: timerUpdateEveryXmin + reloadMinutes + timerMinutes
        });
    }

    if (reloadTab != 0) {
        window.clearInterval(reloadTab);
        browser.browserAction.setIcon({
            'path': iconInactive,
            'tabId': tab.id
        });
        // remove tab.id from array
        let removeFromArray = JSON.parse(localStorage.getItem("verifyTab"));

        if(removeFromArray != null && removeFromArray != "undefined" && removeFromArray > 0){
            for (let i = 0; i <= removeFromArray.length; i++) {
                if(removeFromArray[i] === tab.id){
                    removeFromArray.splice(i, 1);
                    localStorage.setItem("verifyTab", JSON.stringify(removeFromArray));
                }
            }
            verifyTab = removeFromArray;
        }
        if (reloadMinutes == 1) { 
            browser.browserAction.setTitle({
                'title': timerUpdateEveryXmin + reloadMinutes + timerMinute,
                'tabId': tab.id
            });
        } else {
            browser.browserAction.setTitle({
                'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes,
                'tabId': tab.id
            });
        }
        activate = true;
        reloadTab = 0;
        return;
    } else {
        verifyTab.push(verifyTabID);
        localStorage.setItem("verifyTab", JSON.stringify(verifyTab));
    }

    changeHoverText(tab, reloadMinutes);

        reloadTab = setInterval(function() {
            updatePageFunction();
            if (activate == true) {
                let canReload = 1;
                if (updatePage == true){
                    if(verifyTab.length > 0){
                        for (let i = 0; i <= verifyTab.length; i++) {
                            if(verifyTab[i] == verifyTabID){
                                    canReload = 0;
                                    // console.log(">> Tab saved ", verifyTab[i], " current tab id ", verifyTabID);
                            }
                        }
                    }
                    
                    if (canReload == 1) {
                            let existTabInArray = false;
                            let tabsClicked = JSON.parse(localStorage.getItem("verifyTab"));
                            let tabsVisited = JSON.parse(localStorage.getItem("tabsStored"));
                            if(tabsClicked.length > 0){
                                for(let i = 0; i <= tabsClicked.length; i++){
                                    for(let j = 0; j <= tabsVisited.length; j++){
                                        // console.log("Clicked ", tabsClicked[i], " ==  Visited ", tabsVisited[j]);
                                        if(tabsClicked[i] === tabsVisited[j]){
                                            existTabInArray = true;
                                        }
                                    }
                                }
                                if(existTabInArray == true){
                                    console.log("(Reload) The tab exist in the Array ", tab.id);
                                    reloadTab = 0;
                                    browser.tabs.reload(tab.id, {'bypassCache': true});
                                    browser.browserAction.setIcon({path: iconActive});
                                    browser.browserAction.setTitle({
                                        'title': timerUpdate + date,
                                        'tabId': tab.id
                                    });
                                    changeHoverText(tab, reloadMinutes);
                                } else {
                                    console.log("(Not Reload) The tab doesn't exist in Array");
                                    reloadTab = 0;
                                    changeHoverText(tab, reloadMinutes);
                                }
                            } else {
                                console.log("(Not Reload) In the tab ", tab.id);
                                reloadTab = 0;
                                browser.browserAction.setIcon({path: iconInactive});
                                browser.browserAction.setTitle({
                                    'title': timerUpdate + date,
                                    'tabId': tab.id
                                });
                                changeHoverText(tab, reloadMinutes);
                            }
                        
                    } else {
                        console.log("(Not Reload) Can't reload the tab because is in use ", tab.id);
                        reloadTab = 0;
                        browser.browserAction.setIcon({path: iconInactive});
                        browser.browserAction.setTitle({
                            'title': timerUpdate + date,
                            'tabId': tab.id
                        });
                        changeHoverText(tab, reloadMinutes);
                    }
                }else {
                    console.log("(Reload) Can reload any tab", tab.id);
                    reloadTab = 0;
                    browser.tabs.reload(tab.id, {'bypassCache': true});
                    browser.browserAction.setIcon({path: iconActive});
                    browser.browserAction.setTitle({
                        'title': timerUpdate + date,
                        'tabId': tab.id
                    });
                    changeHoverText(tab, reloadMinutes);
                }
            }
        }, reloadMinutes * 60 * 1000);
}

function verifyPage(tab) {

    browser.tabs.query({
            active: true,
            windowId: browser.windows.WINDOW_ID_CURRENT
        })
        .then(tabs => browser.tabs.get(tabs[0].id))
        .then(tab => {
            verifyTabID = tab.id;
            // console.log(verifyTabID);
            if (tab.url == "about:preferences") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:config") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:addons") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:debugging") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:support") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:newtab") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:buildconfig") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:cache") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:checkerboard") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:crashes") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:credits") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:devtools") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:downloads") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:home") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:memory") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:mozilla") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:sessionrestore") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (tab.url == "about:plugins") {
                browser.browserAction.setIcon({
                    path: iconLocalOff
                });
            } else if (alreadyAccessed == true && getTabId == tab.id) {
                browser.browserAction.setIcon({
                    path: iconActive
                });
                browser.browserAction.setTitle({
                    'title': timerUpdate + date,
                    'tabId': tab.id
                });
            } else if (alreadyAccessed == false && getTabId == tab.id) {
                browser.browserAction.setIcon({
                    path: iconInactive
                });
                if (reloadMinutes == 1) {
                    browser.browserAction.setTitle({
                        'title': timerUpdateEveryXmin + reloadMinutes + timerMinute,
                        'tabId': tab.id
                    });
                } else {
                    browser.browserAction.setTitle({
                        'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes,
                        'tabId': tab.id
                    });
                }
            } else {
                browser.browserAction.setIcon({
                    path: iconInactive
                });
            }
        });
        
         // tabs opened
        var tabsStored = localStorage.getItem("tabsStored");
        tabOpened = tabsStored ? JSON.parse(tabsStored) : [];
        
        let alreadyExist = false;
        let removeAlreadyExist = JSON.parse(localStorage.getItem("tabsStored"));;
        if(tabOpened.length != 0){
            for(let r = 0; r <= tabOpened.length; r++){
                if(tabOpened[r] == verifyTabID){
                    alreadyExist = true;
                }
                
                if(removeAlreadyExist[r] == "undefined" || removeAlreadyExist[r] == null){
                    removeAlreadyExist.splice(r, 1);
                    localStorage.setItem("tabsStored", JSON.stringify(removeAlreadyExist));
                }
            }
        }else {
            tabOpened.push(verifyTabID);
            localStorage.setItem("tabsStored", JSON.stringify(tabOpened));
        }
    
        if(alreadyExist == false){
            tabOpened.push(verifyTabID);
            localStorage.setItem("tabsStored", JSON.stringify(tabOpened));
        }
        tabOpened = localStorage.getItem("tabsStored");
        // console.log("Tabs clicked to reload ", verifyTab);
        // console.log("All open tabs already captured ", tabOpened);

        // verify if is checked to reload
        let reloadNotActivated = false;
        if(verifyTab.length > 0){
            for (let i = 0; i <= verifyTab.length; i++) {
                if(verifyTab[i] == verifyTabID){
                    reloadNotActivated = true;
                }
            }
        }
        if(reloadNotActivated == false){
            // console.log("Add-on not activated");
            if (reloadMinutes == 1) {
                browser.browserAction.setTitle({
                    'title': timerUpdateEveryXmin + reloadMinutes + timerMinute,
                    'tabId': tab.id
                });
            } else {
                browser.browserAction.setTitle({
                    'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes,
                    'tabId': tab.id
                });
            }
    
            alreadyAccessed = false;
            activate = true;
            reloadTab = 0;
        }
}

function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Context Menu created successfully");
    }
}

function contextMenuFunction() {
    if (localStorage.getItem('contextMenu') == 'true') {
        browser.menus.create({
            id: "tab-refresh",
            title: "Tab Refresh",
            contexts: ["selection"]
        }, onCreated);

        browser.menus.create({
            id: "1",
            title: "1 min",
            contexts: ["all"],
        }, onCreated);

        browser.menus.create({
            id: "2",
            title: "2 min",
            contexts: ["all"],
        }, onCreated);

        browser.menus.create({
            id: "3",
            title: "3 min",
            contexts: ["all"],
        }, onCreated);

        browser.menus.create({
            id: "5",
            title: "5 min",
            contexts: ["all"],
        }, onCreated);

        browser.menus.create({
            id: "10",
            title: "10 min",
            contexts: ["all"],
        }, onCreated);

    } else {
        browser.menus.remove("tab-refresh");
        browser.menus.remove("1");
        browser.menus.remove("2");
        browser.menus.remove("3");
        browser.menus.remove("5");
        browser.menus.remove("10");
    }
}

browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "tab-refresh":
            break;
        case "1":
            localStorage.setItem("timer", 1);
            startTimer(tab);
            break;
        case "2":
            localStorage.setItem("timer", 2);
            startTimer(tab);
            break;
        case "3":
            localStorage.setItem("timer", 3);
            startTimer(tab);
            break;
        case "5":
            localStorage.setItem("timer", 5);
            startTimer(tab);
            break;
        case "10":
            localStorage.setItem("timer", 10);
            startTimer(tab);
            break;
    }
});

function timerCount(tab, showCounter) {
    getTabId = tab.id;
    if (localStorage.getItem("timer") == null) {
        sec = 180;
        secValueRecover = sec;
    } else {
        sec = localStorage.getItem("timer");
        sec = sec * 60;
        secValueRecover = sec;
    }
    if (localStorage.getItem('counter') == "enabled") {
        if (alreadyAccessed == false) {
            setInterval(function() {
                browser.browserAction.setBadgeText({
                    'text': sec.toString(),
                    'tabId': tab.id
                });
                sec = sec - 1;
                if (sec == 00) {
                    sec = secValueRecover;
                }
            }, 1000);
        } else {
            browser.browserAction.setBadgeText({
                'text': "",
                'tabId': tab.id
            });
        }
    }
}

function updatePageFunction(){
    if (localStorage.getItem("updatePage") == null || localStorage.getItem("updatePage") == "undefined"){
        updatePage = true;
    }else if (localStorage.getItem("updatePage") == 'true') {
        updatePage = true;
    }else {
        updatePage = false;
    }
}

function verify(tab){
    browser.tabs.query({
            active: true,
            windowId: browser.windows.WINDOW_ID_CURRENT
        })
        .then(tabs => browser.tabs.get(tabs[0].id))
        .then(tab => {
            if(getTabId == tab.id){
                verifyState = true;
            }else {
                verifyState = false;
            }
    });
}

// remove tab closed from the array
function handleRemovedTab(tabId) {
    // console.log("Tab: " + tabId + " is closing");
    let removeFromArray = JSON.parse(localStorage.getItem("verifyTab"));
    if(removeFromArray > 0){
        for (let i = 0; i <= removeFromArray.length; i++) {
            if(removeFromArray[i] === tabId){
                removeFromArray.splice(i, 1);
                localStorage.setItem("verifyTab", JSON.stringify(removeFromArray));
            }
        }
    }else {
        // console.log("The Array is empty");
    }
    verifyTab = localStorage.getItem("verifyTab");
}