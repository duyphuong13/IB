
var IB = IB || {};
IB.modules = IB.modules || {};
IB.modules.myboard = IB.modules.myboard || {};

IB.modules.myboard.BoardList = (function () {

    var _private = {
        container: "#ww-canvas-body-table"
    };

    var _model = {
        listboards: ko.observableArray([]),
        pageSize: ko.observable(10),
        pageIndex: ko.observable(0),
        totalRows: ko.observable(11),
        onCreateBoardClick: function () { },
        isLoading: ko.observable(true),
    };

    function ResetToDefault() {

        _model.listboards.removeAll();
        _model.pageIndex(0);
        _model.pageSize(10);
        _model.totalRows(11);
        _model.isLoading(true);
    }

    function BoardItem(boardItem) {
        var _self = this;
        _self.Id = ko.observable(boardItem.Id);
        _self.Title = ko.observable(boardItem.Title);
        _self.Description = ko.observable(boardItem.Description);
        _self.Href = ko.observable("/InspirationBoard/UpdateBoard?id=" + boardItem.Id);
        _self.BoardImageUrl = ko.observable(boardItem.BoardImageUrl);
        _self.OnError = function () {
            _self.BoardImageUrl('/cdn/images/iboard-new-empty.jpg?w=220&h=220')
        }
    }
    function ShowMore() {
        _model.pageIndex(_model.pageIndex() + 1);
        RetrieveMyBoard(_model.pageIndex(), _model.pageSize(), null);
    }

    function RetrieveMyBoard(pageIndex, pageSize, callback) {

        _model.isLoading(true);
        $.getJSON("/InspirationBoard/GetMyBoards?pageIndex=" + pageIndex + "&pageSize=" + pageSize, function (data) {
            _model.isLoading(false);
            SetLisBoardsDataSource(data.boards, data.totalItems);
            if (typeof (callback) == typeof (function () { })) {
                callback();
            }
        });
    }

    function UpdateData(callback) {
        ResetToDefault();
        RetrieveMyBoard(_model.pageIndex(), _model.pageSize(), callback);
    }

    function SetLisBoardsDataSource(listBoards, totalItems) {

        _model.totalRows(totalItems);
        ///*Remove current data*/
        //_model.listboards.removeAll();
        /*Push the new data to the list with custom entity*/
        $.each(listBoards, function (index, board) {
            _model.listboards.push(new BoardItem(board));
        });

    }
    function ApplyBinding() {

        /*Check if the container have been initialised*/
        if (_private.container != null) {
            ko.applyBindings(_model, $(_private.container)[0]);
        }
    }

    /* Constructor
     * params: object contain all parameter pass for TaskList module
     *         - container: jquery dom of ui
     */
    function BoardList(params) {
        /*Assign external parameter to private variable*/
        for (var item in params) {
            if (typeof (_private[item]) != typeof (undefined)) {
                _private[item] = params[item];
            }
        }
        _model.ShowMore = ShowMore;
        /*Data binding*/
        ApplyBinding();
        //   RetrieveMyBoard(null);
        /*Init jquery control*/
        //  InitControl();
    };


    BoardList.prototype.UpdateData = function (callback) {
        UpdateData(callback);
    }
    BoardList.prototype.OnCreateBoardClick = function (createBoardFunc) {
        _model.onCreateBoardClick = createBoardFunc;
    }


    return BoardList;
})();
