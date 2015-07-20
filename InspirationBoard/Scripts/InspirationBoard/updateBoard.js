var IB = IB || {};
IB.modules = IB.modules || {};

IB.modules.UpdateBoard = (function () {
    var self = this;

    /* private variable */
    var _private = {
        container: "#ww-canvas-body-table"
    }
    /* model to binding */
    var _model = {
        Id: ko.observable(''),
        Title: ko.observable(''),
        Description: ko.observable(''),
        BoardStructure: ko.observable(''),
        IsUpdatingBoard: ko.observable(false),
    };

    /* private methods */
    var imageStripsType = 0; // 0: Galary, 1: My photos
    var saveMyBoard = function () {
        saveState();
        _model.IsUpdatingBoard(true);
        data = ko.toJSON(_model);
        $.ajax(
            {
                url: "/InspirationBoard/SaveBoardItem",
                type: "POST",
                data: data,
                datatype: "json",
                processData: false,
                contentType: "application/json; charset=utf-8",
                success: function (r) {
                    saved(true);
                    console.log(r);
                    _model.IsUpdatingBoard(false);
                },
                error: function (err) {
                    console.log(err);
                    _model.IsUpdatingBoard(false);
                }
            });
    }
    var imgStripUpdate = function () {

        $("#ib-photo-strip").removeClass("loaded").addClass("loading");
        if ($("#ib-nav").hasClass("gallery")) {
            getImageStrip(imageStripsType, 0, 30);
        } else {
            getImageStrip(imageStripsType, 0, 30);
        }
    };
    var getImageStrip = function (type, pageIndex, pageSize) {
        $.getJSON("/InspirationBoard/GetStripImages?type=" + type + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize, function (data) {
            newImgStripUpdateReturn(data, undefined);
        });
    }
    var newImgStripUpdateReturn = function (data, f) {
        if (f === undefined) {
            $("#ib-nav").removeClass("my").addClass("gallery");
        } else {
            $("#ib-nav").removeClass("gallery").addClass("my");
            if (f == "recent") {
                $("#ib-photo-strip-header-my").removeClass("all").addClass("used");
            } else {
                $("#ib-photo-strip-header-my").removeClass("used").addClass("all");
            }
        }
        var d = $("#ib-photo-strip").data("page");
        var h = (d * 14) + 1;
        if (d % 2 !== 0) {
            data.images = data.images.slice(14);
        } else {
            data.images = data.images.slice(0, 14);
        }
        var g = h - 1 + data.images.length;
        if (data.images.length === 0) {
            $("#ib-photo-strip-countPage").text(0);
        } else {
            $("#ib-photo-strip-countPage").text(h + "-" + g);
        }
        $("#ib-photo-strip-countTotal").text(data.total_image_count);
        var k = $("#ib-photo-strip-images-imgs");
        if (data.images.length === 0) {
            if ($("#ib-nav").hasClass("gallery")) {
                k.html("<span class='redText'>No photos found. Please try different criteria.<span>");
            } else {
                k.html("<span class='redText'>No photos found.<span>");
            }
        } else {
            k.empty();
            for (var b = 0; b < data.images.length; b++) {
                var c = data.images[b];
                var e;
                e = $('<span><img id="' + c.image_id + '" src="' + c.thumbnail_url + '" class="source-img"/></span>');
                e.find("img").data({ wwData: { portfolioItemId: c.image_id, vendorName: c.vendor_name, vendorUrl: c.storefront_url, img: c.image_url, zoom: 1 } });

                k.append(e);
            }
        }
        $("#ib-photo-strip-images-prev").css("visibility", function (i, l) {
            if (d !== 0) {
                return "visible";
            } else {
                return "hidden";
            }
        });
        $("#ib-photo-strip-images-next").css("visibility", function (i, l) {
            if (d + 1 < Math.ceil(data.total_image_count / 12)) {
                return "visible";
            } else {
                return "hidden";
            }
        });
        $("#ib-photo-strip .source-img").draggable({
            scope: "images", start: function () {
                $("#ib-photo-preview").remove();
            }, helper: function () {
                var i = $(this);
                return $('<img class="source-img"></img>').attr("src", i.attr("src")).data({ wwData: i.data("wwData") });
            }
        }).each(function () {
            var i = $(this);
            i.closest("span").hover(function () {
                if ($("img.ui-draggable-dragging").length === 0) {
                    var l = $(this);
                    $('<div id="ib-photo-preview"><img src="' + i.data("wwData").img + '"/><div class="normalText">Photo by <a target="_blank" href="' + i.data("wwData").vendorUrl + '">' + i.data("wwData").vendorName + "</a></div></div>").css({ top: i.offset().top + i.height(), left: i.offset().left }).appendTo(l);
                }
            }, function () {
                $(this).children("div").remove();
            });
        }).attr("title", "Drag, and drop this photo to add it to your inspiration board.");
        $("#ib-photo-strip").removeClass("loading").addClass("loaded");
    }
    var getVendorLinks = function () {
        var a = "";
        var b = {};
        $("#ib-cell-root .ib-cell img").each(function () {
            var c = $(this).data("wwData");
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
    var initEdit = function (data) {


        $("#ib-photo-strip-images-next").click(function () {
            $("#ib-photo-strip").data("page", $("#ib-photo-strip").data("page") + 1);
            imgStripUpdate();
        });
        $("#ib-photo-strip-images-prev").click(function () {
            $("#ib-photo-strip").data("page", $("#ib-photo-strip").data("page") - 1);
            imgStripUpdate();
        });
        $("#ib-nav .ib-photo-strip-update").click(function () {
            var currentTab = ($(this).attr("id"));
            switch (currentTab) {
                case "tab1u":
                    $("#tab2s").hide();
                    $("#tab2u").show();
                    $("#tab1u").hide();
                    $("#tab1s").show();
                    imageStripsType = 0;
                    break;
                case "tab2u":
                    $("#tab1s").hide();
                    $("#tab1u").show();
                    $("#tab2u").hide();
                    $("#tab2s").show();
                    imageStripsType = 1;
                    break;
                default:
                    break;

            }
            $("#ib-photo-strip").data("page", 0);
            imgStripUpdate();
        });
        $("#ib-nav .ib-photo-strip-update").first().trigger("click");
        $("#ib-overall-controls-print-fake").closest("a").click(function (b) {
            $("#ib-preview-print").remove();
            $('<span id="ib-preview-print"><span class="strong">' + $("#ib-dialog-edit-name").data("default") + "</span><br/><span>" + $("#ib-dialog-edit-description").data("default") + '</span><br/><br/><img src="' + $("#ib-main-container").data("image")["750"] + '"/></span>').appendTo("body");
            $("#ib-preview-print img").bind("imgpreload", function () {
                $("#ib-overall-controls-print").trigger("click");
            });
        });
        $(".addthis_button_email.ready-true.public.at300b").live("click", function () {
            var b = getVendorLinks();
            addthis_share.email_vars.vendor_urls = "Photos by: " + b;
        });
        $("#ib-overall-controls-embed").click(function () {
            var e = $("#ib-main-container").data();
            IB.ALL.dialogBoardEmbed.dialog("option", "title", "Embed: " + $("#ib-dialog-edit-name").data("default"));
            $("#ib-embed-dialog-preview").css("background-image", "url(" + e.image["220"] + ")");
            var b = $("#ib-embed-dialog-form");
            var c = getVendorLinks();
            b.data({ bid: e.bid, image: e.image, code: e.codes, vendorlinks: c });
            IB.ALL.dialogBoardEmbed.dialog("open");
            var d = $("#ib-embed-dialog");
            if (saved()) {
                d.addClass("saved");
            } else {
                d.removeClass("saved");
            }
            b.find("select[name=width]").val("750").trigger("change");
        });

        $("#ib-overall-controls-save").click(function () {
            saveMyBoard();
        });
        $('<div id="ib-controls-hover-drag"><img id="ib-move-button" title="move image to another cell" src="/Content/InspirationBoard/move.png"/></div><div id="ib-controls-hover"><img id="ib-zoom-button" title="resize image" src="/Content/InspirationBoard/zoom.png"/><img id="ib-clear-button" title="clear cell" src="/Content/InspirationBoard/clear.png"/></div><div id="image_clone"></div><div id="mask1" class="lightbox_bg"></div><div id="mask2" class="lightbox_bg"></div><div id="mask3" class="lightbox_bg"></div><div id="mask4" class="lightbox_bg"></div><div id="ib-controls"><div id="ib-zoom-slider"></div><a href="#_" onclick="IB.zoomCancel();" class="cancelButton">Cancel</a> <a href="#_" onclick="IB.zoomUpdate();" class="btn-primary ui-button ui-widget ui-state-default ui-corner-all">Save</a></div>').appendTo("body");
        $("#ib-zoom-slider").slider({
            slide: function (b, c) {
                resetImg($("#image_clone img"), $("#ib-cell-root .selected").closest("div"), 1 + (c.value / 100));
            }
        });
        $("#ib-clear-button").click(function (c) {
            var b = $("#ib-container div.hovered");
            $("#ib-controls-hover").hide();
            $("#ib-controls-hover-drag").hide();
            divInit(b, { height: b.height(), width: b.width(), type: "EMPTY" });
        });
        $("#ib-zoom-button").click(function (c) {
            var b = $("#ib-container div.hovered img");
            $("#ib-cell-root .selected").removeClass("selected");
            b.addClass("selected");
            zoomStart();
        });
        $("#ib-controls-hover-drag").draggable({
            scope: "images", cursorAt: { left: 20, top: 20 }, helper: function () {
                var c = $("#ib-container div.hovered img");
                var f = $("<img></img>").attr("src", c.attr("src")).data({ wwData: c.data("wwData") }).hide().appendTo("body");
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
        divInit($("#ib-cell-root"), data);
        saved(true);
        window.onbeforeunload = function () {
            if (!saved()) {
                return "If you leave you will lose unsaved changes to your Inspiration Board.";
            }
        };
    };
    var zoomStart = function () {
        var a = $("#ib-cell-root .selected");
        var b = a.parent();
        $("#ib-zoom-slider").slider("option", "value", (a.data("wwData").zoom - 1) * 100);
        $("#image_clone").empty().append(a.clone().data("wwData", a.data("wwData")).draggable({ stop: a.draggable("option", "stop"), containment: a.draggable("option", "containment") })).css({ top: b.offset().top, left: b.offset().left });
        $("#mask1").css({ top: b.offset().top, left: 0, width: b.offset().left, height: b.height() });
        $("#mask2").css({ top: 0, left: 0, height: b.offset().top, width: $(document).width() });
        $("#mask3").css({ top: b.offset().top, left: b.offset().left + b.width(), height: b.height() });
        $("#mask4").css({ top: b.offset().top + b.height(), left: 0, width: $(document).width() });
        $("#ib-controls").css({ top: b.offset().top + b.height() + 10, left: (b.offset().left + b.width() / 2) - ($("#ib-controls").width() / 2) });
        $("#image_clone,#mask1,#mask2,#mask3,#mask4,#ib-controls").show();
    };
    var resetImg = function (b, i, l) {
        var c = $("<img></img>").attr("src", b.attr("src")).hide().appendTo("body");
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
    var divInit = function (h, i) {
        saved(false);
        var g = {
            tolerance: "pointer", scope: "images", hoverClass: "drophover", drop: function (k, m) {
                var n = $(this);
                var l = m.helper.data("wwData");
                if (n.find("img").attr("src") != l.img) {
                    $hovered = $("#ib-cell-root .hovered img");
                    if ($hovered.length > 0 && $hovered.attr("src") == l.img) {
                        $movedFrom = $hovered.closest(".ib-cell");
                        divInit($movedFrom, { height: $movedFrom.height(), width: $movedFrom.width(), type: "EMPTY" });
                    }
                    divInit(n, { height: n.height(), width: n.width(), type: "IMAGE", wwData: m.helper.data("wwData") });
                }
            }
        };
        h.empty().addClass("ib-cell").removeClass("empty").css({ "height": i.height, "width": i.width });
        if ("IMAGE" == i.type) {
            if (isEdit()) {
                var a = $('<img src="' + i.wwData.img + '" onerror="IB.imgError($(this));"/>').css("visibility", "hidden").data({ wwData: i.wwData }).draggable({
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
                        saved(false);
                    }
                });
                h.append($('<div class="ib-cell-img-container"></div>').width(h.width()).height(h.height()).append(a));
                a.bind("imgpreload", function () {
                    if (typeof (i.imgHeight) != "undefined") {
                        a.height(i.imgHeight);
                        a.width(i.imgWidth);
                        a.css("left", i.imgLeft);
                        a.css("top", i.imgTop);
                    }
                    resetImg(a, h, i.wwData.zoom);
                    a.css("visibility", "visible");
                });
                a.dblclick(function () {
                    $("#ib-cell-root .selected").removeClass("selected");
                    $(this).addClass("selected");
                    zoomStart();
                });
                a.mousedown(function () {
                    var l = $("#ib-controls-hover").hide();
                    var k = $("#ib-controls-hover-drag").hide();
                    $("#ib-cell-root .hovered").removeClass("hovered");
                    h.addClass("hovered");
                    l.css({ top: h.offset().top, left: h.offset().left }).show();
                    k.css({ top: h.offset().top, left: h.offset().left + h.width() - k.outerWidth() }).show();
                });
                a.trigger("mousedown");
                h.droppable(g);
            } else {
                if (i.wwData.portfolioItemId !== undefined) {
                    h.append($('<div class="citation"><span class="strong">Photo submitted by: </span>' + i.wwData.vendorName + "</div>")).hover(function () {
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
                var e = $("<div></div>");
                var c = $("<div></div>");
                if ("HSPLIT" == i.type) {
                    c.addClass("divider hsplit").css({ "width": i.width, "height": 6 });
                } else {
                    c.addClass("divider vsplit").css({ "width": 6, "height": i.height });
                }
                var d = $("<div></div>");
                h.append(e).append(c).append(d);
                divInit(e, i.children[0]);
                divInit(d, i.children[1]);
            } else {
                if (isEdit()) {
                    var j = $("<div></div>").addClass("msg");
                    j.append("<div>divide this cell <a href='#_' onclick='IB.cellSplit(this,true);'>top/bottom</a></div>");
                    j.append("<div>divide this cell <a href='#_' onclick='IB.cellSplit(this,false);'>left/right</a></div>");
                    if (h.siblings().length > 0) {
                        h.attr("stu", new Date().getTime());
                        var b = $(h.parent(".ib-cell").children().first()).attr("stu") == $(h.get()).attr("stu");
                        h.attr("stu", "");
                        if (h.siblings(".hsplit").length == 1) {
                            if (b) {
                                j.append("<div><a href='#_' onclick='IB.cellMerge(this);'>merge down</a></div>");
                            } else {
                                j.append("<div><a href='#_' onclick='IB.cellMerge(this);'>merge up</a></div>");
                            }
                        } else {
                            if (h.siblings(".vsplit").length == 1) {
                                if (b) {
                                    j.append("<div><a href='#_' onclick='IB.cellMerge(this);'>merge right</a></div>");
                                } else {
                                    j.append("<div><a href='#_' onclick='IB.cellMerge(this);'>merge left</a></div>");
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
    var cellMergeRecur = function (b, e, a) {
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
            resetImg($imgs.first(), b, $imgs.first().data("wwData").zoom);
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
                cellMergeRecur($(d.get(c)), e, a);
            }
        }
    };


    var isEdit = function (a) {
        return $("#ib-overall-controls-save").length > 0;
    };
    var saved = function (a) {
        if (!isEdit()) {
            return;
        }
        if (typeof (a) !== "boolean") {
            return $("#ib-overall-controls-save").hasClass("disabled");
        } else {
            if (a) {
                $("#ib-overall-controls-save").addClass("disabled");
                $("#ib-overall-controls").removeClass("ready-false ready-true");
                if ($("#ib-cell-root img").length === 0) {
                    $("#ib-overall-controls").addClass("ready-false");
                } else {
                    $("#ib-overall-controls").addClass("ready-true");
                }
            } else {
                $("#ib-overall-controls-save").removeClass("disabled");
            }
        }
        $("#ib-overall-controls-save").removeClass("blueButtonNew").addClass("blueButtonNew");
    };

    var saveState = function () {
        var b = $.toJSON(saveStateRecur($("#ib-cell-root")));
        var a = [];
        var f = [];
        var d = $("#ib-cell-root img");
        for (var c = 0; c < d.length; c++) {
            var e = $(d.get(c)).data("wwData");
            if (e.portfolioItemId !== undefined) {
                a[a.length] = e.portfolioItemId;
            } else {
                f[f.length] = e.scrapbookItemId;
            }
        }
        _model.BoardStructure(b);
        //        debugger;
        //InspirationBoardNew.saveBoard($("#ib-main-container").data("bid"), b, a, f, IB.saveStateReturn);
    };

    /* 
    * Method to generate BoardStructure
    */
    var saveStateRecur = function (a) {
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
                    e.children[b] = saveStateRecur($(c.get(b)));
                }
            } else {
                e.type = "EMPTY";
            }
        }
        return e;
    };


    /* static method, can using in html */
    IB.zoomCancel = function () {
        $("#image_clone,#mask1,#mask2,#mask3,#mask4,#ib-controls").hide();
    };

    IB.zoomUpdate = function () {
        var a = $("#image_clone img");
        var b = $("#ib-cell-root .selected");
        b.css({ top: a.position().top, left: a.position().left, width: a.width(), height: a.height() }).data("wwData", a.data("wwData"));
        resetImg(b, b.closest("div"), b.data("wwData").zoom);
        $("#image_clone,#mask1,#mask2,#mask3,#mask4,#ib-controls").hide();
        saved(false);
    };

    IB.imgError = function (b) {
        var a = b.closest(".ib-cell");
        var c = { height: a.height(), width: a.width(), type: "EMPTY" };
        divInit(a, c);
        $("#ib-controls-hover,#ib-controls-hover-drag").hide();
    };
    IB.cellMerge = function (e, b) {
        $("#ib-controls-hover-drag,#ib-controls-hover").hide();
        var d = $(e).closest(".ib-cell");
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
        cellMergeRecur(c, f, a);
        if (c.children(".msg").length > 0) {
            var h = { height: c.height(), width: c.width(), type: "EMPTY" };
            divInit(c, h);
        }
        saved(false);
        c.find("img").trigger("mousedown");
    };
    IB.cellSplit = function (c, a) {
        var b = $(c).closest(".ib-cell");
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
        divInit(b, d);
    };
    IB.UpdateImageStrip = function () {
        imgStripUpdate();
    }
    // 0 : edit, 1 : delete
    IB.UpdateBoard = function (title, description, mode, callback) {
        var url = mode == 1 ? "/InspirationBoard/DeleteBoardItem" : "/InspirationBoard/UpdateBoardItem";
        title = title.trim();
        var isChanged = false;
        description = description.trim();
        if (_model.Title() != title) {
            _model.Title(title);
            isChanged = true;
        }
        if (_model.Description() != description) {
            _model.Description(description);
            isChanged = true;
        }
        var data = {
            Id: _model.Id(),
            Title: _model.Title(),
            Description: _model.Description()
        };
        if ((mode == 0 && isChanged) || mode == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: url,
                    data: data,
                    dataType: "json",
                    success: function (data) {

                        if (typeof (callback) == typeof (function () { })) {
                            callback();
                        }

                    },
                    error: function (data) {

                    }

                });
        }
    }

    /* Constructor
    * params: object contain all parameter pass for TaskList module
    *         - container: jquery dom of ui
    */
    function UpdateBoard(params) {
        /*Assign external parameter to private variable*/
        for (var item in params) {
            if (typeof (_private[item]) != typeof (undefined)) {
                _private[item] = params[item];
            }
        }

    };

    UpdateBoard.prototype.InitEdit = function () {

        $.getJSON("/InspirationBoard/GetBoardItem?boardId=" + boardGuid, function (boardItem) {

            _model.BoardStructure(boardItem.BoardStructure);
            _model.Description(boardItem.Description);
            _model.Title(boardItem.Title);
            _model.Id(boardItem.Id);

            _model.DeleteBoard = function () {
                var r = confirm("Do you want to remove this board !");
                if (r == true) {
                    IB.UpdateBoard("", "", 1, function () {
                        window.location.href = "/InspirationBoard";
                    });
                }
            }
            _model.EditBoard = function () {
                $("#board-name").val(_model.Title());
                $("#board-description").val(_model.Description());
                $("#modal_updateBoard").modal('show');
            }
            $("#btn_modal_updateBoard_submit").click(function () {
                $("#imgLoadingUpdateBoardPopup").show();
                var boardName = $("#board-name").val();
                var description = $("#board-description").val();
                var callBack = function () {
                    $("#modal_updateBoard").modal('hide');
                    $("#imgLoadingUpdateBoardPopup").hide();
                }
                IB.UpdateBoard(boardName, description, 0, callBack);
            });
            ko.applyBindings(_model, $(_private.container)[0]);

            initEdit(JSON.parse(_model.BoardStructure()));
        });
    }

    /* public methods */
    return UpdateBoard;

})();