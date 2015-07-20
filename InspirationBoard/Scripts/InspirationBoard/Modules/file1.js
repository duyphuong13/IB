
/**************************************************************************
    Filename:       CreateTaskModal.js
    Description:    js object for manage user list modal
    Version:        v0.1                             
    Company:        ASWIG IT - VN

    Created on:     06/2/2014
    Created by:     Phuong Nguyen
**************************************************************************/

/*Namespace initial*/
var tms = tms || {};
tms.modules = tms.modules || {};
tms.modules.homepage = tms.modules.homepage || {};
/*Namespace initial*/


/*Task navigation control*/
tms.modules.homepage.CreateTaskModal = (function () {

    /*private variables*/
    /*
     * The _private variable contain main data using for binding
     */
    var _private = {
        container: ".tms-create-task-modal"
    };

    var _model = {
        subject: ko.observable(''),
        applicationName: ko.observable(tms.enum.ApplicationName.Manual),
        claimNumber: ko.observable(''),
        actualOwnerAlias: ko.observable(''),
        actualOwnerFullName: ko.observable(''),
        businessUnitAlias: ko.observable(''),
        injureWorkerFullName: ko.observable(''),
        duedate: ko.observable(''),
        body: ko.observable(''),
        textEntityNumber: ko.observable(''),
        status: ko.observable(tms.enum.OutlookTaskStatus.Open),
        //   applicationNameList: ko.observableArray([]),
        businessUnitAliasList: ko.observableArray([]),
        userInGroupAliasList: ko.observableArray([]),
        isValid: ko.observable(true)

    };

    /*Event*/
    var _event = {
        OnClickChooseUser: $.tms.NewID()
    };

    var SubmitCallback = function () {

    };

    /*Factory method for task request object*/
    function TaskRequest() {
        return new tms.data.task('task');
    };
    /*Factory method for task request object*/
    function UserRequest() {
        return new tms.data.user('user');
    };

    function IsShowEntity() {
        var isShowEntity = false;
        if (_model.applicationName() == tms.enum.ApplicationName.CreditorPayments
            || _model.applicationName() == tms.enum.ApplicationName.ElectronicDocuments) {
            isShowEntity = true;
            if (_model.applicationName() == tms.enum.ApplicationName.CreditorPayments) {

                _model.textEntityNumber('Payment number:');
            } else {
                _model.textEntityNumber('Document number:');
            }
        }
        return isShowEntity;
    }

    function ChooseUser() {
        $.tms.Instance("tms.modules.homepage.SearchUserModal").Show(
            _model.businessUnitAlias(),
            _private.container,
            function (users) {
                if (users != null && users.length > 0) {
                    _model.actualOwnerAlias(users[0].alias);
                    _model.actualOwnerFullName(users[0].name);
                }
            });
    }

    /*private functions*/
    function ApplyBinding() {
        /*Check if the container have been initialised*/
        if ($(_private.container).length > 0) {
            if (ko.dataFor($(_private.container)[0]) == null || typeof (ko.dataFor($(_private.container)[0])) == typeof (undefined)) {
                _model.SaveCreateTask = SaveCreateTask;
                _model.ChooseUser = ChooseUser;
                _model.businessUnitAlias.subscribe(function (value) {
                    if (typeof (value) != typeof (undefined) && value != null && value.trim() != '') {
                        _model.actualOwnerAlias(tms.data.currentUser);
                        _model.actualOwnerFullName(tms.data.currentUserFullName);
                    }
                });
                /*Auto add x button to duedate for remove date functionality
                  Because x button just implemented for showing when user 
                  input data but datepicker do not allow user to input data
                  */
                _model.duedate.subscribe(function () {
                    $('input[data-bind*=duedate]', _private.container).addClass('x');
                }, _model);
                ko.applyBindings(_model, $(_private.container)[0]);
            }
        }
    };

    function GetBusinessUnitList(callback) {
        var list = [];
        for (var index = 0; index < tms.data.currentUserBusiness.length; index++) {
            if (!$.tms.IsNullOrEmpty(tms.data.currentUserBusiness[index])) {
                list.push({
                    value: tms.data.currentUserBusiness[index],
                    name: tms.data.currentUserBusiness[index]
                });
            }
        }
        callback(list);
    }

    var _GetListUserInGroupTimeSpan = null;
    function GetListUserInGroup(businessUnit, successCallBack) {
        if (_GetListUserInGroupTimeSpan != null && (Date.now() - _GetListUserInGroupTimeSpan) < 500) {
            return;
        }
        else {
            _GetListUserInGroupTimeSpan = Date.now();
        }
        var list = [];
        var teamName = $.tms.GetTeamByBusiness(businessUnit);
        if (!$.tms.IsNullOrEmpty(teamName)) {
            _model.isValid(true);
            UserRequest().GetMembersByTeam(businessUnit, teamName, {
                success: function (members) {
                    for (var i = 0; i < members.length; i++) {
                        list.push({
                            value: members[i].Alias,
                            name: members[i].FullName
                        });
                    }
                    successCallBack(list);

                },
                blockUI: $(_private.container + ' .modal-content')

            });
        }
        else {
            _model.isValid(false);
            var message = $.tms.GetValidationMessage('HasNoTeamInBusinessUnit').Format({
                key: '[businessUnit]',
                value: _model.businessUnitAlias()
            });
            $.tms.Instance('tms.Notify').Warning(message);

        }
    }

    function GetApplicationList(successCallback) {
        var list = [];
        for (var application in tms.enum.ApplicationName) {
            if (!$.tms.IsNullOrEmpty(application)) {

                if (tms.enum.ApplicationName.Manual == $.tms.GetApplicationNameValue(application)) {
                    list.push({
                        value: $.tms.GetApplicationNameValue(application),
                        name: " "
                    });
                }
                else {
                    list.push({
                        value: $.tms.GetApplicationNameValue(application),
                        name: application.BreakWord()
                    });
                }
            }
        }
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

    function GetTaskDetails(taskId, callback) {
        TaskRequest().GetTaskDetail(taskId, {
            success: function (task) {
                callback(task);
            },
            blockUI: $(_private.container + ' .modal-content')
        });

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
        /*Integrate with LandingPage to Enable/Disable ReUseIETab*/
        $.tms.ReUseTabForModal(_private.container, function () {
            /*Callback when show modal*/
        }, function () {
            /*Callback when hide modal*/
            HideModal();
        });

        GetBusinessUnitList(function (list) {
            _model.businessUnitAliasList(list);
            _model.businessUnitAlias(list[0].value);
        });
        /*Try to trigger event that user click on iframe of this form to focus to textbox and close duedate control*/
        try {
            $('iframe', $(_private.container)).contents().find("html").parent().on('off');
            $('iframe', $(_private.container)).contents().find("html").parent().on('click', function (event) {
                if ($('input[data-bind*=duedate]', _private.container).data('datepicker')) {
                    $('input[data-bind*=duedate]', _private.container).data('datepicker').hide();
                }
                $('iframe', $(_private.container)).contents().find("body").focus();
            });
        } catch (ex) {
        }
        $(_private.container).modal('show');
    }

    function IsValid() {
        if (!_model.isValid()) {
            var message = $.tms.GetValidationMessage('HasNoTeamInBusinessUnit').Format({
                key: '[businessUnit]',
                value: _model.businessUnitAlias()
            });
            $.tms.Instance('tms.Notify').Warning(message);
            return false;
        }

        if (_model.subject().length < 1) {
            $.tms.Instance('tms.Notify').Warning($.tms.GetValidationMessage('DataIsRequired').Format('Subject'));
            return false;
        }
        else {
            if (_model.subject().length > 250) {
                $.tms.Instance('tms.Notify').Warning($.tms.GetValidationMessage('TaskSubjectLengthInvalid'));
                return false;
            }
        }

        return true;
    }

    function SaveCreateTask() {
        _model.subject(_model.subject().trim());
        if (!IsValid()) {
            return;
        }
        /*Validate data*/
        var taskModel = ko.toJS(_model);
        taskModel.duedate = moment(taskModel.duedate, tms.common.configuration.DATE_FORMAT).toDate();
        TaskRequest().CreateTask(taskModel, {
            success: function (result) {
                if (result.Success) {
                    /*Notify success*/
                    $.tms.Instance('tms.Notify').Success($.tms.GetCommonMessage('CreateTask_Success'));
                    /*Notify success*/
                    HideModal();
                    /*Notify task is created to caller*/
                    SubmitCallback(taskModel, result);
                }
                else {
                    $.tms.Instance('tms.Notify').Warning($.tms.GetCommonMessage('CreateTask_Fail'));
                }
            },
            blockUI: $('.modal-content', _private.container)
        });

    }
    function ClearData() {
        _model.subject('');
        _model.actualOwnerAlias('');
        _model.actualOwnerFullName('');
        _model.body('');
        _model.businessUnitAlias('');
        _model.claimNumber('');
        _model.duedate((new Date()).ToTMSDateString());
        _model.duedate('');
    }

    function HideModal() {
        /*Release memory*/
        ClearData();
        /*Enable ReUse Tab*/
        LandingPage.SetField(LandingPage.CanReUseTabFieldName, true);
        /*Hide modal*/
        $(_private.container).modal('hide');
    }
    /* Constructor
     * params: object contain all parameter pass for module
     *         - container: jquery dom of ui
     */
    function CreateTaskModal() {
        /* Do need to initial manually because we have the custom binding for this one already
        $("#tms-create-task-duedate").datepicker();
        */
    };

    /*publically accessible variables and functions*/
    CreateTaskModal.prototype.Show = function (callbackSubmit) {

        SubmitCallback = callbackSubmit;
        InitialLoad(function () {
            /*BootstrapModalInit*/
            BootstrapModalInit();
            /*Data binding*/
            ApplyBinding();
            /*Clear data*/
            ClearData();
            /*Show Modal*/
            ShowModal();
            /*Focus to Subject textbox*/
            setTimeout(function () {
                $('input[data-bind*=subject]').focus();
            }, 800);
        })
    };

    CreateTaskModal.prototype.Hide = function () {
        HideModal();
    };

    return CreateTaskModal;
})();