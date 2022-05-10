public with sharing class DataTableActionsController {
    
    @AuraEnabled
    public static List<Account> getAccounts(){
        try {
            return [SELECT  Id, 
                            Name, 
                            AccountNumber 
                            FROM Account 
                            WITH SECURITY_ENFORCED 
                            Order By CreatedDate DESC 
                            LIMIT 5 ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}