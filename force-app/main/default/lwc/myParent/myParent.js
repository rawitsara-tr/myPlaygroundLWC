import { LightningElement } from 'lwc';

export default class MyParent extends LightningElement {
    // 1 Parent to Child
    // message = 'I am from Parent Component';

    handleClickParentToChild() {
        this.message = 'Message Changed';
        this.template.querySelector('c-my-child').childComp(this.message);
        // AccountController account = new AccountController(); || this.template.querySelector('c-my-child') (Create Object of Child Component)
        // account.getAccounts(); || childComp(this.message); (Call Method from Child Component)
    }

    // 2 Child to Parent
    handleEventFromChild(event) {
        let key = event.detail.key;
        let value = event.detail.value;
        this.message = key + ' ' + value;
        console.log('Child to Parent >> ', this.message);
    }
         
}