var reportTagIncorrectlyReturn;
var WW = {};
WW.registerNS = function(d) {
    var c = d.split(".");
    var a = window;
    for (var b = 0; b < c.length; b++) {
        if (typeof a[c[b]] == "undefined") {
            a[c[b]] = {};
        }
        a = a[c[b]];
    }
};

WW.requiredAngularDependencies = [];
WW.defaultPartnerKey = "163r5mm3";
WW.registerNS("WW.localStorage");
WW.localStorage.nameIBStarted = "ww-ib-started";
WW.localStorage.keyVendorUpgrade = "ww-v-upgrade";
WW.localStorage.keyHideMarketingToolbar = "ww-marketing-toolbar";
WW.localStorage.keyHideVRELeads = "ww-vre-lead-hide";
WW.localStorage.keyHideVRECategoryPrefix = "ww-vre-hide-category-";
WW.localStorage.keyLocation = "UserLocationGeoText";
WW.localStorage.keyVRELastCategory = "vre-last-category";
WW.localStorage.keyHideClientsOverviewPopup = "ww-vendor-clients-overview";
WW.localStorage.keyHideFreeTrialPopup = "ww-vendor-free-trial";
WW.localStorage.keyWebsiteThemesRecent = "ww-wedding-website-theme-recent";
WW.localStorage.keyWebsiteThemesFilters = "ww-wedding-website-theme-filters";
WW.localStorage.keyWebsiteThemesResults = "ww-wedding-website-theme-results";
WW.localStorage.userBrowser = "ww-user-browser";
WW.localStorage.supports_html5_storage = function() {
    try {
        window.localStorage.setItem("test", "test");
        window.localStorage.removeItem("test");
        return true;
    } catch (a) {
        return false;
    }
};
WW.localStorage.setItem = function(a, b) {
    if (b !== null && $j.trim(b).length !== 0) {
        if (WW.localStorage.supports_html5_storage()) {
            localStorage.setItem(a, b);
        } else {
            createCookie(a, b, 365);
        }
    }
};
WW.localStorage.getItem = function(a) {
    if (WW.localStorage.supports_html5_storage()) {
        return localStorage.getItem(a);
    } else {
        return readCookie(a);
    }
};
WW.localStorage.removeItem = function(a) {
    if (WW.localStorage.supports_html5_storage()) {
        localStorage.removeItem(a);
    } else {
        eraseCookie(a);
    }
};
WW.localStorage.sessionSetItem = function(a, b) {
    if (WW.localStorage.supports_html5_storage()) {
        sessionStorage.setItem(a, b);
    } else {
        createCookie(a, b);
    }
};
WW.localStorage.sessionGetItem = function(a) {
    if (WW.localStorage.supports_html5_storage()) {
        return sessionStorage.getItem(a);
    } else {
        return readCookie(a);
    }
};
WW.localStorage.sessionRemoveItem = function(a) {
    if (WW.localStorage.supports_html5_storage()) {
        sessionStorage.removeItem(a);
    } else {
        eraseCookie(a);
    }
};
WW.fbAd = function() {
    FB.ui({method: "feed",name: "We're getting married!",link: "www.weddingwire.com",picture: "http://wwcdn.weddingwire.com/static/8.4.91/images/wedding/post-graphic.gif",caption: "www.weddingwire.com",description: "WeddingWire is helping us make the announcement and plan for the big day! Are you getting married too? WeddingWire.com has over 200,000 reviewed wedding vendors as well as FREE planning tools, including wedding websites and checklists. Plan your wedding with me at WeddingWire!"});
};
WW.RandomNumberGenerator = function(a) {
    this.seed = a;
    this.A = 48271;
    this.M = 2147483647;
    this.Q = this.M / this.A;
    this.R = this.M % this.A;
    this.oneOverM = 1 / this.M;
    this.next = function(c) {
        if (c === undefined) {
            c = 1;
        }
        c += 2;
        for (var d = 0; d < c; d++) {
            var b = this.seed / this.Q;
            var e = this.seed % this.Q;
            var f = this.A * e - this.R * b;
            if (f > 0) {
                this.seed = f;
            } else {
                this.seed = f + this.M;
            }
        }
        return (this.seed * this.oneOverM);
    };
    return this;
};
WW.getDateOfYearSeed = function() {
    var a = new Date();
    var b = new Date(a.getFullYear(), 0, 1);
    return Math.ceil((a - b) / 86400000);
};
WW.getDaySeed = function() {
    var a = new Date();
    return a.getDate();
};
WW.getHourSeed = function() {
    var a = new Date();
    return a.getHours();
};
WW.getFlowplayerLocation = function() {
    return {src: "http://www.weddingwire.com/localStatic/flash/flowplayer/flowplayer.commercial.swf",wmode: "opaque",cachebusting: true};
};
WW.getFlowplayerDefaults = function() {
    return {key: "#$545a485ecea6e24f687",wmode: "opaque",plugins: {controls: {url: "http://www.weddingwire.com/localStatic/flash/flowplayer/flowplayer.controls.swf",zIndex: 3}}};
};
WW.getJplayerLocation = function() {
    return "http://www.weddingwire.com/localStatic/flash/jplayer-2.0";
};
var browserType = "IE";
function noop(a) {
}
function setRadioValue(a, d) {
    var c = document.getElementsByName(a);
    for (var b = 0; b < c.length; ++b) {
        if (c[b].value == d) {
            c[b].checked = true;
            break;
        }
    }
}
function getRadioValue(a) {
    var c = document.getElementsByName(a);
    for (var b = 0; b < c.length; ++b) {
        if (c[b].checked) {
            return c[b].value;
        }
    }
}
function onMenuItemClick(c, b, a) {
    document.location.href = a.value;
}
String.prototype.trim = function() {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};
function readOnlyCheckBox() {
    return false;
}
function getBrowserType() {
    if (navigator.userAgent.indexOf("Opera") != -1 && document.getElementById) {
        browserType = "OP";
    }
    if (document.all) {
        browserType = "IE";
    }
    if (document.layers) {
        browserType = "NN";
    }
    if (!document.all && document.getElementById) {
        browserType = "MO";
    }
}
function hideLayer(a) {
    document.getElementById(a).style.display = "none";
}
function hideLayerByVisibility(a) {
    document.getElementById(a).style.visibility = "hidden";
}
function showLayer(a) {
    document.getElementById(a).style.display = "block";
}
function showLayerByVisibility(a) {
    document.getElementById(a).style.visibility = "visible";
}
var startTop, startLeft;
var effectDone = false;
function toggleEffect(a, b) {
    if (!effectDone) {
        fadeIn(a, b);
        effectDone = true;
    } else {
        fadeOut();
        effectDone = false;
    }
}
function fadeIn(f, g) {
    if (document.all) {
        f = event;
    }
    var d = document.getElementById("bubble_tooltip");
    var c = document.getElementById("bubble_tooltip_content");
    startTop = d.offsetTop;
    startLeft = d.offsetLeft;
    c.innerHTML = g;
    d.style.display = "block";
    var a = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    var b = f.clientX - 100;
    if (b < 0) {
        b = 0;
    }
    d.style.left = b + "px";
    d.style.top = f.clientY - d.offsetHeight - 1 + a + "px";
    new Rico.Effect.FadeTo(d, 1, 200, 4);
}
function fadeOut() {
    var a = document.getElementById("bubble_tooltip");
    startTop = a.offsetTop;
    startLeft = a.offsetLeft;
    new Rico.Effect.FadeTo(a, 0, 50, 2);
}
function resetEffect() {
    new Rico.Effect.FadeTo("bubble_tooltip", 1, 50, 2);
}
function isPhoneNumber(a) {
    rePhoneNumber = new RegExp(/^\([1-9]\d{2}\)\s?\d{3}\-\d{4}$/);
    if (!rePhoneNumber.test(a)) {
        alert("Phone Number Must Be Entered As: (555) 555-1234");
        return false;
    }
    return true;
}
function checkPhone(c) {
    var b = "0123456789-";
    var a = 0;
    for (a = 0; a <= c.length - 1; a++) {
        if (b.indexOf(c.charAt(a)) == -1) {
            alert("Phone number contains Invalid characters");
            return false;
        }
    }
    if (c.charAt(3) != "-" || c.charAt(7) != "-" || c.length != 12) {
        alert("Phone Number should be of Format 'XXX-YYY-ZZZZ' ");
        return false;
    }
    return true;
}
function isValidZipCode(a) {
    return /^\d{5}$|^\d{5}-\d{4}$/.test(a);
}
function checkZip(c) {
    var b = "0123456789-";
    var a = 0;
    for (a = 0; a <= c.length - 1; a++) {
        if (b.indexOf(c.charAt(a)) == -1) {
            alert("Zip code contains Invalid characters");
            return false;
        }
    }
    if (c.length != 5) {
        if (c.length != 10) {
            alert("Enter 5 or 9 digit zip code of format XXXXX or XXXXX-YYYY " + c.length);
            return false;
        }
        if (c.length == 10 && c.charAt(5) != "-") {
            alert("zip code should be of format XXXXX or XXXXX-YYYY");
            return false;
        }
    }
}
function checkEmail(a) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(a.toUpperCase());
}
function checkTelePhone(a, b) {
    if (b) {
        return /[0-9]*/.test(a);
    } else {
        return /^[0-9]{10}$/.test(a);
    }
}
function checkUrl(a) {
    return /^(http|https):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a) && a.indexOf(".") != -1 && a.indexOf(".") != (a.length - 1);
}
function trimPhone(a) {
    return a.trim().replace(/[-\(\)\s]/g, "");
}
var checkDate = function(a) {
    return /^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/.test(a.toUpperCase());
};
function genericDeleteWarning(a) {
    if (confirm("Are you sure you want to remove this" + a) == false) {
        return false;
    }
}
function openWindow(b, a) {
    if (a === undefined) {
        a = "wireWin";
    }
    window.open(b, a + (new Date()).getTime());
}
function openPopUp(b, d, c, a, f, e) {
    window.open(b, "wireWin", "menubar=" + d + ",width=" + c + ",height=" + a + ",toolbar=" + f + ",scrollbars=" + e + ",resizable=yes");
}
function showContainer(a, b) {
    if (a.checked) {
        document.getElementById(b).style.display = "block";
    } else {
        document.getElementById(b).style.display = "none";
    }
}
function toggleDivShowChecked(a, b) {
    if (a.checked) {
        document.getElementById(b).style.display = "block";
    } else {
        document.getElementById(b).style.display = "none";
    }
}
function toggleDivHideChecked(a, b) {
    if (a.checked) {
        document.getElementById(b).style.display = "none";
    } else {
        document.getElementById(b).style.display = "block";
    }
}
function toggleDivSelectBox(b, a, c) {
    if (b.value == a) {
        document.getElementById(c).style.display = "block";
    } else {
        document.getElementById(c).style.display = "none";
    }
}
function toggleUserNavBar() {
    el = document.getElementById("moreNav");
    if (el.style.display == "none") {
        el.style.display = "block";
        createCookie("userNavMore", "on", "5");
        document.getElementById("toggleText").innerHTML = "hide tools";
    } else {
        el.style.display = "none";
        createCookie("userNavMore", "off", "5");
        document.getElementById("toggleText").innerHTML = "show tools";
    }
}
function checkAll(a, c, b) {
    for (i = a; i <= c; i++) {
        document.getElementById(i).checked = b;
    }
}
function getRandomNum(b, a) {
    return (Math.floor(Math.random() * (a - b)) + b);
}
function getRandomChar(f, g, k, h, d) {
    var a = "0123456789";
    var c = "abcdefghijklmnopqrstuvwxyz";
    var j = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var b = "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/? ";
    var e = d;
    if (f == true) {
        e += a;
    }
    if (g == true) {
        e += c;
    }
    if (k == true) {
        e += j;
    }
    if (h == true) {
        e += b;
    }
    return e.charAt(getRandomNum(0, e.length));
}
function getPassword(d, j, h, m, g, c, f, l, e, b) {
    var a = "";
    if (d > 0) {
        a = a + getRandomChar(h, m, g, c, j);
    }
    for (var k = 1; k < d; ++k) {
        a = a + getRandomChar(f, l, e, b, j);
    }
    return a;
}
var dlgConfirmationLoaded = null;
function myalert(a) {
    if (dlgConfirmationLoaded == null || !dlgConfirmationLoaded) {
        alert(a);
    } else {
        showConfirmationDialogAlert(a);
    }
}
var charCount = 1;
var maxCharCount = 2000;
function displayLeftLength(b) {
    var a = document.getElementById(b);
    a.innerHTML = (maxCharCount - charCount > 0) ? maxCharCount - charCount : 0;
}
function evalEntryLength(f, b, c, e, a) {
    maxCharCount = b;
    var d = getCharCount(f);
    if (d > b) {
        if (e != "") {
            f.className = e;
        }
        if (c) {
            showAllowedLength(f, b);
        }
    } else {
        if (a != "") {
            f.className = a;
        }
    }
}
function getCharCount(a) {
    charCount = a.value.length;
    return charCount;
}
function showAllowedLength(b, a) {
    b.value = b.value.substr(0, a);
    window.status = b.value;
}
function showErr(a, b) {
    document.getElementById(a + "errrow").style.display = "";
    document.getElementById(a + "err").innerHTML = "<span class='error'>" + b + "</span>";
}
function hideErr(a) {
    document.getElementById(a + "errrow").style.display = "none";
    document.getElementById(a + "err").innerHTML = "";
}
function showDivErr(a, b) {
    document.getElementById(a + "_err").style.display = "";
    document.getElementById(a + "_err").innerHTML = "<span class='error'>" + b + "</span>";
}
function hideDivErr(a) {
    document.getElementById(a + "_err").style.display = "none";
    document.getElementById(a + "_err").innerHTML = "";
}
function buildRowMessage(b, a, c) {
    row = b.insertRow(b.rows.length);
    td = row.insertCell(0);
    td.align = "center";
    td.colSpan = c;
    td.className = "greyText strong";
    td.innerHTML = a;
}
function clearTable(d, b) {
    if (b == null) {
        b = parseInt(d.getAttribute("headersize"));
        if (isNaN(b)) {
            b = 0;
        }
    }
    var a = d.rows.length;
    for (var c = b; c < a; ++c) {
        d.deleteRow(b);
    }
}
function convertDate(b) {
    var c;
    var f;
    var a;
    var e = b + "";
    var d = e.split(",");
    c = d[0];
    f = d[1];
    a = d[2];
    if (f.length == 1) {
        f = "0" + f;
    }
    if (a.length == 1) {
        a = "0" + a;
    }
    return f + "/" + a + "/" + c;
}
var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
function convertIntToMonth(a) {
    return months[a];
}
var shortMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
function convertIntToShortMonth(a) {
    return shortMonths[a];
}
function convertDateObj(b) {
    var d;
    var g;
    var a;
    var f = b + "";
    var e = f.split(",");
    d = e[0];
    g = parseInt(e[1]) - 1;
    a = e[2];
    var c = new Date(d, g, a);
    return c;
}
function getUrlVars(a) {
    if (a == null) {
        a = document.URL;
    }
    var e = [], d;
    var c = a.split("?")[1];
    if (c != undefined) {
        c = c.split("&");
        for (var b = 0; b < c.length; b++) {
            d = c[b].split("=");
            e.push(d[1]);
            e[d[0]] = d[1];
        }
    }
    return e;
}
function getUrlVarsHash(d) {
    if (d == null) {
        d = document.URL;
    }
    var c = {};
    var e = d.split("&");
    for (var b = 0; b < e.length; b++) {
        var f = e[b].split("=");
        f[0] = decodeURIComponent(f[0]);
        f[1] = decodeURIComponent(f[1]);
        if (typeof c[f[0]] === "undefined") {
            c[f[0]] = f[1];
        } else {
            if (typeof c[f[0]] === "string") {
                var a = [c[f[0]], f[1]];
                c[f[0]] = a;
            } else {
                c[f[0]].push(f[1]);
            }
        }
    }
    return c;
}
function safeConsoleLog(a) {
    if (window.console && window.console.log) {
        window.console.log(a);
    }
}
function googleAnalyticsPageView(a) {
    _gaq.push(["_trackPageview", a]);
}
function GetURLParameter(a) {
    var d = window.location.search.substring(1);
    var c = d.split("&");
    for (var b = 0; b < c.length; b++) {
        var e = c[b].split("=");
        if (e[0] == a) {
            return e[1];
        }
    }
    return null;
}
function doAjaxFormRequest(h, k, d, g) {
    if (g == null) {
        g = true;
    }
    var c = $j(h);
    var a = c.attr("action");
    var b = c.serialize();
    if (h == "#formVendorFilter") {
        var e = c.serializeArray();
        var j = null;
        $j(e).each(function(m, l) {
            if (l.name == "geo") {
                j = l.value;
                l.value = decodeURIComponent(GetURLParameter("geo"));
            }
        });
        $j(e).each(function(m, l) {
            if (l.name == "geosr") {
                l.value = j;
            }
        });
        b = $j.param(e);
    }
    var f = a + "?" + b;
    if (g) {
        googleAnalyticsPageView(f);
    }
    if (d) {
        History.replaceState({page: f}, "", f);
    }
    $j.ajax({type: "POST",url: a,data: b + "&ajax=true",success: k});
}
function doAjaxRequest(c, e, f, a, b) {
    if (b == null) {
        b = true;
    }
    var d = c + "?" + e;
    if (b) {
        _gaq.push(["_trackPageview", d]);
    }
    if (a) {
        History.replaceState({page: d}, "", d);
    }
    $j.ajax({type: "POST",url: c,data: e + "&ajax=true",success: f});
}
function formatCurrency(a) {
    a = a.toString().replace(/\$|\,/g, "");
    if (isNaN(a)) {
        a = "0";
    }
    sign = (a == (a = Math.abs(a)));
    a = Math.floor(a * 100 + 0.50000000001);
    cents = a % 100;
    a = Math.floor(a / 100).toString();
    if (cents < 10) {
        cents = "0" + cents;
    }
    for (var b = 0; b < Math.floor((a.length - (1 + b)) / 3); b++) {
        a = a.substring(0, a.length - (4 * b + 3)) + "," + a.substring(a.length - (4 * b + 3));
    }
    return (((sign) ? "" : "-") + "$" + a + "." + cents);
}
function validateCurrency(a) {
    var b = a.replace(/\$|\,/g, "");
    if (isNaN(parseFloat(b))) {
        return false;
    }
    return true;
}
function validImage(a) {
    var b = a.split(".").pop().toLowerCase();
    if ($j.inArray(b, ["gif", "png", "jpg", "jpeg"]) == -1) {
        return false;
    } else {
        return true;
    }
}
function isFloat(a) {
    if (isNaN(parseFloat(a))) {
        return false;
    }
    return true;
}
function stripCurrency(a) {
    a = a.replace(/\$|\,/g, "");
    return a;
}
function getFloatCurrency(a) {
    var b = a.replace(/\$|\,/g, "");
    if (isNaN(parseFloat(b))) {
        return 0;
    } else {
        return parseFloat(b);
    }
}
function getRowCell(e, a) {
    var d;
    var c = 0;
    for (var b = 0; b < e.childNodes.length; ++b) {
        d = e.childNodes[b];
        if (d != null) {
            if (d.nodeName == "TD") {
                ++c;
                if (c == a) {
                    return d;
                }
            }
        }
    }
    return null;
}
function getTableFromCell(a) {
    var d;
    var c = 0;
    for (var b = 0; b < a.childNodes.length; ++b) {
        d = a.childNodes[b];
        if (d != null) {
            if (d.nodeName == "TABLE") {
                return d;
            }
        }
    }
    return null;
}
function getElementByIdFromNode(d, e) {
    var c;
    var b = 0;
    for (var a = 0; a < d.childNodes.length; ++a) {
        c = d.childNodes[a];
        if (c != null) {
            if (c.id == e) {
                return c;
            }
        }
    }
    return null;
}
function getRowCellCount(d) {
    var c;
    var a = 0;
    for (var b = 0; b < d.childNodes.length; ++b) {
        c = d.childNodes[b];
        if (c != null) {
            if (c.nodeName == "TD") {
                ++a;
            }
        }
    }
    return a;
}
function deleteRowById(d, e) {
    var a = d.rows.length;
    var c;
    for (var b = 0; b < a; ++b) {
        c = d.rows[b];
        if (c.id == e) {
            d.deleteRow(b);
            break;
        }
    }
}
function getRowIndexById(d, e) {
    var a = d.rows.length;
    var c;
    for (var b = 0; 
    b < a; ++b) {
        c = d.rows[b];
        if (c.id == e) {
            return b;
        }
    }
    return -1;
}
function mapSize(c) {
    if (c == null) {
        return 0;
    }
    var b = 0;
    for (var a in c) {
        if (typeof (c[a]) != "function") {
            ++b;
        }
    }
    return b;
}
function inArray(c, b) {
    for (var a = 0; a < c.length; ++a) {
        if (c[a] == b) {
            return true;
        }
    }
    return false;
}
function indexOf(c, b) {
    for (var a = 0; a < c.length; 
    ++a) {
        if (c[a] == b) {
            return a;
        }
    }
    return -1;
}
function removeArrayIndex(b, a) {
    b.splice(a, 1);
}
function stringLimit(a, b) {
    if (a.length > b) {
        a = a.substring(0, b - 3);
        a += "...";
    }
    return a;
}
function getObject(a) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[a];
    } else {
        return document.embeds[a];
    }
}
function updateObject(a, b) {
    var c = getObject(a);
    c.SetVariable("_root.isNewData", "1");
    c.SetVariable("_root.newData", b);
    c.TGotoLabel("/", "JavaScriptHandler");
}
function removeComma(a) {
    return a.replace(/,/g, "");
}
function convertBoolToYesNo(a) {
    return a == "true" ? "Yes" : "No";
}
var dtCh = "/";
var minYear = 1900;
var maxYear = 2900;
function isInteger(b) {
    var a;
    for (a = 0; 
    a < b.length; a++) {
        var d = b.charAt(a);
        if (((d < "0") || (d > "9"))) {
            return false;
        }
    }
    return true;
}
function stripCharsInBag(d, e) {
    var b;
    var a = "";
    for (b = 0; b < d.length; b++) {
        var f = d.charAt(b);
        if (e.indexOf(f) == -1) {
            a += f;
        }
    }
    return a;
}
function daysInMonth(a, b) {
    if (a == 4 || a == 6 || a == 9 || a == 11) {
        return 30;
    } else {
        if (a == 2) {
            if (b != null) {
                return (((b % 4 == 0) && ((!(b % 100 == 0)) || (b % 400 == 0))) ? 29 : 28);
            }
            return 29;
        } else {
            return 31;
        }
    }
}
function isDate(k) {
    var j = k.indexOf(dtCh);
    var h = k.indexOf(dtCh, j + 1);
    var d = k.substring(0, j);
    var a = k.substring(j + 1, h);
    var b = k.substring(h + 1);
    strYr = b;
    if (a.length != 2 || d.length != 2 || b.length != 4) {
        return "The date format should be : mm/dd/yyyy";
    }
    if (a.charAt(0) == "0" && a.length > 1) {
        a = a.substring(1);
    }
    if (d.charAt(0) == "0" && d.length > 1) {
        d = d.substring(1);
    }
    for (var c = 1; c <= 3; c++) {
        if (strYr.charAt(0) == "0" && strYr.length > 1) {
            strYr = strYr.substring(1);
        }
    }
    var e = parseInt(d);
    var g = parseInt(a);
    var f = parseInt(strYr);
    if (j == -1 || h == -1) {
        return "The date format should be : mm/dd/yyyy";
    }
    if (d.length < 1 || e < 1 || e > 12) {
        return "Please enter a valid month";
    }
    if (a.length < 1 || g < 1 || g > 31 || g > daysInMonth(e, f)) {
        return "Please enter a valid day";
    }
    if (b.length != 4 || f == 0 || f < minYear || f > maxYear) {
        return "Please enter a valid 4 digit year between " + minYear + " and " + maxYear;
    }
    if (k.indexOf(dtCh, h + 1) != -1 || isInteger(stripCharsInBag(k, dtCh)) == false) {
        return "Please enter a valid date";
    }
    return "true";
}
WW.dwr = WW.dwr || {};
WW.dwr.debug = function() {
    dwr.engine.setErrorHandler(function(b, a) {
        showConfirmationDialogAlertWithCallback(b, function() {
            location.href = location.href;
        });
        throw a;
    });
};
WW.dwr.safety = function() {
    dwr.engine.setErrorHandler(function(b, a) {
        location.href = location.href;
    });
};
function DWRerr(a) {
    if (a.length > 0) {
        if (a.charAt(0) == "/") {
            window.location = a;
        } else {
            window.location.replace(unescape(window.location.pathname));
        }
    } else {
        window.location.replace(unescape(window.location.pathname));
    }
}
function getboolean(a) {
    if (a == "false") {
        return false;
    } else {
        return true;
    }
}
function getElementsByName_fix(b, c) {
    var f = document.getElementsByTagName(b);
    var a = new Array();
    var e = 0;
    for (var d = 0; d < f.length; d++) {
        att = f[d].getAttribute("name");
        if (att == c) {
            a[e] = f[d];
            e++;
        }
    }
    return a;
}
function changeImage(a, b) {
    document[a].src = b;
}
function fixpng() {
    var f = navigator.appVersion.split("MSIE");
    var g = parseFloat(f[1]);
    if ((g >= 5.5) && (document.body.filters)) {
        for (var c = 0; c < document.images.length; c++) {
            var d = document.images[c];
            var j = d.src.toUpperCase();
            if (j.substring(j.length - 3, j.length) == "PNG") {
                var e = (d.id) ? "id='" + d.id + "' " : "";
                var k = (d.className) ? "class='" + d.className + "' " : "";
                var b = (d.title) ? "title='" + d.title + "' " : "title='" + d.alt + "' ";
                var h = "display:inline-block;" + d.style.cssText;
                if (d.align == "left") {
                    h = "float:left;" + h;
                }
                if (d.align == "right") {
                    h = "float:right;" + h;
                }
                if (d.parentElement.href) {
                    h = "cursor:hand;" + h;
                }
                var a = "<span " + e + k + b + ' style="' + "width:" + d.width + "px; height:" + d.height + "px;" + h + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src='" + d.src + "', sizingMethod='scale');\"></span>";
                d.outerHTML = a;
                c = c - 1;
            }
        }
    }
}
function checkAll(c, b) {
    var a = document.getElementsByName(c);
    for (var d = 0; d < a.length; ++d) {
        a[d].checked = b.checked;
    }
}
function addClass(b, c) {
    if (!b.className) {
        b.className = c;
    } else {
        var a = b.className;
        a += " ";
        a += c;
        b.className = a;
    }
}
function goTo(a) {
    document.location.href = a;
}
function setDefault(b, a) {
    if (b.value.length == 0 || b.value == a) {
        b.value = a;
    } else {
        b.style.color = "";
    }
}
function clearDefault(b, a) {
    if (b.value == a) {
        b.value = "";
    }
    b.style.color = "";
}
function showItem(b) {
    var a = document.getElementById(b);
    a.style.display = "block";
}
function hideItem(b) {
    var a = document.getElementById(b);
    a.style.display = "none";
}
function toggleDiv(b) {
    var a = document.getElementById(b);
    if ((a.style.display == "none") || (a.style.display == "")) {
        a.style.display = "block";
    } else {
        a.style.display = "none";
    }
}
function myobject(a) {
    this.value = a;
}
function setPage(f, e, d) {
    if (e != null) {
        var h = (f - 1) * d;
        var a = (f * d) - 1;
        var b = e.rows.length;
        var g;
        for (var c = 1; c < b; ++c) {
            g = e.rows[c];
            if (c >= h && c <= a) {
                g.style.display = "";
            } else {
                g.style.display = "none";
            }
        }
    }
}
function pageforward(c, b, f, a) {
    var d = c.value;
    ++d;
    var e = (d - 1) * a;
    if (e < b.rows.length) {
        c.value = d;
        setPage(d, b, a);
        setPageMsg(c, b, f, a);
    }
    self.location.hash = "topPage";
}
function pageback(c, b, e, a) {
    var d = c.value;
    if (d > 1) {
        c.value = --d;
        setPage(d, b, a);
        setPageMsg(c, b, e, a);
    }
    self.location.hash = "topPage";
}
function setPageMsg(e, d, g, b) {
    if (d != null) {
        var f = e.value;
        var a = document.getElementById(g);
        var c = 0;
        c = Math.ceil(d.rows.length / b);
        a.innerHTML = "Page " + f + " of " + c;
    }
}
function createCookie(c, d, e) {
    if (e) {
        var b = new Date();
        b.setTime(b.getTime() + (e * 24 * 60 * 60 * 1000));
        var a = "; expires=" + b.toGMTString();
    } else {
        var a = "";
    }
    document.cookie = c + "=" + encodeURIComponent(d) + a + "; path=/";
}
function readCookie(b) {
    var e = b + "=";
    var a = document.cookie.split(";");
    for (var d = 0; d < a.length; d++) {
        var f = a[d];
        while (f.charAt(0) == " ") {
            f = f.substring(1, f.length);
        }
        if (f.indexOf(e) == 0) {
            return f.substring(e.length, f.length);
        }
    }
    return null;
}
function eraseCookie(a) {
    createCookie(a, "", -1);
}
function selectValToggle(b, c, a) {
    if (b.value == c) {
        toggleDiv(a);
    } else {
        hideItem(a);
    }
}
function runAddToWatchList(a) {
    AjaxUserContent.createWatchlistItem(a, showConfirmationDialogAlertNew);
}
function TrackerDisplayNumber(b, c, a) {
    b.innerHTML = c;
    var d = "";
    if (typeof userEmail == "undefined" || !userEmail) {
        userEmail = null;
    }
    if (typeof channelId == "undefined" || !channelId) {
        channelId = 1;
    }
    if (typeof weddingId == "undefined" || !weddingId) {
        weddingId = null;
    }
    if (typeof vendorId == "undefined" || !vendorId) {
        vendorId = null;
    }
    if (typeof isAdmin == "undefined" || !isAdmin) {
        isAdmin = false;
    }
    if (userEmail != null) {
        d = d + "&user_email=" + userEmail;
        if (weddingId != null) {
            d = d + "&wedding_id=" + weddingId;
        } else {
            if (vendorId != null) {
                d = d + "&vendor_id=" + vendorId;
            }
        }
    }
    if (!isAdmin) {
        var e = "url('/api/Tracker.gif?channel_id=" + channelId + "&type=vendor_phone&target_id=" + a + d + "')";
        b.style.backgroundImage = e;
    }
    b.style.backgroundRepeat = "no-repeat";
    b.setAttribute("onclick", "");
}
function prettyAddToMyVendors(a, b) {
    prettySetMyVendorCallBack(b);
    saveToVendor_vid = a;
    addToMyVendors(a);
}
function prettyInviteVendor(a, b) {
    prettySetMyVendorCallBack(b);
    saveToVendor_vid = a;
    inviteToConnect(a);
}
function prettySetMyVendorCallBack(a) {
    setMyVendorCallback(function(b) {
        if (b == "Invitation Sent" || b == "Saved to My Vendors" || b == "This Vendor is already saved.") {
            var c = "Saved";
            if (b == "Invitation Sent") {
                if (a) {
                    c = "Added to Pros I Know";
                } else {
                    c = "Connected";
                }
            }
            if (!a) {
                c = "<span class='lightGreyText'>" + c + "</span>";
            }
            if (saveToVendor_vid.length > 0) {
                elem = document.getElementById("img_" + saveToVendor_vid);
                if (elem != null) {
                    elem.innerHTML = c;
                }
                elem = document.getElementById("img_" + saveToVendor_vid + "spot");
                if (elem != null) {
                    elem.innerHTML = c;
                }
            }
        } else {
            if (typeof dlgConfirmationLoaded != "undefined" && dlgConfirmationLoaded) {
                showConfirmationDialogAlert(b);
            } else {
                alert(b);
            }
        }
    });
}
function setWWSortCookie(c, b) {
    var f = readCookie("WWSORT");
    if (f != null) {
        var e = f.split("|");
        e.pop();
        var d = false;
        for (var a = 0; a < e.length; ++a) {
            var g = e[a].split("=");
            if (g[0] == c) {
                e[a] = c + "=" + b;
                d = true;
            }
        }
        if (!d) {
            e[e.length] = c + "=" + b;
        }
        f = "";
        for (var a = 0; a < e.length; ++a) {
            f += e[a] + "|";
        }
    } else {
        f = c + "=" + b + "|";
    }
    createCookie("WWSORT", f, 365);
}
function getWWSortCookie(b) {
    var d = readCookie("WWSORT");
    if (d != null) {
        var c = d.split("|");
        for (var a = 0; a < c.length; ++a) {
            var e = c[a].split("=");
            if (e[0] == b) {
                return e[1];
            }
        }
    } else {
        return null;
    }
}
function resizeNeeded(f, c) {
    var e = f;
    var b = e.value.split("\n");
    var g = b.length + 1;
    var h = e.rows;
    for (var d = 0; d < b.length; d++) {
        var a = b[d];
        if (a.length >= e.cols) {
            g += Math.floor(a.length / e.cols);
        }
    }
    if (g > e.rows) {
        e.rows = g;
    }
    if (g < e.rows) {
        e.rows = Math.max(c, g);
    }
}
function WWcheckIframe() {
    try {
        if (top.location.href != window.location.href) {
            top.location.href = window.location.href;
        }
    } catch (a) {
        top.location.href = window.location.href;
    }
}
function isAlphaNumeric(a) {
    if ((a >= 65 && a <= 90) || (a >= 48 && a <= 57)) {
        return true;
    } else {
        return false;
    }
}
function convertErrorCodeToMsg(a) {
    var b = "";
    if (a == "-999") {
        b = "Unknown error";
    } else {
        if (a == "-4") {
            b = "Could not find user";
        } else {
            if (a == "-5") {
                b = "This email address has already been used to create an account.";
            } else {
                if (a == "-6") {
                    b = "Your email address has not yet been confirmed. We have just sent you an email with a confirmation link. Please check your email and click on the link provided.";
                } else {
                    if (a == "-7") {
                        b = "This account has been deactivated.";
                    } else {
                        if (a == "-8") {
                            b = "Password must be at least 6 characters";
                        } else {
                            if (a == "-9") {
                                b = "Facebook account linking failed. please contact support";
                            } else {
                                if (a == "-3") {
                                    b = "sorry, facebook login failed; please contact support";
                                } else {
                                    if (a == "-100") {
                                        b = "The email address is not correct.";
                                    } else {
                                        if (a == "-101") {
                                            b = "Please enter a valid wedding date.";
                                        } else {
                                            if (a == "-102") {
                                                b = "The password is not correct.";
                                            } else {
                                                if (a == "-103") {
                                                    b = "Password does not match the confirmation password.";
                                                } else {
                                                    if (a == "-104") {
                                                        b = "Email addresses must match.";
                                                    } else {
                                                        if (a == "-105") {
                                                            b = "Please try entering the characters you see again.";
                                                        } else {
                                                            if (a == "-106") {
                                                                b = "You can only upload images (jpg, jpeg, gif, png).";
                                                            } else {
                                                                if (a == "-107") {
                                                                    b = "Please enter a valid zip code.";
                                                                } else {
                                                                    if (a == "-201") {
                                                                        b = "First Name is required";
                                                                    } else {
                                                                        if (a == "-202") {
                                                                            b = "Last Name is required";
                                                                        } else {
                                                                            if (a == "-203") {
                                                                                b = "Email is required";
                                                                            } else {
                                                                                if (a == "-204") {
                                                                                    b = "You must agree to the Terms and Conditions by selecting 'Yes'";
                                                                                } else {
                                                                                    if (a == "-205") {
                                                                                        b = "Please enter a wedding date.";
                                                                                    } else {
                                                                                        if (a == "-206") {
                                                                                            b = "Please enter a username.";
                                                                                        } else {
                                                                                            if (a == "-207") {
                                                                                                b = "Please enter a password.";
                                                                                            } else {
                                                                                                if (a == "-208") {
                                                                                                    b = "Please pick an image to upload.";
                                                                                                } else {
                                                                                                    if (a == "-209") {
                                                                                                        b = "Please enter your comment.";
                                                                                                    } else {
                                                                                                        if (a == "-210") {
                                                                                                            b = "Please enter your email message.";
                                                                                                        } else {
                                                                                                            if (a == "-211") {
                                                                                                                b = "Please enter your email signature.";
                                                                                                            } else {
                                                                                                                if (a == "-212") {
                                                                                                                    b = "First Name contains a reserved keyword";
                                                                                                                } else {
                                                                                                                    if (a == "-213") {
                                                                                                                        b = "Last Name contains a reserved keyword";
                                                                                                                    } else {
                                                                                                                        if (a == "-300") {
                                                                                                                            b = "Vendors are not allowed to log in for this action.";
                                                                                                                        } else {
                                                                                                                            if (a == "-400") {
                                                                                                                                b = "This discussion has been locked by an Administrator.";
                                                                                                                            } else {
                                                                                                                                if (a == "-401") {
                                                                                                                                    b = "Posting a new comment has been temporarily disabled at this time.";
                                                                                                                                } else {
                                                                                                                                    if (a == "-500") {
                                                                                                                                        b = "You do not have enough space to upload this image. Please contact <a href='mailto:support@weddingwire.com'>support</a>.";
                                                                                                                                    } else {
                                                                                                                                        b = "Unknown error.";
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return b;
}
var hideDivs = function(d, c) {
    for (var b = 0; b < c.length; b++) {
        var a = $j("#" + c[b]);
        a.toggle(d.checked);
        if (!d.checked) {
            a.find("input:checked").prop("checked", false);
        }
    }
};
function createSingleSlider(g, a, f, d, e) {
    var b = $j("<div class='slider' style='width:378px;'></div>");
    $j("#" + g).find("#" + g + "_bg").after(b);
    var c = b.slider({min: a,max: f,step: d,animate: "fast",change: function(h, j) {
            $j("#" + g + "_value").val(Math.round(j.value / d));
            if (e !== undefined) {
                e();
            }
        }});
    return c;
}
function updateSingleSlider(a, c, b) {
    a.slider("option", "value", c * b);
}
var EventTracker = function() {
    this.triggered = false;
    this.track = function(b, c, a, d) {
        if (typeof (_gaq) != "undefined" && !this.triggered) {
            _gaq.push(["_trackEvent", b, c, a, d]);
            this.triggered = true;
        } else {
            if (typeof (pageTracker) != "undefined" && !this.triggered) {
                pageTracker._trackEvent(b, c, a, d);
                this.triggered = true;
            }
        }
    };
};
function getProgressBar(d, a, b, c) {
    var g = "progressBarContainer";
    if (a) {
        g = a;
    }
    var f = "progressBarBackgroundWhite";
    if (b) {
        f = b;
    }
    var e = "progressBarGreen";
    if (c) {
        e = c;
    }
    return '<div class="' + g + '"><div class="' + f + '"><div style="width: ' + d + '%" class="' + e + '">&nbsp;</div></div></div>';
}
function makeEditableLink(f, d, b, e, c, a) {
    return "<a id='" + f + "' href='#' onclick='makeEditable(this,\"" + b + '","' + e + '", "' + c + '", "' + a + "\");return false;'>" + d + "</a>";
}
function makeEditable(d, b, e, c, a) {
    if (d.innerHTML == a) {
        d.innerHTML = "";
    }
    d.parentNode.innerHTML = "<input id='" + d.id + "' type='text' onkeypress='makeEditableOnKeyPress(event, this);' onblur='" + e + "(" + b + ")' value=\"" + escapeAtt(d.innerHTML) + "\" style='" + c + "'/>";
    $j("#" + d.id).data($j(d).data()).focus();
}
function makeEditableDate(e, c, f, d, b, a) {
    makeEditable(e, c, f, d, b);
    $j("#" + e.id).attr("readonly", "true").datepicker(a).focus();
}
function makeEditableOnKeyPress(a, b) {
    var c;
    a = (a) ? a : ((event) ? event : null);
    if (a) {
        c = a.keyCode;
        if (c == 13) {
            b.blur();
        }
    }
}
var monthDay = new Array(31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
function DateDiffInMonths(h, g) {
    var a = 0;
    var c = 0, f = 0, e = 0;
    var d = new Date(h);
    var b = new Date(g);
    d.setDate(1);
    b.setDate(1);
    if (d.getDate() > b.getDate()) {
        a = monthDay[d.getMonth()];
    }
    if (a == -1) {
        if (IsLeapYear(d.getFullYear())) {
            a = 29;
        } else {
            a = 28;
        }
    }
    if (a != 0) {
        c = (b.getDate() + a) - d.getDate();
        a = 1;
    } else {
        c = b.getDate() - d.getDate();
    }
    if ((d.getMonth() + a) > b.getMonth()) {
        f = (b.getMonth() + 12) - (d.getMonth() + a);
        a = 1;
    } else {
        f = (b.getMonth()) - (d.getMonth() + a);
        a = 0;
    }
    e = b.getFullYear() - (d.getFullYear() + a);
    return f + e * 12;
}
function IsLeapYear(a) {
    var b = a.getFullYear();
    return !(b % 4) && (b % 100) || !(b % 400) ? true : false;
}
function clone(b) {
    var a = (b instanceof Array) ? [] : {};
    for (i in b) {
        if (b[i] && typeof b[i] == "object") {
            a[i] = clone(b[i]);
        } else {
            a[i] = b[i];
        }
    }
    return a;
}
function escapeAtt(b) {
    var a = b.replace(/"/g, "&quot;");
    a.replace(/'/g, "&rsquo");
    return a;
}
function getTrackablePage(a) {
    if (a === undefined || a.length == 0) {
        return location.href.split("?")[0];
    } else {
        return a;
    }
}
WW.fb = {response: null,initArray: [],init: function(a) {
        this.response = a;
        for (var b = 0; 
        b < this.initArray.length; b++) {
            this.initArray[b](a);
        }
    },initEnsure: function(a) {
        if (this.response !== null) {
            a(this.response);
        } else {
            this.initArray.push(a);
        }
    }};
String.prototype.startsWith = function(a) {
    a = a.toLowerCase();
    return (this.toLowerCase().match("^" + a) == a);
};
var themeSelectMe = function(c) {
    var d = $j(c).closest(".theme-tile-box");
    var b = d.find("div.selected-color");
    var a = d.find("div.theme-tile");
    a.removeClass(themeGetColorName(b.get(0))).addClass(themeGetColorName(c));
    b.removeClass("selected-color");
    $j(c).addClass("selected-color");
};
var themeGetColorName = function(a) {
    return a.className.replace("theme-colors", "").replace("selected-color", "").trim();
};
var themePreview = function(b) {
    var a = themeGetSelected(b);
    window.open("/vendor/VendorViewStoreFront?themeCode=" + a);
};
var themeSelect = function(b) {
    var a = themeGetSelected(b);
    location.href = "/vendor/VendorChangeTheme?action=update&themeCode=" + a;
};
var themeSelectForFBPD = function(b, c) {
    var a = themeGetSelected(b);
    location.href = "/vendor/VendorFacebookTabThemeDesigner?action=updateThemeCode&themeCode=" + a + "&returnToTab=" + c;
};
var themeGetSelected = function(c) {
    var a = $j(c).closest(".theme-tile-box");
    var b = a.find("div.selected-color");
    return b.first().attr("id");
};
var getSelectedRadio = function(b) {
    for (var a = 0; a < b.length; 
    a++) {
        if (b[a].checked) {
            return b[a].value;
        }
    }
    return null;
};
var reportTagIncorrectly = function(a, b) {
    ReportAbuse.createPortfolioTagAbuse(a, location.href, function(c) {
        reportTagIncorrectlyReturn(b, c);
    });
};
function registerNS(d) {
    var c = d.split(".");
    var a = window;
    for (var b = 0; b < c.length; b++) {
        if (typeof a[c[b]] == "undefined") {
            a[c[b]] = new Object();
        }
        a = a[c[b]];
    }
}
var showSEOContent = function(a) {
    if (a.height() == 0) {
        a.css({"height": "auto","overflow": "","display": "none"}).slideToggle("slow");
    } else {
        a.slideToggle("slow");
    }
};
if (typeof (jQuery) != "undefined") {
    $j = jQuery.noConflict();
    jQuery.fn.br2nl = function() {
        return this.each(function() {
            var a = jQuery(this);
            a.val(a.val().replace(/(<br>)|(<br\s*\/>)|(<p>)|(<\/p>)/g, "\r\n"));
        });
    };
    reportTagIncorrectlyReturn = function(a, b) {
        if (b != null) {
            $j(a).replaceWith("This item has been flagged.");
        }
    };
    jQuery.widget("ww.dialog", jQuery.ui.dialog, {options: {autoOpen: false,modal: true,resizable: false,draggable: false,position: "center",width: "auto",height: "auto",open: function(a, b) {
                $j(this).closest(".ui-dialog").removeClass("ui-corner-all").addClass("ui-corner-all");
                $j(this).find("input, textarea").placeholder();
                $j(this).closest(".ui-dialog").focus();
            }}});
    jQuery.widget("ww.tooltip", jQuery.ui.tooltip, {options: {open: function(b, d) {
                var a = $j(b.srcElement).tooltip();
                var c = d.tooltip;
                a.unbind("mouseleave").bind("mouseleave", function(g) {
                    g.stopImmediatePropagation();
                    var f = setTimeout(function() {
                        a.tooltip("close");
                    }, 500);
                    c.hover(function() {
                        clearTimeout(f);
                    }, function() {
                        a.tooltip("close");
                    });
                });
            }}});
    $j(function() {
        $j("input,textarea").placeholder();
        $j(".jquery-datepicker").each(function() {
            createDatePicker(this);
        });
        $j(".toggle-navigation-menu-tab").on({mouseenter: function() {
                $j(this).find(".navmenu-drop").show();
            },mouseleave: function() {
                $j(this).find(".navmenu-drop").hide();
            }});
        if (typeof (moment) != "undefined") {
            $j("[data-replace-time]").each(function() {
                if ($j(this).attr("data-replace-time")) {
                    var a = "MM/DD/YYYY hh:mm a";
                    if ($j(this).attr("data-replace-time-format")) {
                        a = $j(this).data("replace-time-format");
                    }
                    $j(this).html(moment($j(this).data("replace-time")).format(a));
                }
            });
        }
        $j(".core-secondary-actn-btn-dropdown-container").on({mouseenter: function() {
                $j(this).find(".core-secondary-actn-btn").addClass("selected");
                $j(this).find(".dropdown-options").show().position({my: "left top",at: "left bottom",of: $j(this),collision: "none"});
            },mouseleave: function() {
                $j(this).find(".core-secondary-actn-btn").removeClass("selected");
                $j(this).find(".dropdown-options").hide();
            }});
    });
    $j(document).on("click", "a[href$='#']", function(a) {
        a.returnValue = false;
        if (a.preventDefault) {
            a.preventDefault();
        }
    });
    (function(a) {
        if (a.ui && a.ui.dialog && a.ui.dialog.overlay && a.browser.webkit) {
            a.ui.dialog.overlay.events = a.map(["focus", "keydown", "keypress"], function(b) {
                return b + ".dialog-overlay";
            }).join(" ");
        }
    }(jQuery));
}
function createDatePicker(b) {
    var a = {changeYear: true,maxDate: ($j(b).data("maxdate") != null) ? $j(b).data("maxdate") : "+10y",minDate: ($j(b).data("mindate") != null) ? $j(b).data("mindate") : "-10y"};
    if ($j(b).hasClass("button")) {
        a.showOn = "both";
        a.buttonImage = "http://wwcdn.weddingwire.com/static/8.4.91/images/icons/16/silk/calendar.gif";
        a.buttonImageOnly = true;
        a.buttonText = "Select your wedding date";
    }
    if ($j(b).hasClass("font-awesome-button")) {
        a.showOn = "both";
        a.buttonHtml = "<i class='icon icon-calendar'></i>";
    }
    if ($j(b).hasClass("landing-button")) {
        a.showOn = "both";
        a.buttonHtml = "<i class='icon landing-icon icon-calendar jquery-ui-calendar-fa-icon'></i>";
    }
    $j(b).datepicker(a);
    $j(b).attr("readonly", "true");
    if ($j("body").hasClass("core-vendor authed") && $j(b).is("#contactus-date")) {
        $j("#contactus-date").next("button.ui-datepicker-trigger").replaceWith("<i class='icon landing-icon icon-calendar jquery-ui-calendar-fa-icon ui-datepicker-trigger' onclick='$j(\"#contactus-date\").datepicker(\"show\");'></i>");
    }
}
WW.getRatingStarClass = function(b) {
    var a = "stars-00";
    if (b == 0) {
        a = "stars-00";
    } else {
        if (b > 0.25 && b <= 0.75) {
            a = "stars-05";
        } else {
            if (b > 0.75 && b <= 1.25) {
                a = "stars-10";
            } else {
                if (b > 1.25 && b <= 1.75) {
                    a = "stars-15";
                } else {
                    if (b > 1.75 && b <= 2.25) {
                        a = "stars-20";
                    } else {
                        if (b > 2.25 && b <= 2.75) {
                            a = "stars-25";
                        } else {
                            if (b > 2.75 && b <= 3.25) {
                                a = "stars-30";
                            } else {
                                if (b > 3.25 && b <= 3.75) {
                                    a = "stars-35";
                                } else {
                                    if (b > 3.75 && b <= 4.25) {
                                        a = "stars-40";
                                    } else {
                                        if (b > 4.25 && b <= 4.75) {
                                            a = "stars-45";
                                        } else {
                                            if (b > 4.75) {
                                                a = "stars-50";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return a;
};
WW.getRatingStarClass100 = function(b) {
    var a = "stars-00";
    if (b == 0) {
        a = "stars-00";
    } else {
        if (b > 0.25 && b <= 0.75) {
            a = "stars-10";
        } else {
            if (b > 0.75 && b <= 1.25) {
                a = "stars-20";
            } else {
                if (b > 1.25 && b <= 1.75) {
                    a = "stars-30";
                } else {
                    if (b > 1.75 && b <= 2.25) {
                        a = "stars-40";
                    } else {
                        if (b > 2.25 && b <= 2.75) {
                            a = "stars-50";
                        } else {
                            if (b > 2.75 && b <= 3.25) {
                                a = "stars-60";
                            } else {
                                if (b > 3.25 && b <= 3.75) {
                                    a = "stars-70";
                                } else {
                                    if (b > 3.75 && b <= 4.25) {
                                        a = "stars-80";
                                    } else {
                                        if (b > 4.25 && b <= 4.75) {
                                            a = "stars-90";
                                        } else {
                                            if (b > 4.75) {
                                                a = "stars-100";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return a;
};
WW.getRatingStarSrc = function(b) {
    var a = "0_stars.gif";
    if (b == 0) {
        a = "0_stars.gif";
    } else {
        if (b > 0.25 && b <= 0.75) {
            a = "5_stars.gif";
        } else {
            if (b > 0.75 && b <= 1.25) {
                a = "10_stars.gif";
            } else {
                if (b > 1.25 && b <= 1.75) {
                    a = "15_stars.gif";
                } else {
                    if (b > 1.75 && b <= 2.25) {
                        a = "20_stars.gif";
                    } else {
                        if (b > 2.25 && b <= 2.75) {
                            a = "25_stars.gif";
                        } else {
                            if (b > 2.75 && b <= 3.25) {
                                a = "30_stars.gif";
                            } else {
                                if (b > 3.25 && b <= 3.75) {
                                    a = "35_stars.gif";
                                } else {
                                    if (b > 3.75 && b <= 4.25) {
                                        a = "40_stars.gif";
                                    } else {
                                        if (b > 4.25 && b <= 4.75) {
                                            a = "45_stars.gif";
                                        } else {
                                            if (b > 4.75) {
                                                a = "50_stars.gif";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return "http://wwcdn.weddingwire.com/static/8.4.91/images/stars/" + a;
};
WW.getRatingStarSrcNew = function(b) {
    var a = "0_stars.gif";
    if (b == 0) {
        a = "0_stars.gif";
    } else {
        if (b > 0.25 && b <= 0.75) {
            a = "5_stars.gif";
        } else {
            if (b > 0.75 && b <= 1.25) {
                a = "10_stars.gif";
            } else {
                if (b > 1.25 && b <= 1.75) {
                    a = "15_stars.gif";
                } else {
                    if (b > 1.75 && b <= 2.25) {
                        a = "20_stars.gif";
                    } else {
                        if (b > 2.25 && b <= 2.75) {
                            a = "25_stars.gif";
                        } else {
                            if (b > 2.75 && b <= 3.25) {
                                a = "30_stars.gif";
                            } else {
                                if (b > 3.25 && b <= 3.75) {
                                    a = "35_stars.gif";
                                } else {
                                    if (b > 3.75 && b <= 4.25) {
                                        a = "40_stars.gif";
                                    } else {
                                        if (b > 4.25 && b <= 4.75) {
                                            a = "45_stars.gif";
                                        } else {
                                            if (b > 4.75) {
                                                a = "50_stars.gif";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return "http://wwcdn.weddingwire.com/static/8.4.91/images/starsNew/" + a;
};
WW.removeAll = function(c, b) {
    var a = [];
    $j.each(c, function(d, e) {
        if ($j.inArray(e, b) === -1) {
            a.push(e);
        }
    });
    return a;
};
WW.vendorDetailsCallbacks = {};
WW.vendorDetailsObjects = {};
WW.vendorDetails = function(a, d, b) {
    if (WW.vendorDetailsObjects[a] == undefined) {
        var c = WW.vendorDetailsCallbacks[a] || [];
        c.push(d);
        WW.vendorDetailsCallbacks[a] = c;
        if (c.length == 1) {
            $j.ajax("http://api.weddingwire.com/api/v3/Vendor", {cache: true,data: {partner_key: b,vendor_id: a,go_mobile: "yes",reviews: "yes",images: "yes",portfolio_event_type: "wedding"},jsonpCallback: "WW.vendorDetailsCallback",dataType: "jsonp"});
        }
    } else {
        d(WW.vendorDetailsObjects[a]);
    }
};
WW.vendorDetailsCallback = function(b) {
    if (typeof b.error_code_major !== "undefined") {
    } else {
        WW.vendorDetailsObjects[b.vendor_id] = b;
        var c = WW.vendorDetailsCallbacks[b.vendor_id] || [];
        for (var a = 0; a < c.length; a++) {
            c[a](b);
        }
    }
};
WW.getSmallReviewStars = function(d) {
    d = parseFloat(d);
    var c = 0;
    var a = d * 10;
    var b = parseInt(a, 10) % 5;
    if (b > (5 / 2)) {
        c = a + (5 - b);
    } else {
        c = a - b;
    }
    return ("http://wwcdn.weddingwire.com/static/8.4.91/images/search/reviewstars/" + c + "_stars.gif");
};
(function(d, g) {
    var c = g.geo = {};
    var b = {setLocation: d.noop,setLocationPlaceholder: d.noop};
    var h = function() {
        return !!navigator.geolocation;
    };
    var e = function(k) {
        for (var l = 0; l < k.types.length; l++) {
            if (k.types[l] === "postal_code") {
                return true;
            }
        }
        return false;
    };
    var a = function(k) {
        if (WW.localStorage.supports_html5_storage()) {
            localStorage["location"] = k;
        }
    };
    var j = function() {
        if (WW.localStorage.supports_html5_storage() && localStorage["location"] !== null && localStorage["location"] !== undefined) {
            b.setLocation(localStorage["location"]);
        } else {
            if (h()) {
                b.setLocationPlaceholder("Looking up your location ...");
                if (typeof (google) === "undefined" || typeof (google.maps) === "undefined") {
                    var k = document.createElement("script");
                    k.type = "text/javascript";
                    k.id = "google-maps";
                    k.src = "//maps.googleapis.com/maps/api/js?v=3&client=gme-weddingwire&channel=" + WW.defaultPartnerKey + "&sensor=true&callback=WW.geo.callback";
                    d("body").append(k);
                } else {
                    f();
                }
            }
        }
    };
    var f = function() {
        navigator.geolocation.getCurrentPosition(function(k) {
            var o = k.coords.latitude;
            var m = k.coords.longitude;
            var l = new google.maps.LatLng(o, m);
            var n = new google.maps.Geocoder();
            n.geocode({"location": l}, function(t, r) {
                if (r === "OK") {
                    for (var s = 0; s < t.length; s++) {
                        var q = t[s];
                        for (var p = 0; p < q.address_components.length; p++) {
                            if (e(q.address_components[p])) {
                                b.setLocation(q.address_components[p].short_name);
                                return;
                            }
                        }
                    }
                }
            });
        });
    };
    d.extend(c, {findLocation: j,callback: f,settings: function(k) {
            if (k === undefined) {
                return b;
            }
            d.extend(b, k);
        }});
})(jQuery, WW);
(function(c, b) {
    if (typeof (c.fn.qtip) != "undefined") {
        c.fn.qtip.defaults = c.extend(true, {}, c.fn.qtip.defaults, {style: {tip: {corner: true,border: 1}},hide: {fixed: true,delay: 300,event: "mouseleave click unfocus"},position: {my: "top center",at: "bottom center",viewport: c(window),adjust: {method: "flip none"}}});
        var a = c.extend(true, {}, c.fn.qtip.defaults);
        c(document).on("mouseover", "[data-tooltip], [data-tooltip-content]", function(d) {
            var e = function(f) {
                return c(f).data("tooltip");
            };
            if (c(this).data("tooltip-content") && typeof window[c(this).data("tooltip-content")] !== "undefined") {
                e = window[c(this).data("tooltip-content")];
            }
            if (c(this).data("tooltip-style-classes") && c.trim(c(this).data("tooltip-style-classes")) != "") {
                a.style["classes"] = c.trim(c(this).data("tooltip-style-classes"));
            } else {
                a.style["classes"] = "ui-tooltip-rounded ui-tooltip-ww-standard";
            }
            c(this).qtip(c.extend(true, {}, a, {overwrite: false,show: {event: d.type,ready: true},content: e(this)}), d);
        });
    }
})(jQuery, WW);
(function(e, c) {
    var g = c.tracking = {};
    var b = {debug: false};
    var f = function(j, l) {
        if (l == null) {
            l = j;
        }
        new EventTracker().track("Lead Gen", 'Clicks "Visit My Website"', l);
        var k = "http://api.weddingwire.com/api/v3/Tracker.gif?type=vendor_website&target_id=" + j + "&partner_key=" + WW.defaultPartnerKey;
        e("body").append('<img src="' + k + '"/>');
    };
    var d = function(k) {
        var j = "http://api.weddingwire.com/api/v3/TrackerUGC.gif?type=promotion_website&target_id=" + k + "&partner_key=" + WW.defaultPartnerKey;
        e("body").append('<img src="' + j + '"/>');
    };
    var h = function(j, l) {
        if (l == null) {
            l = j;
        }
        new EventTracker().track("Lead Gen", 'Clicks "Visit My Blog"', l);
        var k = "http://api.weddingwire.com/api/v3/Tracker.gif?type=vendor_blog&target_id=" + j + "&partner_key=" + WW.defaultPartnerKey;
        e("body").append('<img src="' + k + '"/>');
    };
    var a = function(j, k) {
        if (k == null) {
            k = j;
        }
        new EventTracker().track("Lead Gen", 'Clicks "Save To Vendors"', k);
    };
    e.extend(g, {blankVendorWebsiteLinkTracking: f,blankUserContentForPromotionWebsiteLinkTracking: d,blankVendorBlogLinkTracking: h,saveToVendors: a,settings: function(j) {
            if (j === undefined) {
                return b;
            }
            e.extend(b, j);
        }});
})(jQuery, WW);
var contactusUpdateType = function(a) {
    document.getElementById("contactus").className = a.value;
};
var contactusSubmit = function(v, s) {
    var c = "";
    var m = document.getElementById("contactus-error");
    document.getElementById("contactus-submit").disabled = true;
    var g = document.getElementById("contactus-namefirst");
    var o = document.getElementById("contactus-namelast");
    var q = document.getElementById("contactus-email");
    var w = document.getElementById("contactus-date");
    var l = document.getElementById("contactus-phone");
    var j = document.getElementById("contactus-msg");
    var n = document.getElementsByName("contactus-time");
    var e = document.getElementById("contactus-type");
    g.onfocus();
    o.onfocus();
    q.onfocus();
    w.onfocus();
    l.onfocus();
    var x = g.value.trim();
    var f = o.value.trim();
    var b = q.value.trim();
    var u = w.value.trim();
    var y = l.value.trim();
    var a = j.value.trim();
    var h = e.value.split("-")[1];
    var d = [];
    for (var r = 0; r < n.length; r++) {
        if (n[r].checked) {
            d[d.length] = n[r].value;
        }
    }
    if (x.length == 0) {
        c = "First Name is required";
    }
    if (c == "" && f.length == 0) {
        c = "Last Name is required";
    }
    if (c == "") {
        if (b.length == 0) {
            c = "Email address is required";
        } else {
            if (!checkEmail(b)) {
                c = "Email address is invalid";
            }
        }
    }
    if (c == "" && (u.length == 0 || !checkDate(u) || Date.parse(u) == 0)) {
        c = "Wedding date is required";
    }
    if ("call" == h) {
        if (c == "") {
            if (y.length == 0) {
                c = "Phone Number is required";
            } else {
                if (!checkTelePhone(trimPhone(y))) {
                    c = "Phone Number is invalid";
                }
            }
        }
        if (c == "" && d.length == 0) {
            c = "A best time is required";
        }
    }
    if ("question" == h) {
        if (c == "" && a.length == 0) {
            c = "A message is required.";
        }
    }
    if (c == "") {
        m.style.display = "";
        var p = {"first_name": x,"last_name": f,"email_address": b,"event_date_epoch": Date.parse(u)};
        if ("call" == h) {
            p["phone"] = y;
            var k = "Please call me <br/> Best Time to Contact: ";
            for (var r = 0; r < d.length; r++) {
                if (r > 0) {
                    k += " or ";
                }
                k += d[r];
            }
            p["message"] = k;
        }
        if ("question" == h) {
            p["message"] = a;
        }
        p["vendor_id"] = v;
        var t;
        if (typeof (WW) !== "undefined" && typeof (WW.defaultPartnerKey) !== "undefined") {
            t = WW.defaultPartnerKey;
        } else {
            t = "163r5mm3";
        }
        $j.get("//api.weddingwire.com/api/v3/OpenCreateVendorLead", {partner_key: t,payload: JSON.stringify(p),network: WeddingWire.settings().network,callback: "contactUsCallback"}, function(z) {
            contactUsCallback(z);
        }, "jsonp");
        if (s) {
            createCookie("cufn", escape(x));
            createCookie("culn", escape(f));
            if ($j("#ms-global-page-content").length != 0) {
                createCookie("cuea", encodeURIComponent(escape(b)));
            } else {
                createCookie("cuea", escape(b));
            }
            createCookie("cued", escape(u));
            createCookie("cuph", escape(y));
        }
    } else {
        m.innerHTML = c;
        m.style.display = "block";
        document.getElementById("contactus-submit").disabled = false;
    }
    g.onblur();
    o.onblur();
    q.onblur();
    w.onblur();
    l.onblur();
};
function contactUsCallback(b) {
    var c = document.getElementById("contactus-error");
    if (typeof b !== "undefined") {
        if (typeof b.error_code_major !== "undefined") {
            if (b.error_code_major == 400 && b.error_code_minor == 16) {
                c.innerHTML = "Event Date Invalid";
                c.style.display = "block";
            } else {
                c.innerHTML = "Sorry we experienced an error, please try again later.";
                c.style.display = "block";
            }
        } else {
            $j("#contactus-done").html("Your information has been submitted successfully. Thank you for your interest in <br/>" + b.vendor_name + "!");
            $j("#contactus").removeClass().addClass("contactus-done");
            $j("body").append('<img src="//api.weddingwire.com/api/v3/Tracker.gif?type=widget_contactus&target_id=' + b.vendor_id + '&partner_key=163r5mm3"/>');
            tracker = new EventTracker();
            var a = b.vendor_id;
            if (typeof google_storefront_tacking_label != "undefined") {
                a = google_storefront_tacking_label;
            }
            tracker.track("Lead Gen", "Submits Contact Us Form", a);
        }
    } else {
        c.innerHTML = "Sorry we experienced an error, please try again later.";
        c.style.display = "block";
    }
    if (document.getElementById("contactus-submit") != null) {
        document.getElementById("contactus-submit").disabled = false;
    }
}
$j(document).ready(function() {
    $j(document).on("touchend", ".nav-dropdown a", function(c) {
        c.preventDefault();
        var a = $j(this);
        var b = a.attr("href");
        if (b && b != "#") {
            window.location = b;
        }
    });
});
