package com.chedtech.api.modules.classroom.dto;

public record BoardOperationMessage(
    String classroomId,
    String actionType, // ADD_ENTITY, UPDATE_ENTITY, DELETE_ENTITY, CLEAR_BOARD, SYNC_STATE, SET_PERMISSION, CURSOR_MOVE
    String payload,    // Serialized entity JSON or state string
    String senderId,
    String senderName,
    long timestamp
) {}

