trigger AccountTrigger on Account (after insert, after update) {
    if(trigger.isAfter){
        if(trigger.isInsert || trigger.isUpdate){
            List<RefreshDataTable__e> refreshDataTableEvents = new List<RefreshDataTable__e>();
            for (Account account : Trigger.new) {
                refreshDataTableEvents.add(new RefreshDataTable__e(
                    RecordId__c = account.Id           
                ));
            }
            EventBus.publish(refreshDataTableEvents);
        }
    }
} 