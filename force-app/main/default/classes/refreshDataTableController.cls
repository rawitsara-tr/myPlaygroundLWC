public with sharing class refreshDataTableController {
    public refreshDataTableController() {

    }
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccounts(){
        return [SELECT Id, Name,AccountNumber,Type,Phone FROM Account ORDER BY Name];
    }
}
