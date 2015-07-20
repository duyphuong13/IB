/**************************************************************************
    Filename:       tasklist.js
    Description:    js object for manage homepage task list
    Version:        v0.1                             
    Company:        ASWIG IT - VN

    Created on:     03/11/2014
    Created by:     Duy Le
**************************************************************************/

/*Namespace initial*/
var tms = tms || {};
tms.modules = tms.modules || {};
tms.modules.homepage = tms.modules.homepage || {};
/*Namespace initial*/


/*Task list control*/
tms.modules.homepage.TaskList = (function () {

    /*private variables*/
    /*
     * The _private variable contain main data using for binding
     */
    var _private = {
        container: null,
        taskAttr: [],
        sortOperator: [],
        completedTask: ko.observableStorage(false, { key: "tms/tasklist/completedTaskToggleKey" }),
        taskList: ko.observableArray([]),
        filterValue: ko.observableStorage("", { key: 'tms/tasklist/filterValue' }),
        filterValueSumitted: ko.observableStorage("", { key: 'tms/tasklist/filterValueSumitted' }),
        sortByType: ko.observableStorage(null, { key: 'tms/tasklist/sortByType' }),
        sortByOpt: ko.observableStorage(null, { key: 'tms/tasklist/sortByOpt' })
    };

    var _event = {
        OnFilterChange: $.tms.NewID(),
        OnAdvanceSearchClick: $.tms.NewID(),
        OnSelectTaskChange: $.tms.NewID(),
        OnFinishedReallocate: $.tms.NewID(),
        OnCreatedTask: $.tms.NewID(),
        OnUpdatedTask: $.tms.NewID()
    }

    var _maxLengthForTaskSubjectView = 70;

    /*DataRequest*/
    var _dataRequest = {
        task: null,
        lastestRequestId: '',
        requestInSilent: false,
        advanceSearch: false,
        advanceSearchFilter: {}
    };

    /*For tracing last request method - use for recall in filter/sort feature*/
    var currentDataRequestMethod = null;

    function SortOperatorChange() {
        if (typeof (currentDataRequestMethod) == typeof (function () { })) {
            /*Turn on request in silent*/
            _dataRequest.requestInSilent = false;
            currentDataRequestMethod();
        }
    }

    function OnPagingChange() {
        /*Request data*/
        if (currentDataRequestMethod != null && typeof (currentDataRequestMethod) == typeof (function () { })) {
            /*Turn off request in silent*/
            _dataRequest.requestInSilent = false;
            /*Apply new page change*/
            currentDataRequestMethod();
        }
    }

    function ScrollListToTop() {
        setTimeout(function () {
            $('.tableFeedScroll', $(_private.container)).slimScroll({ scrollTo: '0px' });
        }, 100);
    }

    function DisableSelectTextInTaskList() {
        $(_private.container).mousedown(function (e) {
            if (e.ctrlKey || e.shiftKey) {
                // For non-IE browsers
                e.preventDefault();

                // For IE
                if ($.browser.msie) {
                    this.onselectstart = function () { return false; };
                    var me = this;  // capture in a closure
                    window.setTimeout(function () { me.onselectstart = null; }, 0);
                }
            }
        });
    }

    function TaskRequest() {
        /*Init data request object for task*/
        return new tms.data.task('task');
    };

    function LocalStorage() {
        /*Init data request object for task*/
        return $.tms.Instance('tms.LocalStorage');
    };

    /*private functions*/
    function ApplyBinding() {
        /*Add computed method for checkbox handler*/
        TaskListModelCustom();

        /*Add function for binding*/
        _private.OpenApplication = OpenApplication;
        _private.TaskSelect = TaskSelect;
        _private.filterValue.subscribe(OnClearFilterClick, _private);
        _private.ReAssignTask = ReAssignTask;
        _private.EditCurrentSelectedTask = EditCurrentSelectedTask;
        _private.CreateTask = CreateTask;
        _private.filterSubmit = filterSubmit;
        _private.sortByOpt.subscribe(SortOperatorChange, _private);
        _private.SelectSortType = SelectSortType;
        _private.ChangeSortOpt = ChangeSortOpt;
        _private.ExecuteFilter = ExecuteFilter;
        _private.CompletedTaskToggleClick = CompletedTaskToggleClick;
        _private.AdvanceSearchClick = AdvanceSearchClick;

        /*Add paging control*/
        var pagingControl = new tms.Controls.Paging();
        var pagingModel = pagingControl.Integate(_private, 'taskList', OnPagingChange);
        /*Add paging control*/

        /*Check if the container have been initialised*/
        if (_private.container != null) {
            ko.applyBindings(_private, $(_private.container)[0]);
        }
    };

    /*Event handler for press enter on filter textbox => submit current value for filter data*/
    var _filterLegacyValue = "";
    function filterSubmit(data, event) {
        if (event.keyCode == 13) {
            ExecuteFilter();
        }
        return true;
    }

    function OnClearFilterClick() {
        var filterValue = _private.filterValue();

        //Process null
        if (filterValue == null) {
            filterValue = "";
        }

        /*Process the space in filter value*/
        if (filterValue && filterValue.trim().length <= 0) {
            filterValue = filterValue.trim();
        }

        //Just clear filter when clear textbox
        if (filterValue.length == 0 && _private.filterValueSumitted().length > 0) {
            ExecuteFilter();
        }
    }

    function ExecuteFilter() {
        var filterValue = _private.filterValue();

        /*Process the space in filter value*/
        if (filterValue && filterValue.trim().length <= 0) {
            _private.filterValue(filterValue.trim());
        }

        /*Send request to server*/
        if (typeof (currentDataRequestMethod) == typeof (function () { })) {
            _private.filterValue(filterValue.trim());
            if (_private.filterValue() != _filterLegacyValue) {
                /*Turn off advance search when filter*/
                /*TurnOffAdvanceSearch(); => Filter is now apply for current dataset*/
                /*Turn off request in silent*/
                _dataRequest.requestInSilent = false;
                /*Set default data for paging control when change selected folder*/
                SetPageNumberToFirst();
                /*Apply filter*/
                currentDataRequestMethod();
                /*_onFilterChange*/
                PubSub.publish(_event.OnFilterChange, '');
            }

        }
    }

    function SetPageNumberToFirst() {
        _private.SetPageNumberWithoutNotify(1);
    }

    /*Event handler*/
    function TaskListModelCustom() {
        /*Computed property for check all control*/
        _private.CheckAll = ko.computed({
            read: function () {
                var task = ko.utils.arrayFirst(_private.taskList(), function (task) {
                    return !task.selected();
                });
                return task == null;
            },
            write: function (value) {
                ko.utils.arrayForEach(_private.taskList(), function (task) {
                    task.checked(value);
                });
            }
        });
        /*Computed property for check all control*/
        _private.ReAssignButtonVisible = ko.computed({
            read: function () {
                var task = ko.utils.arrayFirst(_private.taskList(), function (task) {
                    return task.selected();
                });
                return task != null;
            }
        });

        _private.EditButtonVisible = ko.computed({
            read: function () {
                var task = ko.utils.arrayFilter(_private.taskList(), function (task) {
                    return task.selected();
                });
                return task.length == 1;
            }
        });
        /*Add custom properties*/
        ko.utils.arrayForEach(_private.taskList(), function (task) {
            /*For select highlight feature*/
            task.selected = ko.observable(false);
            /*For operator buttons hover effect*/
            task.optButtonsVisible = ko.observable(false);
        });

        /*Initial data for Sort type list*/
        InitialDataForSortControl();
    };

    function InitialDataForSortControl() {
        _private.taskAttr = [];
        _private.taskAttr.push({
            id: tms.enum.SortField.CreatedTime,
            name: "Create Date",
            type: tms.enum.PropertyType.SystemTime
        });
        _private.taskAttr.push({
            id: tms.enum.SortField.ApplicationName,
            name: "Application",
            type: tms.enum.PropertyType.String
        });
        _private.taskAttr.push({
            id: tms.enum.SortField.ClaimNumber,
            name: "Claim Number",
            type: tms.enum.PropertyType.String
        });
        _private.taskAttr.push({
            id: tms.enum.SortField.Subject,
            name: "Subject",
            type: tms.enum.PropertyType.String
        });
        if (tms.data.currentUserBusiness.length > 1) {
            _private.taskAttr.push({
                id: tms.enum.SortField.BusinessUnit,
                name: "Business Unit",
                type: tms.enum.PropertyType.String
            });
        }

        _private.sortOperator = [];
        _private.sortOperator.push({
            type: tms.enum.PropertyType.String,
            opts: [
                {
                    name: "A on top",
                    opt: tms.enum.ExchangeSortDirection.Ascending
                },
                {
                    name: "Z on top",
                    opt: tms.enum.ExchangeSortDirection.Descending
                }
            ]
        });
        _private.sortOperator.push({
            type: tms.enum.PropertyType.Integer,
            opts: [
                {
                    name: "Smallest on top",
                    opt: tms.enum.ExchangeSortDirection.Ascending
                },
                {
                    name: "Largest on top",
                    opt: tms.enum.ExchangeSortDirection.Descending
                }
            ]
        });
        _private.sortOperator.push({
            type: tms.enum.PropertyType.SystemTime,
            opts: [
                {
                    name: "Newest on top",
                    opt: tms.enum.ExchangeSortDirection.Descending
                },
                {
                    name: "Oldest on top",
                    opt: tms.enum.ExchangeSortDirection.Ascending
                }
            ]
        });
        /*Set default value for sortByType*/
        if (_private.sortByType() == null) {
            SetSortType(_private.taskAttr[0]);
        }

        _private.OperatorsBySortType = ko.computed({
            read: function () {
                return _private.sortOperator.filter(function (item) { return item.type == _private.sortByType().type })[0].opts;
            }
        });
    };

    function SetSortType(type) {
        _private.sortByType(type);
        _private.sortByOpt(_private.sortOperator.filter(function (item) { return item.type == _private.sortByType().type })[0].opts[0]);
    }

    function CustomData(list) {
        ko.utils.arrayForEach(list, function (task) {
            /*For select highlight feature*/
            task.selected = ko.observable(false);
            /*For operator buttons hover effect*/
            task.optButtonsVisible = ko.observable(false);
            /*For checkbox manage*/
            task.checked = ko.observable(false);
        });
    };

    function CalTaskSubjectLength(container) {
        var containerWidth = $(container).width() * 78 / 100;
        _maxLengthForTaskSubjectView = Math.round(containerWidth * 67 / 484);
    };

    function CalculateTaskSubjectLength() {
        if (_private.container == 'body') {
            CalTaskSubjectLength('.divListContainer');
        }
        else {
            CalTaskSubjectLength(_private.container);
        }
    }

    /*Custom mapping entity for client side*/
    function TaskItem(OutLookTask) {
        var _self = this;
        /*Main information*/
        _self.Id = OutLookTask.Id;
        _self.Status = OutLookTask.Status
        _self.TaskType = OutLookTask.TaskType;
        _self.TaskTypeID = OutLookTask.TaskTypeID;
        _self.WorkerName = OutLookTask.InjuredWorkerFullName ? OutLookTask.InjuredWorkerFullName : "";
        _self.ClaimNumber = OutLookTask.ClaimNumber ? OutLookTask.ClaimNumber : "";
        _self.Description = OutLookTask.Subject ? OutLookTask.Subject.Truncate(_maxLengthForTaskSubjectView) : "";
        _self.ApplicationURL = OutLookTask.ApplicationURL;
        _self.ApplicationName = OutLookTask.ApplicationName;
        _self.ActualOwnerAlias = OutLookTask.ActualOwnerAlias;
        _self.BusinessUnitAlias = OutLookTask.BusinessUnitAlias;
        _self.DateTime = moment(OutLookTask.CreateDate).format("MMM DD");

        /*Check if DueDate is available*/
        if (OutLookTask && !$.tms.IsNullOrEmpty(OutLookTask.DueDateUTC)) {
            _self.DueDate = moment(OutLookTask.DueDateUTC).toDate().ToTMSDateString();
            if (moment(OutLookTask.DueDateUTC).toDate().equalDate(new Date())) {
                _self.IsDueDateReached = true;
            }
            else {
                _self.IsDueDateReached = false;
            }
        }
        else {
            _self.DueDate = '';
            _self.IsDueDateReached = false;
        }

        _self.Read = ko.observable(OutLookTask.Read);
        _self.IsReassign = OutLookTask.IsReassign == true ? true : false;
        /*Main information*/

        /*Addition information*/
        /*For select highlight feature*/
        _self.selected = ko.observable(false);
        /*For operator buttons hover effect*/
        _self.optButtonsVisible = ko.observable(false);
        /*For checkbox manage*/
        _self.checked = ko.observable(false);
        /*Addition information*/
    };

    function AdvanceSearchClick() {
        /*Clear filter*/
        _private.filterValue("");
        _private.filterValueSumitted("");
        /*Clear filter*/
        PubSub.publish(_event.OnAdvanceSearchClick, '');
    }

    function CompletedTaskToggleClick() {
        _private.completedTask(!_private.completedTask());
        SetPageNumberToFirst();
        currentDataRequestMethod();
    }

    /*Method to handle button to open application for task*/
    function OpenApplication(task) {
        //aswlp is the protocol of Landing page project
        var currentURL = task.ApplicationURL;
        /*PreProcess null value for application url*/
        if (currentURL == null || typeof (currentURL) == typeof (undefined)) {
            currentURL = '';
        }
        else {
            currentURL = currentURL.trim();
        }

        var applicationName = LandingPage.Imaging;
        if ($.tms.GetApplicationNameValue(task.ApplicationName) == tms.enum.ApplicationName.CreditorPayments) {
            applicationName = LandingPage.CreditorPayments;
        }

        currentURL = 'aswlp://' + applicationName + "//" + currentURL;
        /*Go to application by using aswlp protocol*/
        $(location).attr('href', currentURL);
    };

    /*Manage currentTaskID*/
    var __currentTaskId = ko.observableStorage("", { key: "tms.module.tasklist.CurrentTaskId" });

    function GetCurrentTaskId() {
        return __currentTaskId();
    }

    function SetCurrentTaskId(id) {
        __currentTaskId(id);
    }
    /*Manage currentTaskID END*/

    function SelectAllTask() {
        ko.utils.arrayForEach(_private.taskList(), function (task) {
            task.selected(true);
        });
    }

    var lastestClickTask = "";/*Use for manage ctrl/shilt click*/
    function TaskSelect(task, e) {

        if (e.ctrlKey || e.shiftKey) {
            /*Prevent ctrl click on current showing task*/
            if (GetCurrentTaskId() == task.Id) {
                return true;
            }
            if (e.ctrlKey) {
                CtrlHighlightTask(task);
                lastestClickTask = task.Id;
            }
            else {
                ShiftHighlightTask(task);
            }
        }
        else {
            lastestClickTask = task.Id;
            /*Cache current taskid*/
            SetCurrentTaskId(task.Id);
            /*Highlight selected task*/
            HighlightSelectedTask(GetCurrentTaskId());
            /*Set read/unread status*/
            if (!task.Read()) {
                task.Read(true);
                MarkTaskAsRead(task.Id);
            }
        }
    };

    function ShiftHighlightTask(task) {
        /*Highlight from previous above selected*/
        var taskList = _private.taskList();
        var currentSelectedID = task.Id;
        var startHighlightIndex = -1, endHighlightIndex = 0;

        if (lastestClickTask == currentSelectedID) {
            return false;
        }

        for (var index = 0; index < taskList.length; index++) {
            if (taskList[index].Id == currentSelectedID || taskList[index].Id == lastestClickTask) {
                if (startHighlightIndex == -1) {
                    startHighlightIndex = index;
                }
                else {
                    endHighlightIndex = index;
                    break;
                }
            }
        }

        /*Unselect all tasks*/
        UnSelectAllTask();

        /*Highlight selected task*/
        for (var index = startHighlightIndex; index <= endHighlightIndex; index++) {
            taskList[index].selected(true);
        }
    }

    function CtrlHighlightTask(task) {
        task.selected(!task.selected());
    }

    function UnSelectAllTask() {
        /*UnSelect current selected task*/
        var listOfSelected = ko.utils.arrayFilter(_private.taskList(), function (task) {
            return task.selected()
        });
        for (var index = 0; index < listOfSelected.length; index++) {
            listOfSelected[index].selected(false);
        }
        /*UnSelect current selected task*/
    }

    function HighlightSelectedTask(taskId) {
        var highlightSuccess = false;
        if (taskId != "" && taskId != null) {
            /*UnSelect current selected task*/
            UnSelectAllTask();
            /*UnSelect current selected task*/
            /*hightlight the selected item*/
            var selectedItem = ko.utils.arrayFirst(_private.taskList(), function (task) {
                return task.Id == taskId;
            });
            if (typeof (selectedItem) != typeof (undefined) && selectedItem != null) {
                selectedItem.selected(true);
                highlightSuccess = true;
            }
            /*hightlight the selected item*/
        }
        if (highlightSuccess) {
            /*Fire task select change event*/
            PubSub.publish(_event.OnSelectTaskChange, taskId);
            lastestClickTask = taskId;
        }
        else {
            lastestClickTask = "";
        }
        return highlightSuccess;
    }

    function SelectSortType(type) {
        SetSortType(type)
    }

    function ChangeSortOpt(type) {
        var targetItem = _private.OperatorsBySortType().filter(function (sortType) {
            return sortType.opt != _private.sortByOpt().opt;
        });
        if (targetItem.length > 0) {
            _private.sortByOpt(targetItem[0]);
        }
    }

    function GetCurrentUserAliasByHash() {
        return $.tms.GetCurrentAlias();
    }

    function ReAsssignTaskValid(taskList) {
        if (taskList) {
            var buList = {};
            for (var index = 0; index < taskList.length; index++) {
                buList[taskList[index].BusinessUnitAlias] = index;
            }
            return Object.getOwnPropertyNames(buList).length == 1;
        }
        return false;
    }

    function ReAssignTask() {
        var taskList = [];
        ko.utils.arrayForEach(_private.taskList(), function (item) {
            if (item.selected()) {
                taskList.push(item);
            }
        });
        if (ReAsssignTaskValid(taskList)) {
            $.tms.Instance('tms.modules.homepage.UserList').Show(taskList, GetCurrentUserAliasByHash(), taskList[0].BusinessUnitAlias, function () {
            }, function (assignee) {
                currentDataRequestMethod();
                PubSub.publish(_event.OnFinishedReallocate, {
                    tasks: taskList,
                    assignee: assignee
                });
            });
        }
        else {
            $.tms.Instance('tms.Notify').Danger($.tms.GetValidationMessage('ReassignTaskInMultipleBU'));
        }
    };

    function EditCurrentSelectedTask() {
        var listCheckedTask = GetCheckedTask();
        if (listCheckedTask.length > 0) {
            /*Initial update task modal*/
            $.tms.Instance("tms.modules.homepage.UpdateTaskModal").Show(listCheckedTask[0], function () {
                /*Publish event of update task with following task*/
                PubSub.publish(_event.OnUpdatedTask, listCheckedTask[0]);
                /*Refresh the current task list*/
                currentDataRequestMethod();
            });
        }
    }
    function CreateTask() {
        $.tms.Instance("tms.modules.homepage.CreateTaskModal").Show(function (task) {
            currentDataRequestMethod();
            PubSub.publish(_event.OnCreatedTask, task);
        });
    }

    function GetCheckedTask() {
        var list = ko.utils.arrayFilter(_private.taskList(), function (task) {
            return task.selected();
        });
        return list;
    }

    /* START - Data Request Method*/
    function MarkTaskAsRead(id) {
        TaskRequest().MarkTaskAsRead(id, {
            blockUIWhenRequest: false
        });
    }

    function TaskListRequest(filters, alias, businessUnit, group, team) {
        var taskListRequest = {
            pageIndex: _private.currentPage(),
            pageSize: _private.pageSize(),
            FilterValue: _private.filterValue() ? _private.filterValue().trim() : '',
            SortField: _private.sortByType().id,
            SortType: _private.sortByOpt().opt,
            Filters: filters,
            Alias: alias ? alias : '',
            ShowCompletedTask: _private.completedTask(),
            BusinessUnitAlias: businessUnit ? businessUnit : '',
            GroupAlias: group ? group : '',
            TeamAlias: team ? team : ''
        };

        /*Tracing filter*/
        _filterLegacyValue = taskListRequest.FilterValue;
        _private.filterValueSumitted(_filterLegacyValue);
        setTimeout(function () {
            _filterLegacyValue = +_filterLegacyValue + " ";
        }, 5000);

        return taskListRequest;
    }

    ////RetrieveGroupTask
    function RetrieveGroupTask(businessUnit, group, team, alias, callback) {
        var requestOption = {
            success: function (data, requestId) {
                if (_dataRequest.lastestRequestId != requestId) {
                    return;
                }
                /*Set data source*/
                SetTaskListDataSource(data.Tasks, data.TotalItems);
                /*Notify retrieve done*/
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            error: function (error) {
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            blockUI: $(_private.container),
            cacheData: true,
            cacheDuration: 1000
        };

        /*Set request in silent mode*/
        requestOption.blockUIWhenRequest = !_dataRequest.requestInSilent;

        /*Fetch new data*/
        var filters = null;
        if (_dataRequest.advanceSearch) {
            filters = _dataRequest.advanceSearchFilter;
        }
        _dataRequest.lastestRequestId = TaskRequest().RetrieveGroupTask(TaskListRequest(filters, alias, businessUnit, group, team), requestOption);
    };

    function RetrieveMyTask(businessUnit, callback) {
        var requestOption = {
            success: function (data, requestId) {
                if (_dataRequest.lastestRequestId != requestId) {
                    return;
                }
                /*Set data source*/
                SetTaskListDataSource(data.Tasks, data.TotalItems);
                /*Notify retrieve done*/
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            error: function (error) {
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            blockUI: $(_private.container),
            cacheData: true,
            cacheDuration: 1000
        };

        /*Set request in silent mode*/
        requestOption.blockUIWhenRequest = !_dataRequest.requestInSilent;

        /*Fetch new data*/
        var filters = null;
        if (_dataRequest.advanceSearch) {
            filters = _dataRequest.advanceSearchFilter;
        }
        _dataRequest.lastestRequestId = TaskRequest().RetrieveMyTask(TaskListRequest(filters, '', businessUnit), requestOption);
    };

    function RetrievePaymentTask(businessUnit, callback) {
        var requestOption = {
            success: function (data, requestId) {
                if (_dataRequest.lastestRequestId != requestId) {
                    return;
                }
                /*Set data source*/
                SetTaskListDataSource(data.Tasks, data.TotalItems);
                /*Notify retrieve done*/
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            error: function (error) {
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            blockUI: $(_private.container),
            cacheData: true,
            cacheDuration: 1000
        };

        /*Set request in silent mode*/
        requestOption.blockUIWhenRequest = !_dataRequest.requestInSilent;

        /*Fetch new data*/
        var filters = null;
        if (_dataRequest.advanceSearch) {
            filters = _dataRequest.advanceSearchFilter;
        }
        _dataRequest.lastestRequestId = TaskRequest().RetrievePaymentTask(TaskListRequest(filters, '', businessUnit), requestOption);
    };

    function RetrieveImagingTask(businessUnit, callback) {
        var requestOption = {
            success: function (data, requestId) {
                if (_dataRequest.lastestRequestId != requestId) {
                    return;
                }
                /*Set data source*/
                SetTaskListDataSource(data.Tasks, data.TotalItems);
                /*Notify retrieve done*/
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            error: function (error) {
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            blockUI: $(_private.container),
            cacheData: true,
            cacheDuration: 1000
        };

        /*Set request in silent mode*/
        requestOption.blockUIWhenRequest = !_dataRequest.requestInSilent;

        /*Fetch new data*/
        var filters = null;
        if (_dataRequest.advanceSearch) {
            filters = _dataRequest.advanceSearchFilter;
        }
        _dataRequest.lastestRequestId = TaskRequest().RetrieveImagingTask(TaskListRequest(filters, '', businessUnit), requestOption);
    };

    function RetrieveSeachAllTask(callback, silent) {
        var requestOption = {
            success: function (data, requestId) {
                if (_dataRequest.lastestRequestId != requestId) {
                    return;
                }
                /*Set data source*/
                SetTaskListDataSource(data.Tasks, data.TotalItems);
                /*Notify retrieve done*/
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            error: function (error) {
                if (typeof (callback) == typeof (function () { })) {
                    callback();
                }
            },
            blockUI: $(_private.container),
            cacheData: true,
            cacheDuration: 1000
        };

        /*Set request in silent mode*/
        requestOption.blockUIWhenRequest = !_dataRequest.requestInSilent;

        /*Fetch new data*/
        var filters = null;
        if (_dataRequest.advanceSearch) {
            filters = _dataRequest.advanceSearchFilter;
        }
        _dataRequest.lastestRequestId = TaskRequest().RetrieveSearchAllTask(TaskListRequest(filters), requestOption);
    };

    function SetTaskListDataSource(taskList, totalItems) {
        /*Calculate max length for task subject for fix with all screen*/
        CalculateTaskSubjectLength();
        /*Scroll current list to top*/
        ScrollListToTop();
        /*Backup the current list status*/
        var _legacyList = [];
        ko.utils.arrayForEach(_private.taskList(), function (currentTask) {
            _legacyList.push({
                Id: currentTask.Id,
                checked: currentTask.selected(),
            });
        })
        /*Remove current data*/
        _private.taskList.removeAll();
        /*Push the new data to the list with custom entity*/
        $.each(taskList, function (index, task) {
            _private.taskList.push(new TaskItem(task));
        });
        /*Restore current checked list*/
        $.each(_legacyList, function (index, oldTask) {
            ko.utils.arrayForEach(_private.taskList(), function (currentTask) {
                if (oldTask.Id == currentTask.Id) {
                    currentTask.checked(oldTask.checked)
                };
            })
        });
        /*Refresh page number combobox*/
        _private.SetTotalItems(totalItems);

        /*Rehighlight data, if not exist in current list, notify to outside that no select now*/
        if (!HighlightSelectedTask(GetCurrentTaskId())) {
            PubSub.publish(_event.OnSelectTaskChange, '');
            SetCurrentTaskId("");
        }
    };
    /* END   - Data Request Method*/

    function InitControl() {
        if (ie && ie < 10) {
            $(' input,textarea', _private.container).placeholder();
        }
        DisableSelectTextInTaskList();
    }

    function TurnOnAdvanceSearch(filter) {
        _dataRequest.advanceSearch = true;
        _dataRequest.advanceSearchFilter = filter;
        _private.filterValue("");
        _private.filterValueSumitted("");
        _filterLegacyValue = "";
    }

    function TurnOffAdvanceSearch() {
        _dataRequest.advanceSearch = false;
        _dataRequest.advanceSearchFilter = {};
    }

    /*Removed*/
    function MaxLengthHandlerForIE() {
    }

    /* Constructor
     * params: object contain all parameter pass for TaskList module
     *         - container: jquery dom of ui
     */
    function TaskList(params) {
        /*Assign external parameter to private variable*/
        for (var item in params) {
            if (typeof (_private[item]) != typeof (undefined)) {
                _private[item] = params[item];
            }
        }

        /*Data binding*/
        ApplyBinding();
        /*Init jquery control*/
        InitControl();
        /*Set request data method block body in first times*/
        var backupContainer = _private.container;
        _private.container = 'body';
        setTimeout(function () {
            _private.container = backupContainer;
        }, 2000);

        MaxLengthHandlerForIE();
    };


    /*publically accessible variables and functions*/
    TaskList.prototype.GetTaskList = function () {
        return _private.taskList();
    };
    TaskList.prototype.GetModel = function () {
        return _private;
    };

    TaskList.prototype.GetCurrentTaskId = function () {
        return GetCurrentTaskId();
    }

    TaskList.prototype.OnFilterChange = function (callback) {
        PubSub.subscribe(_event.OnFilterChange, PubSub.HandlerAdapter(function (val) {
            /*Turn on request in silent*/
            _dataRequest.requestInSilent = false;
            if (typeof (callback) == typeof (function () { })) {
                callback(val);
            }
        }));

    };

    TaskList.prototype.SelectMyTask = function (businessUnit, resetFilter, callback) {
        if (typeof (resetFilter) != typeof (undefined) && resetFilter == true) {
            _private.filterValue("");
            _private.filterValueSumitted("");
        }
        /*Turn off request in silent*/
        _dataRequest.requestInSilent = false;
        /*Turn off advance search*/
        TurnOffAdvanceSearch();
        /*Set default data for paging control when change selected folder*/
        SetPageNumberToFirst();
        /*Retrieve*/
        RetrieveMyTask(businessUnit, callback);
        /*Set current data request method for paging*/
        currentDataRequestMethod = function (cb) {
            RetrieveMyTask(businessUnit, cb);
        };
    };

    TaskList.prototype.SelectPaymentTask = function (businessUnit, resetFilter, callback) {
        if (typeof (resetFilter) != typeof (undefined) && resetFilter == true) {
            _private.filterValue("");
            _private.filterValueSumitted("");
        }
        /*Turn off request in silent*/
        _dataRequest.requestInSilent = false;
        /*Turn off advance search*/
        TurnOffAdvanceSearch();
        /*Set default data for paging control when change selected folder*/
        SetPageNumberToFirst();
        /*Retrieve*/
        RetrievePaymentTask(businessUnit, callback);
        /*Set current data request method for paging*/
        currentDataRequestMethod = function (cb) {
            RetrievePaymentTask(businessUnit, cb);
        };
    };

    TaskList.prototype.SelectImagingTask = function (businessUnit, resetFilter, callback) {
        if (typeof (resetFilter) != typeof (undefined) && resetFilter == true) {
            _private.filterValue("");
            _private.filterValueSumitted("");
        }
        /*Turn off request in silent*/
        _dataRequest.requestInSilent = false;
        /*Turn off advance search*/
        TurnOffAdvanceSearch();
        /*Set default data for paging control when change selected folder*/
        SetPageNumberToFirst();
        /*Retrieve*/
        RetrieveImagingTask(businessUnit, callback);
        /*Set current data request method for paging*/
        currentDataRequestMethod = function (cb) {
            RetrieveImagingTask(businessUnit, cb);
        }
    };

    TaskList.prototype.SelectGroupTask = function (alias, teamAlias, businessUnit, group, resetFilter, callback) {
        if (typeof (resetFilter) != typeof (undefined) && resetFilter == true) {
            _private.filterValue("");
            _private.filterValueSumitted("");
        }
        /*Turn off request in silent*/
        _dataRequest.requestInSilent = false;
        /*Turn off advance search*/
        TurnOffAdvanceSearch();
        /*Set default data for paging control when change selected folder*/
        SetPageNumberToFirst();
        /*Retrieve*/
        RetrieveGroupTask(businessUnit, group, teamAlias, alias, callback);
        /*Set current data request method for paging*/
        currentDataRequestMethod = function (callback) {
            RetrieveGroupTask(businessUnit, group, teamAlias, alias, callback);
        };
    };

    TaskList.prototype.SelectSearchAllTask = function (isSearchAll) {
        if (isSearchAll)
            currentDataRequestMethod = RetrieveSeachAllTask;
    };


    TaskList.prototype.OnSelectTaskChange = function (callback) {
        PubSub.subscribe(_event.OnSelectTaskChange, PubSub.HandlerAdapter(callback));
    }

    TaskList.prototype.RefreshData = function (callback) {
        /*Turn on silent request*/
        _dataRequest.requestInSilent = true;
        /*Refresh current data*/
        currentDataRequestMethod(function () {
            if (typeof (callback) == typeof (function () { })) {
                callback();
            }
        });
    };

    TaskList.prototype.AdvanceSearch = function (filters, callback) {
        if (typeof (currentDataRequestMethod) == typeof (function () { })) {
            /*Turn off request in silent*/
            _dataRequest.requestInSilent = false;
            /*Set filter data*/
            TurnOnAdvanceSearch(filters);
            /*Submit search request - CLear filter before search - When clear filter - it will automatic*/
            _filterLegacyValue = "AdvanceSearch";
            _private.filterValueSumitted(_filterLegacyValue);
            _private.filterValue("  ");
        }
    }

    TaskList.prototype.OnFinishedReallocate = function (callback) {
        PubSub.subscribe(_event.OnFinishedReallocate, PubSub.HandlerAdapter(callback));
    }

    TaskList.prototype.OnAdvanceSearchClick = function (handler) {
        PubSub.subscribe(_event.OnAdvanceSearchClick, PubSub.HandlerAdapter(handler));
    }

    TaskList.prototype.OnCreatedTask = function (handler) {
        PubSub.subscribe(_event.OnCreatedTask, PubSub.HandlerAdapter(handler));
    }

    TaskList.prototype.OnUpdatedTask = function (handler) {
        PubSub.subscribe(_event.OnUpdatedTask, PubSub.HandlerAdapter(handler));
    }

    TaskList.prototype.SelectAllTasks = function () {
        SelectAllTask();
    }


    return TaskList;
})();