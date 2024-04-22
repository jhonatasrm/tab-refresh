let reloadTab = 0;
let sec;
let alreadyAccessed = false;
let date;
let refreshTab;
let activate;
let verifyState = true;
let reloadMinutes;
let showCounter = true;
let secValueRecover;
var updatePage;
var getTabId;
var verifyTabID;
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
browser.browserAction.onClicked.addListener(function(tab) {
    startTimer(tab);
});

// onUpdate Tab
browser.tabs.onUpdated.addListener(verifyPage);

browser.tabs.onActivated.addListener(handleTabActivated);

// Define the function to handle tab activation
function handleTabActivated(activeInfo) {
    // Get the tab information
    browser.tabs.get(activeInfo.tabId)
        .then(tab => {
            // Call verifyPage function for the activated tab
            verifyPage(tab);
        })
        .catch(error => {
            console.error('Error retrieving tab information:', error);
        });
}

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

        if (removeFromArray && removeFromArray.length > 0) {
            for (let i = 0; i < removeFromArray.length; i++) {
                if (removeFromArray[i] === tab.id) {
                    removeFromArray.splice(i, 1);
                    localStorage.setItem("verifyTab", JSON.stringify(removeFromArray));
                    break; // Exit the loop once the tab ID is removed
                }
            }
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
        alreadyAccessed = false;
        activate = true;
        reloadTab = 0;
        return;
    } else {
        var addTabClicked = JSON.parse(localStorage.getItem("verifyTab"));
        // Check if addTabClicked is null or undefined
        if (addTabClicked === null || typeof addTabClicked === 'undefined') {
            // If it's null or undefined, initialize it as an empty array
            addTabClicked = [];
        }

        // Check if the tab ID already exists in the array
        if (!addTabClicked.includes(tab.id)) {
            // If the tab ID doesn't exist, push it into the array
            addTabClicked.push(tab.id);
        }

        // Save the updated array back to localStorage
        localStorage.setItem("verifyTab", JSON.stringify(addTabClicked));

        // Set alreadyAccessed to true
        alreadyAccessed = true;
    }

    changeHoverText(tab, reloadMinutes);

    reloadTab = setInterval(function() {
        updatePageFunction();
        verifyTab = JSON.parse(localStorage.getItem("verifyTab"));
        if (activate == true) {
            let canReload = 1;
            if (updatePage == true){
                if(verifyTab.length > 0){
                    for (let i = 0; i <= verifyTab.length; i++) {
                        if(verifyTab[i] == verifyTabID){
                                canReload = 0;
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
                                    if(tabsClicked[i] == tabsVisited[j]){
                                        existTabInArray = true;
                                    }
                                }
                            }
                            if(existTabInArray == true){
                                browser.tabs.reload(tab.id, {'bypassCache': true});
                                reloadTab = 0;
                                browser.browserAction.setIcon({path: iconActive});
                                browser.browserAction.setTitle({
                                    'title': timerUpdate + date,
                                    'tabId': tab.id
                                });
                                changeHoverText(tab, reloadMinutes);
                            } else {
                                reloadTab = 0;
                                changeHoverText(tab, reloadMinutes);
                            }
                        } else {
                            reloadTab = 0;
                            browser.browserAction.setIcon({path: iconInactive});
                            browser.browserAction.setTitle({
                                'title': timerUpdate + date,
                                'tabId': tab.id
                            });
                            changeHoverText(tab, reloadMinutes);
                        }
                    
                } else {
                    reloadTab = 0;
                    browser.browserAction.setIcon({path: iconInactive});
                    browser.browserAction.setTitle({
                        'title': timerUpdate + date,
                        'tabId': tab.id
                    });
                    changeHoverText(tab, reloadMinutes);
                }
            }else {
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
    let verifyTabID;
    let alreadyAccessed = false;
    let getTabId = tab.id;
    let reloadMinutes = localStorage.getItem("timer") || 3;
    let iconActive = "../res/icons/refresh_tab_on_32.png";
    let iconInactive = "../res/icons/refresh_tab_32.png";
    let iconLocalOff = "../res/icons/refresh_tab_off_32.png";
    let timerUpdate = browser.i18n.getMessage("message_timer");
    let timerUpdateEveryXmin = browser.i18n.getMessage("message_timer_min");
    let timerMinutes = browser.i18n.getMessage("min");
    let timerMinute = browser.i18n.getMessage("min1");

    let storedTabs = localStorage.getItem("verifyTab");
    let verifyTab = storedTabs ? JSON.parse(storedTabs) : [];

    browser.tabs.query({
            active: true,
            windowId: browser.windows.WINDOW_ID_CURRENT
        })
        .then(tabs => browser.tabs.get(tabs[0].id))
        .then(currentTab => {
            verifyTabID = currentTab.id;
            if (verifyTab.includes(verifyTabID)) {
                browser.browserAction.setIcon({
                    path: iconActive
                });
                browser.browserAction.setTitle({
                    'title': timerUpdate + " " + getReloadTime(reloadMinutes),
                    'tabId': tab.id
                });
            } else {
                browser.browserAction.setIcon({
                    path: iconInactive
                });
            }
        })
        .catch(error => {
            console.error('Error retrieving tab information:', error);
        });

    function getReloadTime(minutes) {
        let currentDate = new Date();
        let hours = currentDate.getHours();
        let secs = currentDate.getSeconds();
        let newMinutes = currentDate.getMinutes() + parseInt(minutes);

        if (newMinutes > 59) {
            hours = hours + 1;
            newMinutes = newMinutes - 60;
        }

        if (newMinutes < 10) {
            newMinutes = "0" + newMinutes;
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

        return hours + ":" + newMinutes + ":" + secs;
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
            id: "page-refresh",
            title: "Page Refresh",
            contexts: ["all"]
        }, onCreated);
    } else {
        browser.menus.removeAll();
    }
}

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
                if (sec == 0) {
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


function handleRemovedTab(tabId) {
    // Retrieve and parse the stored arrays
    let removeFromArray = localStorage.getItem("verifyTab") ? JSON.parse(localStorage.getItem("verifyTab")) : [];
    let removeFromArrayOpened = localStorage.getItem("tabsStored") ? JSON.parse(localStorage.getItem("tabsStored")) : [];

    // Remove the tab ID from the array when clicked on the Add-on icon
    removeFromArray = removeFromArray.filter(id => id !== tabId);
    localStorage.setItem("verifyTab", JSON.stringify(removeFromArray));

    // Remove the tab ID from the opened tabs array
    removeFromArrayOpened = removeFromArrayOpened.filter(id => id !== tabId);
    localStorage.setItem("tabsStored", JSON.stringify(removeFromArrayOpened));
}