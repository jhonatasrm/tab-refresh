var reloadTab = 0;
var sec;
var alreadyAccessed = false;
var getTabId;
var date;
var refreshTab;
var activate;
var reloadMinutes;
var showCounter = true;
var iconActive = "../res/icons/refresh_tab_on_32.png";
var iconInactive = "../res/icons/refresh_tab_32.png";
var iconLocalOff = "../res/icons/refresh_tab_off_32.png";

// i18n
var timerUpdate = browser.i18n.getMessage("message_timer");
var timerUpdateEveryXmin = browser.i18n.getMessage("message_timer_min");
var timerMinutes = browser.i18n.getMessage("min");
var timerMinute = browser.i18n.getMessage("min1");

if(localStorage.getItem("timer") == null){
    reloadMinutes = 3;
    localStorage.setItem("timer", 3);
    browser.browserAction.setTitle({title: timerUpdateEveryXmin + reloadMinutes + timerMinutes});
}else if(localStorage.getItem("timer") == 1 ){
    reloadMinutes = localStorage.getItem("timer");
    browser.browserAction.setTitle({title: timerUpdateEveryXmin + reloadMinutes + timerMinute});
}else{
    reloadMinutes = localStorage.getItem("timer");
    browser.browserAction.setTitle({title: timerUpdateEveryXmin + reloadMinutes + timerMinutes});
}

window.onload = function(){
    browser.browserAction.setIcon({'path': iconInactive, 'tabId': tab.id});
    browser.browserAction.setTitle({'title': timerUpdateEveryXmin, 'tabId': tab.id});
}

// start about.html
function handleInstalled(details) {
    browser.tabs.create({
    url: "../html/about.html"
    });
}

browser.runtime.onInstalled.addListener(handleInstalled);

//start
browser.browserAction.onClicked.addListener(startTimer);

// onUpdate Tab
browser.tabs.onUpdated.addListener(verifyPage);

// setup badge background color
browser.browserAction.setBadgeBackgroundColor({'color': '#14C7CD'});

function changeHoverText(tab, reloadMinutes) {
var currentDate = new Date();
var hours = currentDate.getHours();
var secs = currentDate.getSeconds();
var minutes = currentDate.getMinutes() + parseInt(reloadMinutes);

if (minutes > 59){
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

if (reloadTab == 0){
    browser.browserAction.setTitle({'title': timerUpdate + date, 'tabId': tab.id});
    browser.browserAction.setIcon({'path': iconActive, 'tabId': tab.id});
    alreadyAccessed = false;
    activate = true;
    reloadTab = 0;
        timerCount(tab, showCounter);
}else{
    browser.browserAction.setIcon({'path': iconInactive, 'tabId': tab.id});

    if(reloadMinutes == 1){
        browser.browserAction.setTitle({'title': timerUpdateEveryXmin + reloadMinutes + timerMinute, 'tabId': tab.id});
    }else{
        browser.browserAction.setTitle({'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes, 'tabId': tab.id});
    }

alreadyAccessed = true;
activate = false;
reloadTab = 1;
        timerCount(tab, showCounter);
}
}

function startTimer(tab) {

if(localStorage.getItem("timer") == null){
    reloadMinutes = 3;
    localStorage.setItem("timer", 3);
}else{
    reloadMinutes = localStorage.getItem("timer");
    }

if(localStorage.getItem("timer") == null){
    reloadMinutes = 3;
    browser.browserAction.setTitle({title: timerUpdateEveryXmin + reloadMinutes + timerMinutes});
}else if(localStorage.getItem("timer") == 1 ){
    reloadMinutes = localStorage.getItem("timer");
    browser.browserAction.setTitle({title: timerUpdateEveryXmin + reloadMinutes + timerMinute});
}else{
    reloadMinutes = localStorage.getItem("timer");
    browser.browserAction.setTitle({title: timerUpdateEveryXmin + reloadMinutes + timerMinutes});
}

if (reloadTab != 0) {
    window.clearInterval(reloadTab);
    browser.browserAction.setIcon({'path': iconInactive, 'tabId': tab.id});

if(reloadMinutes == 1){
    browser.browserAction.setTitle({'title': timerUpdateEveryXmin + reloadMinutes + timerMinute, 'tabId': tab.id});
}else{
    browser.browserAction.setTitle({'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes, 'tabId': tab.id});
}
reloadTab = 0;
return;
}

changeHoverText(tab, reloadMinutes);
if(activate == true){
    reloadTab = setInterval(function() {
         browser.tabs.reload(tab.id, {'bypassCache': true});
         getTabId = tab.id;
         changeHoverText(tab, reloadMinutes);
    }, reloadMinutes * 60 * 1000);
}
}

function verifyPage(tab){
browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
    .then(tabs => browser.tabs.get(tabs[0].id))
    .then(tab => {
        if(tab.url == "about:preferences") {
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:config"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:addons"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:debugging"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:support"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:newtab"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:buildconfig"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:cache"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:checkerboard"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:crashes"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:credits"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:devtools"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:downloads"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:home"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:memory"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:mozilla"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:sessionrestore"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (tab.url == "about:plugins"){
            browser.browserAction.setIcon({path: iconLocalOff});
        }else if (alreadyAccessed == true && getTabId == tab.id){
            browser.browserAction.setIcon({path: iconActive});
            browser.browserAction.setTitle({'title': timerUpdate + date, 'tabId': tab.id});
        }else if(alreadyAccessed == false && getTabId == tab.id){
            browser.browserAction.setIcon({path: iconInactive});
            if(reloadMinutes == 1){
                browser.browserAction.setTitle({'title': timerUpdateEveryXmin + reloadMinutes + timerMinute, 'tabId': tab.id});
            }else{
                browser.browserAction.setTitle({'title': timerUpdateEveryXmin + reloadMinutes + timerMinutes, 'tabId': tab.id});
            }
        }else {
            browser.browserAction.setIcon({path: iconInactive});
        }
    });
}

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Context Menu created successfully");
  }
}

function contextMenuFunction(){
 if(localStorage.getItem('contextMenu') == 'True'){
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

    }else{
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

function timerCount(tab, showCounter){
        if(localStorage.getItem("timer") == null){
            sec = 180;
            var secValueRecover = sec;
        }else{
            sec = localStorage.getItem("timer");
            sec = sec * 60;
            var secValueRecover = sec;
        }
        if(localStorage.getItem('counter') == "enabled"){
            if(alreadyAccessed == false){
                setInterval(function() {
                    browser.browserAction.setBadgeText({'text': sec.toString(), 'tabId': tab.id});
                    sec = sec - 1;
                    if (sec == 00){
                        sec = secValueRecover;
                        }
                    }, 1000);
            }else{
                 browser.browserAction.setBadgeText({'text': "", 'tabId': tab.id});
            }
        }
}
