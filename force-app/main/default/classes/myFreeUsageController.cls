public with sharing class myFreeUsageController {
    public myFreeUsageController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<FreeUsage__c> getOpps( String searchKey, String sortBy, String sortDirection) {
        
        String query = 'SELECT Id, Name FROM FreeUsage__c';
        system.debug('query---'+query);
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key';
        }
        if ( sortBy != null && sortDirection != null ) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        query = query + ' LIMIT 10';
        return Database.query( query );
    }
}
