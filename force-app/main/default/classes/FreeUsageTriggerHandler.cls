public with sharing class FreeUsageTriggerHandler {
    public FreeUsageTriggerHandler() {

    }
    public static void createRefreshRecordPlatformEvents(List<FreeUsage__c> newFreeUsageList){
        
        List<Refresh_FreeUsage_Event__e> refreshRecordEventList = new List<Refresh_FreeUsage_Event__e>();
        Refresh_FreeUsage_Event__e refreshEventObj = new Refresh_FreeUsage_Event__e();
        
        if(newFreeUsageList == null || newFreeUsageList.isEmpty())
            return;
                     
        for (FreeUsage__c fu : newFreeUsageList) {
            refreshEventObj = new Refresh_FreeUsage_Event__e();
            refreshEventObj.Record_Id__c = fu.Id;
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

