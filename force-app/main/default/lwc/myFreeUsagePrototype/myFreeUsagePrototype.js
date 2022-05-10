import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import getAccountList from '@salesforce/apex/myFreeUsagePrototypeController.getAccountList';

export default class MyFreeUsagePrototype extends NavigationMixin(LightningElement) {
    @track loader = false;
    @track error = null;
    @track pageSize = 10;
    @track pageNumber = 1;
    @track totalRecords = 0;
    @track totalPages = 0;
    @track recordEnd = 0;
    @track recordStart = 0;
    @track isPrev = true;
    @track isNext = true;
    @track accounts = [];

    //On load
    connectedCallback() {
        this.getAccounts();
    }

    //handle next
    handleNext() {
        this.pageNumber = this.pageNumber + 1;
        this.getAccounts();
    }

    //handle prev
    handlePrev() {
        this.pageNumber = this.pageNumber - 1;
        this.getAccounts();
    }

    wiredFreeUsageResult;
    //get accounts
    getAccounts() {
        this.loader = true;
        getAccountList({ pageSize: this.pageSize, pageNumber: this.pageNumber })
            .then(result => {
                this.loader = false;
                if (result) {
                    this.wiredFreeUsageResult = result;
                    var resultData = JSON.parse(result);
                    console.log('result >> ', result);
                    console.log('resultData >> ', resultData);
                    this.accounts = resultData.accounts;
                    this.pageNumber = resultData.pageNumber;
                    this.totalRecords = resultData.totalRecords;
                    this.recordStart = resultData.recordStart;
                    this.recordEnd = resultData.recordEnd;
                    this.totalPages = Math.ceil(resultData.totalRecords / this.pageSize);
                    this.isNext = (this.pageNumber == this.totalPages || this.totalPages == 0);
                    this.isPrev = (this.pageNumber == 1 || this.totalRecords < this.pageSize);
                }
            })
            .catch(error => {
                this.loader = false;
                this.error = error;
            });
    }

    //display no records
    get isDisplayNoRecords() {
        var isDisplay = true;
        if (this.accounts) {
            if (this.accounts.length == 0) {
                isDisplay = true;
            } else {
                isDisplay = false;
            }
        }
        return isDisplay;
    }

    handleEdit(event) {
        console.log(event.target.dataset.recordId);
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

    @track isConfirmOpen = false;
    @track deleteContactId;
    @track error;
    openConfirm(event) {
        // to open modal set isModalOpen tarck value as true
        this.isConfirmOpen = true;
        this.deleteContactId = event.target.dataset.recordId;
        console.log('89 deleteContactId ', event.target.dataset.recordId);
    }
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
    closeConfirm() {
        // to close modal set isModalOpen tarck value as false
        this.isConfirmOpen = false;
    }
}