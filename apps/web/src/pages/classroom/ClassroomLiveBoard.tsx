import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '../../store/authStore';
import { api, Classroom } from '../../lib/api';
import { GeometryWorkspace } from '../workspace/GeometryWorkspace';
import { ArrowLeft, Users, Wifi, WifiOff, Copy, Check } from 'lucide-react';

export const ClassroomLiveBoard: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [connected, setConnected] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  // Load classroom details
  useEffect(() => {
    if (!classroomId) return;
    api.classrooms
      .getClassroom(classroomId)
      .then((cls) => setClassroom(cls))
      .catch((err) => console.error('Failed to load classroom:', err));
  }, [classroomId]);

  // Connect STOMP WebSocket
  useEffect(() => {
    if (!classroomId) return;

    // Use current host or proxy for websocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const brokerURL = `${protocol}//${window.location.host}/ws-geometry`;

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to classroom board operations
        client.subscribe(`/topic/classroom/${classroomId}/board`, (message) => {
          try {
            const body = JSON.parse(message.body);
            // Handle incoming sync operations
            console.log('Incoming board sync action:', body);
          } catch (e) {
            console.error('Error processing board message', e);
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        setConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [classroomId]);

  const copyJoinCode = () => {
    if (classroom?.joinCode) {
      navigator.clipboard.writeText(classroom.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden">
      {/* Classroom Top Banner */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(user?.role === 'ROLE_TEACHER' ? '/teacher' : '/student')}
            className="flex items-center space-x-1 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại bảng điều khiển</span>
          </button>
          <span className="text-slate-700">|</span>
          <span className="font-semibold text-primary-400">
            {classroom ? classroom.name : 'Phòng Học Trực Tuyến'}
          </span>
          {classroom && (
            <button
              onClick={copyJoinCode}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px]"
              title="Sao chép mã vào lớp"
            >
              <span>Mã lớp: <strong>{classroom.joinCode}</strong></span>
              {copiedCode ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{classroom ? `${classroom.studentCount} thành viên` : 'Đang kết nối...'}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            {connected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Thời gian thực (Online)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Mất kết nối STOMP</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Geometry Workspace */}
      <div className="flex-1 relative overflow-hidden">
        <GeometryWorkspace />
      </div>
    </div>
  );
};
