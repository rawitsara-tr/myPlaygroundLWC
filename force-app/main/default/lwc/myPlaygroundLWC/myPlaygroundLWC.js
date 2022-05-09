import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import getContactList from '@salesforce/apex/myPlaygroundController.getContactList';
import getFreeUsageList from '@salesforce/apex/myPlaygroundController.getFreeUsageList';
import getAccList from '@salesforce/apex/myPlaygroundController.getAccList'
import getContacts from '@salesforce/apex/myPlaygroundController.getContacts';
import fetchAccounts from '@salesforce/apex/myPlaygroundController.fetchAccounts';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';

const COLS = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];

const action13 = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' }
];
const column13 = [
    { label: 'Id', fieldName: 'Id', hideDefaultActions: 'true' },
    { label: 'Name', fieldName: 'Name', hideDefaultActions: 'true' },
    {
        label: 'Action',
        type: 'action',
        typeAttributes: { rowActions: action13 }
    }
];

// export default class MyPlaygroundLWC extends LightningElement {
export default class MyPlaygroundLWC extends NavigationMixin(LightningElement) {
    // 1 Card
    text1 = 'Hello World Jaa';

    // 4 Dynamic Input
    text2 = '';
    handleChange1(event) {
        this.text2 = event.target.value;
    }

    // 5 Button Clickable
    handleOnselectActionNew(event) {
        var selectedVal = event.detail.value;
        console.log('Selected button is ' + selectedVal);
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: selectedVal,
                actionName: 'new'
            }
        });
    }

    // 6 Conditional Button
    show = true;
    handleClick1() {
        this.show = !this.show;
    }

    // 7 lightning-input
    inputText = '';
    handleChange2(event) {
        this.inputText = event.target.value;
        window.console.log('event.target => ', event.target);
    }
    handleClick2() {
        alert('Button Clicked');
    }

    // 8 Apex Class getContactList
    /* To call the Apex Method
        1 Create Apex Controller Class
        2 Create an AuraEnabled Method in Apex Controller Class
        3 Import the method to the js (line 3)
        4 Use @wire to call the method
    */
    resultContact;
    errorContact;
    wiredContactsResult;
    @wire(getContactList)
    wireDataGetContact(result) {
        this.wiredContactsResult = result;
        console.log('result >> ', result);
        console.log('result.data >> ', result.data);
        if (result.data) {
            this.resultContact = result.data;
            this.errorContact = undefined;
        } else if (result.error) {
            this.errorContact = result.error;
            this.resultContact = undefined;
        }
    }
    handleEdit(event) {
        const config = {
            type: "standard__recordPage",
            attributes: {
                recordId: event.target.dataset.recordId,
                objectApiName: "Contact",
                actionName: "edit"
            }
        };
        this[NavigationMixin.Navigate](config);
    }

    @track isConfirmOpen = false;
    @track deleteContactId;
    openConfirm(event) {
        // to open modal set isModalOpen tarck value as true
        this.isConfirmOpen = true;
        this.deleteContactId = event.target.dataset.recordId;
        console.log('89 deleteContactId ', event.target.dataset.recordId);
    }
    @track error;
    handleDelete() {
        this.isConfirmOpen = false;
        const recordIdContact = this.deleteContactId;
        deleteRecord(recordIdContact)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account Deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredContactsResult);
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
    closeConfirm() {
        // to close modal set isModalOpen tarck value as false
        this.isConfirmOpen = false;
    }

    // 9 Apex Class getFreeUsageList
    resultFreeUsage;
    errorFreeUsage;
    @wire(getFreeUsageList)
    wireDataGetFreeUsage({ error, data }) {
        if (data) {
            this.resultFreeUsage = data;
            this.errorFreeUsage = undefined;
        } else if (error) {
            this.errorFreeUsage = error;
            this.resultFreeUsage = undefined;
        }
    }
    handleOnselectFreeUsage(event) {
        var selectedVal = event.detail.value;
        const config = {
            type: "standard__recordPage",
            attributes: {
                recordId: event.target.dataset.recordId,
                objectApiName: "FreeUsage__c",
                actionName: "edit"
            }
        };
        this[NavigationMixin.Navigate](config);
    }

    // 10 Delete from RecordId
    accounts;
    errored;
    wiredAccountsResult;
    @wire(getAccList)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.accounts = result.data;
            this.errored = undefined;
        } else if (result.error) {
            this.errored = result.error;
            this.accounts = undefined;
        }
    }
    deleteAccount(event) {
        const recordIdAccount = event.target.dataset.recordId;
        deleteRecord(recordIdAccount)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account Deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredAccountsResult);
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error Deleted',
                        variant: 'error'
                    })
                );
            })
    }

    // 11 Confirm Before Delete
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    // 12 Update Table After Update Record
    

    
}