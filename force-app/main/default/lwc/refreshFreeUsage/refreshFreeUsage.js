import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import getFreeUsage from '@salesforce/apex/refreshFreeUsageController.getFreeUsage';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

//define row actions
const actions = [
    { label: 'New', name: 'New' },
    { label: 'Edit', name: 'Edit' }
];

//define datatable columns with row actions
const columns = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Name', fieldName: 'Name' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'right'
        }
    }
];

export default class RefreshFreeUsage extends NavigationMixin(LightningElement) {
    @track data;
    @track columns = columns;
    recordId;
    refreshTable;
    error;
    subscription = {};
    CHANNEL_NAME = '/event/RefreshDataTableFreeUsage__e'; // Refresh Edit
    // CHANNEL_NAME = '/event/Refresh_FreeUsage_List__e'; // Refresh New

    connectedCallback() {
        subscribe(this.CHANNEL_NAME, -1, this.handleEvent).then(response => {
            console.log('Successfully subscribed to channel');
            this.subscription = response;
        });

        onError(error => {
            //console.error('Received error from server: ', error);
        });
    }

    handleEvent = event => {
        //console.log('event >> ', event);
        const refreshRecordEvent = event.data.payload;
        if (refreshRecordEvent.RecordId__c === this.recordId) {
            this.recordId = '';
            return refreshApex(this.refreshTable);
        }
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, () => {
            console.log('Successfully unsubscribed');
        });
    }

    // retrieving the accounts using wire service
    @wire(getFreeUsage)
    freeUsage(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    handleRowActions(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.Id;
        switch (actionName) {
            case 'New':
                this[NavigationMixin.Navigate] ({
                    type: 'standard__objectPage',
                    attributes: {
                        actionName: "new",
                        objectApiName: "FreeUsage__c" 
                    }
                });
                break;
            case 'Edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'FreeUsage__c',
                        actionName: 'edit'
                    }
                });
                break;
        }
    }
}