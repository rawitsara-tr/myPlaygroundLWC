import { LightningElement, api } from 'lwc';

export default class MyChild extends LightningElement {
    // 1 Parent to Child
    @api message;
    @api
    childComp(name) {
        alert(name);
        this.message = name;
    }

    // 2 Child to Parent
    handleClickChildToParent() {
        /* Way to Dispatch Event
            1 Create an Object of CustomEvent
            2 btnClick is a event name
            3 Detail is key information that you want to send to Parent such as recordId
            4 Syntax to send multiple value
                detail: {
                    key: '001weywgywgfw',
                    value: 'Hello World'
                }
            5 Syntax to send a single value
                detail: '001weywgywgfw'
        */
        const event = new CustomEvent('btnclick', {
            detail: {
                key: '001weywgywgfw',
                value: 'Hello World'
             }
        });
        this.dispatchEvent(event); // dispatch = ส่ง
    }
}