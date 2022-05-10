trigger FreeUsageTrigger on FreeUsage__c (after insert, after update) {          
    if(trigger.isAfter){
        if(trigger.isInsert || trigger.isUpdate){
            List<RefreshDataTableFreeUsage__e> refreshDataTableEvents = new List<RefreshDataTableFreeUsage__e>();
            for (FreeUsage__c freeUsage : Trigger.new) {
                refreshDataTableEvents.add(new RefreshDataTableFreeUsage__e(
                RecordId__c = freeUsage.Id           
            ));
        }
        EventBus.publish(refreshDataTableEvents);
        }
    }
} 
