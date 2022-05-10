import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from "@salesforce/apex/DataTableActionsController.getAccounts";
import currentUserId from '@salesforce/user/Id';
import { subscribe, unsubscribe, onError}  from 'lightning/empApi';


const actions = [
    { label: 'Edit', name: 'edit' },
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Account Number', fieldName: 'AccountNumber'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class DataTableActions extends NavigationMixin( LightningElement ) {

    columns = columns;
    data = [];
    error;
    recordId;
    createdRecord = false;
    isLoading = false;
  

    subscription = {};
    CHANNEL_NAME = '/event/Refresh_Record_Event__e';

    connectedCallback() {
        this.isLoading = true;
        this.fetchAccounts();
        subscribe(this.CHANNEL_NAME, -1, this.manageEvent).then(response => {
            console.log('Subscribed Channel');
            this.subscription = response;
        });
        onError(error => {
            console.error('Server Error--->'+error);
        });
    }

    manageEvent = event=> {
        const refreshRecordEvent = event.data.payload;
        this.isLoading = true;
        console.log('Event--->'+JSON.stringify(refreshRecordEvent));
        if (!this.createdRecord && refreshRecordEvent.Record_Id__c === this.recordId && refreshRecordEvent.User_Id__c === currentUserId) {
            this.fetchAccounts();
        }
        else if (this.createdRecord && refreshRecordEvent.User_Id__c === currentUserId) {            
            this.fetchAccounts();
        }
    }
    
    fetchAccounts() {
        getAccounts()
            .then(result => {
                this.data = result;
                this.error = undefined;
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
                this.isLoading = false;
            });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.Id;
        switch (actionName) {
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
           
            default:
        }
    }

    createAccount(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            },
            state:{
                navigationLocation: 'RELATED_LIST'
            }
        }); 
        this.createdRecord = true;
        
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, response => {
            console.log('Unsubscribed Channel');
        });
    }

}