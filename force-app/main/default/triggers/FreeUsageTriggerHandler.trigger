trigger FreeUsageTriggerHandler on FreeUsage__c (after insert, after update) {
    switch on Trigger.operationType {
        when AFTER_INSERT, AFTER_UPDATE{
            FreeUsageTriggerHandler.createRefreshRecordPlatformEvents(Trigger.new);
        }
    
    }
}
