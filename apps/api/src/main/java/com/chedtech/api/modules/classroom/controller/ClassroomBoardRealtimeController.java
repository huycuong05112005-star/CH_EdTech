package com.chedtech.api.modules.classroom.controller;

import com.chedtech.api.modules.classroom.dto.BoardOperationMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ClassroomBoardRealtimeController {

    @MessageMapping("/classroom/{classroomId}/board/action")
    @SendTo("/topic/classroom/{classroomId}/board")
    public BoardOperationMessage handleBoardAction(
            @DestinationVariable String classroomId,
            BoardOperationMessage message
    ) {
        // Broadcast drawing operations in real-time to all participants in this classroom
        return new BoardOperationMessage(
                classroomId,
                message.actionType(),
                message.payload(),
                message.senderId(),
                message.senderName(),
                System.currentTimeMillis()
        );
    }
}

