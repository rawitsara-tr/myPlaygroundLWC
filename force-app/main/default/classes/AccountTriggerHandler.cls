public with sharing class AccountTriggerHandler{

    public static void createRefreshRecordPlatformEvents(List<Account> newAccountList){
        
        List<Refresh_Record_Event__e> refreshRecordEventList = new List<Refresh_Record_Event__e>();
        Refresh_Record_Event__e refreshEventObj = new Refresh_Record_Event__e();
        
        if(newAccountList == null || newAccountList.isEmpty())
            return;
                     
        for (Account acc : newAccountList) {
            refreshEventObj = new Refresh_Record_Event__e();
            refreshEventObj.Record_Id__c = acc.Id;
            refreshEventObj.User_Id__c = UserInfo.getUserId();
            
            refreshRecordEventList.add(refreshEventObj);
        }
        
        try{
            if(refreshRecordEventList <> null && !refreshRecordEventList.isEmpty())
                EventBus.publish(refreshRecordEventList);
        }catch(Exception e){
            System.debug('Exception during publishing of refresh platform events-->'+e.getMessage());
        }
    }
}