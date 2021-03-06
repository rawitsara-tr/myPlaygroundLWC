import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import getFU from '@salesforce/apex/myFreeUsageController.getFU';

const actions = [
    { label: 'Edit', name: 'Edit' },
    { label: 'Delete', name: 'Delete' },
];

const columns = [{
    label: 'Id',
    fieldName: 'Id',
    type: 'text',
    hideDefaultActions: 'true',
    sortable: true
},
{
    label: 'Name',
    fieldName: 'Name',
    hideDefaultActions: 'true',
    sortable: true
},
{
    type: 'action',
    typeAttributes: { rowActions: actions },
}
];

export default class MyFreeUsage extends NavigationMixin(LightningElement) {

    @track value;
    @track error;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    result;
    @track allSelectedRows = [];
    @track page = 1;
    @track items = [];
    @track data = [];
    @track columns;
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 5;
    @track totalRecordCount = 0;
    @track totalPage = 0;
    isPageChanged = false;
    initialLoad = true;
    headerTitle;
    wiredFreeUsageResult;
    isLoading = false;

    subscription = {};
    CHANNEL_NAME = '/event/Refresh_FreeUsage_Event__e';

    connectedCallback() {
        this.isLoading = true;
        subscribe(this.CHANNEL_NAME, -1, this.manageEvent).then(response => {
            console.log('66 Hello Subscribed Channel');
            this.subscription = response;
        });
        onError(error => {
            console.error('70 Server Error--->'+error);
        });
    }
    manageEvent = event => {
        this.isLoading = true;
        console.log('รีเฟรชชชชชชชชชชชชชช');
        return refreshApex(this.wiredFreeUsageResult);
    }

    @wire(getFU, { searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection' })
    wiredFreeUsage(result) {
        //console.log('57 result >> ', result);
        console.log('58 result.data >> ', result.data);
        this.wiredFreeUsageResult = result;
        if (result.data) {
            this.isLoading = false;
            this.processRecords(result.data);
            this.error = undefined;
        } else if (result.error) {
            this.isLoading = false;
            this.error = error;
            this.data = undefined;
        }
    }

    processRecords(data) {
        this.items = data;
        this.totalRecordCount = data.length;
        this.headerTitle = 'FreeUsage List  ( ' + this.totalRecordCount + ' )';
        this.totalPage = Math.ceil(this.totalRecordCount / this.pageSize);
        this.data = this.items.slice(0, this.pageSize);
        this.endingRecord = this.pageSize;
        this.columns = columns;
    }
    //clicking on previous button this method will be called

    previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        } else {
            //this.isPrev = true;
        }
        var selectedIds = [];
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;
    }
    //clicking on next button this method will be called
    nextHandler() {
        this.isPageChanged = true;
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }
        var selectedIds = [];
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;
    }
    //this method displays records page by page
    displayRecordPerPage(page) {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecordCount)
            ? this.totalRecordCount : this.endingRecord;

        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }
    sortColumns(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);

    }
    onRowSelection(event) {
        if (!this.isPageChanged || this.initialLoad) {
            if (this.initialLoad) this.initialLoad = false;
            this.processSelectedRows(event.detail.selectedRows);
        } else {
            this.isPageChanged = false;
            this.initialLoad = true;
        }

    }
    processSelectedRows(selectedOpps) {
        var newMap = new Map();
        for (var i = 0; i < selectedOpps.length; i++) {
            if (!this.allSelectedRows.includes(selectedOpps[i])) {
                this.allSelectedRows.push(selectedOpps[i]);
            }
            this.mapoppNameVsOpp.set(selectedOpps[i].Name, selectedOpps[i]);
            newMap.set(selectedOpps[i].Name, selectedOpps[i]);
        }
        for (let [key, value] of this.mapoppNameVsOpp.entries()) {
            if (newMap.size <= 0 || (!newMap.has(key) && this.initialLoad)) {
                const index = this.allSelectedRows.indexOf(value);
                if (index > -1) {
                    this.allSelectedRows.splice(index, 1);
                }
            }
        }
    }
    handleKeyChange(event) {
        this.searchKey = event.target.value;
        var data = [];
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] != undefined && this.items[i].Name.includes(this.searchKey)) {
                data.push(this.items[i]);
            }
        }
        this.processRecords(data);
    }

    @track isConfirmOpenFreeUsage = false;
    @track deleteFreeUsageId;
    @track deleteFreeUsageName;
    closeConfirmFreeUsage() {
        this.isConfirmOpenFreeUsage = false;
    }
    handleCreateFreeUsage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "FreeUsage__c" // FreeUsage__c
            }
        })
    }
    handleDeleteFreeUsage() {
        this.isConfirmOpenFreeUsage = false;
        //console.log('Deleting... ', this.deleteFreeUsageId);
        deleteRecord(this.deleteFreeUsageId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'FreeUsage Deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredFreeUsageResult);
            })
            .catch((error) => {
                console.log('error', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error Deleted',
                        variant: 'error'
                    })
                );
            })
    }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        this.deleteFreeUsageId = event.detail.row.Id;
        this.deleteFreeUsageName = event.detail.row.Name;
        //console.log('event.detail.row >> ', this.deleteFreeUsageId);
        switch (actionName) {
            case 'Edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: event.detail.row.Id,
                        objectApiName: 'FreeUsage__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'Delete':
                this.isConfirmOpenFreeUsage = true;
                break;
            default:
        }
    }
    disconnectedCallback() {
        unsubscribe(this.subscription, response => {
            console.log('Unsubscribed Channel');
        });
    }

}