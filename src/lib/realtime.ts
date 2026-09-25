import { RealtimeMessage } from '@/types';

type ClientListener = (msg: RealtimeMessage) => void;

class RealtimeBroadcaster {
  private static instance: RealtimeBroadcaster;
  private listeners: Set<ClientListener> = new Set();

  private constructor() {}

  public static getInstance(): RealtimeBroadcaster {
    if (!RealtimeBroadcaster.instance) {
      RealtimeBroadcaster.instance = new RealtimeBroadcaster();
    }
    return RealtimeBroadcaster.instance;
  }

  public subscribe(listener: ClientListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(type: RealtimeMessage['type'], data: any) {
    const message: RealtimeMessage = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error('Error delivering realtime message to listener:', err);
      }
    });
  }

  public getSubscriberCount(): number {
    return this.listeners.size;
  }
}

export const realtimeBroadcaster = RealtimeBroadcaster.getInstance();
