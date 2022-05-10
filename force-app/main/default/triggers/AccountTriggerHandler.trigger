trigger AccountTriggerHandler on Account (after insert, after update) {
    
    switch on Trigger.operationType {
        when AFTER_INSERT, AFTER_UPDATE{
            AccountTriggerHandler.createRefreshRecordPlatformEvents(Trigger.new);
        }
    
    }
}