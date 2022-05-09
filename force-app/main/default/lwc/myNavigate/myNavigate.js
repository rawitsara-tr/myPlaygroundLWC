import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class MyNavigate extends NavigationMixin(LightningElement) {
    navigateToAccountHomePage() {
        this[NavigationMixin.Navigate] ({
            type: 'standard__objectPage',
            attributes: {
                actionName: "home",
                objectApiName: "Account" // FreeUsage__c
            }
        })
    }
    createNewAccount() {
        this[NavigationMixin.Navigate] ({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "Account" // FreeUsage__c
            }
        })
    }
    navigateToFreeUsageHomePage() {
        this[NavigationMixin.Navigate] ({
            type: 'standard__objectPage',
            attributes: {
                actionName: "home",
                objectApiName: "FreeUsage__c" // FreeUsage__c
            }
        })
    }
    createNewFreeUsage() {
        this[NavigationMixin.Navigate] ({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "FreeUsage__c" // FreeUsage__c
            }
        })
    }
}