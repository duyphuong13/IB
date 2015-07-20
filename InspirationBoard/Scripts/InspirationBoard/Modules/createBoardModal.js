
var IB = IB || {};
IB.modules = IB.modules || {};
IB.modules.myboard = IB.modules.myboard || {};

IB.modules.myboard.CreateBoardModal = (function () {

    var _private = {
        container: "#modal_createNewBoard",
        boardStructureTemplate: {
            "1": '{"height":750,"width":750,"type":"VSPLIT","children":[{"height":750,"width":246,"type":"HSPLIT","children":[{"height":372,"width":246,"type":"EMPTY"},{"height":372,"width":246,"type":"HSPLIT","children":[{"height":183,"width":246,"type":"EMPTY"},{"height":183,"width":246,"type":"EMPTY"}]}]},{"height":750,"width":498,"type":"VSPLIT","children":[{"height":750,"width":246,"type":"HSPLIT","children":[{"height":372,"width":246,"type":"EMPTY"},{"height":372,"width":246,"type":"EMPTY"}]},{"height":750,"width":246,"type":"HSPLIT","children":[{"height":372,"width":246,"type":"HSPLIT","children":[{"height":183,"width":246,"type":"EMPTY"},{"height":183,"width":246,"type":"EMPTY"}]},{"height":372,"width":246,"type":"EMPTY"}]}]}]}',
            "2": '{"height":750,"width":750,"type":"HSPLIT","children":[{"height":498,"width":750,"type":"HSPLIT","children":[{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"VSPLIT","children":[{"height":246,"width":183,"type":"EMPTY"},{"height":246,"width":183,"type":"EMPTY"}]},{"height":246,"width":372,"type":"EMPTY"}]},{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"EMPTY"},{"height":246,"width":372,"type":"EMPTY"}]}]},{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"EMPTY"},{"height":246,"width":372,"type":"EMPTY"}]}]}',
            "3": '{"height":750,"width":750,"type":"HSPLIT","children":[{"height":498,"width":750,"type":"HSPLIT","children":[{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"EMPTY"},{"height":246,"width":372,"type":"EMPTY"}]},{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"EMPTY"},{"height":246,"width":372,"type":"EMPTY"}]}]},{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"VSPLIT","children":[{"height":246,"width":183,"type":"EMPTY"},{"height":246,"width":183,"type":"EMPTY"}]},{"height":246,"width":372,"type":"VSPLIT","children":[{"height":246,"width":183,"type":"EMPTY"},{"height":246,"width":183,"type":"EMPTY"}]}]}]}',
            "4": '{"height":750,"width":750,"type":"HSPLIT","children":[{"height":498,"width":750,"type":"HSPLIT","children":[{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"EMPTY"},{"height":246,"width":372,"type":"EMPTY"}]},{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"VSPLIT","children":[{"height":246,"width":183,"type":"EMPTY"},{"height":246,"width":183,"type":"EMPTY"}]},{"height":246,"width":372,"type":"EMPTY"}]}]},{"height":246,"width":750,"type":"VSPLIT","children":[{"height":246,"width":372,"type":"VSPLIT","children":[{"height":246,"width":183,"type":"EMPTY"},{"height":246,"width":183,"type":"EMPTY"}]},{"height":246,"width":372,"type":"EMPTY"}]}]}'
        }
    };

    var _model = {
        title: ko.observable(''),
        description: ko.observable(''),
        boardTemplate: ko.observable('1'),
        boardStructure: "",
        BoardTemplateList: ko.observableArray([]),
    };
    var SubmitCallback = function () {

    };
    /*private functions*/
    function ApplyBinding() {
        /*Check if the container have been initialised*/
        if ($(_private.container).length > 0) {
            if (ko.dataFor($(_private.container)[0]) == null || typeof (ko.dataFor($(_private.container)[0])) == typeof (undefined)) {
                _model.SaveCreateBoard = SaveCreateBoard;

            
                ko.applyBindings(_model, $(_private.container)[0]);
            }
        }
    };

    function GetBoardTemplateList(successCallback) {
        var list = [];
        successCallback(list);
    }

    function BootstrapModalInit() {
        if ($(_private.container).data('bs.modal') == undefined) {
            $(_private.container).modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
        }
    }

    function InitialLoad(callback) {
        if ($(_private.container).length == 0) {
            TaskRequest().RequestMethod().Load('CreateTaskPartial', {
                success: function () {
                    callback();
                }
            });
        }
        else {
            callback();
        }
    };

    function ShowModal() {

        $(_private.container).modal('show');
    }

    function IsValid() {
        return true;
    }

    function SaveCreateBoard() {
        _model.title(_model.title().trim());
        if (!IsValid()) {
            return;
        }
        _model.boardStructure = _private.boardStructureTemplate[_model.boardTemplate()];
        var boardModel = ko.toJSON(_model);

        $.ajax(
            {
                url: "/InspirationBoard/AddNewBoardItem",
                type: "POST",
                data: boardModel,
                datatype: "json",
                processData: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    HideModal();
                    SubmitCallback();
                },
                error: function (err) {
                    console.log(err);
                }
            });

    }
    function ClearData() {
        _model.title('');

    }

    function HideModal() {
        /*Release memory*/
        ClearData();
        /*Hide modal*/
        $(_private.container).modal('hide');
    }
    /* Constructor
     * params: object contain all parameter pass for module
     *         - container: jquery dom of ui
     */
    function CreateBoardModal(params) {
       
    };

    /*publically accessible variables and functions*/
    CreateBoardModal.prototype.Show = function () {

        InitialLoad(function () {
            BootstrapModalInit();
            ApplyBinding();
            ClearData();
            ShowModal();
            setTimeout(function () {
                $('input[data-bind*=title]').focus();
            }, 800);
        })
    };

    CreateBoardModal.prototype.Hide = function () {
        HideModal();
    };
    CreateBoardModal.prototype.OnCreateSuccess = function (callbackFunc) {
        SubmitCallback = callbackFunc;
    }

    return CreateBoardModal;
})();

