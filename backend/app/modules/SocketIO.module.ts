import { Server as HttpServer } from 'http';
// @ts-ignore
import { Server as SocketServer, Socket } from 'socket.io';

export class SocketIO {
  private static instance: SocketIO | null = null;
  private static io: SocketServer;
  private channelSubscriptions: Record<string, Set<Socket>> = {};

  private constructor(io: SocketServer) {
    SocketIO.io = io;
  }

  public static initialize(server: HttpServer): void {
    this.io = new SocketServer(server, {
      connectionStateRecovery: {},
      cors: {
        origin: '*',
      },
    });

    this.setupSocketEvents();
    this.instance = new SocketIO(this.io);
    console.log(`[SOCKET.IO] Initialized.`);
  }

  private static setupSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[SOCKET.IO] New client connected`);

      socket.on('/subscribe', (channel: string) => {
        console.log(`[SOCKET.IO] Client subscribed to ${channel}`);
        console.log(channel)
        if (!this.io.sockets.adapter.rooms.has(channel)) {
          this.io.sockets.adapter.rooms.set(channel, new Set());
        }
        socket.join(channel);
      });

      socket.on('/unsubscribe', (channel: string) => {
        console.log(`[SOCKET.IO] Client unsubscribed from ${channel}`);
        socket.leave(channel);
      });

      socket.on('/disconnect', () => {
        console.log(`[SOCKET.IO] Client disconnected`);
      });
    });
  }

  public static getInstance(): SocketIO {
    if(!SocketIO.instance) {
      console.log(`[SOCKET.IO] Error: SocketIO instance not initialized. Use SocketIO.initialize() first.`);
      throw new Error(`[SOCKET.IO] Error: SocketIO instance not initialized. Use SocketIO.initialize() first.`);
    }
    return SocketIO.instance;
  }

  public emitEvent(channel: string, event: string, data: any): void {
    console.log(`[SOCKET.IO] Delivering event ${event} to channel ${channel}`);
    SocketIO.io.to(channel).emit(event, data);
  }
}

export default SocketIO;