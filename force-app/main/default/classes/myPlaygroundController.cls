public with sharing class myPlaygroundController {
    // constructor
    public myPlaygroundController() {

    }

    // 8 Apex Class getContactList
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [SELECT Id, Name, Email FROM Contact LIMIT 20];
    }

    // 9 Apex Class getFreeUsageList
    @AuraEnabled(cacheable=true)
    public static List<FreeUsage__c> getFreeUsageList() {
        return [SELECT Id, Name FROM FreeUsage__c];
    }

    // 10 Delete from RecordId
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccList() {
        return [SELECT Id, Name FROM Account LIMIT 20];
    }

    // 12 Update Table After Update Record
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, Name, Email FROM Contact LIMIT 20];
    }

    // 13 Update Table After Update Record
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 20];
    }
}
