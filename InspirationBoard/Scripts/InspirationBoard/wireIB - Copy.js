WW.registerNS("WW.IB");
WW.IB.filterShow = function (c, b) {
    var d = ($j(b).css("display") == "none");
    WW.IB.filterCancel();
    if (b === "#ib-detail-tag-labels") {
        ($j(b + " .js-accordion-nav > div.js-active").length > 0) ? "" : $j(b + " .js-accordion-nav > div:first-child").addClass("js-active").addClass("strong");
    }
    if (d) {
        $j(b).show();
        var a = $j(c);
        $j("#ib-modify-tags").css({ top: a.offset().top + a.height(), left: a.offset().left }).css("visibility", "visible").show();
    }
};
WW.IB.filterCancel = function () {
    $j("#ib-modify-tags").hide().find(".bgWhite").hide();
    $j("#ib-modify-tags input[type=checkbox]").each(function () {
        var a = $j(this);
        if (a.data("checked")) {
            a.prop("checked", true);
        } else {
            a.removeAttr("checked");
        }
    });
};
WW.IB.filterApply = function () {
    var b = $j("#ib-modify-tags .bgWhite:visible");
    var a = b.find("input[type=checkbox]").each(function () {
        var d = $j(this);
        d.data("checked", d.prop("checked"));
    }).filter(":checked").length;
    $link = $j("a." + b.attr("id"));
    var c = $link.data("shortname");
    if (a > 0) {
        c += "(" + a + ")";
    }
    $link.text(c);
    $j("#ib-modify-tags").hide().find(".bgWhite").hide();
    $j("#ib-photo-strip").data("page", 0);
    WW.IB.imgStripUpdate();
};
WW.IB.filterUpdate = function () {
    debugger;
    var a = [], b = "";
    $j("#ib-modify-tags input[type=checkbox]:checked").each(function () {
        a[a.length] = $j(this).data("seo");
    });
    if (a.length > 0) {
        b = "&" + $j.param({ "tags": a }, true);
    }
    var c = $j("#ib-photo-strip").data("page");
    if (c > 1) {
        b += "&page=" + (Math.floor(c / 2) + 1);
    }
    $j.getScript("http://api.weddingwire.com/api/v2/SearchImages?partnerkey=" + WW.defaultPartnerKey + "&callback=WW.IB.imgStripUpdateReturn" + b);
};
WW.IB.usedUpdate = function () {
    var a = $j("#ib-photo-strip").data("page");
    a = (Math.floor(a / 2) + 1);
    InspirationBoardNew.getAllUsedPhotos(a, function (b) {
        WW.IB.imgStripUpdateReturn(b, "used");
    });
};
WW.IB.recentUpdate = function () {
    InspirationBoardNew.getRecentUsedPhotos(function (a) {
        WW.IB.imgStripUpdateReturn(a, "recent");
    });
};
WW.IB.imgStripUpdate = function () {
    $j("#ib-photo-strip").removeClass("loaded").addClass("loading");
    if ($j("#ib-nav").hasClass("gallery")) {
        debugger;
        //WW.IB.filterUpdate();
        getImageStrip(0, 20);
    } else {
        if ($j("#ib-photo-strip-header-my").hasClass("all")) {
            WW.IB.usedUpdate();
        } else {
            WW.IB.recentUpdate();
        }
    }
};
function getImageStrip(pageIndex, pageSize) {
    $j.getJSON("/InspirationBoard/GetStripImages?pageIndex=" + pageIndex + "&pageSize=" + pageSize, function (data) {
        newImgStripUpdateReturn(data, undefined);
    });
}
function newImgStripUpdateReturn(data, f) {
    debugger;
    if (f === undefined) {
        $j("#ib-nav").removeClass("my").addClass("gallery");
    } else {
        $j("#ib-nav").removeClass("gallery").addClass("my");
        if (f == "recent") {
            $j("#ib-photo-strip-header-my").removeClass("all").addClass("used");
        } else {
            $j("#ib-photo-strip-header-my").removeClass("used").addClass("all");
        }
    }
    var d = $j("#ib-photo-strip").data("page");
    var h = (d * 14) + 1;
    if (d % 2 !== 0) {
        data.images = data.images.slice(14);
    } else {
        data.images = data.images.slice(0, 14);
    }
    var g = h - 1 + data.images.length;
    if (data.images.length === 0) {
        $j("#ib-photo-strip-countPage").text(0);
    } else {
        $j("#ib-photo-strip-countPage").text(h + "-" + g);
    }
    $j("#ib-photo-strip-countTotal").text(data.total_image_count);
    var k = $j("#ib-photo-strip-images-imgs");
    if (data.images.length === 0) {
        if ($j("#ib-nav").hasClass("gallery")) {
            k.html("<span class='redText'>No photos found. Please try different criteria.<span>");
        } else {
            k.html("<span class='redText'>No photos found.<span>");
        }
    } else {
        k.empty();
        for (var b = 0; b < data.images.length; b++) {
            var c = data.images[b];
            var e;
            e = $j('<span><img id="' + c.image_id + '" src="' + c.thumbnail_url + '" class="source-img"/></span>');
            e.find("img").data({ wwData: { portfolioItemId: c.image_id, vendorName: c.vendor_name, vendorUrl: c.storefront_url, img: c.image_url, zoom: 1 } });

            k.append(e);
        }
    }
    $j("#ib-photo-strip-images-prev").css("visibility", function (i, l) {
        if (d !== 0) {
            return "visible";
        } else {
            return "hidden";
        }
    });
    $j("#ib-photo-strip-images-next").css("visibility", function (i, l) {
        if (d + 1 < Math.ceil(data.total_image_count / 12)) {
            return "visible";
        } else {
            return "hidden";
        }
    });
    $j("#ib-photo-strip .source-img").draggable({
        scope: "images", start: function () {
            $j("#ib-photo-preview").remove();
        }, helper: function () {
            var i = $j(this);
            return $j('<img class="source-img"></img>').attr("src", i.attr("src")).data({ wwData: i.data("wwData") });
        }
    }).each(function () {
        var i = $j(this);
        i.closest("span").hover(function () {
            if ($j("img.ui-draggable-dragging").length === 0) {
                var l = $j(this);
                $j('<div id="ib-photo-preview"><img src="' + i.data("wwData").img + '"/><div class="normalText">Photo by <a target="_blank" href="' + i.data("wwData").vendorUrl + '">' + i.data("wwData").vendorName + "</a></div></div>").css({ top: i.offset().top + i.height(), left: i.offset().left }).appendTo(l);
            }
        }, function () {
            $j(this).children("div").remove();
        });
    }).attr("title", "Drag, and drop this photo to add it to your inspiration board.");
    $j("#ib-photo-strip").removeClass("loading").addClass("loaded");
}

//WW.IB.imgStripUpdateReturn = function (a, f) {
//    debugger;
//    if (f === undefined) {
//        $j("#ib-nav").removeClass("my").addClass("gallery");
//    } else {
//        $j("#ib-nav").removeClass("gallery").addClass("my");
//        if (f == "recent") {
//            $j("#ib-photo-strip-header-my").removeClass("all").addClass("used");
//        } else {
//            $j("#ib-photo-strip-header-my").removeClass("used").addClass("all");
//        }
//    }
//    var d = $j("#ib-photo-strip").data("page");
//    var h = (d * 14) + 1;
//    if (d % 2 !== 0) {
//        a.images = a.images.slice(14);
//    } else {
//        a.images = a.images.slice(0, 14);
//    }
//    var g = h - 1 + a.images.length;
//    if (a.images.length === 0) {
//        $j("#ib-photo-strip-countPage").text(0);
//    } else {
//        $j("#ib-photo-strip-countPage").text(h + "-" + g);
//    }
//    $j("#ib-photo-strip-countTotal").text(a.total_image_count);
//    var k = $j("#ib-photo-strip-images-imgs");
//    if (a.images.length === 0) {
//        if ($j("#ib-nav").hasClass("gallery")) {
//            k.html("<span class='redText'>No photos found. Please try different criteria.<span>");
//        } else {
//            k.html("<span class='redText'>No photos found.<span>");
//        }
//    } else {
//        k.empty();
//        for (var b = 0; b < a.images.length; b++) {
//            var c = a.images[b];
//            var e;
//            if (c.image_asset_urls) {
//                e = $j('<span><img id="' + c.image_id + '" src="' + c.image_asset_urls.image_sq_64x64_url + '" class="source-img"/></span>');
//                e.find("img").data({ wwData: { portfolioItemId: c.image_id, vendorName: c.vendor.vendor_name, vendorUrl: c.vendor.storefront_url, img: c.image_asset_urls.image_600x600_url, zoom: 1 } });
//            } else {
//                e = $j('<span><img src="' + a.images[b].imageUrl96 + '" class="source-img"/></span>');
//                var j = {};
//                if (a.images[b].scrapbookItemId === null) {
//                    j = { portfolioItemId: a.images[b].portfolioItemId, vendorName: a.images[b].vendorName, vendorUrl: a.images[b].vendorUrl };
//                } else {
//                    j = { scrapbookItemId: a.images[b].scrapbookItemId };
//                }
//                e.find("img").data({ wwData: $j.extend(false, j, { img: a.images[b].imageUrl600, zoom: 1 }) });
//            }
//            k.append(e);
//        }
//    }
//    $j("#ib-photo-strip-images-prev").css("visibility", function (i, l) {
//        if (d !== 0) {
//            return "visible";
//        } else {
//            return "hidden";
//        }
//    });
//    $j("#ib-photo-strip-images-next").css("visibility", function (i, l) {
//        if (d + 1 < Math.ceil(a.total_image_count / 12)) {
//            return "visible";
//        } else {
//            return "hidden";
//        }
//    });
//    $j("#ib-photo-strip .source-img").draggable({
//        scope: "images", start: function () {
//            $j("#ib-photo-preview").remove();
//        }, helper: function () {
//            var i = $j(this);
//            return $j('<img class="source-img"></img>').attr("src", i.attr("src")).data({ wwData: i.data("wwData") });
//        }
//    }).each(function () {
//        var i = $j(this);
//        i.closest("span").hover(function () {
//            if ($j("img.ui-draggable-dragging").length === 0) {
//                var l = $j(this);
//                $j('<div id="ib-photo-preview"><img src="' + i.data("wwData").img + '"/><div class="normalText">Photo by <a target="_blank" href="' + i.data("wwData").vendorUrl + '">' + i.data("wwData").vendorName + "</a></div></div>").css({ top: i.offset().top + i.height(), left: i.offset().left }).appendTo(l);
//            }
//        }, function () {
//            $j(this).children("div").remove();
//        });
//    }).attr("title", "Drag, and drop this photo to add it to your inspiration board.");
//    $j("#ib-photo-strip").removeClass("loading").addClass("loaded");
//};
WW.IB.initView = function (a) {
    this.divInit($j("#ib-cell-root"), a);
};
WW.IB.initTitle = function () {
    $j("#ib-overall-controls .ready-false,#ib-boards .ready-false .ready-false").attr("title", "Add an item to your board and save to enable sharing.");
};
WW.IB.getVendorLinks = function () {
    var a = "";
    var b = {};
    $j("#ib-cell-root .ib-cell img").each(function () {
        var c = $j(this).data("wwData");
        if (b[c.vendorUrl] === undefined && c.vendorUrl !== undefined && c.vendorName !== undefined) {
            if (a !== "") {
                a += ", ";
            }
            a += "<a href='" + c.vendorUrl + "'>" + c.vendorName + "</a>";
            b[c.vendorUrl] = true;
        }
    });
    return a;
};
WW.IB.initEdit = function (data) {
    WW.IB.initEmbed();
    WW.IB.initTitle();
    $j("#ib-photo-strip-images-next").click(function () {
        $j("#ib-photo-strip").data("page", $j("#ib-photo-strip").data("page") + 1);
        WW.IB.imgStripUpdate();
    });
    $j("#ib-photo-strip-images-prev").click(function () {
        $j("#ib-photo-strip").data("page", $j("#ib-photo-strip").data("page") - 1);
        WW.IB.imgStripUpdate();
    });
    $j("#ib-nav .ib-photo-strip-update").click(function () {
        $j("#ib-photo-strip").data("page", 0);
        WW.IB.imgStripUpdate();
    });
    WW.IB.filterCancel();
    $j("#ib-nav .ib-photo-strip-update").first().trigger("click");
    $j("#ib-overall-controls-print-fake").closest("a").click(function (b) {
        $j("#ib-preview-print").remove();
        $j('<span id="ib-preview-print"><span class="strong">' + $j("#ib-dialog-edit-name").data("default") + "</span><br/><span>" + $j("#ib-dialog-edit-description").data("default") + '</span><br/><br/><img src="' + $j("#ib-main-container").data("image")["750"] + '"/></span>').appendTo("body");
        $j("#ib-preview-print img").bind("imgpreload", function () {
            $j("#ib-overall-controls-print").trigger("click");
        });
    });
    $j(".addthis_button_email.ready-true.public.at300b").live("click", function () {
        var b = WW.IB.getVendorLinks();
        addthis_share.email_vars.vendor_urls = "Photos by: " + b;
    });
    $j("#ib-overall-controls-embed").click(function () {
        var e = $j("#ib-main-container").data();
        WW.IB.ALL.dialogBoardEmbed.dialog("option", "title", "Embed: " + $j("#ib-dialog-edit-name").data("default"));
        $j("#ib-embed-dialog-preview").css("background-image", "url(" + e.image["220"] + ")");
        var b = $j("#ib-embed-dialog-form");
        var c = WW.IB.getVendorLinks();
        b.data({ bid: e.bid, image: e.image, code: e.codes, vendorlinks: c });
        WW.IB.ALL.dialogBoardEmbed.dialog("open");
        var d = $j("#ib-embed-dialog");
        if (WW.IB.saved()) {
            d.addClass("saved");
        } else {
            d.removeClass("saved");
        }
        b.find("select[name=width]").val("750").trigger("change");
    });

    $j("#ib-overall-controls-save").click(function () {
        WW.IB.saveState();
    });
    $j('<div id="ib-controls-hover-drag"><img id="ib-move-button" title="move image to another cell" src="http://wwcdn.weddingwire.com/static/8.4.91/images/wedding/inspirationboardNew/move.png"/></div><div id="ib-controls-hover"><img id="ib-zoom-button" title="resize image" src="http://wwcdn.weddingwire.com/static/8.4.91/images/wedding/inspirationboardNew/zoom.png"/><img id="ib-clear-button" title="clear cell" src="http://wwcdn.weddingwire.com/static/8.4.91/images/wedding/inspirationboardNew/clear.png"/></div><div id="image_clone"></div><div id="mask1" class="lightbox_bg"></div><div id="mask2" class="lightbox_bg"></div><div id="mask3" class="lightbox_bg"></div><div id="mask4" class="lightbox_bg"></div><div id="ib-controls"><div id="ib-zoom-slider"></div><a href="#" onclick="WW.IB.zoomCancel();" class="cancelButton">Cancel</a> <a href="#" onclick="WW.IB.zoomUpdate();" class="btn-primary ui-button ui-widget ui-state-default ui-corner-all">Save</a></div>').appendTo("body");
    $j("#ib-zoom-slider").slider({
        slide: function (b, c) {
            WW.IB.resetImg($j("#image_clone img"), $j("#ib-cell-root .selected").closest("div"), 1 + (c.value / 100));
        }
    });
    $j("#ib-clear-button").click(function (c) {
        var b = $j("#ib-container div.hovered");
        $j("#ib-controls-hover").hide();
        $j("#ib-controls-hover-drag").hide();
        WW.IB.divInit(b, { height: b.height(), width: b.width(), type: "EMPTY" });
    });
    $j("#ib-zoom-button").click(function (c) {
        var b = $j("#ib-container div.hovered img");
        $j("#ib-cell-root .selected").removeClass("selected");
        b.addClass("selected");
        WW.IB.zoomStart();
    });
    $j("#ib-controls-hover-drag").draggable({
        scope: "images", cursorAt: { left: 20, top: 20 }, helper: function () {
            var c = $j("#ib-container div.hovered img");
            var f = $j("<img></img>").attr("src", c.attr("src")).data({ wwData: c.data("wwData") }).hide().appendTo("body");
            var e = 100 * f.height() / f.width();
            var b = 100;
            var d = 100;
            var g = 100 * f.width() / f.height();
            if (100 < e) {
                f.height(e);
                f.width(b);
            } else {
                f.height(d);
                f.width(g);
            }
            return f.show();
        }
    });
    this.divInit($j("#ib-cell-root"), data);
    this.saved(true);
    window.onbeforeunload = function () {
        if (!WW.IB.saved()) {
            return "If you leave you will lose unsaved changes to your Inspiration Board.";
        }
    };
    WW.IB.dialogStarted = $j("#ib-dialog-started").dialog({ width: 500, title: "Get Started" });
    WW.IB.dialogUpload = $j("#ib-dialog-upload").dialog({
        width: 400, title: "Upload Photo", open: function (c, d) {
            hideDivErr("ib-dialog-upload");
            $j("#imagefile1").val("");
            var b = $j("#ib-cell-root .empty").length;
            if (b === 0) {
                WW.IB.dialogUpload.dialog("close");
                showConfirmationDialogAlertWithTitleNew("You need to remove an image in order to upload to this board.", "Board Full");
            }
        }
    });
    $j("#ib-dialog-upload-form").submit(function () {
        hideDivErr("ib-dialog-upload");
        $j(this).ajaxSubmit({ iframe: true, dataType: "json", beforeSubmit: WW.IB.dialogUploadValidate, success: WW.IB.dialogUploadReturn, clearForm: true, resetForm: true });
        return false;
    });
    WW.IB.dialogEdit = $j("#ib-dialog-edit").dialog({
        width: 400, open: function (c, d) {
            var b = $j("#ib-dialog-edit-description");
            var f = $j("#ib-dialog-edit-name");
            var e = $j("#ib-dialog-edit-publicFlag");
            b.val(b.data("default"));
            f.val(f.data("default"));
            e.prop("checked", e.data("default"));
            WW.IB.dialogEdit.dialog("option", "title", "Settings: " + f.val());
            hideDivErr("ib-dialog-edit");
        }
    });
    $j("#ib-dialog-edit-form").submit(function () {
        hideDivErr("ib-dialog-edit");
        var b = $j("#ib-dialog-edit-description");
        var g = $j("#ib-dialog-edit-name");
        var d = $j("#ib-dialog-edit-publicFlag");
        var c = g.val();
        var f = b.val();
        var e = d.prop("checked");
        if (c === null || $j.trim(c).length === 0) {
            showDivErr("ib-dialog-edit", "Board name is required.");
            return false;
        }
        WW.IB.dialogEdit.dialog("close");
        InspirationBoardNew.updateBoardDetails($j("#ib-dialog-edit-form").data("bid"), c, f, e, function (j) {
            if (j) {
                var i = $j("#ib-overall-controls");
                var h = (e && i.data("wedpublic"));
                i.removeClass("public-false public-true").addClass("public-" + h);
                $j("#ib-name").text(c);
                g.data("default", c);
                b.data("default", f);
                d.data("default", e);
            }
        });
        return false;
    });
    $j("#ib-dialog-edit-goaway").change(function () {
        if ($j(this).prop("checked")) {
            WW.localStorage.setItem(WW.localStorage.nameIBStarted, "goaway");
        } else {
            WW.localStorage.removeItem(WW.localStorage.nameIBStarted);
        }
    });
    if (WW.localStorage.getItem(WW.localStorage.nameIBStarted) != "goaway") {
        WW.IB.dialogStarted.dialog("open");
    }
};

WW.IB.dialogUploadValidate = function (d, c, b) {
    var a = $j("#ib-cell-root .empty").length;
    if (a === 0) {
        showDivErr("ib-dialog-upload", "You need to remove an image in order to upload to this board.");
        return false;
    } else {
        WW.IB.dialogUpload.dialog("close");
        showDialogLoadingPanel("Uploading your photo");
    }
};
WW.IB.dialogUploadReturn = function (c) {
    hideDialogLoadingPanel();
    if (c !== null) {
        if (c.code == "1") {
            for (var b = 0; b < c.images.length; b++) {
                var a = $j("#ib-cell-root .empty");
                if (a.length > 0) {
                    a = a.first();
                    var d = { height: a.height(), width: a.width(), type: "IMAGE", wwData: { zoom: 1, scrapbookItemId: c.images[b].scapbook_item_id, img: c.images[b].image_asset_urls.image_600x600_url } };
                    WW.IB.divInit(a, d);
                }
            }
        } else {
            WW.IB.dialogUpload.dialog("open");
            showDivErr("ib-dialog-upload", convertErrorCodeToMsg(c.code));
        }
    }
};

WW.IB.zoomStart = function () {
    var a = $j("#ib-cell-root .selected");
    var b = a.parent();
    $j("#ib-zoom-slider").slider("option", "value", (a.data("wwData").zoom - 1) * 100);
    $j("#image_clone").empty().append(a.clone().data("wwData", a.data("wwData")).draggable({ stop: a.draggable("option", "stop"), containment: a.draggable("option", "containment") })).css({ top: b.offset().top, left: b.offset().left });
    $j("#mask1").css({ top: b.offset().top, left: 0, width: b.offset().left, height: b.height() });
    $j("#mask2").css({ top: 0, left: 0, height: b.offset().top, width: $j(document).width() });
    $j("#mask3").css({ top: b.offset().top, left: b.offset().left + b.width(), height: b.height() });
    $j("#mask4").css({ top: b.offset().top + b.height(), left: 0, width: $j(document).width() });
    $j("#ib-controls").css({ top: b.offset().top + b.height() + 10, left: (b.offset().left + b.width() / 2) - ($j("#ib-controls").width() / 2) });
    $j("#image_clone,#mask1,#mask2,#mask3,#mask4,#ib-controls").show();
};
WW.IB.zoomCancel = function () {
    $j("#image_clone,#mask1,#mask2,#mask3,#mask4,#ib-controls").hide();
};
WW.IB.zoomUpdate = function () {
    var a = $j("#image_clone img");
    var b = $j("#ib-cell-root .selected");
    b.css({ top: a.position().top, left: a.position().left, width: a.width(), height: a.height() }).data("wwData", a.data("wwData"));
    WW.IB.resetImg(b, b.closest("div"), b.data("wwData").zoom);
    $j("#image_clone,#mask1,#mask2,#mask3,#mask4,#ib-controls").hide();
    this.saved(false);
};
WW.IB.resetImg = function (b, i, l) {
    var c = $j("<img></img>").attr("src", b.attr("src")).hide().appendTo("body");
    var h = i.width() * c.height() / c.width();
    var e = i.width();
    var d = i.height();
    var j = i.height() * c.width() / c.height();
    c.remove();
    if (i.height() < h) {
        b.height(h * l);
        b.width(e * l);
    } else {
        b.height(d * l);
        b.width(j * l);
    }
    var a = [i.offset().left - (b.width() - i.width()), i.offset().top - (b.height() - i.height()), i.offset().left, i.offset().top];
    var g = 0;
    var f = 0;
    if (b.offset().left < a[0]) {
        g = a[0] - b.offset().left;
    }
    if (b.offset().top < a[1]) {
        f = a[1] - b.offset().top;
    }
    b.offset({ left: (b.offset().left + g), top: (b.offset().top + f) });
    var k = b.data("wwData");
    k.zoom = l;
    b.draggable("option", "containment", a).data("wwData", k);
};
WW.IB.imgError = function (b) {
    var a = b.closest(".ib-cell");
    var c = { height: a.height(), width: a.width(), type: "EMPTY" };
    WW.IB.divInit(a, c);
    $j("#ib-controls-hover,#ib-controls-hover-drag").hide();
};
WW.IB.divInit = function (h, i) {
    this.saved(false);
    var g = {
        tolerance: "pointer", scope: "images", hoverClass: "drophover", drop: function (k, m) {
            var n = $j(this);
            var l = m.helper.data("wwData");
            if (n.find("img").attr("src") != l.img) {
                $hovered = $j("#ib-cell-root .hovered img");
                if ($hovered.length > 0 && $hovered.attr("src") == l.img) {
                    $movedFrom = $hovered.closest(".ib-cell");
                    WW.IB.divInit($movedFrom, { height: $movedFrom.height(), width: $movedFrom.width(), type: "EMPTY" });
                }
                WW.IB.divInit(n, { height: n.height(), width: n.width(), type: "IMAGE", wwData: m.helper.data("wwData") });
            }
        }
    };
    h.empty().addClass("ib-cell").removeClass("empty").css({ "height": i.height, "width": i.width });
    if ("IMAGE" == i.type) {
        if (WW.IB.isEdit()) {
            var a = $j('<img src="' + i.wwData.img + '" onerror="WW.IB.imgError($j(this));"/>').css("visibility", "hidden").data({ wwData: i.wwData }).draggable({
                stop: function (m, n) {
                    var q = parseInt(a.css("top"), 10);
                    var p = parseInt(a.css("left"), 10);
                    var o = a.closest("div");
                    if (q > 0) {
                        a.css("top", 0);
                    } else {
                        var k = -(a.height() - o.height());
                        if (q < k) {
                            a.css("top", k);
                        }
                    }
                    if (p > 0) {
                        a.css("left", 0);
                    } else {
                        var l = -(a.width() - o.width());
                        if (p < l) {
                            a.css("left", l);
                        }
                    }
                    WW.IB.saved(false);
                }
            });
            h.append($j('<div class="ib-cell-img-container"></div>').width(h.width()).height(h.height()).append(a));
            a.bind("imgpreload", function () {
                if (typeof (i.imgHeight) != "undefined") {
                    a.height(i.imgHeight);
                    a.width(i.imgWidth);
                    a.css("left", i.imgLeft);
                    a.css("top", i.imgTop);
                }
                WW.IB.resetImg(a, h, i.wwData.zoom);
                a.css("visibility", "visible");
            });
            a.dblclick(function () {
                $j("#ib-cell-root .selected").removeClass("selected");
                $j(this).addClass("selected");
                WW.IB.zoomStart();
            });
            a.mousedown(function () {
                var l = $j("#ib-controls-hover").hide();
                var k = $j("#ib-controls-hover-drag").hide();
                $j("#ib-cell-root .hovered").removeClass("hovered");
                h.addClass("hovered");
                l.css({ top: h.offset().top, left: h.offset().left }).show();
                k.css({ top: h.offset().top, left: h.offset().left + h.width() - k.outerWidth() }).show();
            });
            a.trigger("mousedown");
            h.droppable(g);
        } else {
            if (i.wwData.portfolioItemId !== undefined) {
                h.append($j('<div class="citation"><span class="strong">Photo submitted by: </span>' + i.wwData.vendorName + "</div>")).hover(function () {
                    var k = h.find(".citation");
                    k.css({ width: h.width(), top: h.offset().top + h.height() - k.height(), left: h.offset().left });
                    k.show();
                }, function () {
                    h.find(".citation").hide();
                });
                var f = h.find(".citation").click(function () {
                    window.open(i.wwData.vendorUrl, "_blank");
                });
            }
        }
    } else {
        if (("VSPLIT" == i.type || "HSPLIT" == i.type) && i.children.length == 2) {
            var e = $j("<div></div>");
            var c = $j("<div></div>");
            if ("HSPLIT" == i.type) {
                c.addClass("divider hsplit").css({ "width": i.width, "height": 6 });
            } else {
                c.addClass("divider vsplit").css({ "width": 6, "height": i.height });
            }
            var d = $j("<div></div>");
            h.append(e).append(c).append(d);
            this.divInit(e, i.children[0]);
            this.divInit(d, i.children[1]);
        } else {
            if (WW.IB.isEdit()) {
                var j = $j("<div></div>").addClass("msg");
                j.append("<div>divide this cell <a href='#' onclick='WW.IB.cellSplit(this,true);'>top/bottom</a></div>");
                j.append("<div>divide this cell <a href='#' onclick='WW.IB.cellSplit(this,false);'>left/right</a></div>");
                if (h.siblings().length > 0) {
                    h.attr("stu", new Date().getTime());
                    var b = $j(h.parent(".ib-cell").children().first()).attr("stu") == $j(h.get()).attr("stu");
                    h.attr("stu", "");
                    if (h.siblings(".hsplit").length == 1) {
                        if (b) {
                            j.append("<div><a href='#' onclick='WW.IB.cellMerge(this);'>merge down</a></div>");
                        } else {
                            j.append("<div><a href='#' onclick='WW.IB.cellMerge(this);'>merge up</a></div>");
                        }
                    } else {
                        if (h.siblings(".vsplit").length == 1) {
                            if (b) {
                                j.append("<div><a href='#' onclick='WW.IB.cellMerge(this);'>merge right</a></div>");
                            } else {
                                j.append("<div><a href='#' onclick='WW.IB.cellMerge(this);'>merge left</a></div>");
                            }
                        }
                    }
                }
                h.append(j).addClass("empty");
                h.droppable(g);
            }
        }
    }
};
WW.IB.cellMergeRecur = function (b, e, a) {
    if (!b.hasClass("hsplit")) {
        b.css("height", b.height() + a);
    }
    if (!b.hasClass("vsplit")) {
        b.css("width", b.width() + e);
    }
    if (b.children(".ib-cell-img-container").length > 0) {
        b.children(".ib-cell-img-container").width(b.width()).height(b.height());
    }
    $imgs = b.children(".ib-cell-img-container").first().children("img");
    if ($imgs.length > 0) {
        WW.IB.resetImg($imgs.first(), b, $imgs.first().data("wwData").zoom);
    }
    if (!b.hasClass("divider") && !b.hasClass("empty")) {
        var d = b.children(".divider,.ib-cell");
        if (b.children(".hsplit").length > 0) {
            a = a / 2;
        } else {
            e = e / 2;
        }
        for (var c = 0;
        c < d.length; c++) {
            this.cellMergeRecur($j(d.get(c)), e, a);
        }
    }
};
WW.IB.cellMerge = function (e, b) {
    $j("#ib-controls-hover-drag,#ib-controls-hover").hide();
    var d = $j(e).closest(".ib-cell");
    var g = d.parent();
    var c = d.siblings(".ib-cell");
    var a = 0;
    var f = 0;
    if (g.children(".hsplit").length > 0) {
        a = d.height() + 6;
    } else {
        f = d.width() + 6;
    }
    c.prop("id", g.prop("id")).data("bid", g.data("bid"));
    g.replaceWith(c);
    this.cellMergeRecur(c, f, a);
    if (c.children(".msg").length > 0) {
        var h = { height: c.height(), width: c.width(), type: "EMPTY" };
        this.divInit(c, h);
    }
    this.saved(false);
    c.find("img").trigger("mousedown");
};
WW.IB.cellSplit = function (c, a) {
    var b = $j(c).closest(".ib-cell");
    b.droppable("destroy");
    var d = { height: b.height(), width: b.width(), children: [{ type: "EMPTY" }, { type: "EMPTY" }] };
    if (a) {
        d.type = "HSPLIT";
        d.children[0].height = d.children[1].height = (d.height - 6) / 2;
        d.children[0].width = d.children[1].width = d.width;
        if (d.children[0].height != parseInt(d.children[0].height, 10)) {
            d.children[0].height = parseInt(d.children[0].height, 10);
            d.children[1].height = parseInt(d.children[1].height, 10) + 1;
        }
    } else {
        d.type = "VSPLIT";
        d.children[0].height = d.children[1].height = d.height;
        d.children[0].width = d.children[1].width = (d.width - 6) / 2;
        if (d.children[0].width != parseInt(d.children[0].width, 10)) {
            d.children[0].width = parseInt(d.children[0].width, 10);
            d.children[1].width = parseInt(d.children[1].width, 10) + 1;
        }
    }
    this.divInit(b, d);
};
WW.IB.isEdit = function (a) {
    return $j("#ib-overall-controls-save").length > 0;
};
WW.IB.saved = function (a) {
    if (!WW.IB.isEdit()) {
        return;
    }
    if (typeof (a) !== "boolean") {
        return $j("#ib-overall-controls-save").hasClass("disabled");
    } else {
        if (a) {
            $j("#ib-overall-controls-save").addClass("disabled");
            $j("#ib-overall-controls").removeClass("ready-false ready-true");
            if ($j("#ib-cell-root img").length === 0) {
                $j("#ib-overall-controls").addClass("ready-false");
            } else {
                $j("#ib-overall-controls").addClass("ready-true");
            }
        } else {
            $j("#ib-overall-controls-save").removeClass("disabled");
        }
    }
    $j("#ib-overall-controls-save").removeClass("blueButtonNew").addClass("blueButtonNew");
};
WW.IB.saveState = function () {
    var b = $j.toJSON(WW.IB.saveStateRecur($j("#ib-cell-root")));
    var a = [];
    var f = [];
    var d = $j("#ib-cell-root img");
    for (var c = 0; c < d.length; c++) {
        var e = $j(d.get(c)).data("wwData");
        if (e.portfolioItemId !== undefined) {
            a[a.length] = e.portfolioItemId;
        } else {
            f[f.length] = e.scrapbookItemId;
        }
    }
    debugger;
    InspirationBoardNew.saveBoard($j("#ib-main-container").data("bid"), b, a, f, WW.IB.saveStateReturn);
};
WW.IB.saveStateReturn = function (a) {
    if (a) {
        var b = $j("#ib-main-container").data("image");
        b["220"] = a.profilePicturePath;
        b["400"] = a.picturePath400;
        b["600"] = a.picturePath600;
        b["750"] = a.picturePath750;
        $j("#ib-main-container").data("image", b);
        WW.IB.saved(true);
    } else {
        showConfirmationDialogAlertWithTitleNew("Sorry! Your request could not be completed at this time.<br/>Please try again at a later time.", "Temporary Server Error");
    }
};
WW.IB.saveStateRecur = function (a) {
    var e = { height: a.height(), width: a.width() };
    if (a.children(".ib-cell-img-container").length == 1) {
        e.type = "IMAGE";
        var d = a.children(".ib-cell-img-container").children("img");
        e.wwData = d.data("wwData");
        e.imgLeft = parseInt(d.css("left"), 10);
        e.imgTop = parseInt(d.css("top"), 10);
        e.imgHeight = d.height();
        e.imgWidth = d.width();
        e.height = a.height();
        e.width = a.width();
    } else {
        if (a.children(".divider").length == 1) {
            if (a.children(".vsplit").length == 1) {
                e.type = "VSPLIT";
            } else {
                e.type = "HSPLIT";
            }
            e.children = [];
            var c = a.children(".ib-cell");
            for (var b = 0; b < c.length; b++) {
                e.children[b] = this.saveStateRecur($j(c.get(b)));
            }
        } else {
            e.type = "EMPTY";
        }
    }
    return e;
};
WW.registerNS("WW.IB.ALL");
WW.IB.initEmbed = function () {
    WW.IB.ALL.dialogBoardEmbed = $j("#ib-embed-dialog").dialog({ width: 500 });
    $j("#ib-embed-dialog-form select[name=width]").change(function () {
        var b = $j("#ib-embed-dialog-form").data();
        var a = b.code.replace("$bid", b.bid).replace("$image", b.image[$j(this).val()]).replace("$size", $j(this).val()).replace("$vendorLinks", b.vendorlinks);
        $j("#ib-embed-dialog-form textarea[name=code]").val(a).focus().select();
    });
};
//WW.IB.initNew = function () {
//    WW.IB.ALL.dialogBoardNew = $j("#ib-new-dialog").dialog({ width: 400, title: "Create New Board" });
//    $j("#ib-new-dialog-templates input[name=template]").change(function () {
//        $j("#ib-new-dialog-preview").removeClass("t1 t2 t3 t4").addClass("t" + $j(this).val());
//    });
//};
//WW.IB.ALL.init = function () {
//    WW.IB.ALL.dialogBoardEdit = $j("#ib-edit-dialog").dialog({ width: 400 });
//    WW.IB.initEmbed();
//    WW.IB.initTitle();
//    WW.IB.initNew();
//    $j(".addthis_button_email.at300b").live("click", function () {
//        var a = $j(this).closest(".board").data();
//        addthis_share.email_vars.vendor_urls = a.vendorlinks.replace("<div>", "<div>Photos by: ");
//    });
//    $j("#ib-create-new-board").click(function () {
//        $j("#ib-new-dialog-form .ww-error").hide();
//        $j("#nameNew,#descriptionNew").val("");
//        $j("#publicFlagNew,#ib-new-dialog-template1").prop("checked", true);
//        $j("#ib-new-dialog-template1").trigger("change");
//        WW.IB.ALL.dialogBoardNew.dialog("open");
//    });
//    $j("#ib-boards .edit").click(function () {
//        var b = $j(this).closest(".board").data();
//        WW.IB.ALL.dialogBoardEdit.dialog("option", "title", "Settings: " + b.name);
//        var a = $j("#ib-edit-dialog-form");
//        a.find(".ww-error").hide();
//        a.find("input[name=bid]").val(b.bid);
//        a.find("input[name=old]").val(b.oldflag);
//        a.find("input[name=name]").val(b.name);
//        a.find("textarea[name=description]").val(b.description);
//        a.find("input[name=publicFlag]").prop("checked", b.publicflag);
//        WW.IB.ALL.dialogBoardEdit.dialog("open");
//    });
//    $j("#ib-boards .delete").click(function () {
//        var b = $j(this).closest(".board").data();
//        var a = $j("#ib-delete-dialog-form");
//        a.find("input[name=bid]").val(b.bid);
//        a.find("input[name=old]").val(b.oldflag);
//        setConfirmationDialogCallbackNew(function () {
//            a.submit();
//        });
//        setConfirmationDialogWidthNew("400px");
//        setConfirmationDialogHeaderNew("Delete Board - " + b.name);
//        showConfirmationDialogNew("This board, along with all of its comments, will be deleted. Are you sure you want to delete this board?");
//    });
//    $j("#ib-boards .embed").click(function () {
//        var b = $j(this).closest(".board").data();
//        WW.IB.ALL.dialogBoardEmbed.dialog("option", "title", "Embed: " + b.name);
//        $j("#ib-embed-dialog-preview").css("background-image", "url(" + b.image["220"] + ")");
//        var a = $j("#ib-embed-dialog-form");
//        a.data({ bid: b.bid, image: b.image, code: $j("#ib-boards").data("codes"), vendorlinks: b.vendorlinks });
//        WW.IB.ALL.dialogBoardEmbed.dialog("open");
//        a.find("select[name=width]").val("750").trigger("change");
//    });
//    $j("#ib-boards .share-container").hover(function (b) {
//        $j(".board .addthis_toolbox:visible").hide();
//        var a = $j(this).children(".share");
//        a.siblings(".addthis_toolbox").css({ top: a.offset().top + a.height(), left: a.offset().left }).show();
//    }, function (a) {
//        $j(".board .addthis_toolbox:visible").hide();
//    });
//    $j("#ib-new-dialog-form,#ib-edit-dialog-form").submit(function () {
//        var b = $j(".ww-error", this).is(":visible");
//        if (this.name.value.trim().length === 0) {
//            $j(".ww-error", this).text("You must have a name to create a board.").show();
//        } else {
//            if (this.name.value.length > 50) {
//                $j(".ww-error", this).text("Please limit the board name to 50 characters.").show();
//            } else {
//                return true;
//            }
//        }
//        if (!b) {
//            var a = $j(this).find(".blueButtonNew");
//            a.removeClass("blueButtonNew");
//            setTimeout(function () {
//                a.addClass("blueButtonNew");
//            }, 100);
//        }
//        return false;
//    });
//};
//WW.registerNS("WW.IB.GALLERY");
//WW.IB.GALLERY.init = function () {
//    initLoginPanel();
//    WW.IB.initNew();
//    WW.IB.dialogBrowse = $j("#ib-dialog-browse").dialog({
//        width: 775, title: "Inspiration Board Browser", open: function (a, b) {
//            $j("#ib-dialog-browse div.ww-error").hide();
//            $j("#ib-dialog-browse div.hasEmpty.strong").removeClass("strong");
//        }
//    });
//    $j("#ib-create-new-board").click(function () {
//        WW.IB.ALL.dialogBoardNew.dialog("open");
//    });
//    WW.IB.ALL.dialogBoardNew.dialog({
//        open: function (a, b) {
//            WW.IB.dialogBrowse.dialog("close");
//            $j("#ib-new-dialog-form div.ww-error").hide();
//            $j("#nameNew,#descriptionNew").val("");
//            $j("#publicFlagNew,#ib-new-dialog-template1").prop("checked", true);
//            $j("#ib-new-dialog-template1").trigger("change");
//        }
//    });
//    $j("#ib-dialog-browse div.hasEmpty").live("click", function () {
//        $j("#ib-dialog-browse div.hasEmpty.strong").removeClass("strong");
//        $j(this).addClass("strong");
//    });
//    $j("#ib-dialog-browse-submit").click(function () {
//        var b = $j("#ib-dialog-browse div.hasEmpty.strong");
//        if (b.length === 0) {
//            $j("#ib-dialog-browse div.ww-error").text("You must select an Inspiration Board to add this photo to.").show();
//            if (WW.isMSIE) {
//                $j("#ib-dialog-browse-submit").removeClass("blueButtonNew").addClass("blueButtonNew");
//            }
//        } else {
//            $j("#ib-dialog-browse div.ww-error").hide();
//            var c = $j("#ib-dialog-browse").data();
//            var a = b.data("bid");
//            if (b.data("oldflag")) {
//                InspirationBoard.addGalleryPhoto(c.itemId, c.vid, c.filename, a, ((667 / 3) * (Math.floor((3) * Math.random()))) + 30, ((667 / 3) * (Math.floor((3) * Math.random()))) + 30, 0, -1, WW.IB.GALLERY.addPhotoReturn);
//            } else {
//                InspirationBoardNew.addPhoto(a, c.itemId, WW.IB.GALLERY.addPhotoReturn);
//            }
//            WW.IB.dialogBrowse.dialog("close");
//        }
//    });
//    $j("#ib-new-dialog-form").submit(function () {
//        var b = $j(".ww-error", this).is(":visible");
//        if (this.name.value.trim().length === 0) {
//            $j(".ww-error", this).text("You must have a name to create a board.").show();
//        } else {
//            if (this.name.value.length > 50) {
//                $j(".ww-error", this).text("Please limit the board name to 50 characters.").show();
//            } else {
//                InspirationBoardNew.createBoardAddPhoto(this.name.value, this.description.value, this.publicFlag.checked, $j(this.template).val(), $j("#ib-add-to-board").data("pid"), WW.IB.GALLERY.createBoardReturn);
//                WW.IB.ALL.dialogBoardNew.dialog("close");
//            }
//        }
//        if (!errorVisible) {
//            var a = $j(this).find(".blueButtonNew");
//            a.removeClass("blueButtonNew");
//            setTimeout(function () {
//                a.addClass("blueButtonNew");
//            }, 100);
//        }
//        return false;
//    });
//};
//WW.IB.GALLERY.addPhotoReturn = function (b) {
//    setConfirmationDialogToOk();
//    if (b) {
//        var a = $j("#ib-dialog-browse div.hasEmpty.strong");
//        a.find("img").attr("src", b.profilePicturePath);
//        if (b.full) {
//            a.removeClass("strong hasEmpty").attr("title", "This board is full, please remove an image in order to add a new one.");
//        }
//        showConfirmationDialogAlertNew("Photo added your your Inspiration Board Successfully.");
//    } else {
//        showConfirmationDialogAlertNew("There was an error adding this image to your board.");
//    }
//};
//WW.IB.GALLERY.createBoardReturn = function (a) {
//    setConfirmationDialogToOk();
//    if (a) {
//        var b = '<div class="board boardOld-false hasEmpty" title="' + a.descriptionText + '" data-bid="' + a.boardIdEncrypt + '" data-oldflag="false"><img src="' + a.profilePicturePath + '"/><span>' + a.name + "</span></div>";
//        $j("#ib-boards").prepend(b);
//        setConfirmationDialogHeaderNew("Board Created");
//        showConfirmationDialogAlertNew("Inspiration Board Created Successfully<br/> Go to My Wedding > Inspiration Boards to see your board!");
//    } else {
//        showConfirmationDialogAlertNew("There was an error creating your board and adding this image to it.");
//    }
//};
