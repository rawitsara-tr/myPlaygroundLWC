import { LightningElement } from 'lwc';

export default class LightningDataService extends LightningElement {
    handleError() {
        alert('Errored');
    }
    handleSuccess() {
        alert('Record Created');
    }
    handleSubmit() {
        alert('Form Submitted');
    }
}