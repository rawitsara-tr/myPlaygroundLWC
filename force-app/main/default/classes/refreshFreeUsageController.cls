public with sharing class refreshFreeUsageController {
    public refreshFreeUsageController() {

    }
    @AuraEnabled(cacheable = true)
    public static List<FreeUsage__c> getFreeUsage(){
        return [SELECT Id, Name FROM FreeUsage__c];
    }
}
